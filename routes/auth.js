const express = require("express");
const {User} = require("../models/user");
const {Utils} = require('../models/utils');
const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const jwt = require('jsonwebtoken');
const config = require("../config");


const router = express.Router();

router.post("/register", (req, res, next) => {
    if(req.user) res.status(401).json({err: "Allready registered"});
    else next();
},
(req, res) => {
    const login = req.body.username;
    const pass = req.body.password;
    if(!valid_user_info(login) || !valid_user_info(pass)){
        res.sendStatus(500);
        return;
    }
    console.log(pass);
    const hashedPass = Utils.hash(pass);
    console.log(hashedPass);
    const user = new User(login, hashedPass, "None", 0, "/images/users/user_pic.png", "None");
    
    User.isValidLogin(login)
    .then(() => Utils.insertUserWithPlaylist(user))
    .then(() => res.json(user))
    .catch(err => {
        console.log(err.message);
        res.status(401).json({err: "Username already exists"});
    });
});

router.post("/login", 
(req, res) => {
passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err || !user) {
        return res.status(400).json({
        message: `Something is not right: ${JSON.stringify(info)}`,
        user: user});
    }
    req.login(user,  {session: false}, (err) => {
        if (err) { return res.send(err); }
        // generate a signed json web token with the contents of user object
        const token = jwt.sign(user.toObject(), config.secret, {expiresIn: 86400 * 30});
        jwt.verify(token, config.secret, function(err, data){
            //console.log(err, data);
        })
        return res.json({ user, token });
    });
})(req, res);
});

function valid_user_info(str){
    return /^(\w{3,})+$/.test(str);
}

module.exports = router;