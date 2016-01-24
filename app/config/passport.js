'use strict';

var GitHubStrategy = require('passport-github').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function(passport){
    passport.serializeUser(function(user,done){
        done(null,user.id);
    });
    
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user);
        });
    });
    
    passport.use(new GitHubStrategy({
        clientID: configAuth.githubAuth.clientID,
        clientSecret: configAuth.githubAuth.clientSecret,
        callbackURL: configAuth.githubAuth.callbackURL
    },function(token,refreshToken,profile,done){
        process.nextTick(function(){
            User.findOne({'github.id':profile.id},function(err,user){
                if (err){
                    return done(err);
                }
                if (user){
                    return done(null,user);
                }
                else {
                    var newUser = new User();
                    
                    newUser.github.id=profile.id;
                    newUser.github.username=profile.username;
                    newUser.github.displayName=profile.displayName;
                    newUser.github.publicRepos=profile._json.public_repos;
                    newUser.numSurveys=0;
                    
                    newUser.save(function(err){
                        if(err){
                            throw err;
                        }
                        return done(null,newUser);
                    });
                }
                
            });
        });
    }));
    
    passport.use(new FacebookStrategy({
        
        clientID:configAuth.facebookAuth.clientID,
        clientSecret:configAuth.facebookAuth.clientSecret,
        callbackURL:configAuth.facebookAuth.callbackURL,
        profileFields:['id','emails','name']
        
    },function(token, refreshToken, profile, done){
        
        process.nextTick(function(){
           User.findOne({'facebook.id':profile.id},function(err,user){
                if (err){
                    return done(err);
                }
                if (user){
                    return done(null,user);
                }
                else {
                    var newUser = new User();
                    
                    newUser.facebook.id=profile.id;
                    newUser.facebook.token=token;
                    newUser.facebook.name=profile.name.givenName+' '+profile.name.familyName;
                    newUser.facebook.email=profile.emails[0].value;
                    newUser.numSurveys=0;
                    
                    newUser.save(function(err){
                        if(err){
                            throw err;
                        }
                        return done(null,newUser);
                    });
                }
                
            });
            
        });
        
    }));
    
    passport.use(new TwitterStrategy({
        consumerKey:configAuth.twitterAuth.clientID,
        consumerSecret:configAuth.twitterAuth.clientSecret,
        callbackURL:configAuth.twitterAuth.callbackURL
    },
    function(token,tokenSecret,profile,done){
        
        process.nextTick(function(){
           User.findOne({'twitter.id':profile.id},function(err,user){
                if (err){
                    return done(err);
                }
                if (user){
                    return done(null,user);
                }
                else {
                    var newUser = new User();
                    
                    newUser.twitter.id=profile.id;
                    newUser.twitter.token=token;
                    newUser.twitter.username=profile.username;
                    newUser.twitter.displayName=profile.displayName;
                    newUser.numSurveys=0;
                    
                    newUser.save(function(err){
                        if(err){
                            throw err;
                        }
                        return done(null,newUser);
                    });
                }
                
            });
            
        });
        
    }
    
    ));
    
    passport.use('local-signup',new LocalStrategy({
        usernameField:'username',
        passwordField:'password',
        passReqToCallback:true
    },function(req,username,password,done){
        
        process.nextTick(function(){
           User.findOne({'local.username':username},function(err,user){
            if(err){return done(err);}
            if(user){return done(null,false);}
            else {
                    var newUser = new User();

                    newUser.local.username=username;
                    newUser.local.password=newUser.generateHash(password);
                    newUser.numSurveys=0;
                    
                    newUser.save(function(err){
                        if(err){
                            throw(err);
                        }
                        return(done(null,newUser));
                    });
                }
            }); 
        });
    }));
    
    passport.use('local-login',new LocalStrategy({
        usernameField:'username',
        passwordField:'password',
        passReqToCallback:true
    },function(req,username,password,done){
        
        process.nextTick(function(){
            User.findOne({'local.username':username},function(err,user){
                if(err){return done(err);}
                if(!user){return done(null,false);}
                if(!user.validPassword(password)){return done(null,false);}
                return done(null,user);
            });
        });
        
    })
        
        
        
    );
    
    
};