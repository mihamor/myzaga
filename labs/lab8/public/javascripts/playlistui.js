const Ui = {
    searchInputEl: document.getElementById('search_field'),
    searchInfoEl: document.getElementById('search_info'),
    searchInfoStrEl: document.getElementById('search_info_str'),
    clearFilterEl: document.getElementById('clear_filter'),
    filteredPlaylistsEl: document.getElementById('playlists_list'),
    nextPageButton: document.getElementById('next_page'),
    prevPageButton: document.getElementById('prev_page'),
    pageInfoEl: document.getElementById('page_info'),
    noPlaylistsEl: document.getElementById('no_playlists'),
    listTemplate: null,
    async loadListTemplate() {
        const response = await fetch('/templates/playlists.mst');
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
    processNoPlaylists(length){
        if(!length){
            hideEl(this.nextPageButton);
            hideEl(this.prevPageButton);
            hideEl(this.pageInfoEl);
            showEl(this.noPlaylistsEl);
        }else hideEl(this.noPlaylistsEl);
    },

    renderPlaylists(playlists) {
        this.processNoPlaylists(playlists.playlists.length);
        if(playlists.playlists.length){
            this.processPrevPageButton(playlists.this_page);
            this.processNextPageButton(playlists.this_page, playlists.page_count);
            this.processPageInfo(playlists.this_page, playlists.page_count);
        }
        // update DOM
        const template = this.listTemplate;
        const data = { playlists: playlists.playlists };
        console.log(playlists);
        console.log(template);
        const renderedHTML = Mustache.render(template, data);
        console.log(renderedHTML);
        this.filteredPlaylistsEl.innerHTML = renderedHTML;
    }
};