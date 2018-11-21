const Ui = {
    searchInputEl: document.getElementById('search_field'),
    searchInfoEl: document.getElementById('search_info'),
    searchInfoStrEl: document.getElementById('search_info_str'),
    clearFilterEl: document.getElementById('clear_filter'),
    filteredUsersEl: document.getElementById('user_table'),
    nextPageButton: document.getElementById('next_page'),
    prevPageButton: document.getElementById('prev_page'),
    pageInfoEl: document.getElementById('page_info'),
    noUsersEl: document.getElementById('no_users'),
    listTemplate: null,
    async loadListTemplate() {
        const response = await fetch('/templates/users.mst');
        console.log(response);
        this.listTemplate = await response.text();
        console.log(this.listTemplate);
    },

    setFilter(filter) { 
        this.processClearFilter(filter);
        this.searchInputEl.value = filter;
    },
    processClearFilter(filter){
        if(filter.length === 0) hideEl(this.searchInfoEl);
        else {
            this.searchInfoStrEl.innerHTML = filter;
            showEl(this.searchInfoEl);
        }
    },
    
    processPrevPageButton(curr_page){
        if(curr_page === 1) hideEl(this.prevPageButton);
        else showEl(this.prevPageButton);
    },
    processNextPageButton(curr_page, page_count){
        if(curr_page === page_count) hideEl(this.nextPageButton);
        else showEl(this.nextPageButton);
    },
    processPageInfo(curr_page, page_count){
        showEl(this.pageInfoEl);
        this.pageInfoEl.innerHTML = `${curr_page} out of ${page_count}`;
    },
    processNoUsers(length){
        if(!length){
            hideEl(this.nextPageButton);
            hideEl(this.prevPageButton);
            hideEl(this.pageInfoEl);
            showEl(this.noUsersEl);
        }else hideEl(this.noUsersEl);
    },

    renderUsers(users) {
        this.processNoUsers(users.users.length);
        if(users.users.length){
            this.processPrevPageButton(users.this_page);
            this.processNextPageButton(users.this_page, users.page_count);
            this.processPageInfo(users.this_page, users.page_count);
        }
        // update DOM
        const template = this.listTemplate;
        const data = { users: users.users };
        console.log(users);
        console.log(template);
        const renderedHTML = Mustache.render(template, data);
        console.log(renderedHTML);
        this.filteredUsersEl.innerHTML = renderedHTML;
    }
};