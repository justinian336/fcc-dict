'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var User = new Schema({
    github:{
        id:String,
        displayName:String,
        username:String,
        publicRepos: Number
    },
    facebook:{
        id:String,
        token:String,
        email:String,
        name:String
    },
    twitter:{
      id:String,
      token:String,
      username:String,
      displayName:String
    },
    local:{
        email:String,
        password:String
    },
    numSurveys:Number
});

User.methods.generateHash=function(password){
   return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null); 
};

User.methods.validPassword = function(password){
   return bcrypt.compareSync(password,this.local.password,null); 
};

module.exports = mongoose.model('User',User);