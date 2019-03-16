const express = require("express");
const passport = require('passport');

function checkAuth(req, res, next) {
    if (!req.user) return res.sendStatus(401); // 'Not authorized'
    next();
}

function checkAuthApi(req, res, next) {
    if (!req.user) res.status(403).json({ err: "Unathorized"}); // 'Forbidden'
    else next();
}

function checkAuthRedirect(req, res, next) {
    if (!req.user) return res.redirect("/auth/login"); // 'Not authorized'
    next();
}



function checkAdmin(req, res, next) {
    if (req.user.role !== 1) res.sendStatus(403); // 'Forbidden'
    else next();
}

function checkAdminApi(req, res, next) {
    if (req.user.role !== 1) res.status(403).json({ err: "Forbidden"}); // 'Forbidden'
    else next();
}
let authJWT = passport.authenticate('jwt', {session: false});
module.exports = {checkAdmin, checkAuth, checkAuthApi, checkAuthRedirect, checkAdminApi, authJWT};
