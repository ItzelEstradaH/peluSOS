'use strict'

//Importar módulos
var express = require('express');
var bodyParser = require('body-parser');

//Iniciar Express
var app = express();

//Archivo de Rutas
var routes = require('./routes/routes');

//Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//CORS

//Route Prefix y archivo de rutas
app.use('/api', routes);


//Exportar
module.exports = app;