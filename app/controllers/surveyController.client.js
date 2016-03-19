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
        var messages=["Create a New Dictionary Entry","Your Surveys"];
        $scope.message=messages[0];
        $scope.languages=[
    {name:"Español",abbrev:"es"},
    {name:"Português",abbrev:"pt"},
    {name:"中文",abbrev:"zh"},
    {name:"Français",abbrev:"fr"},
    {name:"Italiano",abbrev:"it"},
    {name:"Deutsch",abbrev:"de"},
    {name:"日本語",abbrev:"ja"},
    {name:"한국어",abbrev:"ko"},
    {name:"Pусский",abbrev:"ru"},
    {name:"العربية",abbrev:"ar"},
    {name:"Svenska",abbrev:"sv"},
    {name:"Nederlands",abbrev:"nl"},
    {name:"বাংলা",abbrev:"bn"},
    {name:"TiếngViệt",abbrev:"vi"},
    {name:"Polski",abbrev:"pl"},
    {name:"Yкраїнська",abbrev:"uk"},
    {name:"Català",abbrev:"ca"},
    {name:"فارسی",abbrev:"fa"},
    {name:"Norskbokmål",abbrev:"nb"},
    {name:"Suomi",abbrev:"fi"},
    {name:"BahasaIndonesia",abbrev:"id"},
    {name:"Română",abbrev:"ro"},
    {name:"čeština",abbrev:"cs"},
    {name:"Magyar",abbrev:"hu"},
    {name:"Cрпски/srpski",abbrev:"sr"},
    {name:"BahasaMelayu",abbrev:"ms"},
    {name:"Türkçe",abbrev:"tr"},
    {name:"Esperanto",abbrev:"eo"},
    {name:"қазақша",abbrev:"kk"},
    {name:"Euskara",abbrev:"eu"},
    {name:"Dansk",abbrev:"da"},
    {name:"Slovenčina",abbrev:"sk"},
    {name:"български",abbrev:"bg"},
    {name:"ខ្មែរ, ខេមរភាសា, ភាសាខ្មែរ",abbrev:"km"}
    ];
        $scope.currentLang;
        
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
            $scope.srvyName = "";
            $scope.options = [{name:'',count:0}];
        };
        
        initialize();
        
        
        $scope.addOption = function(){
            opId++;
            $scope.options.push({name:"",count:0});
        };
        
        $scope.deleteOption = function(){
            if ($scope.options.length==1){}
            else{
                $scope.options.splice($scope.options.length-1,1);
                opId--;
            }
        };
        
        $scope.addSurvey = function(){
            var filteredOptions=[];
            for(var i=0;i<$scope.options.length;i++){
                if($scope.options[i].name!=""){
                    filteredOptions.push($scope.options[i]);
                }
            }
            console.log(filteredOptions);
            
            if($scope.srvyName==""|$scope.currentLang=="none"|filteredOptions.length==0){
                alert("Please fill all the fields");
            }
            else{
                var newSurvey = {
                    surveyId:$scope.userNumSurveys+1,
                    username:$scope.username,
                    name:$scope.srvyName,
                    language:$scope.currentLang,
                    options:filteredOptions,
                    voted:[]
                };
                $http.post('/api/surveys',newSurvey);
                $scope.makeVisible(2);
            }
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
        $scope.newOptions = [];
        $scope.currentSurvey={};
        $scope.chartObject = {};
        $scope.chartObject.type="PieChart";
        $scope.voted = true;
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
        });
        
        $scope.voteScreen = function(surveyId){

            $http.get('/api/'+$routeParams.username+'/'+$routeParams.pollId).then(function(resp){
                
                $scope.currentSurvey=resp.data[0];
                console.log(resp.data[0]);
                
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
        
        $scope.askNewOption = function(){
          $scope.newOptions.push({name:"",count:0});
        };
        
        $scope.addNewOption = function(option, index){
            if(option.name==""){
                alert("Write your new translation before adding");
            }
            else{
                $scope.currentSurvey.options.push(option);
                $scope.newOptions.splice(index,1);
                console.log($scope.currentSurvey.options);
                $http.post('/add/'+$scope.currentSurvey.username+'/'+$scope.currentSurvey.surveyId,{'survUpdate':$scope.currentSurvey}).
                then($scope.voteScreen());
            }
        };
        
        $scope.voteScreen();
        
    }]);
    
})();