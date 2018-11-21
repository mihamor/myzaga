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
    return {
        credentials: "same-origin"        
    };
}


const User = {

    async getAuthUser(){
        let user = null;
        try{
            
            let response = await fetch("/api/v3/me", getHeaders());
            const data = await response.json();
            if(data.err) throw new Error(data.err);
            user = data;
        }catch(err){
            console.log(err);
        }
        return user;
    },
    
    async getList(page=1, search_str=""){
        let users = null;
        const reqOptions = getHeaders();
        if(reqOptions)
        try{
            let response = await fetch(`/api/v3/users?page=${page}&search=${search_str}`, reqOptions);
            let data = await response.json()
            if(data.err) throw new Error(data.err);
            users = data;
        }catch(err){
            console.log(err);
        }
        return users;
    },

    async getById(id){
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
    
};


const Track = {
    
    async getList(page=1, search_str=""){
        let tracks = null;
        const reqOptions = getHeaders();
        if(reqOptions)
        try{
            let response = await fetch(`/api/v3/tracks?page=${page}&search=${search_str}`, reqOptions);
            let data = await response.json()
            if(data.err) throw new Error(data.err);
            tracks = data;
        }catch(err){
            console.log(err);
        }
        return tracks;
    },

    async getById(id){
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
    
};


const Playlist = {
    
    async getList(page=1, search_str="", user=""){
        let playlists = null;
        const reqOptions = getHeaders();
        if(reqOptions)
        try{
            let response = await fetch(`/api/v3/playlists?page=${page}&search=${search_str}&user=${user}`, reqOptions);
            let data = await response.json()
            if(data.err) throw new Error(data.err);
            playlists = data;
        }catch(err){
            console.log(err);
        }
        return playlists;
    },

    async getById(id){
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
    
};







function hideEl(el){
    el.style.visibility = 'hidden';
}
function showEl(el){
    el.style.visibility = 'visible';
}

async function getTracks(page=1, search_str=""){
    let tracks = null;
    const reqOptions = getHeaders();
    try{
        let response = await fetch(`/api/v3/tracks?page=${page}&search=${search_str}`, reqOptions);
        let data = await response.json();
        if(data.err) throw new Error(data.err);
        tracks = data;
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
        let response = await fetch(`/api/v3/playlists?page=${page}&search=${search_str}&user=${user}`, reqOptions);
        playlists = await response.json()
    }catch(err){
        console.log(err);
    }
    return playlists;
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


///////////////////////////////////////
