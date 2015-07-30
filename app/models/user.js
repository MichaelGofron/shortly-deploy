// NOTE: this file is not needed when using MongoDB
var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var Users = mongoose.Schema({
  username: String,
  password: String,
  updated: {type: Date, default: Date.now}
});
// var User = require('../models/user');
Users.methods.comparePassword = function(attemptedPassword, callback){
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
}

Users.methods.hashPassword = function(){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
    });
}

Users.pre('save', function(next){
  this.hashPassword().then(next);
});

var User = db.model('User', Users);

module.exports = User;

