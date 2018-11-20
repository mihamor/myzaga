let user_search = document.getElementById("user_search");
if(!user_search) setPlaylistsPage();
else setPlaylistsPage(user_search.getAttribute("value"));