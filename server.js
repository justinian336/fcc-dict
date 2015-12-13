'use strict';

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var routes = require('./app/routes/index.js');
require('dotenv').load();
require('./app/config/passport')(passport);
var app = express();

app.use(session({
  secret:'secretSurBay',
  resave:false,
  saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect('mongodb://localhost:27017/surbay');

routes(app,passport);
app.use('/public',express.static(process.cwd()+'/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/bower_components',express.static(process.cwd()+'/bower_components'));

app.listen(8080, function(){
  console.log('Listening!');
});