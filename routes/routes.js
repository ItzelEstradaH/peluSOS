'use strict '

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();
//miltiparty para subida de archivos
var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir:'./uploads/users'});

//Rutas Usuario
router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

router.put('/user/:id', UserController.update);
router.delete('/user/:id', UserController.delete);
router.post('/user/picture/:id',md_upload, UserController.setPicture);
router.get('/user/picture/:img', UserController.getPicture);

//Rutas para reportes



module.exports = router;
