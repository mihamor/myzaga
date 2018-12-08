import React, { Component } from 'react';
import './Playlists.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import ModalDelete from '../ModalDelete/ModalDelete';
import { FlexSection as Section, HeaderSection } from '../Sections/Sections';
import Spinner from '../Spinner/Spinner';
import {
  fetchPlaylists,
  fetchPlaylistById,
  setPlaylistOnView,
  fetchUpdatePlaylist,
  fetchCreatePlaylist,
  fetchDeletePlaylist,
  fetchUpdateData
} from '../actions/playlists';
import {
  fetchUserById
} from '../actions/users';
import {
  setTrack
} from '../actions/player';
import {
  fetchTracksAll,
} from '../actions/tracks';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import Select from 'react-select';

class Playlist extends Component {
  constructor(props) {
    super(props);

    // console.log("SHOW TRACK");
    // console.log(props.track);
    let { desc, _id, tracks } = props.playlist;
    this.desc = desc;
    this.id = _id;
    this.tracks = tracks;
    this.dispatch = props.dispatch;
    //this.state = {shouldUpdate:false};
  }


  render() {

    let uri_to_playlist = `/playlists/${this.id}`;
    return (
      <Link className="list-group-item d-flex justify-content-between align-items-center list-group-item-action list-group-item-secondary playlists-item"
        to={{ pathname: uri_to_playlist, state: { playlistOnView: this.props.playlist } }}>
        {this.desc}<span className="badge badge-primary badge-pill">{this.tracks.length}</span>
      </Link>);
  }
}




class PlaylistList extends Component {
  constructor(props) {
    super(props);
    this.state = { playlists: [], isLoading: true };
  }

  componentWillReceiveProps(props) {
    if (this.state.playlists === props.playlists) return;
    // console.log("RECEIVING PROPS VIEW PLAYLISTLIST");
    // console.log(props);
    this.setState({
      playlists: props.playlists ? props.playlists : [],
      isLoading: props.isLoading
    });
  }

  render() {
    let listPlaylists = null;
    let playlists = this.state.playlists;
    if (this.state.isLoading) listPlaylists = <div className="text-center"><Spinner /></div>;
    else if (playlists.length === 0) listPlaylists = <div className="text-center">Not found</div>;
    else listPlaylists = this.state.playlists.map((playlist) =>
      <Playlist key={playlist._id} playlist={playlist} />);
    return (
      <div className="col-lg-12 mx-auto bg-light border rounded track-list">
        <div>
          <ul className="list-group">
            {listPlaylists}
          </ul>
        </div>
      </div>
    );
  }
}

const SearchInfo = ({ onClick, filter }) => {
  if (!filter || filter === "") return "";
  return (
    <div id="search_info">
      Seacth results for: <span id="search_info_str">{filter}</span>
      <button id="clear_filter" className="close float-none"
        aria-label="Erase search" type="button"
        onClick={onClick} >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>);
}

function is_playlist_owner(user, playlist){
  return playlist.userRef.toString() === user._id.toString()
      || playlist.userRef._id.toString() === user._id.toString()
      || user.role;
}

function formUnSelectedArr(tracks, selected){
  let arr = [];
  for(let track of tracks){
      let flag = false;
      for(let sel of selected){
          if(sel._id.toString() === track._id.toString()) {
              flag = true;
              break;
          }
      }
      if(!flag) arr.push(track);
  }
  return arr;
}


class PlaylistsListPage extends Component {
  constructor(props) {
    super(props);
    this.isLoggedIn = props.user;

    let parsed = queryString.parse(this.props.location.search);
    // console.log(parsed.user); // replace param with your own 
    this.state = {
      userFilter: parsed.user,
      playlistsOnPage: props.playlistsOnPage ? props.playlistsOnPage : [],
      isLoading: props.isLoading ? props.isLoading : true,
      searchFilter: props.searchFilter ? props.searchFilter : "",
      pageCount: props.pageCount ? props.pageCount : 0,
      currentPage: props.currentPage ? props.currentPage : 0
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSearchSumbit = this.handleSearchSumbit.bind(this);
    this.handleEraseFilter = this.handleEraseFilter.bind(this);
    this.handleNextPageClick = this.handleNextPageClick.bind(this);
    this.handlePrevPageClick = this.handlePrevPageClick.bind(this);
    this.dispatch = props.dispatch;
  }

  componentWillMount() {
    this.dispatch(fetchPlaylists(0, "", this.state.userFilter));
  }

  componentWillReceiveProps(props) {
    // console.log("RECEIVING PROPS CONTAINER");
    // console.log(props);
    this.setState({
      playlistsOnPage: props.playlistsOnPage ? props.playlistsOnPage : [],
      isLoading: props.isLoading,
      searchFilter: props.searchFilter,
      pageCount: props.pageCount,
      currentPage: props.currentPage,
    });
  }

  handleSearchSumbit(event) {
    event.preventDefault();
    let searchFilter = this.state.searchFilter;
    // if(!searchFilter || searchFilter === "") return;
    this.dispatch(fetchPlaylists(0, searchFilter, this.state.userFilter));
  }
  handleFilterChange(event) {
    this.setState({ searchFilter: event.target.value });
  }
  handleEraseFilter(event) {
    event.preventDefault();
    this.dispatch(fetchPlaylists(0, "", this.state.userFilter));
  }
  handleNextPageClick(event) {
    event.preventDefault();
    this.dispatch(fetchPlaylists(this.state.currentPage + 1,
      this.props.searchFilter, this.state.userFilter));
  }
  handlePrevPageClick(event) {
    event.preventDefault();
    this.dispatch(fetchPlaylists(this.state.currentPage - 1,
      this.props.searchFilter, this.state.userFilter));
  }

  render() {



    if (!this.isLoggedIn) return <Redirect to="/auth/login" />;

    const search_info = <SearchInfo onClick={this.handleEraseFilter} filter={this.props.searchFilter} />;
    let page_info = this.state.pageCount !== 0 ?
      <span className="track-page-info">{this.state.currentPage} out of {this.state.pageCount}</span> : "";

    const next_page_button = this.state.currentPage < this.state.pageCount ?
      <button type="button" onClick={this.handleNextPageClick} id="next_page" className='btn btn-primary'>&raquo; Next page</button> : "";
    const prev_page_button = this.state.currentPage > 1 ?
      <button type="button" onClick={this.handlePrevPageClick} id="prev_page" className='btn btn-primary'>&laquo; Previous page</button> : "";

    let headerText = this.state.userFilter ? `Playlists for user` : 'Playlists';
    let playlistsList = <PlaylistList playlists={this.state.playlistsOnPage} isLoading={this.state.isLoading} />
    return (
      <div>
        <HeaderSection>
          <h3>{headerText}</h3>
        </HeaderSection>
        <Section>
          <input className="track-filter" type="search" value={this.state.searchFilter} onChange={this.handleFilterChange} id="search_field" name="search" placeholder="Search playlist..." />
          <button id="search" onClick={this.handleSearchSumbit} className="btn btn-primary track-search" type="button" >Search</button>
          {search_info}
          {playlistsList}
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="text-center">
                {prev_page_button}
                {page_info}
                {next_page_button}
              </div>
            </div>
          </div>
          <Link className="btn btn-primary float-right btn-add" to="/playlists/new">Add new playlist</Link>
        </Section>
      </div>);
  }
}


const playlistsapStateToProps = state => {
  // console.log("MAPPING TRACKS PAGE");
  //// console.log(state.loggedInUser);
  return {
    playlistsOnPage: state.playlists.playlistsOnPage,
    isLoading: state.playlists.isFetchingPlaylists,
    pageCount: state.playlists.pageCount,
    currentPage: state.playlists.currentPage,
    userFilterObj : state.users.userOnView,
    searchFilter: state.playlists.searchFilter
  };
}
const PlaylistsListPageContainer = withRouter(connect(
  playlistsapStateToProps,
)(PlaylistsListPage));



class PlaylistPage extends Component{
  constructor(props) {
    super(props);
    this.user = props.user;
    // console.log("PROPS ON PLAYLIST PAGE");
    // console.log(this.props);
    let cashedPlaylist = null;
    if(this.props.location.state)
      cashedPlaylist = this.props.location.state.playlistOnView;
    // console.log(cashedPlaylist);
    this.state = {
      isDeleted : false,
      playlistOnView: cashedPlaylist,
      isLoading: !cashedPlaylist,
      playlistOnViewId: props.match.params.id,
    };
    this.dispatch = props.dispatch;
    this.handleDelete = this.handleDelete.bind(this);
  }


  componentWillMount(){
    if(!this.state.playlistOnView)
      this.dispatch(fetchPlaylistById(this.state.playlistOnViewId));
    else this.dispatch(setPlaylistOnView(this.state.playlistOnView));
  }

  componentWillReceiveProps(props) {
    // console.log("RECEIVING PROPS TRACK CONTAINER");
    // console.log(props);
    this.setState({
      isDeleted : props.isDeleted,
      playlistOnView: props.playlistOnView,
      isLoading: props.isLoading
    });
  }


  handleDelete(){
    this.dispatch(fetchDeletePlaylist(this.state.playlistOnViewId));
  }

  render() {

    if(this.state.isDeleted) {
      // console.log("REDIRECT IF DELETED");
      return <Redirect to="/playlists"/>;
    }else if(!this.user) {
      // console.log("NOT LOGGED IN");
      return <Redirect to="/auth/login"/>;
    }


    let playlist = this.state.playlistOnView;
    // console.log("PLAYLITS IN PLAYLIST PAGE");
    // console.log(playlist);
    if(this.state.isLoading) {
      return (
        <div>
          <Section>
            <div className="text-center">
              <Spinner/>
            </div>
          </Section>
        </div>);
    }else if(!playlist)
      return (
        <div>
        <HeaderSection>
          <p className="lead">
          Error 404</p></HeaderSection>
          <Section>
            <h1>Something went wrong</h1>
          </Section>
        </div>        
      )

    let isOwner = is_playlist_owner(this.user, playlist);
    let linkToUser = `/users/${playlist.userRef._id}`;
    let linkToUpdate = `/playlists/update/${playlist._id}`;
    let operButtons = isOwner && !playlist.isUserUploads ?   // TODO MODAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL 
      <div>
        <hr/>
        <Link className ="btn btn-primary track-update-btn" to={linkToUpdate}>Update</Link>
        <div className ="float-right track-update-btn">
          <button className ="btn btn-primary" data-toggle="modal" data-target="#delete_modal" >
            Delete
          </button>
        </div>
        <ModalDelete onClick={this.handleDelete} name="playlist" id="delete_modal"/>
      </div> : "";

    let tracks = playlist.tracks && playlist.tracks.length !== 0 ? playlist.tracks.map(track => {
      let linkToTrack = `/tracks/${track._id}`;
      return (
        <Link className ="list-group-item list-group-item-action track-ref" to={linkToTrack}>
          <span className="text-primary">
            {track.author}
          </span> - {track.name}
        </Link>);
    })  : <div className="text-center">Empty playlist</div>;

    return(
      <div>
        <HeaderSection>
          <h1>{playlist.desc}</h1>
          <p className="lead">uploaded by <Link to={linkToUser}>{playlist.userRef.login}</Link></p>
        </HeaderSection>
        <Section>
          <div class="list-group track-list rounded w-100">
            {tracks}
          </div>
            {operButtons}
        </Section>
    </div>);
  }
}

const playlistMapStateToProps = state => {
  // console.log("MAPPING PLAYLIST PAGE");
  //// console.log(state.loggedInUser);
  return {
    isDeleted: state.playlists.isPlaylistDeleted,
    playlistOnView: state.playlists.playlistOnView,
    isLoading: state.playlists.isFetchingPlaylist ||
      state.playlists.isFetchingPlaylistDelete
  };
}

const PlaylistPageContainer = withRouter(connect(
  playlistMapStateToProps,
)(PlaylistPage));



class PlaylistUpdatePage extends Component {
   constructor(props){
     super(props);
     this.dispatch = props.dispatch;

    this.user = props.user;
    this.state = {
      playlist : null,
      isPlaylistUpdated : false,
      isLoading : !props.data.playlist,
      desc : props.data.playlist ? props.data.playlist.decs : null,
      tracks : props.data.playlist ? props.data.playlist.tracks : [],
      playlistId : props.match.params.id,
      allTracks : props.data.tracks ? props.data.tracks : []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handeTracksChange = this.handeTracksChange.bind(this);
  }

  handleDescChange (event) {
    this.setState({desc: event.target.value});
  }
  handeTracksChange (value) {
    this.setState({tracks: value});
  }

  handleSubmit(event){
    event.preventDefault();
    let new_pl = this.state;
    new_pl._id = new_pl.playlistId;
    // console.log("NEW PLAYLIST");
    new_pl.tracks = new_pl.tracks.map(track => track._id);
    // console.log(new_pl);
    this.dispatch(fetchUpdatePlaylist(new_pl));
  }


  componentWillMount(){
    this.dispatch(fetchUpdateData(this.state.playlistId))
  }

  componentWillReceiveProps(props){
    if(props.data && props.data.playlist && props.data.allTracks) {
      let {desc, tracks, _id} = props.data.playlist;
      let isLoading = props.isLoading;
      let isPlaylistUpdated = props.isPlaylistUpdated;
      this.setState({
        allTracks: props.data.allTracks,
        desc,
        playlist: props.data.playlist,
        tracks,
        playlistId: _id,
        isLoading,
        isPlaylistUpdated
      })
    }else {
      //let isLoading = props.isLoading;;
      //let isTrackUpdated = props.isTrackUpdated;
      this.setState({
        isLoading : props.isLoading,
        isPlaylistUpdated : props.isPlaylistUpdated});
    }
  }
  render(){
    if(this.state.isLoading)
      return(
        <div>
          <HeaderSection>
            <h1>Update playlist</h1>
          </HeaderSection>
          <Section>
            <div className="text-center">
              <Spinner/>
            </div>
          </Section>
        </div>);
    if(this.state.isPlaylistUpdated) {
      let linkToPlaylist = `/playlists/${this.state.playlistId}`;
      // console.log("REDIRECT TO "+ linkToPlaylist);
      return <Redirect to={linkToPlaylist}/>;
    }

   // let isOwner = is_playlist_owner(this.user, this.state.playlist);

    if(!this.state.playlist || !is_playlist_owner(this.user, this.state.playlist) ) return <Redirect to="/playlists"/>;

    let unselected = formUnSelectedArr(this.state.allTracks, this.state.tracks);
    return (
    <div>
      <HeaderSection>
        <h1>Update playlist</h1>
      </HeaderSection>

    <Section>
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
            <label forhtml="desc">Short description:</label>
            <input type="text" id="desc" name="desc" className="form-control" onChange={this.handleDescChange} value={this.state.desc}/>
        </div>
        <div className="form-group">
            <label forhtml="tracks">Tracks:</label>
            <Select
              isMulti
              name="tracks"
              options={unselected}
              value={this.state.tracks}
              getOptionLabel={({author, name}) => `${author} - ${name}`}
              getOptionValue={val => val}
              className="basic-multi-select"
              classNamePrefix="select"
              id="tracks"
              onChange={this.handeTracksChange}
              />
        </div>
            <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </Section>

    </div>);
  }
}

const playlistUpdMapStateToProps = state => {
  // console.log("MAPPING PLAYLIST UPDATE PAGE");
  // console.log(state.playlists);
  //// console.log(state.loggedInUser);
  return {
    isPlaylistUpdated : state.playlists.isPlaylistUpdated,
    data: state.playlists.updateData,
    isLoading: state.playlists.isFetchingPlaylist
  };
}
const PlaylistUpdatePageContainer = withRouter(connect(
  playlistUpdMapStateToProps,
)(PlaylistUpdatePage));




class PlaylistCreatePage extends Component {
  constructor(props){
    super(props);
    this.dispatch = props.dispatch;

   this.state = {
     isLoading : !props.isLoading,
     desc : "",
     tracks : [],
     allTracks : props.allTracks ? props.allTracks : [],
     playlistId : null
   };
   this.handleSubmit = this.handleSubmit.bind(this);
   this.handleDescChange = this.handleDescChange.bind(this);
   this.handeTracksChange = this.handeTracksChange.bind(this);
 }

 handleDescChange (event) {
   this.setState({desc: event.target.value});
 }
 handeTracksChange (value) {
   this.setState({tracks: value});
 }

 handleSubmit(event){
  event.preventDefault();
  let new_pl = this.state;
  new_pl._id = new_pl.playlistId;
  // console.log("NEW PLAYLIST");
  new_pl.tracks = new_pl.tracks.map(track => track._id);
  // console.log(new_pl);
  this.dispatch(fetchCreatePlaylist(new_pl));
 }


 componentWillMount(){
   this.dispatch(fetchTracksAll())
 }

componentWillReceiveProps(props){
  if(props.allTracks) {
    let isLoading = props.isLoading;
    let isPlaylistCreated = props.isPlaylistCreated;
    let plId = props.playlistId;
    this.setState({
      allTracks: props.allTracks,
      playlistId : plId,
      isLoading,
      isPlaylistCreated
    })
  }else {
    this.setState({
      isLoading : props.isLoading,
      isPlaylistUpdated : props.isPlaylistUpdated});
  }
}
 render(){
   if(this.state.isLoading)
     return(
       <div>
         <HeaderSection>
           <h1>Create playlist</h1>
         </HeaderSection>
         <Section>
           <div className="text-center">
             <Spinner/>
           </div>
         </Section>
       </div>);
   if(this.state.isPlaylistCreated) {
     let linkToPlaylist = `/playlists/${this.state.playlistId}`;
     // console.log("REDIRECT TO "+ linkToPlaylist);
     return <Redirect to={linkToPlaylist}/>;
   }


   //let unselected = formUnSelectedArr(this.state.allTracks, this.state.tracks);
   return (
   <div>
     <HeaderSection>
       <h1>Create playlist</h1>
     </HeaderSection>

   <Section>
     <form onSubmit={this.handleSubmit}>
       <div className="form-group">
           <label forhtml="desc">Short description:</label>
           <input type="text" id="desc" name="desc" className="form-control" onChange={this.handleDescChange} value={this.state.desc} required/>
       </div>
       <div className="form-group">
           <label forhtml="tracks">Tracks:</label>
           <Select
             isMulti
             name="tracks"
             options={this.state.allTracks}
             value={this.state.tracks}
             getOptionLabel={({author, name}) => `${author} - ${name}`}
             getOptionValue={val => val}
             className="basic-multi-select"
             classNamePrefix="select"
             id="tracks"
             onChange={this.handeTracksChange}
             />
       </div>
           <button type="submit" className="btn btn-primary">Submit</button>
     </form>
   </Section>

   </div>);
 }
}

const playlistNewMapStateToProps = state => {
 // console.log("MAPPING PLAYLIST NEW PAGE");
 // console.log(state.playlists);
 //// console.log(state.loggedInUser);
 return {
   isPlaylistCreated : state.playlists.isPlaylistCreated,
   allTracks: state.tracks.tracksOnPage,
   playlistId : state.playlists.newPlaylistId,
   isLoading: state.playlists.isFetchingPlaylistCreate ||
    state.tracks.isFetchingTracks
 };
}
const PlaylistCreatePageContainer = withRouter(connect(
  playlistNewMapStateToProps,
)(PlaylistCreatePage));

export {
  PlaylistsListPageContainer,
  PlaylistPageContainer,
  PlaylistUpdatePageContainer,
  PlaylistCreatePageContainer,
};