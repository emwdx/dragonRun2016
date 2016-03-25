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


AccountsTemplates.configure({
    defaultLayout: 'main',
});


AccountsTemplates.configure({
    // Behaviour
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: false,
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
          signUp: "Please create an account to register for this year's HIS Charity Dragon Run:",
          signIn:"Please sign in to continue:"
      },
    },
});

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
    redirect: '/sign-in'
});



AccountsTemplates.configureRoute('resetPwd', {
    name: 'resetPwd',
    template:'reset-password',
    path: '/reset-password/'
});


AccountsTemplates.configureRoute('forgotPwd', {
    name: 'forgotPwd',
    template:'forgot-password',
    path: '/forgot-password/'
});
