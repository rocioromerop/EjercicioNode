"use strict";

var conn = require('../lib/connectMongoose');

var mongoose = require('mongoose');

//Creo el esquema

var userSchema = mongoose.Schema({
	nombre: String,
	email: String,
	clave: String
});

// al esquema le metemos un estático
userSchema.statics.list = function(sort,  cb){
	// preparamos la query sin ejecutarla
	var query = User.find({});
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
var User = mongoose.model('User', userSchema);

