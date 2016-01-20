'use strict';

(function(db){
    var app = angular.module("explore",[]);
    
    app.controller("view-polls",["$scope", "$http", function($scope,$http){
        
        $scope.polls=[];
        
        $http.get('/api/surveys').then(function(resp){
            $scope.polls = resp.data;
        });
        
        
        
        
    }]);
    
})();