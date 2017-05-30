console.log("Teacher Connection app.js works");


const app = angular.module('teachersConnection', []);
//const appURL = 'http://localhost:3000/';
const appURL = 'https://teachersconnection-api.herokuapp.com/';
const loggedIn = false;
const loginEmail = ''
const admin = false;
const timeOut = 5;

// ====== main controller ============= //
app.controller('mainController', ['$http', function($http){
  this.invalidMessage = "";
  //this.loginEmail = 'shyyuan@yahoo.com'; // for local testing

  // Arrays and Objects for the site
  this.activeTeacher = {};
  this.allTeachers = [];
  this.allEvents = [];
  this.editTeacherMode = false;
  this.teacherFormData = {};
  this.teacherInd = -1;
  this.teacherSortByName = false;
  this.teacherSortByEmail = false;
  this.editEventMode = false;
  this.viewEventMode = false;
  this.eventFormData = {};
  this.eventInd = -1;
  this.currentEvent = {};
  this.dialogues = [];
  this.dialogueForm = {};

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
          this.activeTeacher.lastActiveTime = Date.now();
          //console.log('Valid email: ', this.activeTeacher);
          break;
        } else {
          this.loggedIn = false;
          this.showMessage = true;
          this.invalidMessage = "Invalid email address";
        }
      }
      if (this.loggedIn){
        this.showMessage = false;
        if (this.activeTeacher.id === 1) {
          this.admin = true;
        } else {
          this.admin = false;
        }
        this.allTeachers = response.data;
        this.sortTeacherByName();
        console.log('All teachers: ', this.allTeachers);
        this.getAllEvents();
        this.tab = 1;
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
  // Create/Update/Delete Teacher
  // ============
  // create new teacher
  this.createTeacher = function(){
    if (this.timeOut()){
      this.logout();
      this.timeOutMessage();
    } else {
      this.activeTeacher.lastActiveTime = Date.now();
      console.log("inside create new teacher: ", this.teacherFormData);
      $http({
        method: 'POST',
        url : appURL+'teachers',
        data: this.teacherFormData
      }).then(function(result){
        //console.log('Data from server: ', result.data);
        this.allTeachers.push(result.data);
        this.sortAllTeachers();
        this.teacherFormData = {};
      }.bind(this));
    }
  };

  // edit Teacher
  this.editTeacher = function(ind){
    if (this.timeOut()){
      this.logout();
      this.timeOutMessage();
    } else {
      this.activeTeacher.lastActiveTime = Date.now();
      this.editTeacherMode = true;
      this.teacherFormData.name = this.allTeachers[ind].name;
      this.teacherFormData.email = this.allTeachers[ind].email;
      this.teacherInd = ind;
    }
  };

  // Update teacher info in DB
  this.updateTeacher = function(ind){
    if (this.timeOut()){
      this.logout();
      this.timeOutMessage();
    } else {
      this.activeTeacher.lastActiveTime = Date.now();
      var tempId = this.allTeachers[ind].id;
      console.log("inside Update teacher: ", this.teacherFormData);
      $http({
        method: 'PUT',
        url : appURL+'teachers/'+tempId,
        data: this.teacherFormData
      }).then(function(result){
        console.log('Teacher updated from server: ', result.data);
        this.allTeachers.splice(ind, 1, result.data);
        this.sortAllTeachers();
        this.cancelEditTeacher();
      }.bind(this));
    }
  }

  // cancel edit teacher mode
  this.cancelEditTeacher = function(){
    this.checkTimeOut(2);
  };

  // Delete teacher
  this.deleteTeacher = function(ind){
    if (this.timeOut()){
      this.logout();
      this.timeOutMessage();
    } else {
      this.activeTeacher.lastActiveTime = Date.now();
      var tempId = this.allTeachers[ind].id;
      $http.delete(appURL+'teachers/'+tempId).then(response => {
        this.allTeachers.splice(ind, 1);
        console.log('Delete teacher: ', response);
      });
    }
  };

  // ===========
  // Teacher Sort Function
  // ===========
  this.sortTeacherByName = function(){
    if (this.timeOut()){
      this.logout();
      this.timeOutMessage();
    } else {
      this.activeTeacher.lastActiveTime = Date.now();
      this.teacherSortByName = true;
      this.teacherSortByEmail = false;
      this.allTeachers =  this.allTeachers.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
      return this.allTeachers;
    }
  };

  this.sortTeacherByEamil = function(){
    if (this.timeOut()){
      this.logout();
      this.timeOutMessage();
    } else {
      this.activeTeacher.lastActiveTime = Date.now();
      this.teacherSortByName = false;
      this.teacherSortByEmail = true;
      this.allTeachers = this.allTeachers.sort((a, b) => a.email.toUpperCase().localeCompare(b.email.toUpperCase()));
      return this.allTeachers;
    }
  };

  this.sortAllTeachers = function(){
    if (this.teacherSortByName) {
      this.sortTeacherByName();
    } else if (this.teacherSortByEmail) {
      this.sortTeacherByEamil();
    }
  };

  // ===========
  // checkTimeOut
  // ===========
  this.checkTimeOut = function(tab){
    if (this.timeOut()) {
      this.logout();
      this.timeOutMessage();
    } else {
      this.activeTeacher.lastActiveTime = Date.now();
      this.tab = tab;
      this.viewEventMode = false;
      this.editTeacherMode = false;
      this.editEventMode = false;
      this.teacherFormData = {};
      this.eventFormData = {};
      if (tab === 1){
        this.getAllEvents();
      }
    }
  };
  // the timeOut function
  this.timeOut = function(){
    var diff = (Date.now() - this.activeTeacher.lastActiveTime)/60000;
    console.log('Time diff: ', diff);
    if (diff > timeOut) {
      return true;
    } else {
      return false;
    }
  };
  // set time out message
  this.timeOutMessage = function(){
    this.showMessage = true;
    this.invalidMessage = "Session Timeout";
  }

  // ===========
  // Logout
  // ===========
  this.logout = function(){
    this.loggedIn = false;
    this.showMessage = false;
    this.loginEmail = ''
  }

  // ============
  // Create/Update/Delete Events and its Dialogues
  // ============
  // create new event
  this.createEvent = function(){
    if (this.timeOut()){
      this.logout();
      this.timeOutMessage();
    } else {
      this.activeTeacher.lastActiveTime = Date.now();
      console.log("inside create new event: ", this.eventFormData);
      $http({
        method: 'POST',
        url : appURL+'events',
        data: this.eventFormData
      }).then(function(result){
        console.log('New Event data from server: ', result.data);
        this.getAllEvents();
        this.eventFormData = {};
      }.bind(this));
    }
  };

  // view one event detail and its dialogues
  this.viewEventDetail = function(ind){
    if (this.timeOut()){
      this.logout();
      this.timeOutMessage();
    } else {
      this.currentEvent = this.allEvents[ind];
      this.viewEventMode = true;
      //console.log('View event ',this.currentEvent);
      this.getDialogues(this.currentEvent.id);
    }
  };

  // edit one event
  this.editEvent = function(){
    if (this.timeOut()){
      this.logout();
      this.timeOutMessage();
    } else {
      this.editEventMode = true;
      this.eventFormData.title = this.currentEvent.title;
      this.eventFormData.convener = this.currentEvent.convener;
      this.eventFormData.description = this.currentEvent.description;
      this.eventFormData.location = this.currentEvent.location;
      this.eventFormData.start_datetime = this.currentEvent.start_datetime;
      this.eventFormData.end_datetime = this.currentEvent.end_datetime;
    }
  };

  // update event in DB
  this.updateEvent = function(){
    if (this.timeOut()){
      this.logout();
      this.timeOutMessage();
    } else {
      this.activeTeacher.lastActiveTime = Date.now();
      console.log('Update Event: ', this.eventFormData);
      $http({
        method: 'PUT',
        url : appURL+'events/'+this.currentEvent.id,
        data: this.eventFormData
      }).then(function(result){
      console.log('Event updated from server: ', result.data);
        this.currentEvent = result.data;
        this.editEventMode = false;
        this.eventFormData = {};
      }.bind(this));
    }
  };

  // Delete event and its dialogues


  // Get all dialogue for one event
  this.getDialogues = function(id){
    $http.get(appURL+'events/'+id).then(response => {
      //console.log('View event and dialogues: ', response.data.dialogues);
      this.dialogues = response.data.dialogues;
      for (var i=0; i<this.dialogues.length; i++){
        for(var j=0; j<this.allTeachers.length; j++){
          if (this.dialogues[i].teacher_id === this.allTeachers[j].id) {
            this.dialogues[i].teacherName =  this.allTeachers[j].name;
            break;
          }
        }
      }
    });
  };

  // Post (create) new dialogue
  this.newDialogue = function(){
    if (this.timeOut()){
      this.logout();
      this.timeOutMessage();
    } else {
      this.dialogueForm.event_id = this.currentEvent.id;
      this.dialogueForm.teacher_id = this.activeTeacher.id;
      console.log('New Dialogue: ',this.dialogueForm);
      $http({
        method: 'POST',
        url : appURL+'dialogues',
        data: this.dialogueForm
      }).then(function(result){
        console.log('Dialogue Data from server: ', result.data);
        this.dialogueForm = {};
        this.getDialogues(this.currentEvent.id);
      }.bind(this));
    }
  };


  // for local testing
  //this.validateEmail();
}]);
