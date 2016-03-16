"use strict";

var conn = require('../lib/connectMongoose');

var mongoose = require('mongoose');

//Creo el esquema

let userSchema = mongoose.Schema({
	nombre: String,
	email: String,
	clave: String
});

// al esquema le metemos un estático
userSchema.statics.list = function(filter, sort,  cb){
	let sortAplicar = sort || "name";
	// preparamos la query sin ejecutarla
	let query = User.find(filter);
	// añadimos más parámetros a la query
	query.sort(sortAplicar);

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
var User = mongoose.model('User', userSchema);

