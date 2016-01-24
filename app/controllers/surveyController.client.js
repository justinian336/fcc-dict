'use strict';

(function(db){
    var app = angular.module("ikou",["googlechart","ngRoute"]);
    
    app.config(['$routeProvider',function($routeProvider){
        $routeProvider.when('/:username/:pollId',{
            templateUrl: '/public/poll.html',
            controller:'votingCtrl'
        });
    }]);
    
    
    app.controller("poll",["$scope", "$http", function($scope,$http){
        
        var opId;
        $scope.username='';
        $scope.userNumSurveys=1;
        $scope.currentSurvey ={};
        $scope.votersList = [];
        $scope.options = [];
        var messages=["Create a New Survey","Your Surveys"];
        $scope.message=messages[0];
        
        $scope.changeMessage=function(i){
           $scope.message=messages[i]; 
        };
        
        $http.get('/api/current-user').then(function(resp){
            $scope.username = resp.data.username;
            $scope.userNumSurveys = resp.data.numSurveys;
        });
        
        $scope.visible=1;
        
        $scope.makeVisible = function(panel){
            $scope.visible = panel;
        };
        
        var initialize = function(){
            opId = 2;
            $scope.srvyName = "New Poll";
            $scope.options = [{name:'Option 1',count:0},{name:'Option 2',count:0}];
        };
        
        initialize();
        
        
        $scope.addOption = function(){
            opId++;
            $scope.options.push({name:'Option '+opId,count:0});
        };
        
        $scope.deleteOption = function(){
            if ($scope.options.length==2){}
            else{
                $scope.options.splice($scope.options.length-1,1);
                opId--;
            }
        };
        
        $scope.addSurvey = function(){
            var newSurvey = {
                surveyId:$scope.userNumSurveys+1,
                username:$scope.username,
                name:$scope.srvyName,
                options:$scope.options,
                voted:[]
            };
            $http.post('/api/surveys',newSurvey);
        };
        
        $scope.restartSurvey = function(){
            initialize();
        };
        
        $scope.reqSurveys = function(){
            $http.get('/api/'+$scope.username+'/surveys').then(function(resp){
                $scope.surveys = resp.data;
            },function(err){
                if (err){throw err}
            });
        };
        
        $scope.removeSurvey = function(surveyId){
            $http.delete('/api/'+$scope.username+'/'+surveyId);
            $scope.reqSurveys();
        };
        
    }]);
    
    app.controller("votingCtrl",['$scope','$http','$routeParams',function($scope,$http,$routeParams){
        
        $scope.votersList=[];
        $scope.options=[];
        $scope.currentSurvey={};
        $scope.chartObject = {};
        $scope.chartObject.type="PieChart";
        $scope.voted = false;
        $scope.selectedOption={value:0};
        $scope.username='';
        $scope.drawChart = function(){
            $scope.chartObject.data={"cols":[
                    {id:"o",label:"Option",type:"string"},
                    {id:"v",label:"Votes",type:"number"}
                ],"rows":$scope.options};
                
                $scope.chartObject.options = {
                    'titlePosition':'none',
                    'is3D':true
                };
        };
        
        $http.get('/api/current-user').then(function(resp){
            $scope.username = resp.data.username;
            console.log($scope.username);
        });
        
        $scope.voteScreen = function(surveyId){

            $http.get('/api/'+$routeParams.username+'/'+$routeParams.pollId).then(function(resp){
                $scope.currentSurvey=resp.data[0];
                
                $scope.votersList = $scope.currentSurvey.voted.reduce(function(previous,current){
                    previous.push(current.username);
                    return previous;
                },[]);
                
                $scope.options = $scope.currentSurvey.options.reduce(function(previous,current){
                    previous.push({c:[{v:current.name},{v:current.count}]});
                    return previous;
                },[]);
                
                $scope.voted=$scope.votersList.indexOf($scope.username)!=-1;
                
                $scope.drawChart();
                
            },function(err){
                if (err){throw err}
            });
            
        };
        
        $scope.vote = function(optionVal){
            $scope.currentSurvey.options[optionVal].count++;
            console.log($scope.currentSurvey);
            $http.post('/vote/'+$scope.currentSurvey.username+'/'+$scope.currentSurvey.surveyId,{'survUpdate':$scope.currentSurvey,'optUpdate':$scope.currentSurvey.options[optionVal].name}).
            then($scope.voteScreen());
        };
        
        $scope.voteScreen();
        
    }]);
    
})();