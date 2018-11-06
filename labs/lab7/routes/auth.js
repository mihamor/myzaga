const express = require("express");
const {User} = require("../models/user");
const {Utils} = require('../models/utils');



const router = express.Router();
router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    
});

router.get("/login", (req, res) => {
    res.render("login");
});
router.post("/login", (req, res) => {
    
});

router.post("/logout", (req, res) => {
    
});
    
    

module.exports = router;