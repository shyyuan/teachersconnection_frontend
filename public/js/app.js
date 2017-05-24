console.log("Teacher Connection app.js works");

var appURL = 'http://localhost:3000/';

var app = angular.module('teachersConnection', []);

app.controller('mainController', ['$http', function($http){
    this.message = "Controller works";

    $http({
      method: 'GET',
      url: appURL+'teachers'
    }).then(function(response){
      console.log(response.data);
    });





}]);
