var Bookshelf = require('bookshelf');
var path = require('path');
var mongoose = require('mongoose');
var db = process.env.NODE_ENV === 'production' ? mongoose.createConnection('mongodb://shortlyAdnanDB:pzqQzZg0h34bBSRCHfmnHx399yrjR0nv2tkZJraT9A4-@ds036698.mongolab.com:36698/shortlyAdnanDB') : mongoose.createConnection('localhost', 'mike');


db.on('error', console.error.bind(console, 'connection error: '));

module.exports = db;
