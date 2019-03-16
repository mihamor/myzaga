const {User} = require('../models/user');
const {Track} = require('../models/track');
const {Utils} = require('../models/utils');
const {Comment} = require('../models/comment');
const {Playlist} = require('../models/playlist');


class SocketHandler
{
    constructor(io){
        this.io = io;
    }
    getCallback(){
        if(!this.io) return null;
        return retrieveCallback(this.io);
    }
}

const retrieveCallback = (io) => (socket) => {
    console.log("GOT NEW CONNECTION");
    let currTrack = 'default';
    socket.on('ontrack', (trackId) => {
        console.log("JOINING "+ trackId);
        currTrack = trackId;
        socket.join(trackId); 
    });
    socket.on('leaveTrack', (trackId) => {
        console.log("LEAVING "  + trackId)
        currTrack = null;
        socket.leave(trackId); 
     });
    socket.on('sendcomment',async ({commentText, id, user}) => {
        if(!currTrack) {
            console.log("ERROR");
            return;
        }
        console.log('comment sended '+ commentText);
        console.log("POST NEW COMMENT");
        const trackId = id;
        const userId = user;
        const content = commentText;
    
        console.log(content);
        console.log(trackId);
        try{
            const comment = new Comment(content, userId);
    
            const isExist = await Track.isExist(trackId);
            const userPop = await User.getById(userId);
            if(!isExist || !userPop) throw new Error("No such entity");
            const newId = await Comment.insert(comment);
            await Track.insertComment(trackId, newId);
            const newTrack = await Utils.getPopulatedTrack(trackId);
            io.sockets.in(currTrack).emit('successComment', newTrack);
        }catch(error) {
            console.log(error);
            io.sockets.in(currTrack).emit('failedComment', error);
        }
    });

    socket.on('disconnect', function () {

        console.log('USER DISCONNECTED');
      });
    };

module.exports = SocketHandler;