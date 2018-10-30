const express = require("express");
const {User} = require("../models/user.js");

const router = express.Router();
User.setStoragePath("./data/users.json");

router.get("/", function(req, res){
    User.getAll()
        .then(x => res.render('users',{users : x}))
        .catch(err => {
            console.log(err.message);
            req.next();
        });
});
router.get("/:id", function(req, res){
    let id = req.params.id;
    console.log(id);
    User.getById(id)
        .then(user => {
            if(!user) 
                return Promise.reject("No such user");
            res.render("user", user)
        })
        .catch(err => req.next(err));
});

module.exports = router;