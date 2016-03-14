'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 

var Anuncio = mongoose.model('Anuncio'); // pido el modelo

var auth = require("../../../lib/auth");

//router.use(auth("admin", "pass2")); 

/* GET users listing. */

router.get('/', function(req, res) { 
	var sort = req.query.sort || 'name';
	Anuncio.list(sort, function(err, rows){
		if(err){
			return res.json({result: false, err: err});
		}
		//Cuando estén disponibles, los mando en JSON
		res.json({result: true, rows: rows});
		return;
	});
});


module.exports = router;