'use strict';

(function(db){
    var app = angular.module("dictionary",['ui.bootstrap']);
    
    app.controller("view-entries",["$scope", "$http", function($scope,$http){
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
        
        $scope.currentLang={name:"Languages"};
        $scope.setLang = function(lang){
            $scope.currentLang = lang;
            $scope.entries=[];
        };
        
        $scope.entries=[];
        $scope.getDictio = function(value){
            if($scope.currentLang.name!="Languages"){
                var rgxpVal = new RegExp(value,"i");
                $http.get('/api/dictionary').then(function(resp){
                    $scope.entries = resp.data.filter(function(term){
                        return term.name.search(rgxpVal)!=-1&term.language==$scope.currentLang.abbrev;
                    });
                    for(var i=0;i<$scope.entries.length;i++){
                        var optCounts = [];
                        for(var j=0;j<$scope.entries[i].options.length;j++){
                            optCounts.push($scope.entries[i].options[j].count);
                        }
                        var mostVoted = Math.max(...optCounts);
                        $scope.entries[i].mostVoted = $scope.entries[i].options.filter(function(val){
                            return val.count==mostVoted;
                        })[0].name;
                    }
                });
            }
            else{
                var rgxpVal = new RegExp(value,"i");
                $http.get('/api/dictionary').then(function(resp){
                    $scope.entries = resp.data.filter(function(term){
                        return term.name.search(rgxpVal)!=-1;
                    });
                    for(var i=0;i<$scope.entries.length;i++){
                        var optCounts = [];
                        for(var j=0;j<$scope.entries[i].options.length;j++){
                            optCounts.push($scope.entries[i].options[j].count);
                        }
                        var mostVoted = Math.max(...optCounts);
                        $scope.entries[i].mostVoted = $scope.entries[i].options.filter(function(val){
                            return val.count==mostVoted;
                        })[0].name;
                    }
                });
            }
        };
        
        
        
        
    }]);
    
})();