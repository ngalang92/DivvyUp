const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const publishableKey = process.env.PUBLISHABLE_KEY;
const secretKey = process.env.SECRET_KEY;


 module.exports = {
  signUp(req, res, next){
    res.render("users/sign_up");
  },
  create(req, res, next){
    // We pull the values from the request's body and add them to a newUser object
     let newUser = {
       username: req.body.username,
       email: req.body.email,
       password: req.body.password,
       passwordConfirmation: req.body.passwordConfirmation
     };
     // call the createUser function, passing in newUser and a callback
     userQueries.createUser(newUser, (err, user) => {
       if(err){
         req.flash("error", err);
         res.redirect("/users/sign_up");
       } else {
        // If we created the user successfully,
        // we authenticate the user by calling the  authenticate method on the Passport object
         passport.authenticate("local")(req, res, () => {
           req.flash("notice", "You've successfully signed up!");
           res.redirect("/items");
         })
       }
     });
   },
   signInForm(req, res, next){
     res.render("users/sign_in");
   },
   signIn(req, res, next){
     passport.authenticate("local", {
       //successFlash:'You have successfully signed in!',
       //failureFlash : "Login failed, please try again.",
       successRedirect: '/items',
       failureRedirect: '/users/sign_in'
     })
     (req, res, function () {
      if(!req.user){
         req.flash("notice", "Sign in failed. Please try again.")

       } else {
         req.flash("notice", "You've successfully signed in!");

       }
     })
   },
   signOut(req, res, next){
     req.logout();
     req.flash("notice", "You've successfully signed out!");
     res.redirect("/");
   },

}
