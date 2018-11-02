const express = require("express");
const {Comment} = require("../models/comment.js");
const {Track} = require('../models/track.js');
const {Utils} = require('../models/utils.js');



const router = express.Router();
router.post("/:id/new", function(req, res){
    console.log("POST NEW COMMENT");
    let trackId = req.params.id;
    let userId = req.body.userId;
    let content = req.body.commentText;

    if(!validate_form_input(req.body)){
        console.log("Invalid comment input");
        req.next();
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

    Utils.isTrackHasComment(trackId, commentId)
        .then(track => {
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
    let userId = body.userId;
    let content = body.commentText;
    return userId 
        && content
        && content.length != 0;
}

module.exports = router;