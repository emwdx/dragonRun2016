

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
Template.allActiveRunners.helpers({
stoppedRunners: function(){
 runnersList = RaceRunners.find({runnerIsStopped:true},{sort:{runnerNumber:-1}}).fetch()    
 return runnersList;   
},
notStoppedRunners: function(){
 runnersList = RaceRunners.find({runnerIsStopped:false},{sort:{runnerNumber:-1}}).fetch()    
 return runnersList;   
},

numberStoppedRunners: function(){
return RaceRunners.find({runnerIsStopped:true}).count();
    
},
    
numberNotStopped: function(){
    
return RaceRunners.find({runnerIsStopped:false}).count();      
},
numberRegistered: function(){
    
 return RaceRunners.find().count();
    
}    
    
    
});
Template.stoppedRunners.helpers({
stoppedRunners: function(){
 runnersList = RaceRunners.find({runnerIsStopped:true},{sort:{runnerStopTime:1}}).fetch()    
 return runnersList;   
},
runnerStopTimeString: stopTimeString,
});
    
Template.stoppedRunnersByNumber.helpers({
stoppedRunners: function(){
 runnersList = RaceRunners.find({runnerIsStopped:true},{sort:{runnerNumber:1}}).fetch()    
 return runnersList;   
},
runnerStopTimeString: stopTimeString,
});
    
Template.stoppedRunnersAdultMale.helpers({
stoppedRunners: function(){
 runnersList = RaceRunners.find({runnerGender:"M",runnerAge:"4",runnerIsStopped:true},{sort:{runnerStopTime:1}}).fetch()    
 return runnersList;   
},
runnerStopTimeString: stopTimeString,
});
Template.stoppedRunnersAdultFemale.helpers({
stoppedRunners: function(){
 runnersList = RaceRunners.find({runnerGender:"F",runnerAge:"4",runnerIsStopped:true},{sort:{runnerStopTime:1}}).fetch()    
 return runnersList;   
},
runnerStopTimeString: stopTimeString,
});

Template.stoppedRunnersHSMale.helpers({
stoppedRunners: function(){
 runnersList = RaceRunners.find({runnerGender:"M",runnerAge:"3",runnerIsStopped:true},{sort:{runnerStopTime:1}}).fetch()    
 return runnersList;   
},
runnerStopTimeString: stopTimeString,
});
Template.stoppedRunnersHSFemale.helpers({
stoppedRunners: function(){
 runnersList = RaceRunners.find({runnerGender:"F",runnerAge:"3",runnerIsStopped:true},{sort:{runnerStopTime:1}}).fetch()    
 return runnersList;   
},
runnerStopTimeString: stopTimeString,
});    

Template.stoppedRunnersMSMale.helpers({
stoppedRunners: function(){
 runnersList = RaceRunners.find({runnerGender:"M",runnerAge:"2",runnerIsStopped:true},{sort:{runnerStopTime:1}}).fetch()    
 return runnersList;   
},
runnerStopTimeString: stopTimeString,
});
Template.stoppedRunnersMSFemale.helpers({
stoppedRunners: function(){
 runnersList = RaceRunners.find({runnerGender:"F",runnerAge:"2",runnerIsStopped:true},{sort:{runnerStopTime:1}}).fetch()    
 return runnersList;   
},
runnerStopTimeString: stopTimeString,
});    
Template.stoppedRunnersLSMale.helpers({
stoppedRunners: function(){
 runnersList = RaceRunners.find({runnerGender:"M",runnerAge:"1",runnerIsStopped:true},{sort:{runnerStopTime:1}}).fetch()    
 return runnersList;   
},
runnerStopTimeString: stopTimeString,
});
Template.stoppedRunnersLSFemale.helpers({
stoppedRunners: function(){
 runnersList = RaceRunners.find({runnerGender:"F",runnerAge:"1",runnerIsStopped:true},{sort:{runnerStopTime:1}}).fetch()    
 return runnersList;   
},
runnerStopTimeString: stopTimeString,
});    
    
    
    
Template.stoppedRunners.helpers({
stoppedRunners: function(){
 runnersList = RaceRunners.find({runnerIsStopped:true},{sort:{runnerStopTime:1}}).fetch()    
 return runnersList;   
},
runnerStopTimeString: stopTimeString,
});
Template.emergencyContactList.helpers({
runners: function(){return Runners.find({runnerHasPaid:true},{sort:{runnerBibNumber:1}})} 
});
      
Template.officialRaceTime.helpers({
raceTime:raceTime  
    
});
    
Template.flaggingRunners.events({
    
'submit form':function(e){
 e.preventDefault()
 var flaggedRunner = parseInt($('#flaggingRunnersInput').val())
 var flaggedRunnerEntry = RaceRunners.findOne({runnerNumber:flaggedRunner, runnerIsFlagged:false});
 var currentSpotterIndex = systemVariables.findOne({name:"currentSpotterIndex"}).value;
 var currentSpotter = systemVariables.findOne({name:"currentSpotterIndex"});
 
 var numOfSpotters = parseInt(systemVariables.findOne({name:"numOfSpotters"}).value);   

 
 if(flaggedRunnerEntry&&(!flaggedRunnerEntry.runnerIsStopped)){
    RaceRunners.update({_id:flaggedRunnerEntry._id},{$set:{runnerIsFlagged:true,runnerFlagAssignment:(currentSpotterIndex)}});
    
    if(currentSpotterIndex<numOfSpotters){
        currentSpotterIndex++;
    }
    else if(currentSpotterIndex==numOfSpotters){
        currentSpotterIndex=1;
        
    }
    
    systemVariables.update({_id:currentSpotter._id},{$set:{value:currentSpotterIndex}});
 }
 else{alert("runnerNotFound")};
 $('#flaggingRunnersInput').val('')
 

},
'click .flaggingRunnersRemoveFlag':function(e){
    
 e.preventDefault();
 currentRunner = this;
 RaceRunners.update({_id:currentRunner._id},{$set:{runnerIsFlagged:false,runnerFlagAssignment:-1}});

},
'click .flaggingRunnersStopButton':function(e){
    
 e.preventDefault();
 currentRunner = this;
 var clientTime = parseInt(Session.get('time'));   
 var currentServerTime = TimeSync.serverTime(clientTime);   
 
var raceStartTime = systemVariables.findOne({name:"raceStartTime"});
if(!raceStartTime){return 'not found'}
var elapsedTime = (currentServerTime - raceStartTime.value);

RaceRunners.update({_id:currentRunner._id},{$set:{runnerStopTime:elapsedTime,runnerIsStopped:true}});
},
'click .flaggingRunnersOopsButton':function(e){
    
 e.preventDefault();
 currentRunner = this;
 
RaceRunners.update({_id:currentRunner._id},{$set:{runnerStopTime:0,runnerIsStopped:false}});
},

    
   

});


Template.flaggingRunners.helpers({
   
    numOfSpotters: function(){ 
     var numOfSpotters = systemVariables.findOne({name:"numOfSpotters"});   
     if(numOfSpotters){   
        return numOfSpotters.value;
     }
    else{ return null;}
    
    
    },
    currentSpotterIndex: function(){ 
        var currentSpotterIndex = systemVariables.findOne({name:"currentSpotterIndex"});
        if(currentSpotterIndex){
            return currentSpotterIndex.value;
        }
        else{ return null;}
    },
    spotter1Numbers: function(){
        
        return RaceRunners.find({runnerFlagAssignment:1,runnerIsStopped:false,runnerIsFlagged:true},{sort:{runnerNumber:-1}});
    },
    spotter2Numbers: function(){
        return RaceRunners.find({runnerFlagAssignment:2,runnerIsStopped:false,runnerIsFlagged:true},{sort:{runnerNumber:-1}});
        
    },
    spotter3Numbers: function(){
        
        return RaceRunners.find({runnerFlagAssignment:3,runnerIsStopped:false,runnerIsFlagged:true},{sort:{runnerNumber:-1}});
    },
    spotter4Numbers: function(){
         return RaceRunners.find({runnerFlagAssignment:4,runnerIsStopped:false,runnerIsFlagged:true},{sort:{runnerNumber:-1}});
        
    },
    
    spotter1NumbersStopped: function(){
        
        return RaceRunners.find({runnerFlagAssignment:1,runnerIsStopped:true},{sort:{runnerStopTime:-1}});
    },
    spotter2NumbersStopped: function(){
        return RaceRunners.find({runnerFlagAssignment:2,runnerIsStopped:true},{sort:{runnerStopTime:-1}});
        
    },
    spotter3NumbersStopped: function(){
        
        return RaceRunners.find({runnerFlagAssignment:3,runnerIsStopped:true},{sort:{runnerStopTime:-1}});
    },
    spotter4NumbersStopped: function(){
         return RaceRunners.find({runnerFlagAssignment:4,runnerIsStopped:true},{sort:{runnerStopTime:-1}});
        
    },
    runnerStopTimeString: stopTimeString,
    
    connectedToServer:function(){
 return (Meteor.status().status=='connected');
 }
    
    
});
Template.missionControl.events({
    
'submit form':function(e){
 e.preventDefault()
 var flaggedRunner = parseInt($('#flaggingRunnersInput').val())
 var flaggedRunnerEntry = RaceRunners.findOne({runnerNumber:flaggedRunner, runnerIsFlagged:false});
 var currentSpotterIndex = systemVariables.findOne({name:"currentSpotterIndex"}).value;
 var currentSpotter = systemVariables.findOne({name:"currentSpotterIndex"});
 
 var numOfSpotters = parseInt(systemVariables.findOne({name:"numOfSpotters"}).value);   

 
 if(flaggedRunnerEntry&&(!flaggedRunnerEntry.runnerIsStopped)){
    RaceRunners.update({_id:flaggedRunnerEntry._id},{$set:{runnerIsFlagged:true,runnerFlagAssignment:(currentSpotterIndex)}});
    
    if(currentSpotterIndex<numOfSpotters){
        currentSpotterIndex++;
    }
    else if(currentSpotterIndex==numOfSpotters){
        currentSpotterIndex=1;
        
    }
    
    systemVariables.update({_id:currentSpotter._id},{$set:{value:currentSpotterIndex}});
 }
 else{alert("runnerNotFound")};
 $('#flaggingRunnersInput').val('')
 

},
'click .flaggingRunnersRemoveFlag':function(e){
    
 e.preventDefault();
 currentRunner = this;
 RaceRunners.update({_id:currentRunner._id},{$set:{runnerIsFlagged:false,runnerFlagAssignment:-1}});

},
'click .flaggingRunnersStopButton':function(e){
    
 e.preventDefault();
 currentRunner = this;
 var clientTime = parseInt(Session.get('time'));   
 var currentServerTime = TimeSync.serverTime(clientTime);   
 
var raceStartTime = systemVariables.findOne({name:"raceStartTime"});
if(!raceStartTime){return 'not found'}
var elapsedTime = (currentServerTime - raceStartTime.value);

RaceRunners.update({_id:currentRunner._id},{$set:{runnerStopTime:elapsedTime,runnerIsStopped:true}});
},
'click .flaggingRunnersOopsButton':function(e){
    
 e.preventDefault();
 currentRunner = this;
 
RaceRunners.update({_id:currentRunner._id},{$set:{runnerStopTime:0,runnerIsStopped:false}});
},
'click .flaggingRunnersEstimatedTime':function(e){
 e.preventDefault();
 currentRunner = this;
 var currentSpotterIndex = systemVariables.findOne({name:"currentSpotterIndex"}).value;
 var currentSpotter = systemVariables.findOne({name:"currentSpotterIndex"});
 var numOfSpotters = parseInt(systemVariables.findOne({name:"numOfSpotters"}).value);  

 RaceRunners.update({_id:currentRunner._id},{$set:{runnerIsFlagged:true,runnerFlagAssignment:(currentSpotterIndex)}})
 if(currentSpotterIndex<numOfSpotters){
        currentSpotterIndex++;
    }
 else if(currentSpotterIndex==numOfSpotters){
        currentSpotterIndex=1;
        
 }
    
 systemVariables.update({_id:currentSpotter._id},{$set:{value:currentSpotterIndex}});    
    
}

    
   

});


Template.missionControl.helpers({
   
    numOfSpotters: function(){ 
     var numOfSpotters = systemVariables.findOne({name:"numOfSpotters"});   
     if(numOfSpotters){   
        return numOfSpotters.value;
     }
    else{ return null;}
    
    
    },
    currentSpotterIndex: function(){ 
        var currentSpotterIndex = systemVariables.findOne({name:"currentSpotterIndex"});
        if(currentSpotterIndex){
            return currentSpotterIndex.value;
        }
        else{ return null;}
    },
    spotter1Numbers: function(){
        
        return RaceRunners.find({runnerFlagAssignment:1,runnerIsStopped:false,runnerIsFlagged:true},{sort:{runnerNumber:-1}});
    },
    spotter2Numbers: function(){
        return RaceRunners.find({runnerFlagAssignment:2,runnerIsStopped:false,runnerIsFlagged:true},{sort:{runnerNumber:-1}});
        
    },
    spotter3Numbers: function(){
        
        return RaceRunners.find({runnerFlagAssignment:3,runnerIsStopped:false,runnerIsFlagged:true},{sort:{runnerNumber:-1}});
    },
    spotter4Numbers: function(){
         return RaceRunners.find({runnerFlagAssignment:4,runnerIsStopped:false,runnerIsFlagged:true},{sort:{runnerNumber:-1}});
        
    },
    
    spotter1NumbersStopped: function(){
        
        return RaceRunners.find({runnerFlagAssignment:1,runnerIsStopped:true},{sort:{runnerStopTime:-1}});
    },
    spotter2NumbersStopped: function(){
        return RaceRunners.find({runnerFlagAssignment:2,runnerIsStopped:true},{sort:{runnerStopTime:-1}});
        
    },
    spotter3NumbersStopped: function(){
        
        return RaceRunners.find({runnerFlagAssignment:3,runnerIsStopped:true},{sort:{runnerStopTime:-1}});
    },
    spotter4NumbersStopped: function(){
         return RaceRunners.find({runnerFlagAssignment:4,runnerIsStopped:true},{sort:{runnerStopTime:-1}});
        
    },
    runnerStopTimeString: stopTimeString,
    
    connectedToServer:function(){
 return (Meteor.status().status=='connected');
 },
    runnersET1: function(){
       return RaceRunners.find({runnerEstimatedTime:"1",runnerIsFlagged:false},{sort:{runnerNumber:-1}}); 
        
    },
    runnersET2: function(){
        
       return RaceRunners.find({runnerEstimatedTime:"2",runnerIsFlagged:false},{sort:{runnerNumber:-1}});  
    },
    runnersET3: function(){
        
       return RaceRunners.find({runnerEstimatedTime:"3",runnerIsFlagged:false},{sort:{runnerNumber:-1}});  
    },
    runnersET4: function(){
       return RaceRunners.find({runnerEstimatedTime:"4",runnerIsFlagged:false},{sort:{runnerNumber:-1}});  
        
    }
    
    
});
    
Template.flaggerPortal.helpers({

    flaggedRunnerNumbers: function(){
        
     var currentIndex = parseInt(Session.get("currentFlagIndex"));
     return RaceRunners.find({runnerIsFlagged:true,runnerFlagAssignment:currentIndex,runnerIsStopped:false});
        
        
    }
    
});
    
Template.flaggerPortal.events({
    
'click .flaggedRunnersButton':function(e){
    
 e.preventDefault();
 currentRunner = this;
 var clientTime = parseInt(Session.get('time'));   
 var currentServerTime = TimeSync.serverTime(clientTime);   
 
var raceStartTime = systemVariables.findOne({name:"raceStartTime"});
if(!raceStartTime){return 'not found'}
var elapsedTime = (currentServerTime - raceStartTime.value);
console.log(elapsedTime);
RaceRunners.update({_id:currentRunner._id},{$set:{runnerStopTime:elapsedTime,runnerIsStopped:true}});
}
    
    
    

    
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
var currentServerTime = TimeSync.serverTime(clientTime);
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
    

