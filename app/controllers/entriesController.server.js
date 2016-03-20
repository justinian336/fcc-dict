'use strict';

var Entry = require('../models/entries.js');
var Users = require('../models/users.js');

function entryHandler(){
    
    this.getEntries=function(req,res){
        Entry.find({},{_id:false,__v:false}).exec(function(err,result){
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
    
    this.addEntry = function(req,res){
        var newEntry = new Entry(req.body);
        console.log(newEntry);
        newEntry.save(function(err,obj){
            if(err){throw err}
        });
        Users.update({'github.username':(req.user.github.username).toString()},{$inc:{numEntries:1}},function(data){
            console.log(req.user.github.username);
        });
    };
    
    this.removeEntry = function(usrnm,entryId){
        Entry.remove({usernamed:usrnm,entryId:entryId},function(err){
            if(err){throw err}
            console.log('Deleted entry number '+entryId);
        });
    };
    
    this.vote = function(req,res){
        console.log(req.user.github.username);
        
        Entry.update({'username':req.params.ownerid,'entryId':req.params.entryId},{$set:{'options':req.body.entryUpdate.options}},function(err,num){
            if(err){throw err}
            console.log(num);
        });
        Entry.update({'username':req.params.ownerid,'entryId':req.params.entryId},{$push:{'voted':{'username':req.user.github.username,'votedOption':req.body.optUpdate}}},function(err,num){
            if(err){throw err}
            console.log(num);
        });
    };
    
    this.addNewOption = function(req,res){
        console.log(req.user.github.username);
        
        Entry.update({'username':req.params.ownerid,'entryId':req.params.entryId},{$set:{'options':req.body.entryUpdate.options}},function(err,num){
            if(err){throw err}
            console.log(num);
        });
    };
}

module.exports=entryHandler;