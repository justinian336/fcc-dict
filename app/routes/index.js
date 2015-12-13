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
        res.sendFile(process.cwd()+'/public/usrhome.html');
    });
    
    app.route('/api/surveys').
    get(isLoggedIn,surveyHandler.getSurveys).
    post(isLoggedIn,function(req,res){
        surveyHandler.addSurvey(req,res);
    });
    
    app.route('/api/users').get(isLoggedIn,surveyHandler.getUsers);
    
    app.route('/api/current-user').get(isLoggedIn,function(req,res){
        res.json({userId:req.user.github.id,username:req.user.github.username,numSurveys:req.user.numSurveys});
    });

    app.route('/api/:id/surveys').get(isLoggedIn,function(req,res){
        Survey.find({userId:req.user.github.id}).exec(function(err,response){
           if(err){throw err;}
           res.json(response);
        });
    });
    
    app.route('/api/:id/:surveyId').
    get(isLoggedIn,function(req,res){
        Survey.find({userId:req.params.id,surveyId:req.params.surveyId}).exec(function(err,response){
           if(err){throw err;}
           res.json(response);
        });
    }).
    delete(isLoggedIn,function(req,res){
        surveyHandler.removeSurvey(req.params.id,req.params.surveyId);
    });
    
    app.route('/vote/:surveyId').post(isLoggedIn,function(req,res){
        surveyHandler.vote(req,res);
    });
    
    app.route('/poll/:userId/:surveyId').post(isLoggedIn,function(req,res){
        res.sendFile(process.cwd()+'/public/poll.html');
    });

    app.route('/signup').get(function(req,res){
        res.sendFile(process.cwd()+'/public/signup.html');
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
};