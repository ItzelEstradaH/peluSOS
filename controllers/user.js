'use strict'

var validator = require('validator');
var User = require('../models/user');

var controller = {

  save: (req, res)=>{
    //obtener datos por POST
    var params = req.body;
    //validar datos con Validator
    try {
      var valid_type = validator.matches(params.type, '[123]');
      
      if(params.type === '3')
        var valid_rfc = validator.matches(params.rfc, '[A-Z]{3}[0-9]{6}[A-Z-0-9]{3}'); 
      else
        var valid_rfc = validator.isEmpty(params.rfc);

      var valid_name = !validator.isEmpty(params.name);
      var valid_phone = validator.isMobilePhone(params.phone, 'es-MX');
      var valid_pass = validator.isLength(params.pass, {min:8});
      
    } catch (error) {
      return res.status(400).send({
        msg: 'Faltan datos requeridos.'
      });
    }

    if(valid_type && valid_rfc && valid_name && valid_phone && valid_pass){
      //Crear objeto con los datos
      var user = new User();
      user.type = params.type;
      user.rfc = params.rfc;
      user.name = params.name;
      user.phone = params.phone;
      user.pass = params.pass;

      user.save((error, userStored)=>{
        if(error || !userStored){
          return res.status(400).send({
            msg: 'No se puede completar el registro.',
            error
          });

        }
        return res.status(201).send({
          msg: 'Usuario registrado.',
          user: userStored
        });
      });
      
    }else{
      
      //Crear objeto con los datos
      return res.status(400).send({
        msg: 'Datos no válidos.',
        data: {
          rfc: {
            value: params.rfc,
            valid: valid_rfc
          },
          name: {
            value: params.name,
            valid: valid_name
          },
          phone: {
            value: params.phone,
            valid: valid_phone
          },
          pass: {
            value: params.pass,
            valid: valid_pass
          }
        }
      });
    }
    
  },

  login:(req, res) => {
    var phone = req.body.phone;
    var pass = req.body.pass;

    User.findOne({phone:phone}).exec((error,user) =>{

      if (error) {
        return res.status(500).send({
          msg:'Ocurrió un error',
          error
        });
      }

      if (!user) {
        return res.status(404).send({
          msg:'El teléfono no está registrado'
        });
      }

      if(user.pass != pass){
        return res.status(401).send({
          msg:'Contraseña incorrecta'
        });
      }

      //Iniciar sesión
      //Pasos para crear la sesión en el servidor.

      //Enviar respuesta
      return res.status(200).send({
        msg:'Bienvenido: '+user.name,
      });

    });

  
  }
  


};

module.exports = controller;