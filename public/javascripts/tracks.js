const data = {
    _nameFilter: "",
    curr_page: 1,

    get nameFilter() {
        return this._nameFilter.toLowerCase().trim();
    },
    async setFilter(value) {
        this.curr_page = 1;
        this._nameFilter = value;
        Ui.setFilter(this.nameFilter);
        const f_tracks = await this.filteredTracks();
        Ui.renderTracks(f_tracks);
    },

    // computed property
    async filteredTracks(page=1) {
        const filterText = this.nameFilter;
        const tracks = await Track.getList(page, filterText);
        return tracks;
    },

    async setTracks() {
        const f_tracks = await this.filteredTracks(this.curr_page);
        Ui.renderTracks(f_tracks);
    }
};

window.addEventListener('load', async (le) => {
    Ui.setFilter("");
    await Ui.loadListTemplate();
    await data.setTracks();
});

Ui.searchInputEl.addEventListener('input', async (e) => { await data.setFilter(e.target.value); });
Ui.clearFilterEl.addEventListener('click', async (e) => { await data.setFilter(''); });
Ui.nextPageButton.addEventListener('click', async (e) => { data.curr_page += 1; await data.setTracks(); });
Ui.prevPageButton.addEventListener('click', async (e) => { data.curr_page -= 1; await data.setTracks(); });