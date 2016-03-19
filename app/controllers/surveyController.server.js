'use strict';

var Survey = require('../models/surveys.js');
var Users = require('../models/users.js');

function surveyHandler(){
    
    this.getSurveys=function(req,res){
        Survey.find({},{_id:false,__v:false}).exec(function(err,result){
           if(err){throw err;}
           res.json(result);
        });
    };
    
    this.getUsers=function(req,res){
        Users.find({},{_id:false,__v:false}).exec(function(err,result){
            if(err){throw err}
            var users=[];
            for(var i=0;i<result.length;i++){
                users.push(result[i].github.username);
            }
            res.json(users);
        });
    };
    
    this.addSurvey = function(req,res){
        var newSurvey = new Survey(req.body);
        console.log(newSurvey);
        newSurvey.save(function(err,obj){
            if(err){throw err}
        });
        Users.update({'github.username':(req.user.github.username).toString()},{$inc:{numSurveys:1}},function(data){
            console.log(req.user.github.username);
        });
    };
    
    this.removeSurvey = function(usrnm,srvyId){
        Survey.remove({usernamed:usrnm,surveyId:srvyId},function(err){
            if(err){throw err}
            console.log('Deleted survey number '+srvyId);
        });
    };
    
    this.vote = function(req,res){
        console.log(req.user.github.username);
        
        Survey.update({'username':req.params.ownerid,'surveyId':req.params.surveyId},{$set:{'options':req.body.survUpdate.options}},function(err,num){
            if(err){throw err}
            console.log(num);
        });
        Survey.update({'username':req.params.ownerid,'surveyId':req.params.surveyId},{$push:{'voted':{'username':req.user.github.username,'votedOption':req.body.optUpdate}}},function(err,num){
            if(err){throw err}
            console.log(num);
        });
    };
    
    this.addNewOption = function(req,res){
        console.log(req.user.github.username);
        
        Survey.update({'username':req.params.ownerid,'surveyId':req.params.surveyId},{$set:{'options':req.body.survUpdate.options}},function(err,num){
            if(err){throw err}
            console.log(num);
        });
    };
}

module.exports=surveyHandler;