console.log("Teacher Connection app.js works");

const app = angular.module('teachersConnection', []);
//const appURL = 'http://localhost:3000/';
const appURL = 'https://teachersconnection-api.herokuapp.com/';
const loggedIn = false;
const showInvalidLogin = false;
const loginEmail = ''
// const editTeacherMode = false;

// ====== main controller ============= //
app.controller('mainController', ['$http', function($http){
  //this.message = "Controller works";
  //this.loginEmail = 'shyyuan@yahoo.com'; // for local testing
  this.tab = 1;
  //this.editTeacherMode = false;
  // Arrays and Objects for the site
  this.activeTeacher = {};
  this.allTeachers = [];
  this.allEvents = [];
  this.editTeacherMode = false;
  this.teacherFormData = {};
  this.teacherInd = -1;

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
        console.log('All teachers: ', this.allTeachers);
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

  // ====== get allEvents ========= //
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

  // ============
  // Create/Update Teacher
  // ============
  // create new teacher
  this.createTeacher = function(){
    console.log("inside create new teacher: ", this.teacherFormData);
    $http({
      method: 'POST',
      url : appURL+'teachers',
      data: this.teacherFormData
    }).then(function(result){
      console.log('Data from server: ', result.data);
      this.allTeachers.push(result.data);
      this.teacherFormData = {};
    }.bind(this));
  };

  // edit Teacher
  this.editTeacher = function(ind){
    this.editTeacherMode = true;
    this.teacherFormData.name = this.allTeachers[ind].name;
    this.teacherFormData.email = this.allTeachers[ind].email;
    this.teacherInd = ind;
  };

  // Update teacher info in DB
  this.updateTeacher = function(ind){
    var tempId = this.allTeachers[ind].id;
    console.log("inside Update teacher: ", this.teacherFormData);
    $http({
      method: 'PUT',
      url : appURL+'teachers/'+tempId,
      data: this.teacherFormData
    }).then(function(result){
      console.log('Teacher updated from server: ', result.data);
      this.allTeachers.splice(ind, 1, result.data);
      this.cancelEditTeacher();
    }.bind(this));
  }

  // cancel edit teacher mode
  this.cancelEditTeacher = function(){
    this.editTeacherMode = false;
    this.teacherInd = -1;
    this.teacherFormData = {};
  };


  // ===========
  // Logout
  // ===========
  this.logout = function(){
    this.loggedIn = false;
    this.showInvalidLogin = false;
    this.loginEmail = ''
  }
  // for local testing
  //this.validateEmail();
}]);
