'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 

var crypto = require("crypto");

var User = mongoose.model('User'); // pido el modelo

var auth = require("../../../lib/auth");


/* GET users listing. */

router.get('/', auth(), function(req, res) { 
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

	//quiero poner el hash a la pass primero, y luego ya guardar lo obtenido
	var usuario= req.body;
	var pass = req.body.clave;

	// cambiar el "pass" por "passConHash"

	var sha256 = crypto.createHash("sha256");
	sha256.update(pass, "utf8");//utf8 here
	var passConHash = sha256.digest("base64");

	usuario.clave=passConHash;

	var user = new User (usuario); // creamos el objeto en memoria, aún no está en la base de datos

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