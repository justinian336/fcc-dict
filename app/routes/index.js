'use strict';
var SurveyHandler = require(process.cwd()+'/app/controllers/surveyController.server.js');
var bodyParser = require('body-parser');
var Survey = require('../models/surveys.js');
var Users = require('../models/users.js');


module.exports = function(app,passport){
    app.use(bodyParser.json());
    
    var surveyHandler = new SurveyHandler();
    
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
    
    app.route('/poll').get(isLoggedIn,function(req,res){
        res.sendFile(process.cwd()+'/public/pollView.html');
    });
    
    app.route('/poll/404').get(isLoggedIn,function(req,res){
       res.sendFile(process.cwd()+'/public/404.html'); 
    });
    
    app.route('/api/surveys').
    get(isLoggedIn,surveyHandler.getSurveys).
    post(isLoggedIn,function(req,res){
        surveyHandler.addSurvey(req,res);
    });
    
    app.route('/api/users').get(isLoggedIn,surveyHandler.getUsers);
    
    app.route('/api/current-user').get(isLoggedIn,function(req,res){
        console.log(req.user);
        res.json({username:req.user.local.username,numSurveys:req.user.numSurveys});
    });

    app.route('/api/:id/surveys').get(isLoggedIn,function(req,res){
        Survey.find({username:req.user.local.username}).exec(function(err,response){
           if(err){throw err;}
           res.json(response);
        });
    });
    
    app.route('/api/:id/:surveyId').
    get(isLoggedIn,function(req,res){
        Survey.find({username:req.params.id,surveyId:req.params.surveyId}).exec(function(err,response){
           if(err){throw err;}
           res.json(response);
        });
    }).
    delete(isLoggedIn,function(req,res){
        surveyHandler.removeSurvey(req.params.id,req.params.surveyId);
    });
    
    app.route('/vote/:ownerid/:surveyId').post(isLoggedIn,function(req,res){
        surveyHandler.vote(req,res);
    });

    app.route('/signup').get(function(req,res){
        res.sendFile(process.cwd()+'/public/signup.html');
    });
    
    app.route('/explore').get(function(req,res){
        res.sendFile(process.cwd()+'/public/explore.html');
    });
    
    app.route('/account').get(isLoggedIn,function(req,res){
        res.sendFile(process.cwd()+'/public/account.html');
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