const express = require("express");
const passport = require('passport');

function checkAuth(req, res, next) {
    if (!req.user) return res.sendStatus(401); // 'Not authorized'
    next();  // пропускати далі тільки аутентифікованих
}

function checkAuthApi(req, res, next) {
    if (!req.user) res.status(403).json({ err: "Unathorized"}); // 'Forbidden'
    else next();  // пропускати далі тільки аутентифікованих із роллю 'admin'
}

function checkAuthRedirect(req, res, next) {
    if (!req.user) return res.redirect("/auth/login"); // 'Not authorized'
    next();  // пропускати далі тільки аутентифікованих
}



function checkAdmin(req, res, next) {
    if (req.user.role !== 1) res.sendStatus(403); // 'Forbidden'
    else next();  // пропускати далі тільки аутентифікованих із роллю 'admin'
}

function checkAdminApi(req, res, next) {
    if (req.user.role !== 1) res.status(403).json({ err: "Forbidden"}); // 'Forbidden'
    else next();  // пропускати далі тільки аутентифікованих із роллю 'admin'
}
function authJWT(req, res, next) {
    passport.authenticate('jwt', {session: false});
}
 module.exports = {checkAdmin, checkAuth, checkAuthApi, checkAuthRedirect, checkAdminApi, authJWT};