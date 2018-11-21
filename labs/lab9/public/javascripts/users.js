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
        const f_users = await this.filteredUsers();
        Ui.renderUsers(f_users);
    },

    // computed property
    async filteredUsers(page=1) {
        const filterText = this.nameFilter;
        const users = await User.getList(page, filterText);
        return users;
    },

    async setUsers() {
        const f_users = await this.filteredUsers(this.curr_page);
        Ui.renderUsers(f_users);
    }
};

window.addEventListener('load', async (le) => {
    Ui.setFilter("");
    await Ui.loadListTemplate();
    await data.setUsers();
});

Ui.searchInputEl.addEventListener('input', async (e) => { await data.setFilter(e.target.value); });
Ui.clearFilterEl.addEventListener('click', async (e) => { await data.setFilter(''); });
Ui.nextPageButton.addEventListener('click', async (e) => { data.curr_page += 1; await data.setUsers(); });
Ui.prevPageButton.addEventListener('click', async (e) => { data.curr_page -= 1; await data.setUsers(); });