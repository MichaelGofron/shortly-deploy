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

Links.post('init', function(doc){
  var shasum = crypto.createHash('sha1');
  shasum.update(doc.url);
  doc.code = shasum.digest('hex').slice(0,5);
});

var Link = db.model('Link', Links);

// Links.model = Link;
module.exports = Link;
// var db = require('../config');
// var Links = require('../collections/links');
// var crypto = require('crypto');

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

// module.exports = Link;
