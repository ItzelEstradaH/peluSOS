'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
  type: {type: Number, required:true},
  rfc: {type: String, default:null},
  name: {type: String, required:true},
  phone: {type: String, unique:true, required:true},
  pass: {type: String, required:true},
  image: {type: String, default:null},
});

module.exports = mongoose.model('User', UserSchema);