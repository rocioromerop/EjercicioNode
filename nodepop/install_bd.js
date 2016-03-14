"use strict";

var conn = require('./lib/connectMongoose');

var mongoose = require('mongoose');

require('./models/anuncioModel');
require('./models/userModel');

var Anuncio = mongoose.model('Anuncio'); // pido el modelo
var User = mongoose.model('User');

// cargar librería
var fs = require('fs');

// PARA LEER EL anuncios.json
// leer fichero de texto en utf8 y guardarlo en la base de datos

fs.readFile('./anuncios.json', {encoding: "utf8"}, function(err, data){
	if (err){
		console.log("ERROR!" + err);
		return;
	} 
	Anuncio.remove(function(err){
		if(err){
			console.log("Error al eliminar los anuncios existentes");
			return;
		}
		console.log("Se eliminan los anuncios");
		var paquete = JSON.parse(data);
	
		//Recorriendo todos los anuncios; guardar en la base de datos paquete.anuncios[i]
		for(var i = 0; i<2; i++){
			var anuncio = new Anuncio(paquete.anuncios[i]);
			anuncio.save(function(err, anuncioCreado){
			if(err){
				 console.log("error");
				 return;
			}
				console.log('anuncioCreado' + anuncioCreado);
			});
	}
	console.log(paquete);
	
	});

});

// PARA LEER EL usuarios.json

fs.readFile('./usuarios.json', {encoding: "utf8"}, function(err, data){
	if (err){
		console.log("ERROR!" + err);
		return;
	} 

	User.remove(function(err){
		if(err){
			console.log("Error al eliminar los usuarios existentes");
			return;
		}
		console.log("Se eliminan los usuarios");
		var paquete2 = JSON.parse(data);
		
		//Recorriendo todos los usuarios; guardar en la base de datos paquete2.usuarios[i]
		for(var i = 0; i<2; i++){
			var usuario = new User(paquete2.usuarios[i]);
			usuario.save(function(err, usuarioCreado){
			if(err){	
				 console.log("error");
				 return;
			}
			console.log('usuarioCreado' + usuarioCreado);
			});

		}

		console.log(paquete2);
		console.log("FIN");
	});

	
});