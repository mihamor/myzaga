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


async function getAuthUser(){
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
async function getUsers(page=1, search_str=""){
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

async function onSearchTracks(form){
    const search_str = form.search.value;
    try{
        await setTracksPage(1, search_str);
    }catch(err){
        console.log(err);
    }
}


async function onSearchPlaylists(form){
    const search_str = form.search.value;
    let user_search = document.getElementById("user_search");
    let user_query = "";
    if(user_search) user_query = user_search.getAttribute("value");
    try{
        await setPlaylistsPage(user_query,1, search_str);
    }catch(err){
        console.log(err);
    }
}
async function onSearchUsers(form){
    const search_str = form.search.value;
    try{
        await setUsersPage(1, search_str);
    }catch(err){
        console.log(err);
    }
}





async function onPageEntities(button, setPageCb){
    const page = button.getAttribute("value");
    const search = button.getAttribute("search");
    console.log(page, search);
    await setPageCb(page, search);
}

async function onPagePlaylists(button) {
    console.log("On getPagePlaylists submit");
    let user_search = document.getElementById("user_search");
    let user_query = "";
    if(user_search) user_query = user_search.getAttribute("value");
    try{
        const page = button.getAttribute("value");
        const search = button.getAttribute("search");
        console.log(page, search);
        await setPlaylistsPage(user_query, page, search);
    }catch(err){
        console.log(err);
    }
}

async function onPageTracks(button) {
    console.log("On getPageTrack submit");
    try{
        await onPageEntities(button, setTracksPage);
    }catch(err){
        console.log(err);
    }
}

async function onPageUsers(button) {
    console.log("On getPageTrack submit");
    try{
        await onPageEntities(button, setUsersPage);
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



async function setUsersPage(page=1, search_str=""){
    let user = await getAuthUser();
    if(!user) {
        window.location.href = "/auth/login";
        return;
    }
    let users = await getUsers(page, search_str);
    console.log(users);
    let next_page = users.this_page === users.page_count ? 0 : users.this_page + 1;
    let usersHtml = await renderTemplate("users", 
    {   user:user, 
        users:users.users,
        prev_page: users.this_page - 1,
        next_page: next_page,
        search_str: users.search_str,
        this_page: users.this_page,
        page_count: users.page_count
    });
    setPageContent(usersHtml);
}



async function setTracksPage(page=1, search_str=""){
    let user = await getAuthUser();
    if(!user) {
        window.location.href = "/auth/login";
        return;
    }
    let tracks = await getTracks(page, search_str);
    console.log(tracks);
    let next_page = tracks.this_page === tracks.page_count ? 0 : tracks.this_page + 1;
    let tracksHtml = await renderTemplate("tracks", 
    {   user:user, 
        tracks:tracks.tracks,
        prev_page: tracks.this_page - 1,
        next_page: next_page,
        search_str: tracks.search_str,
        this_page: tracks.this_page,
        page_count: tracks.page_count
    });
    setPageContent(tracksHtml);
}


async function setPlaylistsPage(user_search="", page=1, search_str=""){
    let user = await getAuthUser();
    if(!user) {
        window.location.href = "/auth/login";
        return;
    }
    if(user_search == "null") user_search="";
    let playlists = await getPlaylists(page, search_str, user_search);
    console.log(playlists);
    let next_page = playlists.this_page === playlists.page_count ? 0 : playlists.this_page + 1;
    let playlistsHtml = await renderTemplate("playlists", 
    {   user:user, 
        playlists:playlists.playlists,
        prev_page: playlists.this_page - 1,
        next_page: next_page,
        search_str: playlists.search_str,
        this_page: playlists.this_page,
        page_count: playlists.page_count
    });
    setPageContent(playlistsHtml);
}
async function onPlaylistEraseSearch(){
    let user_search = document.getElementById("user_search");
    if(!user_search) await setPlaylistsPage();
    else await setPlaylistsPage(user_search.getAttribute("value"));
}