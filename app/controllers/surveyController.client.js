'use strict';

(function(db){
    var app = angular.module("srvyApp",[]);
    
    app.controller("survey",["$scope", "$http",function($scope,$http){
        
        var opId;
        $scope.userId=1;
        $scope.userNumSurveys=1;
        $scope.currentSurvey ={};
        
        $http.get('/api/current-user').then(function(resp){
            $scope.userId = resp.data.userId;
            $scope.userNumSurveys = resp.data.numSurveys;
            console.log($scope.userId,$scope.userNumSurveys);
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
            $http.get('/api/'+$scope.userId+'/'+surveyId).then(function(resp){
                $scope.currentSurvey=resp.data[0];
                console.log($scope.currentSurvey);
            },function(err){
                if (err){throw err}
            }
            );
        };
        
    }]);
    
})();