async function navBarLoad() {
    let user = await getAuthUser();
    let renderedHtmlStr = await renderTemplate("navbar", {user: user});
    const navbarEl = document.getElementById('navbarResponsive');
    navbarEl.innerHTML = renderedHtmlStr;

}
async function initNavBar(){
    await navBarLoad();
    const logoutForm = document.getElementById("logout-form");
    const aboutForm = document.getElementById("about-link");
    const tracksForm = document.getElementById("tracks-link");
    if(logoutForm)
    logoutForm.addEventListener('submit', async function (e) {
       console.log("On logoutForm submit");
       e.preventDefault();  // cancel page reload
       localStorage.removeItem('jwt');
       await navBarLoad();
    });
    aboutForm.addEventListener('submit', async function (e) {
        console.log("On aboutForm submit");
        e.preventDefault();
        let aboutHtml = await renderTemplate("about");
        setPageContent(aboutHtml);
    });
    if(tracksForm)
    tracksForm.addEventListener('submit', async function (e) {
        console.log("On tracksForm submit");
        e.preventDefault();
        let user = await getAuthUser();
        let tracks = await getTracks();
        console.log(tracks);
        let tracksHtml = await renderTemplate("tracks", 
        {   user:user, 
            tracks:tracks.tracks,
            prev_page: tracks.this_page - 1,
            next_page: tracks.this_page + 1,
            search_str: tracks.search_str,
            this_page: tracks.this_page,
            page_count: tracks.page_count
        });
        setPageContent(tracksHtml);
    });

}

initNavBar();