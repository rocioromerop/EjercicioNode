'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 
require('../../../models/anuncioModel');
var Anuncio = mongoose.model('Anuncio'); // pido el modelo

var auth = require("../../../lib/auth");

router.use(auth());  // esta ruta necesita autorización

/**
 * @api {get} /anuncios/ Obtener los anuncios
 * @apiName getAnuncios
 * @apiGroup anuncios
 * @apiVersion 1.0.0
 * @apiDescription Para obtener todos los anuncios. Se pueden dar los filtros por venta, tags, precio, nombre y orden. Para cada elemento es: 
 						Para venta, se puede poner true si es venta y false si es que se busca 
 						Para nombre, mostrará todos los que tengan ese nombre 
 						Para tags, mostrará todos los que tengan esos tags 
 						Para precio, el formato es: -50 devolvería los que tienen el precio menor o igual de 50, 50- devolvería los que tienen el precio mayor o igual que 50, 50 devolvería los que tienen el precio exactamente 50, 50-80 devolvería los que tienen precio entre 50 y 80
 * @apiPermission autentication
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/anuncios
 * @apiParam {boolean} venta filtro por tipo de anuncio
 * @apiParam {string} tags filtro por tags 
 * @apiParam {number} precio filtro por precio 
 * @apiParam {nombre} filtro por nombre
 * @apiParam {string} sort para sobre qué elemento se filtra 

 * @apiSuccess json result: true, rows: rows
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
 * @apiError json result: false, err: err
 */

router.get('/', function(req, res) { 
	let sort = req.query.sort || 'name';
	let filters = {};
	let precio = {};
	let start = 0;
	let limit = 0;

	// PARA LA PAGINACIÓN
	if(req.query.start != undefined){
		start = parseInt(req.query.start);
	}

	if(req.query.limit != undefined){
		limit = parseInt(req.query.limit);
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

		var pre = req.query.precio.split("-");

		if(pre[1]==""){ //x-
			precio.$gte=pre[0];
		}

		if(pre[0]==""){//-x
			precio.$lte=pre[1];
		}

		if(pre[1] != "" && pre[0] != ""){ //x-y
			precio.$gte=pre[0];
			precio.$lte=pre[1];
		}

		if(pre[1] == undefined){
			precio=pre[0];
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

/**
 * @api {get} /anuncios/tags Obtener los tags de los anuncios 
 * @apiName getTags
 * @apiGroup anuncios
 * @apiDescription Para obtener los tags de los anuncios 
 * @apiSuccess {json} result: true, rows: resultadoSinRepetir
 * @apiVersion 1.0.0
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/anuncios/tags
 *
 * @apiPermission autentication
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 		"result":true,"rows":["prueba"," prueba2","prueba, prueba2","[prueba]","lifestyle","mobile","motor"]
 		}
 *
 * @apiError json result: false, err: err

 */

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


/**
 * @api {post} /anuncios/ Añadir un anuncio

 * @apiName postAnuncios
 * @apiGroup anuncios
 * @apiDescription Para añadir un anuncio. Todos los elementos son obligatorios. El formato para recibir los tags es con comas
 * @apiPermission autentication
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/anuncios/
 * @apiVersion 1.0.0
 * @apiParam {string} nombre nombre del anuncio
 * @apiParam {boolean} venta puede ser = true o = false, identifica si es vender o buscar 
 * @apiParam {number} precio precio del anuncio
 * @apiParam {string} foto foto del anuncio
 * @apiParam {string} tags tags del anuncio

 * @apiSuccess json result: true, row: newRow 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
		  "result": true,
		  "row": {
		    "__v": 0,
		    "nombre": "anuncio1",
		    "venta": true,
		    "precio": 9999,
		    "foto": "foto.jpg",
		    "_id": "56e951ab1bbe62c01f677907",
		    "tags": [
		      "prueba",
		      " prueba2"
		    ]
		  }
		}
 *       
 *     
 *
 * @apiError json result: false, err: err
 @apiErrorExample Error-Response:
 {
  "result": false,
  "err": "Es necesario introducir todos los elementos al anuncio (nombre, venta, precio, foto, tags)"
}
@apiErrorExample Error-Response:
 {
  "result": false,
  "err": "Ha ocurrido un error con la base de datos"
}

 */


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
                    res.json({ result: false, err: 'Ha ocurrido un error con la base de datos' });
                    return;
                }
                res.json({ result: true, row: newRow });
                return;
            });
});

/**
 * @api {delete} /anuncios/:id Eliminar anuncio
 * @apiVersion 1.0.0
 * @apiName deleteAnuncios
 * @apiGroup anuncios
 * @apiDescription Para eliminar un anuncio. Se ha de pasar el id del anuncio
 * @apiPermission autentication
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/anuncios/56e6b003056d796c052a75c8
 *
 * @apiParam {string} id id del anuncio

 * @apiSuccess json result: true, row: newRow 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
		  result: true, resp: "Anuncio eliminado correctamente"
		}
 *       
 *     
 *
 * @apiError {json} result: false, err: 'No se ha podido eliminar el anuncio (ha ocurrido un problema en la base de datos, o el anuncio no existe'

 @apiErrorExample Error-Response:
 {
  "result": false,
  "err": "No se ha podido eliminar el anuncio (ha ocurrido un problema en la base de datos, o el anuncio no existe"
}
 */

router.delete('/:id', function(req, res){
	let nombre = req.params.nombre;
	Anuncio.remove({_id: req.params.id}, function(err){
		if(err) return res.json({result: false, err: 'No se ha podido eliminar el anuncio (ha ocurrido un problema en la base de datos, o el anuncio no existe'});
		res.json({result: true, resp: "Anuncio eliminado correctamente"});
		return;
	});

});

/**
 * @api {put} /anuncios/:id Modificar anuncio
 *
 * @apiName updateAnuncio
 * @apiGroup anuncios
 * @apiDescription Para modificar un anuncio. Se ha de pasar el id del anuncio a modificar
 * @apiPermission autentication
 *
 * @apiVersion 1.0.0
 * @apiParam {string} id id del anuncio a modificar

   @apiParam {string} nombre modificar el nombre del anuncio
   @apiParam {boolean} venta modificar true para venta y false para búsqueda
   @apiParam {number} precio modificar el precio del anuncio
   @apiParam {string} foto modificar la foto del anuncio
   @apiParam {string} tags modificar los tags del anuncio

 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/anuncios/56e6b003056d796c052a75c8
 *
 * @apiSuccess json result: true, row: newRow 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
		  result: true, resp: "Anuncio modificado correctamente"
		}
 *       
 *     
 *
 * @apiError {json} result: false, err: 'No se ha podido modificar el anuncio (ha ocurrido un problema en la base de datos, o el anuncio no existe'

 @apiErrorExample Error-Response:
 {
  "result": false,
  "err": "No se ha podido modificar el anuncio (ha ocurrido un problema en la base de datos, o el anuncio no existe"
}
 */

router.put('/:id', function(req, res){
	  Anuncio.update({ _id: req.params.id }, { $set: req.body }, {}, function(err, data) {
        if (err) {
            return res.json({ result: false, err: 'No se ha podido modificar el anuncio (ha ocurrido un problema en la base de datos, o el anuncio no existe' });
        }
        res.json({ result: true, row: 'Anuncio modificado correctamente' });
    });
});


module.exports = router;






