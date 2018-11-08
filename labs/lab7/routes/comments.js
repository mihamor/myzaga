const express = require("express");
const {Comment} = require("../models/comment.js");
const {Track} = require('../models/track.js');
const {Utils} = require('../models/utils.js');



const router = express.Router();
router.post("/:id/new", (req, res, next) => {
    if(!req.user){
        res.sendStatus(401);
    }else next();
},
(req, res) => {
    console.log("POST NEW COMMENT");
    let trackId = req.params.id;
    let userId = req.user._id;
    let content = req.body.commentText;

    if(!validate_form_input(req.body)){
        console.log("Invalid comment input");
        req.next();
        return;
    }


    let comment = new Comment(content, userId);

    Track.isExist(trackId)
        .then(() => Comment.insert(comment))
        .then(newId => Track.insertComment(trackId, newId))
        .then(() => res.redirect(`/tracks/${trackId}`))
        .catch(err => {
            console.log("ERROR at POST COMMENT:" + err.message);
            req.next();
        });
});

router.post("/:id", function(req, res){
    console.log("DELETE COMMENT");
    let commentId = req.params.id;
    let trackId = req.body.trackId;

    if(!trackId){
        console.log("Invalid trackId");
        req.next();
    }


    Comment.getById(commentId)
        .then(comment => {
            if(!is_comment_owner(req.user, comment)){
                return Promise.reject(new Error("Forbidden"));
            }
            else return Utils.isTrackHasComment(trackId, commentId);
        })
    .   then(track => {
            track.comments = removeItemFromArr(track.comments, commentId);
            return Track.update(track);

        })
        .then(() => Comment.delete(commentId))
        .then(() => res.redirect(`/tracks/${trackId}`))
        .catch(err => {
            console.log("ERROR at POST COMMENT:" + err.message);
            req.next();
        });
});


function removeItemFromArr(arr, item){
    let index = arr.indexOf(item);
    if(index > -1){
        arr.splice(index, 1);
    }
    return arr;
}

function validate_form_input(body){
    let content = body.commentText;
    return content
        && content.length != 0;
}


function is_comment_owner(user, comment){
    return comment.user.toString() == user._id.toString()
        || comment.user._id.toString() == user._id.toString();
}

module.exports = router;