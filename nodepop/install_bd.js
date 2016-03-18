"use strict";

var conn = require('./lib/connectMongoose');

var async = require('async');
var mongoose = require('mongoose');

require('./models/anuncioModel');
require('./models/userModel');

var Anuncio = mongoose.model('Anuncio'); // pido el modelo
var User = mongoose.model('User');

// cargar librería
var fs = require('fs');

// PARA LEER EL anuncios.json
// leer fichero de texto en utf8 y guardarlo en la base de datos

function leerArchivo(archivo) {
    return new Promise(function(resolve, reject) {
        fs.readFile(archivo, { encoding: "utf8" }, function(err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        })
    })
};

function eliminarTodosAnuncios() {
    return new Promise(function(resolve, reject) {
        Anuncio.remove(function(err) {
            if (err) {
                reject(err);
            }
            resolve();
        })
    })
}

function guardarAnuncios(anuncioss) { //anuncios quiero que sea JSON.parse(data)
    return new Promise(function(resolve, reject) {
		let ann = JSON.parse(anuncioss);
		console.log('ANN: ', ann);
		console.log('ann.anuncios', ann.anuncios);
    	async.eachSeries(ann.anuncios, function cada(item, siguiente) {
        	console.log("CADA ITEM: ", item);
			let anuncio = new Anuncio(item);
            anuncio.save(function(err) {
	            if (err) {
	                siguiente(err);
	            }
	            console.log("Se guardan los anuncios");
	            siguiente(null); //Si aqui hay un error, se va a la función finalizadora y termina. Si tiene valor null, sigue con el siguiente elemento.
        	});
        }, 
        function fin(err) {
        	if(err != null){
        		reject("ERROR AL AÑADIR ANUNCIOS");
        	}
            resolve(console.log("ACABO DE CREAR LOS ANUNCIOS"));
        });
	    
    })
}

function eliminarTodosUsuarios() {
    return new Promise(function(resolve, reject) {
        User.remove(function(err) {
            if (err) {
                reject(err);
            }
            console.log("Se eliminan los usuarios");
            resolve();
        })
    })
}


function guardarUsuarios(usuarioss) { //anuncios quiero que sea JSON.parse(data)
    return new Promise(function(resolve, reject) {
		let uss = JSON.parse(usuarioss);
    	async.eachSeries(uss.usuarios, function cada(item, siguiente) {
        	console.log("CADA ITEM: ", item);
			let usuario = new User(item);
            usuario.save(function(err) {
	            if (err) {
	                siguiente(err);
	            }
	            console.log("Se guardan los usuarios");
	            siguiente(null); //Si aqui hay un error, se va a la función finalizadora y termina. Si tiene valor null, sigue con el siguiente elemento.
        	});
        }, 
        function fin(err) {
        	if(err != null){
        		reject("ERROR AL AÑADIR USUARIOS");
        	}
            resolve(console.log("ACABO DE CREAR LOS USUARIOS"));
        });
	    
    })
}

eliminarTodosAnuncios()
    .then(function(){
    	return leerArchivo('./anuncios.json'); 
	})
    .then(guardarAnuncios)
    .then(eliminarTodosUsuarios)
    .then(function(){
		return leerArchivo('./usuarios.json');
	})
	.then(function(){
		process.exit();
	})
	.then(guardarUsuarios)
    .catch(function(err) {
        console.log("ERROR EN EL PROCESO DE CARGA DE BD");
        process.exit(1);
    });
