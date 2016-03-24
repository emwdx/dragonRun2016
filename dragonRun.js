

var currentAge = '-1';






if (Meteor.isClient) {

Session.set("selectedRace",'');
Session.set("showSubmitButton","false");
Session.set("runnerAdditionalDonation","0");
Session.set("registrationComplete",'false');
Session.set("currentPaymentRegistrationCode",'');
Session.set("selectedLanguage",'EN');


Meteor.setInterval(function () {
  Session.set('time', new Date());
}, 10);
Meteor.subscribe("systemVariables");
Meteor.subscribe("racerunners");
Meteor.subscribe("runners",{},{});
Meteor.subscribe("payments");
Meteor.subscribe("users");

Template.registerHelper('isAdminUser',function(){

return Roles.userIsInRole(Meteor.user(),['admin']);

});
Template.registerHelper('isStaffUser',function(){

return Roles.userIsInRole(Meteor.user(),['staff','admin']);

});

Template.registerHelper('isWechatUser',function(){

return Roles.userIsInRole(Meteor.user(),['wechat','admin']);

});

Template.loginForm.events({

  'click #loginButton': function(e){
  e.preventDefault()
  var username = $('#inputUsername').val();
  var password = $('#inputPassword').val();
  var previousPath = Session.get('currentURL');


  Meteor.loginWithPassword(username,password,function(){
   Router.go(previousPath);


  });


  }


  });





Template.raceConfiguration.events({
   'click #raceStartButton': function(e){
    e.preventDefault();
    if($('#confirmStartRace').val()=='1'){
    Meteor.call('startRace');

    }
    else{ alert('Confirm what you are doing!');}

   },
   'click #raceStopButton':function(e){
    e.preventDefault();
    Meteor.call('stopRace');
   },
    'click #addRunners':function(e){
 e.preventDefault();
 var allRunners = RaceRunners.find();
 allRunners.forEach(function(runner){

 RaceRunners.remove({_id:runner._id});

    });

 var allRunners = Runners.find({runnerHasPaid:true,runnerRaceSelected:"5K Dragon Run"});

 allRunners.forEach(function(runner){


 var raceRunnerObject = {

 runnerName: (runner.runnerFirstName + ' ' + runner.runnerLastName),
 runnerNumber: runner.runnerBibNumber,
 runnerIsFlagged: false,
 runnerIsStopped:false,
 runnerFlagAssignment:"-1",
 runnerStopTime: 0,
 runnerEstimatedTime: runner.runnerEstimatedTime,
 runnerAge: runner.runnerAge,
 runnerGender: runner.runnerGender

 }

 RaceRunners.insert(raceRunnerObject);

 });

 var numOfSpotters = systemVariables.findOne({name:"numOfSpotters"})
 systemVariables.update({_id:numOfSpotters._id},{$set:{value:4}})
 var currentSpotterIndex = systemVariables.findOne({name:"currentSpotterIndex"})
 systemVariables.update({_id:currentSpotterIndex._id},{$set:{value:1}})


}

});

Template.raceConfiguration.helpers({
raceIsStarted: function(){
    var raceStarted = systemVariables.findOne({name:"raceHasStarted"})
    if(!raceStarted){return false;}
    return raceStarted.value
},
raceTime:function(){
var currentTime = Session.get('time');
var raceStartTime = systemVariables.findOne({name:"raceStartTime"});
if(!raceStartTime){return 'not found'}
var elapsedTime = (currentTime - raceStartTime.value);
minutes = Math.floor(elapsedTime/60000);
seconds = Math.floor(((elapsedTime/60000)-Math.floor(elapsedTime/60000))*60)
if(seconds<=9){var secondString = '0'+seconds.toFixed(0).toString()}
else{var secondString = seconds.toFixed(0).toString();}
if(minutes<9){var minuteString = '0'+minutes.toString()}
else{var minuteString = minutes.toString();}
return {minutes:minuteString,seconds:secondString};
},
connectedToServer:function(){
 return Meteor.status().status;
 },
serverTime: function(){
 var clientTime = parseInt(Session.get('time'));
 return TimeSync.serverTime(clientTime);

},
clientOffset: function(){
Session.set("serverOffset",TimeSync.serverOffset());
var offset = Session.get("serverOffset");
return offset;
}

});


Template.officialRaceTime.helpers({
raceTime:raceTime

});



Template.smallRaceTime.helpers({
raceTime:raceTime,
connection:function(){

if(Meteor.status().status=='connected'){return "green"}
else{return "red"}

}

});

}

function raceTime(){
var clientTime = parseInt(Session.get('time'));
var raceStartTime = systemVariables.findOne({name:"raceStartTime"});
var currentServerTime = raceStartTime;
if(!raceStartTime){return 'not found'}
var elapsedTime = (currentServerTime - raceStartTime.value);
minutes = Math.floor(elapsedTime/60000);
seconds = Math.floor(((elapsedTime/60000)-Math.floor(elapsedTime/60000))*60)
if(seconds<=9){var secondString = '0'+seconds.toFixed(0).toString()}
else{var secondString = seconds.toFixed(0).toString();}
if(minutes<9){var minuteString = '0'+minutes.toString()}
else{var minuteString = minutes.toString();}
return {minutes:minuteString,seconds:secondString};


}

function stopTimeString(){
 var elapsedTime = this.runnerStopTime;
 minutes = Math.floor(elapsedTime/60000);
seconds = Math.floor(((elapsedTime/60000)-Math.floor(elapsedTime/60000))*60)
if(seconds<=9){var secondString = '0'+seconds.toFixed(0).toString()}
else{var secondString = seconds.toFixed(0).toString();}
if(minutes<9){var minuteString = '0'+minutes.toString()}
else{var minuteString = minutes.toString();}
return minuteString+":"+secondString;



}
