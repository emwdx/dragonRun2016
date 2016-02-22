  Meteor.startup(function () {
    // code to run on server at startup
    var numOfUsers = Meteor.users.find().count();
    if(numOfUsers==0){
        
     Accounts.createUser({username:"admin",password:"test1234!",email:"eweinberg@scischina.org"});   
        
    }
      
  var adminUser = Meteor.users.findOne({username:'admin'});

 if (Meteor.users.findOne(adminUser._id)){
            Roles.addUsersToRoles(adminUser._id, ['admin']);
     
 }

if(!Meteor.roles.findOne({name: "race-runner"}))
            Roles.createRole("race-runner");

        if(!Meteor.roles.findOne({name: "staff"}))
            Roles.createRole("staff");

        if(!Meteor.roles.findOne({name: "wechat"}))
            Roles.createRole("wechat");
      
      
  });


Meteor.publish('runners', function(publishLimit,options) {
    if(this.userId){
    var currentUser = Meteor.users.findOne({_id:this.userId});
    if(Roles.userIsInRole(this.userId,['staff','admin'])){
    return Runners.find({year:2015},options);
    }
    else{
        return Runners.find({year:2015,registrationEmail:currentUser.emails[0].address},options);
        
    
    }
    }
    return null;
});

 Meteor.publish('systemVariables',function(){
     
  return systemVariables.find();   
     
 });  

Meteor.publish('payments',function(){
if(this.userId){
    var currentUser = Meteor.users.findOne({_id:this.userId});
    if(Roles.userIsInRole(this.userId,['staff','admin'])){
    return Payments.find({year:2015});
    }
    
    }
return null;   
    
    
});

Meteor.publish('users',function(){
if(this.userId){
    var currentUser = Meteor.users.findOne({_id:this.userId});
    if(Roles.userIsInRole(this.userId,['staff','admin','wechat'])){
    return Meteor.users.find();
    }
    
    }
return null;   
    
    
});


 Meteor.publish('racerunners',function(){
     
  return RaceRunners.find();   
     
 });  
 


Meteor.methods({
 /*    
  sendEmail: function (to, from, subject, text) {
    check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  },
  */
 
  startRace: function(){
      this.unblock();
      var startTimeObject = {name:"raceStartTime",value:new Date().getTime()};
      var raceHasStartedObject = {name:"raceHasStarted",value:true};
      systemVariables.update({name:"raceStartTime"},{$set:startTimeObject});
      systemVariables.update({name:"raceHasStarted"},{$set:raceHasStartedObject});
      
  },
  stopRace: function(){
      this.unblock();
      var startTimeObject = {name:"raceStartTime",value:new Date()};
      var raceHasStoppedObject = {name:"raceHasStarted",value:false};
      systemVariables.update({name:"raceHasStarted"},{$set:raceHasStoppedObject});
      
      
  },
    
 sendPaymentEmail: function(registrationEmail){
  this.unblock();
  if(Roles.userIsInRole(this.userId,['admin','staff'])){
  var html = SSR.render("mustPayTXT");
  Email.send({
      to: registrationEmail,
      from: '2015dragonsquad@SCISHIS.onmicrosoft.com',
      subject: '2015 Dragon Run/Fun Run Registration',
      text: html
    }); 
     
  }
     
 }
});

Runners.allow({
  update: function(){
      
  return Meteor.user();      
      
  },
  remove: function(){
  
  return Meteor.user();
      
  },
  insert: function(){
   
    return Meteor.user();  
      
  }
});

Runners.deny({
    update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
 if(_.contains(fieldNames, 'runnerHasPaid')){
     
  if(Roles.userIsInRole(userId,['staff','admin'])){
      console.log('isAdmin');
      return false;
      
  }
  else{
      return true;
  }
 }
 else{return false}
   
    }
    
});

Payments.allow({
update: function(userId, doc, fieldNames, modifier){
     
  return Roles.userIsInRole(userId,['staff','admin']);      
      
  },
  remove: function(userId, doc){
  
  return Roles.userIsInRole(userId,['staff','admin']);
      
  },
  insert: function(userId, doc){
   
    return Roles.userIsInRole(userId,['staff','admin']);  
      
  }    
        
    
    
});

RaceRunners.allow({
update: function(userId, doc, fieldNames, modifier){
     
  return Roles.userIsInRole(userId,['staff','admin']);      
      
  },
  remove: function(userId, doc){
  
  return Roles.userIsInRole(userId,['staff','admin']);
      
  },
  insert: function(userId, doc){
   
    return Roles.userIsInRole(userId,['staff','admin']);  
      
  }    
        
      
});

systemVariables.allow({
 update: function(){
      
  return true;      
      
  },
  remove: function(){
  
  return true;
      
  },
  insert: function(){
   
    return true;  
      
  }    
    
});


Accounts.onCreateUser(function(options,user){
user.roles = ['race-runner'];    
return user;    
});

SSR.compileTemplate('mustPayTXT', Assets.getText('email.html'));


