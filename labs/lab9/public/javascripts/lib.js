async function renderTemplate(tmpName, dataObject) {
    try{
        let templateResp = await fetch(`/templates/${tmpName}.mst`);
        const templateStr = await templateResp.text();
        const renderedHtmlStr = Mustache.render(templateStr, dataObject);
        return renderedHtmlStr;
    }catch(err){
        console.log(err);
    }
}

function getHeaders(){
    const jwt = localStorage.getItem('jwt');
    if(jwt)
    return {
        headers: { Authorization: `Bearer ${jwt}`, }
    };
}


async function getAuthUser(){
    let user = null;
    const reqOptions = getHeaders();
    if(reqOptions)
    try{
        let response = await fetch("/api/v3/me", reqOptions);
        user = await response.json();
    }catch(err){
        console.log(err);
    }

    return user;
}

async function getTracks(page=1, search_str=""){
    let tracks = null;
    const reqOptions = getHeaders();
    if(reqOptions)
    try{
        let response = await fetch(`/api/v3/tracks?page${page}&search=${search_str}`, reqOptions);
        tracks = await response.json()
    }catch(err){
        console.log(err);
    }
    return tracks;
}

async function getPlaylists(page=1, search_str="", user=""){
    let playlists = null;
    const reqOptions = getHeaders();
    if(reqOptions)
    try{
        let response = await fetch(`/api/v3/playlists?page${page}&search=${search_str}&user=${user}`, reqOptions);
        playlists = await response.json()
    }catch(err){
        console.log(err);
    }
    return playlists;
}
async function getUsers(page=1, search_str=""){
    let users = null;
    const reqOptions = getHeaders();
    if(reqOptions)
    try{
        let response = await fetch(`/api/v3/users?page${page}&search=${search_str}`, reqOptions);
        let data = await response.json()
        if(data.err) throw new Error(data.err);
        users = data;
    }catch(err){
        console.log(err);
    }
    return users;
}

async function getTrack(id){
    let track = null;
    const reqOptions = getHeaders();
    if(reqOptions)
    try{
        let response = await fetch(`/api/v3/tracks/${id}`, reqOptions);
        let data = await response.json();
        if(data.err)throw new Error(data.err);
        track = data;
    }catch(err){
        console.log(err);
    }
    return track;
}

async function getPlaylist(id){
    let playlist = null;
    const reqOptions = getHeaders();
    if(reqOptions)
    try{
        let response = await fetch(`/api/v3/playlists/${id}`, reqOptions);
        let data = await response.json();
        if(data.err)throw new Error(data.err);
        playlist = data;
    }catch(err){
        console.log(err);
    }
    return playlist;
}

async function getUser(id){
    let user = null;
    const reqOptions = getHeaders();
    if(reqOptions)
    try{
        let response = await fetch(`/api/v3/users/${id}`, reqOptions);
        let data = await response.json();
        if(data.err)throw new Error(data.err);
        user = data;
    }catch(err){
        console.log(err);
    }
    return user;
}

function setPageContent(htmlStr){
    const content = document.getElementById('page-content');
    content.innerHTML = htmlStr;
}



///////////////////////////////////////

async function onGetTrack(id) {
    console.log("On getTrack submit");
     // cancel page reload
    try{
        const track = await getTrack(id);
        const user = await getAuthUser();
        const isOwner = is_track_owner(user, track);
        for(let comm of track.comments){
            if(is_comment_owner(user, comm))
                comm.owner = true;
        }
        track.comments = track.comments.sort( (a , b) => {
            return b.addedAt - a.addedAt;
        });
        console.log(track);

        let trackHtml = await renderTemplate("track", {user: user, track: track, isOwner: isOwner});
        setPageContent(trackHtml);
    }catch(err){
        console.log(err);
    }
}



function is_track_owner(user, track){
    return track.uploadedListRef.toString() == user.uploaded_tracks.toString()
        || track.uploadedListRef._id.toString() == user.uploaded_tracks.toString() 
        || user.role;
}
function is_comment_owner(user, comm){
    return comm.user._id.toString() == user._id.toString() 
    || user.role;
}