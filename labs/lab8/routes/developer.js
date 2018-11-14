const express = require("express");
const mongoose = require("mongoose");
const auth_cbs = require("./auth_cb");

const router = express.Router();

router.get("/",
auth_cbs.checkAuthRedirect,
(req, res) => {
    res.render("api");

});


module.exports = router;