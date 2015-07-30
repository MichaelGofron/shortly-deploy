// NOTE: this file is not needed when using MongoDB
var mongoose = require('mongoose');
var crypto = require('crypto');
var db = require('../config');
// var Link = require('../models/link');

var Links = mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits:  { type: Number, default: 0 },
  updated: { type: Date, default: Date.now}
});

Links.pre('save', function(next){
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0,5);
  next();
});

var Link = db.model('Link', Links);

// Links.model = Link;
module.exports = Link;
