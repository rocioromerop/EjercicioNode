'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var crypto = require("crypto");

var User = mongoose.model('User'); // pido el modelo

var auth = require("../../../lib/auth");

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

router.get('/', auth(), function(req, res) {
    var sort = req.query.sort || 'name';
    User.list({}, sort, function(err, rows) {
        if (err) {
            return res.json({ result: false, err: err });
        }
        //Cuando estén disponibles, los mando en JSON
        res.json({ result: true, rows: rows });
        return;
    });
});

/**
 * @api {post} Para registrar un usuario nuevo. Primero comprueba si ese usuario existe o no ya en la base de datos, y si ya existe no te deja añadirlo. La clave se guardará con hash sha256.
 *
 * @apiName postUsuario
 * @apiGroup usuarios
 *
 * @apiParam {nombre} nombre del usuario a registrar
 * @apiParam {clave} clave del usuario a registrar
 *
 * @apiSuccess json result: true, row: newRow
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
        "result": true,
        "row": {
        "__v": 0,
        "nombre": "prueba",
        "email": "prueba",
        "clave": "JlHO10KdlalaE064+hSnfL114zWcpVkDSFFp/VIIwIE=",
        "_id": "56e91e370ae094b01b56c535"
      }
}
 *
 * @apiError json result: false, err: err
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "result": false,
 *       "err": "El usuario ya está registrado"
 *      }
 */

router.post('/', function(req, res) {

    //quiero poner el hash a la pass primero, y luego ya guardar lo obtenido
    var usuario = req.body;
    var pass = req.body.clave;
    let filters = {};
    filters.nombre = usuario.nombre;
    //comprobar si existe ese nombre en la base de datos primero!
    User.list(filters, 'nombre', function(err, rows) {
        if (err) {
            res.json({ result: false, err: err });
            return;
        }
        console.log(rows);
        if (rows.length !== 0) {
            res.json({ result: false, err: "El usuario ya está registrado" });
            return;
        } else {
            let sha256 = crypto.createHash("sha256");
            sha256.update(pass, "utf8"); //utf8 here
            let passConHash = sha256.digest("base64");
            usuario.clave = passConHash;
            let user = new User(usuario); // creamos el objeto en memoria, aún no está en la base de datos

            user.save(function(err, newRow) { // lo guardamos en la base de datos
                //newRow contiene lo que se ha guardado, la confirmación
                if (err) {
                    res.json({ result: false, err: err });
                    return;
                }
                res.json({ result: true, row: newRow });
                return;
            });
        }
        return;
    });

});

/**
 * @api {put} Para actualizar un usuario existente
 *
 * @apiName putUsuarios
 * @apiGroup usuarios
 *
 * @apiParam {nombre} nombre del usuario a actualiza
 * @apiParam {id} id del usuario a actualiza
 * @apiParam {clave} clave del usuario a actualiza
 * @apiParam {email} email del usuario a actualiza
 *
 * @apiSuccess json result: true, row: newRow 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
        "result": true,
        "row": {
        "__v": 0,
        "nombre": "prueba",
        "email": "prueba",
        "clave": "JlHO10KdlalaE064+hSnfL114zWcpVkDSFFp/VIIwIE=",
        "_id": "56e91e370ae094b01b56c535"
      }
}
 *
 * @apiError json result: false, err: err 
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "result": false,
 *       "err": "El usuario ya está registrado"
 *      }
 */

router.put('/:id', function(req, res) {
    var options = {};
    //var options={multi:true};  //para actualizar varios, usar multi
    User.update({ _id: req.params.id }, { $set: req.body }, options, function(err, data) {
        if (err) {
            return res.json({ result: false, err: err });
        }
        res.json({ result: true, row: data });

    });
});


/**
 * @api {delete} Para eliminar un usuario existente
 *
 * @apiName deleteUsuarios
 * @apiGroup usuarios
 *
 * @apiParam {id} id del usuario a eliminar
 *
 * @apiSuccess json result: true, row: newRow 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
        "result": true,
        "resp": "Usuario eliminado correctamente"
      }

 *
 * @apiError json result: false, err: No se ha podido eliminar el usuario (ha ocurrido un problema en la base de datos
 *
 */

router.delete('/:id', function(req, res){
    let nombre = req.params.nombre;
    User.remove({_id: req.params.id}, function(err){
        if(err) return res.json({result: false, err: 'No se ha podido eliminar el usuario (ha ocurrido un problema en la base de datos, o el usuario no existe'});
        res.json({result: true, resp: "Usuario eliminado correctamente"});
        return;
    });

});


module.exports = router;
