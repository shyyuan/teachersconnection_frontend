console.log("Teacher Connection app.js works");

const appURL = 'http://localhost:3000/';
//var appURL = 'https://teachersconnection-api.herokuapp.com/';

const app = angular.module('teachersConnection', []);

const loggedIn = false;
const showInvalidLogin = false;
const loginEmail = ''


app.controller('mainController', ['$http', function($http){
  //this.message = "Controller works";
  // boolean variables check login
  //this.loggedIn = true;
  // this.showInvalidLogin = false;
  //this.loginEmail = 'shyyuan@yahoo.com';

  // Arrays and Objects for the site
  this.activeTeacher = {};
  this.allTeachers = [];
  this.allEvents = [];

  // ============
  // Email check and get allTeachers and allEvents
  // ============
  this.validateEmail = function(){
    //console.log(this.loginEmail);
    $http.get(appURL+'teachers').then(response => {
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
        console.log(this.allTeachers);
        this.getAllEvents();
      }
    });

    // $http({
    //   method: 'GET',
    //   headers: {
    //     "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    //   },
    //   url: appURL+'teachers'
    // }).then(function(response){
    //   //console.log('Get teachers from server: ', response.data);
    //   for (var i=0; i<response.data.length; i++) {
    //     //console.log(response.data[i].email);
    //     if (response.data[i].email == this.loginEmail) {
    //       this.loggedIn = true;
    //       this.showInvalidLogin = false;
    //       this.activeTeacher = response.data[i];
    //       //console.log('Valid email: ', this.activeTeacher);
    //       break;
    //     } else {
    //       this.loggedIn = false;
    //       this.showInvalidLogin = true;
    //     }
    //   }
    //   if (this.loggedIn){
    //     this.allTeachers = response.data;
    //     //console.log(this.allTeachers);
    //     this.getAllEvents();
    //
    //   }
    // }.bind(this));
  };  // end of this.validateEmail function

  // get allEvents
  this.getAllEvents = function(){
    $http.get(appURL+'events').then(response => {
      this.allEvents = response.data;
      console.log('All events: ', this.allEvents);
    });
    // $http({
    //   method: 'GET',
    //   headers: {
    //     "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    //   },
    //   url: appURL+'events'
    // }).then(function(response){
    //   console.log('All events from server: ', response.data);
    //   this.allEvents = response.data;
    //   console.log('All events: ', this.allEvents);
    // }.bind(this));
  };


  this.logout = function(){
    this.loggedIn = false;
    this.showInvalidLogin = false;
    this.loginEmail = ''
  }

  //this.validateEmail();
}]);
