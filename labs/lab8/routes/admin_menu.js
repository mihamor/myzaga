const express = require("express");
const {User} = require("../models/user.js");
const {Utils} = require("../models/utils.js");
const mongoose = require("mongoose");
const auth_cbs = require("./auth_cb");

const router = express.Router();

router.get("/",
auth_cbs.checkAuthRedirect,
auth_cbs.checkAdmin,
async (req, res) => {
    try {
        let users = await User.getAll();
        let selected = await User.this_model().find({role: 1});
        let not_selected = getArrDiff(users, selected);
        //console.log(selected + "-------------------" + not_selected);
        res.render('admin_menu',{selected: selected,not_selected: not_selected, user: req.user});
    } catch(err) {
        console.log(err.message);
        req.next();
    }
});

router.post("/",
auth_cbs.checkAuth,
auth_cbs.checkAdmin,
async (req, res) =>{
    let users_to_update = [];

    let newAdminsIdRaw = req.body.admins;
    
    console.log(newAdminsIdRaw);

    if (!newAdminsIdRaw) newAdminsIdRaw = [];
    else if (typeof newAdminsIdRaw === "string")
        newAdminsIdRaw = [newAdminsIdRaw];

    let newAdminsId = newAdminsIdRaw.map(ele => new mongoose.Types.ObjectId(ele));
    
    console.log(newAdminsId);
    
    let newAdmins = await User.this_model().find()
    .where('_id')
    .in(newAdminsId)
    .exec();
    console.log(newAdmins);

    for(let admin of newAdmins){
        admin.role = 1;
        users_to_update.push(User.update(admin));
    }

    Promise.all(users_to_update)
    .then(() => res.redirect("/admin_menu"))
    .catch(err => {
        console.log(err.message);
        res.sendStatus(400);
    })

});



Array.prototype.diff = function(a) {
    return this.filter(function (i){
        return a.indexOf(i) === -1;
    });
};


function getArrDiff(users, selected){
    let arr = [];
    for(let user of users){
        let flag = false;
        for(let sel of selected){
            if(sel._id == user._id.toString()) {
                flag = true;
                break;
            }
        }
        if(!flag) arr.push(user);
    }
    return arr;
}



module.exports = router;