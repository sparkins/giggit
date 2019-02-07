var express = require('express');
var app = express();

var path = require('path');

var mysql = require('mysql');

app.use(express.static("public"));

module.exports = function (app) {

  // app.get('/', function (req, res) {
  //   res.render(path.join(__dirname, '/../public/home.html'))
  // });

  app.get('/home', function (req, res) {
    res.render(path.join(__dirname, '/../views/home.handlebars'))
  });

  app.get('/business-home', function(req, res){
    res.render(path.join(__dirname, '/../views/businesshome.handlebars'));
  })

  app.get('/user-home', function(req, res){
    res.render(path.join(__dirname, '/../views/userhome.handlebars'));
    if (req.session.user_id && req.cookies.user_sid) {
      res.render(path.join(__dirname, '/../views/home.handlebars'))
    }
    else {
      res.render("home")
    }
  });

  app.get('/business-home', function (req, res) {
    if (req.session.user_id && req.cookies.user_sid) {
      res.render(path.join(__dirname, '/../views/businesshome.handlebars'));
    }
    else {
      res.render("home")
    }
  })

  app.get('/user-home', function (req, res) {
    if (req.session.user_id && req.cookies.user_sid) {
      res.render(path.join(__dirname, '/../views/userhome.handlebars'));
    }
    else {
      res.render("home")
    }
  })


// Creating routes to view each page so I can work on them -Alyssa

// app.get('/userhome', function(req, res){
//   res.render(path.join(__dirname, '/../views/userhome.handlebars'));
// })

// app.get('/user-edit', function(req, res){
//   res.render(path.join(__dirname, '/../views/user-edit.handlebars'+{connected:req.session.username}));
// })

// app.get('/user-search', function (req, res) {
//   res.render('user-search.handlebars', {connected: req.session.username, user: results[0]});
// })
















}

