'use strict';

(function(db){
    var app = angular.module("srvyApp",["googlechart",'ngRoute']);
    
    app.controller("survey",["$scope", "$http", function($scope,$http){
        
        var opId;
        $scope.userId=1;
        $scope.userNumSurveys=1;
        $scope.currentSurvey ={};
        $scope.selectedOption={value:0};
        $scope.votersList = [];
        $scope.voted = false;
        $scope.options = [];
        $scope.chartObject = {};
        $scope.chartObject.type="PieChart";
        
        $http.get('/api/current-user').then(function(resp){
            $scope.userId = resp.data.userId;
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
                userId:$scope.userId,
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
            $http.get('/api/'+$scope.userId+'/surveys').then(function(resp){
                $scope.surveys = resp.data;
            },function(err){
                if (err){throw err}
            });
        };
        
        $scope.removeSurvey = function(surveyId){
            $http.delete('/api/'+$scope.userId+'/'+surveyId);
            $scope.reqSurveys();
        };
        
        $scope.voteScreen = function(surveyId){
            $scope.votersList=[];
            $scope.options=[];
            $scope.currentSurvey={};

            $http.get('/api/'+$scope.userId+'/'+surveyId).then(function(resp){
                $scope.currentSurvey=resp.data[0];
                
                $scope.votersList = $scope.currentSurvey.voted.reduce(function(previous,current){
                    previous.push(current.userId);
                    return previous;
                },[]);
                
                $scope.options = $scope.currentSurvey.options.reduce(function(previous,current){
                    previous.push({c:[{v:current.name},{v:current.count}]});
                    return previous;
                },[]);
                
                $scope.voted=$scope.votersList.indexOf($scope.userId)!=-1;
                
                $scope.chartObject.data={"cols":[
                    {id:"o",label:"Option",type:"string"},
                    {id:"v",label:"Votes",type:"number"}
                ],"rows":$scope.options};
                
                $scope.chartObject.options = {
                    'titlePosition':'none',
                    'is3D':true
                };
                
            },function(err){
                if (err){throw err}
            });
            
        };
        
        $scope.vote = function(optionVal){
            $scope.currentSurvey.options[optionVal].count++;
            $http.post('/vote/'+$scope.currentSurvey.surveyId,{'survUpdate':$scope.currentSurvey,'optUpdate':$scope.currentSurvey.options[optionVal].name});
        };
        
    }]);
    
})();