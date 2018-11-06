const express = require("express");
const {User} = require("../models/user.js");
const {Utils} = require("../models/utils.js");

const router = express.Router();

router.get("/", function(req, res){
    User.getAll()
        .then(x => res.render('users',{users : x}))
        .catch(err => {
            console.log(err.message);
            req.next();
        });
});


router.get("/new", function(req, res){
    res.render('users_new');
});

router.post("/new", function(req, res){
    let login = req.body.login;
    let name = req.body.name;
    let ava_bin = req.files.image;
    let bio = req.body.bio;

    if(!login || !name 
    || !ava_bin || !bio ){
        res.sendStatus(400);
        return;
    }


    Utils.uploadBufferAsync(ava_bin.data)
    .then(result => {
        let user = new User(login, name, 0, result.url, bio);
        return user;
    })
    .then(user => Utils.insertUserWithPlaylist(user))
    .then(newId => res.redirect(`/users/${newId}`))
    .catch(err => {
        console.log(err.message);
        req.next();
    })
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
        .catch(err => {
            console.log(err.message);
            req.next()
        });
});


router.get("/:id/update", function(req, res){
    let id = req.params.id;

    User.getById(id)
        .then(user => res.render('users_update', user))
        .catch(err => {
            console.log(err.message);
            req.next();
        })
});


router.post("/:id/update", function(req, res){
    let name = req.body.name;
    let bio = req.body.bio;
    let id = req.params.id;

    if(!name || !bio ){
        res.sendStatus(400);
        return;
    }


    User.getById(id)
    .then(user => {
        if(!user)
            return Promise.reject("No such user");

        user.bio = bio;
        user.fullname = name;
        return user;
    })
    .then(user => User.update(user))
    .then(() => res.redirect(`/users/${id}`))
    .catch(err => {
        console.log(err.message);
        req.next();
    })
});





module.exports = router;