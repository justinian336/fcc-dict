'use strict';

(function(db){
    var app = angular.module("fcc-dict",["googlechart","ngRoute"]);
    
    app.config(['$routeProvider',function($routeProvider){
        $routeProvider.when('/:username/:entryId',{
            templateUrl: '/public/entry.html',
            controller:'votingCtrl'
        });
    }]);
    
    
    app.controller("entry",["$scope", "$http", function($scope,$http){
        
        var opId;
        $scope.username='';
        $scope.currentEntry ={};
        $scope.votersList = [];
        $scope.options = [];
        var messages=["Create a New Dictionary Entry","Your Entries"];
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
        
        $scope.getUser = function(){
            $http.get('/api/current-user').then(function(resp){
                $scope.username = resp.data.username;
                $scope.userNumEntries = resp.data.numEntries;
                console.log(resp.data);
            });
        };
        
        $scope.getUser();
        
        $scope.visible=1;
        
        $scope.makeVisible = function(panel){
            $scope.visible = panel;
        };
        
        var initialize = function(){
            opId = 2;
            $scope.entryName = "";
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
        
        $scope.addEntry = function(){
            var filteredOptions=[];
            for(var i=0;i<$scope.options.length;i++){
                if($scope.options[i].name!=""){
                    filteredOptions.push($scope.options[i]);
                }
            }
            
            if($scope.entryName==""|$scope.currentLang=="none"|filteredOptions.length==0){
                alert("Please fill all the fields");
            }
            else{
                console.log($scope.userNumEntries);
                var newEntry = {
                    entryId:$scope.userNumEntries+1,
                    username:$scope.username,
                    name:$scope.entryName,
                    language:$scope.currentLang,
                    options:filteredOptions,
                    voted:[]
                };
                $http.post('/api/dictionary',newEntry);
                $scope.makeVisible(2);
            }
        };
        
        $scope.restartEntry = function(){
            initialize();
        };
        
        $scope.reqEntries = function(){
            $http.get('/api/'+$scope.username+'/entries').then(function(resp){
                $scope.dictionary = resp.data;
            },function(err){
                if (err){throw err}
            });
        };
        
        $scope.removeEntry = function(entryId){
            $http.delete('/api/'+$scope.username+'/'+entryId);
            //$scope.reqEntries();
        };
        
    }]);
    
    app.controller("votingCtrl",['$scope','$http','$routeParams',function($scope,$http,$routeParams){
        
        $scope.votersList=[];
        $scope.options=[];
        $scope.newOptions = [];
        $scope.currentEntry={};
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
        
        $scope.voteScreen = function(entryId){

            $http.get('/api/'+$routeParams.username+'/'+$routeParams.entryId).then(function(resp){
                
                $scope.currentEntry=resp.data[0];
                console.log(resp.data[0]);
                
                $scope.votersList = $scope.currentEntry.voted.reduce(function(previous,current){
                    previous.push(current.username);
                    return previous;
                },[]);
                
                $scope.options = $scope.currentEntry.options.reduce(function(previous,current){
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
            $scope.currentEntry.options[optionVal].count++;
            console.log($scope.currentEntry);
            $http.post('/vote/'+$scope.currentEntry.username+'/'+$scope.currentEntry.entryId,{'entryUpdate':$scope.currentEntry,'optUpdate':$scope.currentEntry.options[optionVal].name}).
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
                $scope.currentEntry.options.push(option);
                $scope.newOptions.splice(index,1);
                console.log($scope.currentEntry.options);
                $http.post('/add/'+$scope.currentEntry.username+'/'+$scope.currentEntry.entryId,{'entryUpdate':$scope.currentEntry}).
                then($scope.voteScreen());
            }
        };
        
        $scope.voteScreen();
        
    }]);
    
})();