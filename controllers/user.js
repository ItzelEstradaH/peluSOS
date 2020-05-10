'use strict'

var validator = require('validator');
var User = require('../models/user');
var fs = require('fs');
var path = require('path');

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
          return res.status(500).send({
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
      
      //Devolver error con datos inválidos
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

  update:(req, res) => {
     //obtener datos por POST
     var params = req.body;
     //validar datos con Validator
     try {       
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
 
    if(valid_rfc && valid_name && valid_phone && valid_pass){
      //Crear objeto con los datos a actualizar
      var update = {
        rfc: params.rfc,
        name: params.name,
        phone: params.phone,
        pass: params.pass
      };

      User.findByIdAndUpdate(req.params.id,update, {new:true}, (error,user) => {
        if(error){
          return res.status(500).send({
            msg:'Ocurrió un error al actualizar los datos.',
            error
          });
        }

        if(!user){
          return res.status(404).send({
            msg:'La cuenta de usuario que deseas actualizar no existe.',
          });
        }

        return res.status(200).send({
          msg:'Datos actualizados con éxito.',
          user
        });

      });
    }else{

      //Devolver error con datos inválidos
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

  delete:(req, res) => {

    User.findByIdAndDelete(req.params.id,(error,user)=>{
      if(error){
        return res.status(500).send({
          msg:'Ha ocurrido un error.',
          error
        });
      }

      if(!user){
        return res.status(400).send({
          msg:'La cuenta de usuario no existe.'
        });
      }

      return res.status(200).send({
        msg:'La cuenta ha sido eliminada.',
      });
    });
    
  },

  setPicture:(req, res) => {

    if(!req.files.file0){
      return res.status(400).send({
        msg:'No se ha agregado ninguna imagen'
      });
    }

    var img = req.files.file0;
    var type = img.type.split('/')[1];

    if(type != 'jpeg' && type != 'gif' && type != 'png'){
      fs.unlink(img.path, (error)=>{
        if(error){
          return res.status(500).send({
            msg:'Error con el sistema de archivos.',
          });
        }
        return res.status(400).send({
          msg:'No es un formato de imagen válido.',
        });
      });
    }else if(img.size > 500*1024){
      fs.unlink(img.path, (error)=>{
        if(error){
          return res.status(500).send({
            msg:'Error con el sistema de archivos.',
          });
        }
          
        return res.status(400).send({
          msg:'La imagen es demasiado grande: máximo 500kb.',
        });
      });
    }else{

      var file_name = img.path.split('\\')[2];
    
      User.findByIdAndUpdate(req.params.id,{image:file_name}, (error,user)=>{
        if(error || !user){
          return res.status(500).send({
            msg:'Ocurrió un al actualizar la cuenta de usuario.',
            error
          });
        }

        if(user.image != null){
          fs.unlink('uploads\\users\\'+user.image, (error)=>{
            if(error){
              return res.status(500).send({
                msg:'Error con el sistema de archivos.',
              });
            }
            return res.status(200).send({
              msg:'Imagen actualizada.',
              file_name
            });
          });
        }else{
          return res.status(200).send({
            msg:'Imagen actualizada.',
            file_name
          });
        }
        
      });

    }

    
  },

  getPicture:(req, res)=>{
    var img_path = './uploads/users/'+req.params.img;

    //verificar si el archivo existe
    fs.exists(img_path,(exists)=>{
      if(exists){
        return res.sendFile(path.resolve(img_path));
      }else{
        return res.status(404).send({
          msg:'La imagen solicitada no existe.'
        });
      }
    });
    
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

  
  },

  logout: (req,res) => {
    //Cerrar sesión
  }

};

module.exports = controller;