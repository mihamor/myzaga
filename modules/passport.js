const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const {User} = require('../models/user');
const {Utils} = require('../models/utils');
const LocalStrategy = require('passport-local').Strategy;
const config = require("../config");

passport.serializeUser(function(user, done) {
    done(null, user._id);
});
passport.deserializeUser(async function(id, done) {
    try{
        const user = await User.getById(id)
        done(null, user);
    } catch(err) {
        done(err, null);
    }
});

async function onLogin(username, password, done) {
    try{
        console.log(username, password);
        const hashedPass = Utils.hash(password);
        const user = await User.getByLoginAndHashPass(username, hashedPass);
        if(user) done(null, user);
        else done(null, false);
    } catch(err) {
        console.log(err.message);
        done(err, null);
    }
}

async function onLoginJWT(jwtPayload, done) {    
    try{
        const user = await User.getById(jwtPayload._id);
        if(user) done(null, user);
        else done(null, false);
    } catch(err) {
        console.log(err.message);
        done(err, null);
    }    
}

passport.use(new LocalStrategy(onLogin));
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : config.secret
    },onLoginJWT
));


