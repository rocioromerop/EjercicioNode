'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var crypto = require("crypto");

var User = mongoose.model('User'); // pido el modelo

var auth = require("../../../lib/auth");

/**
 * @api {get} /usuarios/ Obtener usuarios
 * @apiName getUsuarios
 * @apiDescription Para obtener los usuarios existentes. 
 * @apiGroup usuarios
 * @apiPermission autentication
 * @apiSuccess {json} result: true, rows: rows
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/usuarios
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          "result": true,
          "rows": [
            {
              "_id": "56e91e130ae094b01b56c532",
              "nombre": "rocio",
              "email": "rocio",
              "clave": "LJ0/L3lYpZwdf1rb40LiA1u05qzrve78aOtyusIxkdQ=",
              "__v": 0
            },
            {
              "_id": "56e91e240ae094b01b56c533",
              "nombre": "prueba",
              "email": "prueba",
              "clave": "ZV54ZnTZ0+d7wF7R3je0tryJ94iCn588Z552h7QQyJs=",
              "__v": 0
            },
            {
              "_id": "56e91e2c0ae094b01b56c534",
              "nombre": "prueba1",
              "email": "prueba1",
              "clave": "75lOcmKni5fAOa31ghTuffEHaCSn5HU4lIumGuArBcc=",
              "__v": 0
            }
          ]
        }
 *
 * @apiError {json} result: false, err: err
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
 * @api {post} /usuarios/ Regitrar usuario
 *
 * @apiName postUsuario
 * @apiGroup usuarios
 * @apiDescription Para registrar un usuario nuevo. Primero comprueba si ese usuario existe o no ya en la base de datos, y si ya existe no te deja añadirlo. La clave se guardará con hash sha256.
 * @apiPermission none
 * @apiVersion 1.0.0
 * @apiParam {string} nombre nombre del usuario a registrar
 * @apiParam {string} clave clave del usuario a registrar
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/usuarios
 *
 * @apiSuccess {json} result: true, row: newRow
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
 * @apiError {json} result: false, err: err
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
 * @api {put} /usuarios/:id Actualizar usuario
 *
 * @apiName putUsuarios
 * @apiGroup usuarios
 * @apiDescription Para actualizar un usuario existente, se le pasa el id del usuario a actualizar
 * @apiPermission autentication
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/usuarios/56e91e240ae094b01b56c533
 *
 * @apiVersion 1.0.0
 * @apiParam {string} nombre nombre del usuario a actualizar
 * @apiParam {string} id id del usuario a actualizar
 * @apiParam {string} clave clave del usuario a actualizar
 * @apiParam {string} email email del usuario a actualizar
 *
 * @apiSuccess {json} result: true, row: newRow 
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
 * @apiError {json} result: false, err: err 
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "result": false,
 *       "err": "El usuario El usuario ya está cogido"
 *      }
 */

router.put('/:id', function(req, res) {
    var options = {};
    User.findOne({nombre: req.body.nombre}, function(err, rows){
      if(err){
        return res.json({result: false, err: err});
      }
      console.log(rows);
      if(rows==null){
        User.update({ _id: req.params.id }, { $set: req.body }, options, function(err, data) {
        if (err) {
            return res.json({ result: false, err: err});
        }
        return res.json({ result: true, row: data });
        });
      }
      else{
        return res.json({result: false, err: 'El usuario ya está cogido'});
      }
      
    });
    });    


/**
 * @api {delete} /usuarios/:id Eliminar usuario
 *
 * @apiName deleteUsuarios
 * @apiGroup usuarios
 * @apiVersion 1.0.0
 * @apiDescription Para eliminar un usuario existente, hay que pasarle el id
 * @apiPermission autentication
 * @apiParam {id} id id del usuario a eliminar
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/usuarios/56e91e240ae094b01b56c533
 *
 * @apiSuccess {json} result: true, row: newRow 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
        "result": true,
        "resp": "Usuario eliminado correctamente"
      }

 *
 * @apiError {json} result: false, err: No se ha podido eliminar el usuario (ha ocurrido un problema en la base de datos
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
