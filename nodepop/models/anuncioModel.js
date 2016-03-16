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
anuncioSchema.statics.list = function(start, limit, filters, sort,  cb){

	console.log('limit', limit);
	console.log('start', start);

	// preparamos la query sin ejecutarla
	let query = Anuncio.find(filters);
	// añadimos más parámetros a la query
	if(limit != 0){
		query.limit(limit);
	}

	query.sort(sort);

	if(start != 0){
		query.skip(start);
	}


	// se ejecuta la query:
	query.exec(function(err, rows){
		if (err){
			cb(err);
			return;
		}
		cb(null, rows);
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

/**
 * @api {get} /user/:id Get User information
 * @apiVersion 0.1.0
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */