"use strict";

var conn = require('../lib/connectMongoose');

var mongoose = require('mongoose');


//Creo el esquema

var anuncioSchema = mongoose.Schema({
	nombre: String,
	venta: Boolean,
	precio: Number,
	foto: String,
	tags: [String]
});


// al esquema le metemos un estático
anuncioSchema.statics.list = function(sort,  cb){
	// preparamos la query sin ejecutarla
	var query = Anuncio.find({});
	// añadimos más parámetros a la query
	query.sort(sort);

	// se ejecuta la query:
	query.exec(function(err, rows){
		if (err){
			cb(err);
			return;
		}
		cb(null,rows);
		return;
	});

};

// Al modelo le metemos el esquema
var Anuncio = mongoose.model('Anuncio', anuncioSchema);

// Métodos del modelo
var anuncio = {
	getAnuncios: function(cb){
		// con Mongoose
		Anuncio.find({}, function(err, datos){
			if(err){
				cb(err);
				return;
			}
			cb(null, datos);
			return;
		});
	}
};

module.exports = anuncio; 
