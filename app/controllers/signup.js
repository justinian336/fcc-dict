(function(){
    var app = angular.module('signup',[]);
    app.controller('form-valid',['$scope',function($scope){
        $scope.usernameField = '';
        $scope.passwordField = '';
        $scope.verifPasswordField = '';
        
        $scope.go = function(username,password,verifPassword){
            if(username.length>=6&&password.length>=6&&password==verifPassword){
                return false;
            }
            else {
                return true;
            }
        };
        
        $scope.submit=$scope.go($scope.usernameField,$scope.passwordField,$scope.verifPasswordField);
    }]);
    
    
})();