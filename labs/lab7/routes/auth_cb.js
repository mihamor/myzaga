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
    if (!req.user) res.sendStatus(401); // 'Not authorized'
    else if (req.user.role !== 'admin') res.sendStatus(403); // 'Forbidden'
    else next();  // пропускати далі тільки аутентифікованих із роллю 'admin'
}
 module.exports = {checkAdmin, checkAuth, checkAuthRedirect};