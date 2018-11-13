const express = require("express");


function checkAuth(req, res, next) {
    if (!req.user) return res.sendStatus(401); // 'Not authorized'
    next();  // пропускати далі тільки аутентифікованих
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
 module.exports = {checkAdmin, checkAuth, checkAuthRedirect, checkAdminApi};