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
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});


//Route Prefix y archivo de rutas
app.use('/api', routes);


//Exportar
module.exports = app;