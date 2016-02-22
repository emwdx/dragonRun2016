Runners = new Meteor.Collection('runners');
systemVariables = new Meteor.Collection('systemVariables');
RaceRunners = new Meteor.Collection('racerunners');
Payments = new Meteor.Collection('payments');

var mySubmitFunc = function(error, state){
  if (!error) {
    if (state === "signIn") {
      Router.go('/portal/');
    }
    if (state === "signUp") {
      Router.go('/registration/');
    }
  }
};

//Accounts.config({forbidClientAccountCreation: true}); 


var numOfSpotters = systemVariables.findOne({name:"numOfSpotters"})
if(!numOfSpotters){
systemVariables.insert({name:"numOfSpotters",value:4})
}


var currentSpotterIndex = systemVariables.findOne({name:"currentSpotterIndex"})
if(!currentSpotterIndex){
systemVariables.insert({name:"currentSpotterIndex",value:4})
}




AccountsTemplates.configureRoute('signIn', {
    name: 'signIn',
    path: '/sign-in',
    template:'signInAccount',
    redirect: '/portal/'
});

AccountsTemplates.configureRoute('signUp', {
    name: 'signUp',
    template:'registerAccount',
    path:'/sign-up',
    redirect: '/registration/'
});



AccountsTemplates.configureRoute('forgotPwd', {
    name: 'resetPwd',
    redirect: '/reset-password/'
});



AccountsTemplates.configure({
    // Behaviour
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: true,
    lowercaseUsername: false,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: true,
    showPlaceholders: true,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',
   
    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 4000,

    // Hooks
    //onLogoutHook: myLogoutFunc,
    onSubmitHook: mySubmitFunc,

    // Texts
    texts: {
      button: {
          signUp: "Register Now!"
      },
      socialSignUp: "Create an account",
      socialIcons: {
          "meteor-developer": "fa fa-rocket"
      },
      title: {
          forgotPwd: "Recover Your Password",
          signUp: "Please create an account to register for the Dragon Run:",
          signIn:"Please sign in to continue:"
      },
    },
});

