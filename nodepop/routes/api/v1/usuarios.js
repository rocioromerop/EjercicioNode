'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 
var crypto = require("crypto");
var sha256 = crypto.createHash("sha256");


var User = mongoose.model('User'); // pido el modelo

var auth = require("../../../lib/auth");

//router.use(auth("admin", "pass2")); 

/* GET users listing. */

router.get('/', function(req, res) { 
	var sort = req.query.sort || 'name';
	User.list(sort, function(err, rows){
		if(err){
			return res.json({result: false, err: err});
		}
		//Cuando estén disponibles, los mando en JSON
		res.json({result: true, rows: rows});
		return;
	});
});

// Añadir un usuario
router.post('/', function(req, res){
	//lo hacemos directamente con mongoose:

	//quiero poner el hash a la pass primero, y luego ya guardar lo obtenido

	var pass = req.body.clave;

	sha256.update(pass, "utf8");
	var passConHash = sha256.digest("base64");

	console.log('Pass con hash: ' + passConHash);

	// cambiar el "pass" por "passConHash"

	var prueba = {
		"name" : req.body.name,
		"email" : req.body.email,
		"clave" : passConHash
	};

	var user = new User (prueba); // creamos el objeto en memoria, aún no está en la base de datos

	user.save(function(err, newRow){// lo guardamos en la base de datos
		//newRow contiene lo que se ha guardado, la confirmación
		if(err){
			res.json({result: false, err: err});
			return;
		}
		res.json({result: true, row: newRow});
		return;
	});	
});


// Actualizar un usuario
router.put('/:id', function(req, res){
	var options={};
	//var options={multi:true};  //para actualizar varios, usar multi
	User.update({ _id: req.params.id}, {$set: req.body }, options, function(err, data){
		if(err){
			return res.json({result: false, err: err});
		}
		res.json({result: true, row: data});

	});
});


module.exports = router;