async function navBarLoad() {
    const jwt = localStorage.getItem('jwt');
    let user = null;
    try{
        if(jwt){
            const reqOptions = {
                headers: { Authorization: `Bearer ${jwt}`, },
            };     
            let response = await fetch("/api/v3/me", reqOptions);
            user = await response.json();
        }
    }catch(err){
        console.log(err);
    }
    let templateResp = await fetch("/templates/navbar.mst");
    const templateStr = await templateResp.text();
    console.log(user);
    const dataObject = {user: user};
    const renderedHtmlStr = Mustache.render(templateStr, dataObject);
    const navbarEl = document.getElementById('navbarResponsive');
    navbarEl.innerHTML = renderedHtmlStr;

} 
navBarLoad();