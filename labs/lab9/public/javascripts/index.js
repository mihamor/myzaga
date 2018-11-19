async function index() {
    let user = await getAuthUser();
    let indexHtml = await renderTemplate("index", {user: user});
    setPageContent(indexHtml);
}
index();