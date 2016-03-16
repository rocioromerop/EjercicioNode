'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 
require('../../../models/anuncioModel');
var Anuncio = mongoose.model('Anuncio'); // pido el modelo

var auth = require("../../../lib/auth");

router.use(auth());  // esta ruta necesita autorización

/**
 * @api {get} Para obtener los anuncios 
 * @apiName getAnuncios
 * @apiGroup anuncios
 *
 * @apiParam {venta} filtro por tipo de anuncio
 * @apiParam {tags} filtro por tags 
 * @apiParam {precio} filtro por precio 
 * @apiParam {nombre} filtro por nombre
 * @apiParam {sort} para sobre qué elemento se filtra 

 * @apiSuccess json {result: true, rows: rows}
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "result":true,"rows":[{	
				"_id":"56e6b003056d796c052a75c7","nombre":"Bicicleta","venta":true,"precio":230.15,"foto":"bici.jpg","__v":0,"tags":["lifestyle","motor"]
				}
				,
				{
				"_id":"56e6b003056d796c052a75c8","nombre":"iPhone 3GS","venta":false,"precio":50,"foto":"iphone.png","__v":0,"tags":["lifestyle","mobile"]
				}]
				}
 *     }
 *
 * @apiError json {result: false, err: err};
 */

router.get('/', function(req, res) { 
	let sort = req.query.sort || 'name';
	let filters = {};
	let precio = {};
	let start;
	let limit;

	// PARA LA PAGINACIÓN
	if(req.query.start != undefined){
		start = req.query.start;
	}
	else{
		start = 0; //decido que si no me dicen nada, que empiece desde el principio
	}
	if(req.query.limit != undefined){
		limit = req.query.limit;
	}
	else{
		limit = 0; //decido que si no me dicen nada, no habrá límite, es decir, todos los elementos que existen en la base de datos
	}

	// PARA LOS FILTROS
	if(req.query.venta != undefined && (req.query.venta === 'false' || req.query.venta === 'true')){
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
			precio.$lte = req.query.precio.substring(1);
		}
		if( /-$/.test(req.query.precio) ) {
			precio.$gte = req.query.precio.substring(0, (req.query.precio.length-1));
		}
		if(req.query.precio.match(/[0-9]+(-){1}[0-9]+/)){
			let variable = req.query.precio.match(/[0-9]+(-){1}/);
			let izquierda = variable[0].substring(0, (variable.length));
			precio.$gte = izquierda;
			let variable2= req.query.precio.match(/(-){1}[0-9]+/);
			let derecha = variable2[0].substring(1);
			precio.$lte = derecha;
		}
		else{
			precio = req.query.precio;
		}

		filters.precio=precio;
	}
	Anuncio.list(start, limit, filters, sort, function(err, rows){
		if(err){
			return res.json({result: false, err: 'Hay un error con la base de datos'});
		}
		res.json({result: true, rows: rows});
		return;
	});
});

router.get('/tags', function(req, res) { 
	Anuncio.list('0', '0', {}, 'name', function(err, rows){
		if(err){
			return res.json({result: false, err: err});
		}
		let resultado = null;

		let comprobar = false;
		
		// Coger los tags de todos los anuncios y guardarlos en una variable para luego devolverla en resultado

		for(let i=0; i<rows.length ; i++){
			if(rows[i].tags.length != 0){
				if(comprobar==false){ //es la primera vez que hago el bucle, no quiero agregar el null de resultado
					resultado = rows[i].tags;
					comprobar=true;
				}
				else{
					resultado = rows[i].tags.concat(resultado);
				}
				
			}
		}

		let resultadoSinRepetir = resultado.filter(function (item, pos) {return resultado.indexOf(item) == pos});

		res.json({result: true, rows: resultadoSinRepetir});
		return;
	});
});


// Para añadir un anuncio -> Todos los elementos son obligatorios. El formato para recibir los tags es con comas.

router.post('/', function(req, res) { 

	//Todos los elementos son obligatorios para añadir un anuncio

	if(req.body.nombre == undefined || req.body.venta == undefined || req.body.precio == undefined || req.body.foto == undefined || req.body.tags == undefined){
		return res.json({result: false, err: "Es necesario introducir todos los elementos al anuncio (nombre, venta, precio, foto, tags)"});
	}

	let anuncioAgregar = {};

	//Coger los elementos a añadir del anuncio

	anuncioAgregar.nombre = req.body.nombre;
	anuncioAgregar.venta = req.body.venta;
	anuncioAgregar.precio = req.body.precio;
	anuncioAgregar.foto = req.body.foto;

	//los tags llegan con comas, por tanto tenemos que separarlos para meterlos en la base de datos como elementos diferentes

	let separados = req.body.tags.split(",");

	anuncioAgregar.tags = separados;

	let anuncio = new Anuncio(anuncioAgregar); 

	anuncio.save(function(err, newRow) { // lo guardamos en la base de datos
                //newRow contiene lo que se ha guardado, la confirmación
                if (err) {
                    res.json({ result: false, err: err });
                    return;
                }
                res.json({ result: true, row: newRow });
                return;
            });
});

module.exports = router;