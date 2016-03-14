'use strict';

var basicAuth=require('basic-auth'); //nos devuelve una función en vez de un objeto

//Ahora este user y pass será contra el que tendremos que comprobar cuando construimos el closure
var fn = function(user, pass){
	//hacemos una función que devuelve otra función
	return function(req, resp, next){ // middleware con el que controlaré la ocupación	
		var userRequest = basicAuth(req);
		if(!user || userRequest.name !== user || userRequest.pass !== pass){ // no nos han mandado usuario
			resp.set("WWW-Authenticate","Basic realm=Authorization Required"); //pone algo en la cabecera de la respuesta, SIN ENVIARLA AÚN
			resp.send(401); //401="necesita autorización"
			return;
		}
		next();
	}
};

module.exports = fn;