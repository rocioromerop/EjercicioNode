define({ "api": [
  {
    "type": "delete",
    "url": "/anuncios/:id",
    "title": "Eliminar anuncio",
    "name": "deleteAnuncios",
    "group": "anuncios",
    "description": "<p>Para eliminar un anuncio. Se ha de pasar el id del anuncio</p>",
    "permission": [
      {
        "name": "autentication"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/anuncios/56e6b003056d796c052a75c8",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>id del anuncio</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "json",
            "description": "<p>result: true, row: newRow</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n\t\t  result: true, resp: \"Anuncio eliminado correctamente\"\n\t\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "result:",
            "description": "<p>false, err: 'No se ha podido eliminar el anuncio (ha ocurrido un problema en la base de datos, o el anuncio no existe'</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": " {\n  \"result\": false,\n  \"err\": \"No se ha podido eliminar el anuncio (ha ocurrido un problema en la base de datos, o el anuncio no existe\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/v1/anuncios.js",
    "groupTitle": "anuncios"
  },
  {
    "type": "get",
    "url": "/anuncios/",
    "title": "Obtener los anuncios",
    "name": "getAnuncios",
    "group": "anuncios",
    "description": "<p>Para obtener todos los anuncios. Se pueden dar los filtros por venta, tags, precio, nombre y orden. Para cada elemento es: \t\t\t\t\t\tPara venta, se puede poner true si es venta y false si es que se busca \t\t\t\t\t\tPara nombre, mostrará todos los que tengan ese nombre \t\t\t\t\t\tPara tags, mostrará todos los que tengan esos tags \t\t\t\t\t\tPara precio, el formato es: -50 devolvería los que tienen el precio menor o igual de 50, 50- devolvería los que tienen el precio mayor o igual que 50, 50 devolvería los que tienen el precio exactamente 50, 50-80 devolvería los que tienen precio entre 50 y 80</p>",
    "permission": [
      {
        "name": "autentication"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/anuncios",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "venta",
            "description": "<p>filtro por tipo de anuncio</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tags",
            "description": "<p>filtro por tags</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "precio",
            "description": "<p>filtro por precio</p>"
          },
          {
            "group": "Parameter",
            "type": "nombre",
            "optional": false,
            "field": "filtro",
            "description": "<p>por nombre</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sort",
            "description": "<p>para sobre qué elemento se filtra</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "json",
            "description": "<p>result: true, rows: rows</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n      \"result\":true,\"rows\":[{\t\n\t\t\t\t\"_id\":\"56e6b003056d796c052a75c7\",\"nombre\":\"Bicicleta\",\"venta\":true,\"precio\":230.15,\"foto\":\"bici.jpg\",\"__v\":0,\"tags\":[\"lifestyle\",\"motor\"]\n\t\t\t\t}\n\t\t\t\t,\n\t\t\t\t{\n\t\t\t\t\"_id\":\"56e6b003056d796c052a75c8\",\"nombre\":\"iPhone 3GS\",\"venta\":false,\"precio\":50,\"foto\":\"iphone.png\",\"__v\":0,\"tags\":[\"lifestyle\",\"mobile\"]\n\t\t\t\t}]\n\t\t\t\t}\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "json",
            "description": "<p>result: false, err: err</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/api/v1/anuncios.js",
    "groupTitle": "anuncios"
  },
  {
    "type": "get",
    "url": "/anuncios/tags",
    "title": "Obtener los tags de los anuncios",
    "name": "getTags",
    "group": "anuncios",
    "description": "<p>Para obtener los tags de los anuncios</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "result:",
            "description": "<p>true, rows: resultadoSinRepetir</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n   {\n\t\t\"result\":true,\"rows\":[\"prueba\",\" prueba2\",\"prueba, prueba2\",\"[prueba]\",\"lifestyle\",\"mobile\",\"motor\"]\n\t\t}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/anuncios/tags",
        "type": "curl"
      }
    ],
    "permission": [
      {
        "name": "autentication"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "json",
            "description": "<p>result: false, err: err</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/api/v1/anuncios.js",
    "groupTitle": "anuncios"
  },
  {
    "type": "post",
    "url": "/anuncios/",
    "title": "Añadir un anuncio",
    "name": "postAnuncios",
    "group": "anuncios",
    "description": "<p>Para añadir un anuncio. Todos los elementos son obligatorios. El formato para recibir los tags es con comas</p>",
    "permission": [
      {
        "name": "autentication"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/anuncios/",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "nombre",
            "description": "<p>nombre del anuncio</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "venta",
            "description": "<p>puede ser = true o = false, identifica si es vender o buscar</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "precio",
            "description": "<p>precio del anuncio</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "foto",
            "description": "<p>foto del anuncio</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tags",
            "description": "<p>tags del anuncio</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "json",
            "description": "<p>result: true, row: newRow</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n\t\t  \"result\": true,\n\t\t  \"row\": {\n\t\t    \"__v\": 0,\n\t\t    \"nombre\": \"anuncio1\",\n\t\t    \"venta\": true,\n\t\t    \"precio\": 9999,\n\t\t    \"foto\": \"foto.jpg\",\n\t\t    \"_id\": \"56e951ab1bbe62c01f677907\",\n\t\t    \"tags\": [\n\t\t      \"prueba\",\n\t\t      \" prueba2\"\n\t\t    ]\n\t\t  }\n\t\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "json",
            "description": "<p>result: false, err: err</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": " {\n  \"result\": false,\n  \"err\": \"Es necesario introducir todos los elementos al anuncio (nombre, venta, precio, foto, tags)\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": " {\n  \"result\": false,\n  \"err\": \"Ha ocurrido un error con la base de datos\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/v1/anuncios.js",
    "groupTitle": "anuncios"
  },
  {
    "type": "put",
    "url": "/anuncios/:id",
    "title": "Modificar anuncio",
    "name": "updateAnuncio",
    "group": "anuncios",
    "description": "<p>Para modificar un anuncio. Se ha de pasar el id del anuncio a modificar</p>",
    "permission": [
      {
        "name": "autentication"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>id del anuncio a modificar</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "nombre",
            "description": "<p>modificar el nombre del anuncio</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "venta",
            "description": "<p>modificar true para venta y false para búsqueda</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "precio",
            "description": "<p>modificar el precio del anuncio</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "foto",
            "description": "<p>modificar la foto del anuncio</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tags",
            "description": "<p>modificar los tags del anuncio</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/anuncios/56e6b003056d796c052a75c8",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "json",
            "description": "<p>result: true, row: newRow</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n\t\t  result: true, resp: \"Anuncio modificado correctamente\"\n\t\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "result:",
            "description": "<p>false, err: 'No se ha podido modificar el anuncio (ha ocurrido un problema en la base de datos, o el anuncio no existe'</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": " {\n  \"result\": false,\n  \"err\": \"No se ha podido modificar el anuncio (ha ocurrido un problema en la base de datos, o el anuncio no existe\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/v1/anuncios.js",
    "groupTitle": "anuncios"
  },
  {
    "type": "delete",
    "url": "/usuarios/:id",
    "title": "Eliminar usuario",
    "name": "deleteUsuarios",
    "group": "usuarios",
    "description": "<p>Para eliminar un usuario existente, hay que pasarle el id</p>",
    "permission": [
      {
        "name": "autentication"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "id",
            "optional": false,
            "field": "id",
            "description": "<p>id del usuario a eliminar</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/usuarios/56e91e240ae094b01b56c533",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "result:",
            "description": "<p>true, row: newRow</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n{\n     \"result\": true,\n     \"resp\": \"Usuario eliminado correctamente\"\n   }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "result:",
            "description": "<p>false, err: No se ha podido eliminar el usuario (ha ocurrido un problema en la base de datos</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/api/v1/usuarios.js",
    "groupTitle": "usuarios"
  },
  {
    "type": "get",
    "url": "/usuarios/",
    "title": "Obtener usuarios",
    "name": "getUsuarios",
    "description": "<p>Para obtener los usuarios existentes.</p>",
    "group": "usuarios",
    "permission": [
      {
        "name": "autentication"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "result:",
            "description": "<p>true, rows: rows</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n      \"result\": true,\n      \"rows\": [\n        {\n          \"_id\": \"56e91e130ae094b01b56c532\",\n          \"nombre\": \"rocio\",\n          \"email\": \"rocio\",\n          \"clave\": \"LJ0/L3lYpZwdf1rb40LiA1u05qzrve78aOtyusIxkdQ=\",\n          \"__v\": 0\n        },\n        {\n          \"_id\": \"56e91e240ae094b01b56c533\",\n          \"nombre\": \"prueba\",\n          \"email\": \"prueba\",\n          \"clave\": \"ZV54ZnTZ0+d7wF7R3je0tryJ94iCn588Z552h7QQyJs=\",\n          \"__v\": 0\n        },\n        {\n          \"_id\": \"56e91e2c0ae094b01b56c534\",\n          \"nombre\": \"prueba1\",\n          \"email\": \"prueba1\",\n          \"clave\": \"75lOcmKni5fAOa31ghTuffEHaCSn5HU4lIumGuArBcc=\",\n          \"__v\": 0\n        }\n      ]\n    }",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/usuarios",
        "type": "curl"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "result:",
            "description": "<p>false, err: err</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/api/v1/usuarios.js",
    "groupTitle": "usuarios"
  },
  {
    "type": "post",
    "url": "/usuarios/",
    "title": "Regitrar usuario",
    "name": "postUsuario",
    "group": "usuarios",
    "description": "<p>Para registrar un usuario nuevo. Primero comprueba si ese usuario existe o no ya en la base de datos, y si ya existe no te deja añadirlo. La clave se guardará con hash sha256.</p>",
    "permission": [
      {
        "name": "none"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "nombre",
            "description": "<p>nombre del usuario a registrar</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "clave",
            "description": "<p>clave del usuario a registrar</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/usuarios",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "result:",
            "description": "<p>true, row: newRow</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n   {\n        \"result\": true,\n        \"row\": {\n        \"__v\": 0,\n        \"nombre\": \"prueba\",\n        \"email\": \"prueba\",\n        \"clave\": \"JlHO10KdlalaE064+hSnfL114zWcpVkDSFFp/VIIwIE=\",\n        \"_id\": \"56e91e370ae094b01b56c535\"\n      }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "result:",
            "description": "<p>false, err: err</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"result\": false,\n  \"err\": \"El usuario ya está registrado\"\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/v1/usuarios.js",
    "groupTitle": "usuarios"
  },
  {
    "type": "put",
    "url": "/usuarios/:id",
    "title": "Actualizar usuario",
    "name": "putUsuarios",
    "group": "usuarios",
    "description": "<p>Para actualizar un usuario existente, se le pasa el id del usuario a actualizar</p>",
    "permission": [
      {
        "name": "autentication"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/usuarios/56e91e240ae094b01b56c533",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "nombre",
            "description": "<p>nombre del usuario a actualizar</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>id del usuario a actualizar</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "clave",
            "description": "<p>clave del usuario a actualizar</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email del usuario a actualizar</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "result:",
            "description": "<p>true, row: newRow</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n   {\n        \"result\": true,\n        \"row\": {\n        \"__v\": 0,\n        \"nombre\": \"prueba\",\n        \"email\": \"prueba\",\n        \"clave\": \"JlHO10KdlalaE064+hSnfL114zWcpVkDSFFp/VIIwIE=\",\n        \"_id\": \"56e91e370ae094b01b56c535\"\n      }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "json",
            "optional": false,
            "field": "result:",
            "description": "<p>false, err: err</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"result\": false,\n  \"err\": \"El usuario no existe\"\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/api/v1/usuarios.js",
    "groupTitle": "usuarios"
  }
] });
