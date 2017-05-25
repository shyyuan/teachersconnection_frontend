console.log("Teacher Connection app.js works");

var appURL = 'http://localhost:3000/';

var app = angular.module('teachersConnection', []);

app.controller('mainController', ['$http', function($http){
  //this.message = "Controller works";
  // boolean variables check login
  this.loggedIn = false;
  this.showInvalidLogin = false;
  this.loginEmail = '';

  // Arrays and Objects for the site
  this.activeTeacher = {};
  this.allTeachers = [];
  this.allEvents = [];

  // ============
  // Email check and get allTeachers and allEvents
  // ============
  this.validateEmail = function(){
    //console.log(this.loginEmail);
    $http({
      method: 'GET',
      url: appURL+'teachers'
    }).then(function(response){
      //console.log('Get teachers from server: ', response.data);
      for (var i=0; i<response.data.length; i++) {
        //console.log(response.data[i].email);
        if (response.data[i].email == this.loginEmail) {
          this.loggedIn = true;
          this.showInvalidLogin = false;
          this.activeTeacher = response.data[i];
          //console.log('Valid email: ', this.activeTeacher);
          break;
        } else {
          this.loggedIn = false;
          this.showInvalidLogin = true;
        }
      }
      if (this.loggedIn){
        this.allTeachers = response.data;
        //console.log(this.allTeachers);
        this.getAllEvents();
      }
    }.bind(this));
  };

  // get allEvents
  this.getAllEvents = function(){
    $http({
      method: 'GET',
      url: appURL+'events'
    }).then(function(response){
      console.log('All events: ', response.data);
      this.allEvents = response.data;
    }.bind(this));

  }


}]);
