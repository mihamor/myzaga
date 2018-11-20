const express = require("express");
const {User} = require("../models/user.js");
const {Utils} = require("../models/utils.js");
const auth_cbs = require("./auth_cb");

const router = express.Router();

router.get("/",
auth_cbs.checkAuthRedirect,
auth_cbs.checkAdmin,
(req, res) => {
    res.render('users', {user: req.user});
});
router.get("/:id", 
auth_cbs.checkAuthRedirect,
(req, res)=>{
    let id = req.params.id;
    console.log(id);
    User.getById(id)
        .then(user => {
            if(!user) 
                return Promise.reject("No such user");
            let isOwner = is_user_owner(req.user, user);
            res.render("user", {currUser: user, user: req.user, isOwner: isOwner})
        })
        .catch(err => {
            console.log(err.message);
            req.next()
        });
});


router.get("/:id/update", 
auth_cbs.checkAuthRedirect,
(req, res) => {
    let id = req.params.id;

    User.getById(id)
        .then(user => {
            if(!is_user_owner(req.user, user))
                return Promise.reject(new Error("Forbidden"));
            return user;
        })
        .then(user => res.render('users_update', {currUser: user, user: req.user}))
        .catch(err => {
            console.log(err.message);
            req.next();
        })
});


router.post("/:id/update",
auth_cbs.checkAuth,
(req, res) =>{
    let name = req.body.name;
    let bio = req.body.bio;
    let id = req.params.id;
    let ava_bin = req.files.ava;

    if(!name || !bio ){
        res.sendStatus(400);
        return;
    }


    User.getById(id)
    .then(user => {
        if(!user) return Promise.reject("No such user");
        return user;
    })
    .then(user => {
        if(ava_bin)
            return Utils.deleteFileAsync(
                user.avaUrl.substring(user.avaUrl.lastIndexOf('/')+1))
                .then(() => Utils.uploadBufferAsync(ava_bin.data))
                .then(result => {user.avaUrl = result.url; return user;})
        else return user;
    })
    .then(user => {
        if(!is_user_owner(req.user, user))
            return Promise.reject(new Error("Forbidden"));
        user.bio = bio;
        user.fullname = name;
        return user;
    })
    .then(user => User.update(user))
    .then(() => res.redirect(`/users/${id}`))
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })
});
function is_user_owner(user, profile){
    return profile._id.toString() == user._id.toString();
}


module.exports = router;