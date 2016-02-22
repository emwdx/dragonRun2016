Template.frontPage.helpers({
    
isEN: function(){
    
 return Session.equals('selectedLanguage','EN');   
    
},
isZH:function(){
    
return Session.equals('selectedLanguage','ZH');    
}
    
});

Template.header.events({
'click #sign-out':function(e){
Meteor.logout();    
}    
});