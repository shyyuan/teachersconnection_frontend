console.log("Teacher Connection app.js works");

var app = angular.module('teachersConnection', []);

app.controller('mainController', ['$http', function($http){
    this.message = "Controller works";



}]);
