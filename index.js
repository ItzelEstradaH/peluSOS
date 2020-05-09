'use strict'

var mongoose = require('mongoose');
var app = require('./app.js');
var port = 8080;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/pelusos',{useNewUrlParser: true})
  .then(()=>{
    console.log('Conexión a MongoDB correcta!');
    //Iniciar servidor
    app.listen(port,()=>{
      console.log('Servidor corriendo en puerto: '+port);
    });

  }); 
