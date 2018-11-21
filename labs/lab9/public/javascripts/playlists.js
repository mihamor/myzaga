const user_searchEl = document.getElementById("user_search");

const data = {
    _nameFilter: "",
    curr_page: 1,
    userId: user_searchEl ? user_searchEl.getAttribute("value") : "",

    get nameFilter() {
        return this._nameFilter.toLowerCase().trim();
    },
    async setFilter(value) {
        this.curr_page = 1;
        this._nameFilter = value;
        Ui.setFilter(this.nameFilter);
        const f_playlists = await this.filteredPlaylists();
        Ui.renderPlaylists(f_playlists);
    },

    // computed property
    async filteredPlaylists(page=1) {
        const filterText = this.nameFilter;
        const playlists = await Playlist.getList(page, filterText, this.userId);
        return playlists;
    },

    async setPlaylists() {
        const f_playlists = await this.filteredPlaylists(this.curr_page);
        Ui.renderPlaylists(f_playlists);
    }
};

window.addEventListener('load', async (le) => {
    Ui.setFilter("");
    await Ui.loadListTemplate();
    await data.setPlaylists();
});

Ui.searchInputEl.addEventListener('input', async (e) => { await data.setFilter(e.target.value); });
Ui.clearFilterEl.addEventListener('click', async (e) => { await data.setFilter(''); });
Ui.nextPageButton.addEventListener('click', async (e) => { data.curr_page += 1; await data.setPlaylists(); });
Ui.prevPageButton.addEventListener('click', async (e) => { data.curr_page -= 1; await data.setPlaylists(); });