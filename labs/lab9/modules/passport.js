const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const {User} = require('../models/user');
const {Utils} = require('../models/utils');
const LocalStrategy = require('passport-local').Strategy;
//const BasicStrategy = require('passport-http').BasicStrategy;
const config = require("../config");



/*

app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user._id);
});
passport.deserializeUser(async function(id, done) {

    try{
        let user = await User.getById(id)
        done(null, user);
    } catch(err) {
        done(err, null);
    }
});
*/

async function onLogin(username, password, done) {
    try{
        console.log(username, password);
        let hashedPass = Utils.hash(password);
        let user = await User.getByLoginAndHashPass(username, hashedPass);
        //console.log("CYKAAAAAAAAAAAAAAA" +user);
        if(user) done(null, user);
        else done(null, false);
    } catch(err) {
        console.log(err.message);
        done(err, null);
    }
}
passport.use(new LocalStrategy(onLogin));
//passport.use(new BasicStrategy(onLogin));




passport.serializeUser(function(user, done) {
    //console.log(user);
    done(null, user._id);
});
passport.deserializeUser(async function(id, done) {
    try{
        let user = await User.getById(id)
        console.log(user);
        done(null, user);
    } catch(err) {
        done(err, null);
    }
});
