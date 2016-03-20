'use strict';
var EntryHandler = require(process.cwd()+'/app/controllers/entriesController.server.js');
var bodyParser = require('body-parser');
var Entry = require('../models/entries.js');
var Users = require('../models/users.js');


module.exports = function(app,passport){
    app.use(bodyParser.json());
    
    var entryHandler = new EntryHandler();
    
    function isLoggedIn(req,res,next){
        if (req.isAuthenticated()){
            return next();
        }
        else{
            res.redirect('/login');
        }
    }
    
    app.route('/login').get(function(req,res){
        res.sendFile(process.cwd()+'/public/login.html');
    });
    
    app.route('/').get(isLoggedIn,function(req,res){
        res.sendFile(process.cwd()+'/public/index.html');
    });
    
    app.route('/entry').get(isLoggedIn,function(req,res){
        res.sendFile(process.cwd()+'/public/entryView.html');
    });
    
    app.route('/dictionary').get(isLoggedIn,function(req,res){
        res.sendFile(process.cwd()+'/public/dictionary.html');
    });
    
    app.route('/api/dictionary').
    get(isLoggedIn,entryHandler.getEntries).
    post(isLoggedIn,function(req,res){
        entryHandler.addEntry(req,res);
    });
    
    app.route('/api/users').get(isLoggedIn,entryHandler.getUsers);
    
    app.route('/api/current-user').get(isLoggedIn,function(req,res){
        console.log(req.user);
        res.json({username:req.user.github.username,numEntries:req.user.numEntries});
    });

    app.route('/api/:id/entries').get(isLoggedIn,function(req,res){
        Entry.find({username:req.user.github.username}).exec(function(err,response){
           if(err){throw err;}
           res.json(response);
        });
    });
    
    app.route('/api/:id/:entryId').
    get(isLoggedIn,function(req,res){
        Entry.find({username:req.params.id,entryId:req.params.entryId}).exec(function(err,response){
           if(err){throw err;}
           res.json(response);
        });
    }).
    delete(isLoggedIn,function(req,res){
        entryHandler.removeEntry(req.params.id,req.params.entryId);
    });
    
    app.route('/vote/:ownerid/:entryId').post(isLoggedIn,function(req,res){
        entryHandler.vote(req,res);
    });
    
    app.route('/add/:ownerid/:entryId').post(isLoggedIn,function(req,res){
        entryHandler.addNewOption(req,res);
    });
    
    app.route('/logout').get(function(req,res){
        req.logout();
        res.redirect('/login');
    });
    
    app.route('/auth/github').get(passport.authenticate('github'));
    app.route('/auth/github/callback').get(passport.authenticate('github',{
        successRedirect:'/',
        failureRedirect:'/login'
    }));
    
    app.route('/auth/facebook').get(passport.authenticate('facebook',{scope:'email'}));
    app.route('/auth/facebook/callback').get(passport.authenticate('facebook',{
        successRedirect:'/',
        failureRedirect:'/login'
    }));
    
    app.route('/auth/twitter').get(passport.authenticate('twitter'));
    app.route('/auth/twitter/callback').get(passport.authenticate('twitter',{
        successRedirect:'/',
        failureRedirect:'/login'
    }));
    
    app.route('/auth/local-signup').post(passport.authenticate('local-signup',{
        successRedirect:'/',
        failureRedirect:'/signup'
    }));
    
    app.route('/auth/local-login').post(passport.authenticate('local-login',{
        successRedirect:'/',
        failureRedirect:'/login'
    }));
};