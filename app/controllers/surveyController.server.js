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
            res.json(result);
        });
    };
    
    this.addSurvey = function(req,res){
        var newSurvey = new Survey(req.body);
        console.log(newSurvey);
        newSurvey.save(function(err,obj){
            if(err){throw err}
        });
        Users.update({'github.id':(req.user.github.id).toString()},{$inc:{numSurveys:1}},function(data){
            console.log(req.user.github.id);
        });
    };
    
    this.removeSurvey = function(usrId,srvyId){
        Survey.remove({userId:usrId,surveyId:srvyId},function(err){
            if(err){throw err}
            console.log('Deleted survey number '+srvyId);
        });
    };
    
    this.vote = function(req,res){
        console.log(req.user.github.id);
        console.log(req.params.surveyId);
        console.log(req.body.survUpdate.options);
        Survey.update({'userId':req.user.github.id,'surveyId':req.params.surveyId},{$set:{'options':req.body.survUpdate.options}},function(err,num){
            if(err){throw err}
            console.log(num);
        });
        Survey.update({'userId':req.user.github.id,'surveyId':req.params.surveyId},{$push:{'voted':{'userId':req.user.github.id,'votedOption':req.body.optUpdate}}},function(err,num){
            if(err){throw err}
            console.log(num);
        });
    };
}

module.exports=surveyHandler;