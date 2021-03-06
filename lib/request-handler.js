var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};


exports.fetchLinks = function(req, res) {
  // get Mongo to fetch all links -- collection
  // Links.reset().fetch().then(function(links) {
  //   res.send(200, links.models);
  // })
  Link.find().then(function(links){
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  // update with Mongo save methods -- new Model (Link)
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ url: uri }).then(function(found){
    if(found){
      res.send(200, found);
    } else {
      util.getUrlTitle(uri, function (err, title){
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
            url: uri,
            title: title,
            base_url: req.headers.origin
        });

        link.save().then(function(newLink) {
          res.send(200, newLink);
        });
      });
    }
  })

  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.send(200, found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.send(404);
  //       }

  //       var link = new Link({
  //         url: uri,
  //         title: title,
  //         base_url: req.headers.origin
  //       });

  //       link.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.send(200, newLink);
  //       });
  //     });
  //   }
  // });
};

exports.loginUser = function(req, res) {
  // update with Mongo lookup methods -- lookup User collection
  var username = req.body.username;
  var password = req.body.password;


  User.findOne({'username': username}).then(function(user){
    if (!user){
      res.redirect('/login');
    }else{
      user.comparePassword(password,function(match){
        if (match){
          util.createSession(req,res,user);
        }else{
          res.redirect('/login');
        }
      });
    }
  });
  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       })
  //     }
  // });
};

exports.signupUser = function(req, res) {
  // update with Mongo save methods -- new User Model
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({'username': username}).then(function(user){
    if(!user){
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save().then(function(savedUser){
        util.createSession(req,res,savedUser);
      })
    }else{
      console.log("Account already exists");
      res.redirect('/signup');
    }
  });
  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //         .then(function(newUser) {
  //           util.createSession(req, res, newUser);
  //           Users.add(newUser);
  //         });
  //     } else {
  //       console.log('Account already exists');
  //       res.redirect('/signup');
  //     }
  //   })
};

exports.navToLink = function(req, res) {
  // update with Mongo lookup methods -- lookup on collection
  
  Link.findOne({ code: req.params[0] }).then(function(link){
    console.log("the code: ",req.params[0])
    console.log("the req: ", req.params);
    if(!link){
      console.log("couldn't find a link");
      res.redirect('/');
    } else {
      link.visits = link.visits+1;
      link.save().then(function(){
        console.log("Redirecting to: "+link.url);
        return res.redirect(link.url);
      });
    }
  });

  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};