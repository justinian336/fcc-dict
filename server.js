'use strict';

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var routes = require('./app/routes/index.js');
var bodyParser = require('body-parser');
require('dotenv').load();
require('./app/config/passport')(passport);
var app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
  secret:'secretSurBay',
  resave:false,
  saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(process.env.MONGO_URI);

routes(app,passport);
app.use('/public',express.static(process.cwd()+'/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/bower_components',express.static(process.cwd()+'/bower_components'));

app.listen(8080, function(){
  console.log('Listening!');
});