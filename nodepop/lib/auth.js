'use strict';

var basicAuth=require('basic-auth'); //nos devuelve una función en vez de un objeto

var mongoose = require('mongoose'); 
require('../models/userModel');

var User = mongoose.model('User'); // pido el modelo
var crypto = require("crypto");

//Ahora este user y pass será contra el que tendremos que comprobar cuando construimos el closure
var fn = function(){
	//hacemos una función que devuelve otra función
	return function(req, resp, next){ // middleware con el que controlaré la ocupación	
		var userRequest = basicAuth(req);
		var i=0;
		var usuarioEncontrado = null;

		if(!userRequest || userRequest.pass === "" || userRequest.name === ""){
			resp.set("WWW-Authenticate", "Basic realm=Authorization Required"); //pone algo en la cabecera de la respuesta, SIN ENVIARLA AÚN
			resp.sendStatus(401); //ENVIA LA RESPUESTA -> 401="necesita autorización"
			return;
		}

		// Mirar si el usuario y la contraseña están en la base de datos

		User.list({nombre : userRequest.name}, 'nombre', function(err, rows){
			if(err){
				console.log('error al leer de la base de datos');
				return;
			}

			let contraseñaRecibida = userRequest.pass;
			
			if(rows.length !== 0){
				usuarioEncontrado = rows[0];
			}
			else{
				return resp.json({ result: false, err: "El usuario no existe o la contraseña no coincide"});
			}
			// Miro si la contraseña es igual a la recibida, primero tengo que hashearla

			let contraseñaUsuarioBD = usuarioEncontrado.clave;

			var sha256 = crypto.createHash("sha256");
			sha256.update(contraseñaRecibida, "utf8");//utf8 here
			var passConHash = sha256.digest("base64");

			if(passConHash === contraseñaUsuarioBD){
				next();
			}
			
			else{
				resp.set("WWW-Authenticate", "Basic realm=Authorization Required"); //pone algo en la cabecera de la respuesta, SIN ENVIARLA AÚN
				resp.sendStatus(401); //ENVIA LA RESPUESTA -> 401="necesita autorización"
				return;
			}
		});

	}
};

module.exports = fn;