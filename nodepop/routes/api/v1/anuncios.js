'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 

var Anuncio = mongoose.model('Anuncio'); // pido el modelo

var auth = require("../../../lib/auth");

router.use(auth());  // esta ruta necesita autorización

/* GET users listing. */

router.get('/', function(req, res) { 
	let sort = req.query.sort || 'name';
	let filters = {};
	let precio = {};

	if(req.query.venta != undefined){
		filters.venta = req.query.venta;
	}

	if(req.query.tags != undefined){
		filters.tags = req.query.tags;
	}

	if(req.query.nombre != undefined){
		filters.nombre = new RegExp('^' + req.query.nombre, "i");
	}

	if(req.query.precio != undefined){
		if( /^-/.test(req.query.precio) ){ 
			precio.$lte = req.query.precio;
		}
		filters.precio=precio;
	}
	Anuncio.list(filters, sort, function(err, rows){
		if(err){
			return res.json({result: false, err: err});
		}
		//Cuando estén disponibles, los mando en JSON
		res.json({result: true, rows: rows});
		return;
	});
});


module.exports = router;