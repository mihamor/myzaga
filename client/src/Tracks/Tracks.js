import React, { Component } from 'react';
import './Tracks.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import ModalDelete from '../ModalDelete/ModalDelete';
import {Section, HeaderSection} from '../Sections/Sections';
import Spinner from '../Spinner/Spinner';
import {
  fetchTracks,
  fetchTrackById, 
  setTrackOnView, 
  fetchUpdateTrack, 
  fetchCreateTrack,
  fetchDeleteTrack
} from '../actions/tracks';
import {
  fetchCreateComment,
  fetchDeleteComment
} from '../actions/comments';
import {
  setTrack
} from '../actions/player';
import { Link, Redirect , withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
class Track extends Component{
  constructor(props) {
    super(props);

    // console.log("SHOW TRACK");
    // console.log(props.track);
    let {location, name, author, trackImage, _id} = props.track;
    this.audioUrl = location;
    this.name = name;
    this.author = author;
    this.imageUrl = trackImage;
    this.id = _id;
    this.dispatch = props.dispatch;
    this.handlePlayClick = this.handlePlayClick.bind(this);
    //this.state = {shouldUpdate:false};
  }

  handlePlayClick(){
    this.dispatch(setTrack(this.props.track));
  }


  render() {

    // <audio className="track-name" controls>
    //   <source src={this.audioUrl} type="audio/mpeg"/> Your browser does not support the audio element.
    // </audio>



    let uri_to_track = `/tracks/${this.id}`;
    return(
      <div>
        <div className="row">
            <div className="col-md-4">
              <Link to={{ pathname:uri_to_track, state:{ trackOnView : this.props.track } }}>
                <img className="img-fluid rounded-1 track-img" src={this.imageUrl} alt="Track"/>
              </Link>
            </div>
          <div className="col-md-7 bg-light rounded track-border">
            <h3 className="text-primary track-name text-center">{this.name}</h3>
            <p className="track-name text-center" >by {this.author}</p>
            <button className="btn btn-primary float-left track-link" onClick={this.handlePlayClick}>Play track</button> 
            <Link 
              className="btn btn-primary float-right track-link" 
              to={{pathname:uri_to_track,state:{trackOnView : this.props.track}}}>
              View track
            </Link>
          </div>
          <hr/>
        </div>
        <hr/>
      </div>);
  }
}

const TrackContainer = connect()(Track);




class TrackList extends Component {
  constructor(props) {
    super(props);
    this.state = {tracks:[], isLoading:true};
  }

  componentWillReceiveProps(props) {
    if(this.state.tracks === props.tracks) return;
    // console.log("RECEIVING PROPS VIEW TRACKLIST");
    // console.log(props);
    this.setState({
      tracks: props.tracks ? props.tracks : [],
      isLoading: props.isLoading
    });
  }

  render() {
    let listTracks = null;
    let tracks = this.state.tracks;
    if(this.state.isLoading) listTracks = <div className="text-center"><Spinner/></div>;
    else if(tracks.length === 0) listTracks = <div className="text-center">Not found</div>;
    else listTracks = this.state.tracks.map((track) => <TrackContainer key={track._id} track={track}/>);//<Track key={tracks[0]._id} track={tracks[0]}/>;
    return(
      <div className="track-list-wrap bg-gray" id="trackList" >
        <hr/>
        {listTracks}
      </div>
    );
  }
}






const SearchInfo = ({onClick, filter}) => {
  if(!filter || filter === "") return "";
  return (
  <div id="search_info">
      Seacth results for: <span id="search_info_str">{filter}</span>
      <button id="clear_filter"className="close float-none"
        aria-label="Erase search" type="button"
        onClick={onClick} >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>);
}




class TrackListPage extends Component{
  constructor(props) {
    super(props);
    this.isLoggedIn = props.user;
    this.state = {
      tracksOnPage:props.tracksOnPage ? props.tracksOnPage : [],
      isLoading: props.isLoading ? props.isLoading : true,
      searchFilter: props.searchFilter ? props.searchFilter : "" ,
      pageCount : props.pageCount ? props.pageCount : 0,
      currentPage: props.currentPage ? props.currentPage : 0
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSearchSumbit = this.handleSearchSumbit.bind(this);
    this.handleEraseFilter = this.handleEraseFilter.bind(this);
    this.handleNextPageClick = this.handleNextPageClick.bind(this);
    this.handlePrevPageClick = this.handlePrevPageClick.bind(this);
    this.dispatch = props.dispatch;
  }

  componentWillMount(){
    this.dispatch(fetchTracks(0,""));
  }

  componentWillReceiveProps(props) {
    // console.log("RECEIVING PROPS CONTAINER");
    // console.log(props);
    this.setState({
      tracksOnPage: props.tracksOnPage ? props.tracksOnPage : [],
      isLoading: props.isLoading,
      searchFilter: props.searchFilter,
      pageCount : props.pageCount,
      currentPage : props.currentPage,
    });
  }

  handleSearchSumbit(event){
    event.preventDefault();
    let searchFilter = this.state.searchFilter;
    // if(!searchFilter || searchFilter === "") return;
    this.dispatch(fetchTracks(0, searchFilter));
  }
  handleFilterChange (event) {
    this.setState({searchFilter: event.target.value});
  }
  handleEraseFilter(event){
    event.preventDefault();
    this.dispatch(fetchTracks(0, ""));
  }
  handleNextPageClick(event){
    event.preventDefault();
    this.dispatch(fetchTracks(this.state.currentPage+1, this.props.searchFilter));
  }
  handlePrevPageClick(event){
    event.preventDefault();
    this.dispatch(fetchTracks(this.state.currentPage-1, this.props.searchFilter));
  }

  render() {
      if(!this.isLoggedIn)return <Redirect to="/auth/login" />;

      const search_info = <SearchInfo onClick={this.handleEraseFilter} filter={this.props.searchFilter}/>;
      let page_info = this.state.pageCount !== 0 ? 
      <span className="track-page-info">{this.state.currentPage} out of {this.state.pageCount}</span> : "";

      const next_page_button = this.state.currentPage < this.state.pageCount ?
        <button type ="button" onClick={this.handleNextPageClick} id="next_page"  className='btn btn-primary'>&raquo; Next page</button> : "";
      const prev_page_button = this.state.currentPage > 1 ?
        <button type ="button" onClick={this.handlePrevPageClick} id="prev_page" className='btn btn-primary'>&laquo; Previous page</button> : "";

      let trackList = <TrackList tracks={this.state.tracksOnPage} isLoading={this.state.isLoading}/>
      return(
        <div>
          <Section>
            <form onSubmit={this.handleSearchSumbit} className="form-inline">       
              <div class="form-group col-lg-10 ">
                <input className="form-control w-100"type="search" value={this.state.searchFilter} onChange={this.handleFilterChange} id="search_field" name="search" placeholder="Search track..." />
              </div>
              <button id="search" className="btn btn-primary track-search" type="submit" >Search</button>
            </form>
            {search_info}
            <div>
              {trackList}
              <Link className ="btn btn-primary float-right" to="/tracks/new">Add new track</Link>
            </div>
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <div className="text-center">
                    {prev_page_button}
                    {page_info}
                    {next_page_button}
                </div>
              </div>
            </div>
          </Section>
        </div>);
  }
}


const tracksMapStateToProps = state => {
  // console.log("MAPPING TRACKS PAGE");
  //// console.log(state.loggedInUser);
  return {
    tracksOnPage: state.tracks.tracksOnPage,
    isLoading: state.tracks.isFetchingTracks,
    pageCount: state.tracks.pageCount,
    currentPage: state.tracks.currentPage,
    searchFilter: state.tracks.searchFilter
  };
}
const TrackListPageContainer = withRouter(connect(
  tracksMapStateToProps,
)(TrackListPage));



function is_track_owner(user, track){
  return track.uploadedListRef.toString() === user.uploaded_tracks.toString()
    || track.uploadedListRef._id.toString() === user.uploaded_tracks.toString() 
    || user.role;
}
function is_comment_owner(user, comm){
  return (comm.user._id.toString() === user._id.toString() 
    || user.role)
}



const Comment = ({comment, isOwner, onClick}) => {
  let owner = isOwner;
  let {user, addedAt, content} = comment;
  let delButton = owner ? 
    <button onClick={onClick} className="btn btn-primary float-right">Delete</button> : "";
  let linkToUser = `/users/${user._id}`;
  return (
    <div className="col-lg-12 mx-auto float-left  bg-gray rounded comment-body">
      <Link to={linkToUser}>{user.login}</Link>
      <span> added at: {addedAt}</span>
      <hr/>
      <div className="rounded-1 com">
        {content}
      </div>
      {delButton}
    </div>);
}





class TrackPage extends Component{
  constructor(props) {
    super(props);
    this.user = props.user;
    // console.log("PROPS ON TRACK PAGE");
    // console.log(this.props);
    let cashedTrack = null;
    if(this.props.location.state)
      cashedTrack = this.props.location.state.trackOnView;
    // console.log(cashedTrack);
    this.state = {
      isDeleted : false,
      trackOnView: cashedTrack,
      isLoading: !cashedTrack,
      trackOnViewId: props.match.params.id,
      commentText : "",
    };
    this.dispatch = props.dispatch;
    this.handleDelete = this.handleDelete.bind(this);
    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.handleCommentAdd = this.handleCommentAdd.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
  }


  componentWillMount(){
    if(!this.state.trackOnView)
      this.dispatch(fetchTrackById(this.state.trackOnViewId));
    else this.dispatch(setTrackOnView(this.state.trackOnView));
  }

  componentWillReceiveProps(props) {
    // console.log("RECEIVING PROPS TRACK CONTAINER");
    // console.log(props);
    if(props.isAddedComment || props.isDeletedComment) //refetch
      this.dispatch(fetchTrackById(this.state.trackOnViewId))
    else this.setState({
      isDeleted : props.isDeleted,
      trackOnView: props.trackOnView,
      isLoading: props.isLoading,
    });
  }

  handlePlayClick(){
    this.dispatch(setTrack(this.state.trackOnView));
  }
  handleCommentAdd(event){
    event.preventDefault();
    let commentText = this.state.commentText;
    this.dispatch(fetchCreateComment({commentText}, this.state.trackOnViewId));
  }
  handleCommentChange(event){
    this.setState({commentText : event.target.value});
  }


  handleDelete(){
    this.dispatch(fetchDeleteTrack(this.state.trackOnViewId));
  }

  render() {

    if(this.state.isDeleted) {
      // console.log("REDIRECT IF DELETED");
      return <Redirect to="/tracks"/>;
    }


    let track = this.state.trackOnView;
    // console.log("TRACK IN TRACK PAGE");
    // console.log(track);
    if(this.state.isLoading) {
      return (
        <div>
          {/* <HeaderSection>
            <p className="lead">
              Loading Track...
            </p>
          </HeaderSection> */}
          <Section>
            <div className="text-center">
              <Spinner/>
            </div>
          </Section>
        </div>);
    }else if(!track)
      return <HeaderSection><p className="lead">Error fetching</p></HeaderSection>;

    let isOwner = is_track_owner(this.user, track);
    let userPlaylistRef = `/playlists/${track.uploadedListRef._id}`;
    let linkToUpdate = `/tracks/update/${track._id}`;
    let operButtons = isOwner ?   // TODO MODAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL 
      <div>
        <hr/>
        <Link className ="btn btn-primary track-update-btn" to={linkToUpdate}>Update</Link>
        <div className ="float-right track-update-btn">
          <button className ="btn btn-primary" data-toggle="modal" data-target="#delete_modal" >
            Delete
          </button>
          <ModalDelete onClick={this.handleDelete} name="track" id="delete_modal"/>
        </div>
      </div> : "";

    track.comments = track.comments.sort( (a , b) => {
      return new Date(b.addedAt) - new Date(a.addedAt);
    });

    let comments = track.comments.map(comm => {

      let onClickButton = () => {
        let id = comm._id;
        let trackId = track._id;
        this.dispatch(fetchDeleteComment(id, trackId));
      }

      let isOwnerComment = is_comment_owner(this.user, comm);
      return <Comment key={comm._id} comment={comm} isOwner={isOwnerComment} onClick={onClickButton}/>
    });

    return(
      <div>
        <HeaderSection>
          <img className="rounded-circle float-center track-img" src={track.trackImage} alt="Track Cover"/>
            <h1>{track.name}</h1>
          <p className="lead">by {track.author}</p>
        </HeaderSection>
        <Section>
          <div className="list-group track-list bg-light rounded">
            <div className="list-group-item list-group-item-info">{track.name}</div>
            <div className="list-group-item">by {track.author}</div>
            <div className="list-group-item">year: {track.year}</div>
            <div className="list-group-item">album: {track.album}</div>
            <div className="list-group-item">
              Uploaded by: 
              <Link className="action-button" to={userPlaylistRef}>
                {track.uploadedListRef.userRef.login}
              </Link>
            </div>
            <button className="btn btn-primary w-100" onClick={this.handlePlayClick}>Play track</button>
          </div>
            {operButtons}
        </Section>
        <Section>
          <form onSubmit={this.handleCommentAdd}>
            <div className="form-group">
              <label forhtml="comment-cont">Comment:</label>
              <textarea type="text" className="form-control" id="comment-cont" onChange={this.handleCommentChange} value={this.state.commentText} placeholder="Leave a comment..." name="commentText"></textarea>
            </div>
            <button type="submit" className="btn btn-primary float-right">Submit</button>
          </form>
          <div className="row">
            <div className="col-lg-12 mx-auto">
            <h3>Comments:</h3>
              {comments}
            </div>
          </div>
        </Section>
    </div>);
  }
}

const trackMapStateToProps = state => {
  // console.log("MAPPING TRACK PAGE");
  //// console.log(state.loggedInUser);
  return {
    isDeleted: state.tracks.isTrackDeleted,
    trackOnView: state.tracks.trackOnView,
    isLoading: state.tracks.isFetchingTrack ||
      state.tracks.isFetchingTrackDelete,
    isAddedComment : state.tracks.isCreatedComment,
    isDeletedComment : state.tracks.isDeletedComment
  };
}

const TrackPageContainer = withRouter(connect(
  trackMapStateToProps,
)(TrackPage));



class TrackUpdatePage extends Component {
  constructor(props){
    super(props);
    this.dispatch = props.dispatch;
    
    this.state = {
      isTrackUpdated : false,
      isLoading : !props.track,
      author : props.track ? props.track.author : null,
      name : props.track ? props.track.name : null,
      album : props.track ? props.track.album : null,
      year : props.track ? props.track.year : null,
      trackId : props.track ? props.track._id : props.match.params.id 
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleAuthorChange = this.handleAuthorChange.bind(this);
    this.handleAlbumChange = this.handleAlbumChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
  }

  handleNameChange (event) {
    this.setState({name: event.target.value});
  }
  handleAuthorChange (event) {
    this.setState({author: event.target.value});
  }
  handleAlbumChange (event) {
    this.setState({album: event.target.value});
  }
  handleYearChange (event) {
    this.setState({year: event.target.value});
  }

  handleSubmit(event){
    event.preventDefault();
    let new_track = this.state;
    new_track._id = new_track.trackId;
    // console.log("NEW TRACK");
    // console.log(new_track);
    this.dispatch(fetchUpdateTrack(new_track));
  }


  componentWillMount(){
    if(!this.props.track){
      this.dispatch(fetchTrackById(this.state.trackId))
    }
  }

  componentWillReceiveProps(props){
    if(props.track) {
      let {author, name, album, year, _id} = props.track;
      let isLoading = props.isLoading;
      let isTrackUpdated = props.isTrackUpdated;
      this.setState({
        author,
        name,
        album,
        year,
        trackId: _id,
        isLoading,
        isTrackUpdated
      })
    }else {
      //let isLoading = props.isLoading;;
      //let isTrackUpdated = props.isTrackUpdated;
      this.setState({
        isLoading : props.isLoading,
        isTrackUpdated : props.isTrackUpdated});
    }
  }
  render(){
    if(this.state.isLoading)
      return(
        <div>
          <HeaderSection>
            <h1>Update</h1>
          </HeaderSection>
          <Section>
            <div className="text-center">
              <Spinner/>
            </div>
          </Section>
        </div>);
    if(this.state.isTrackUpdated) {
      let linkToTrack = `/tracks/${this.state.trackId}`;
      // console.log("REDIRECT TO "+ linkToTrack);
      return <Redirect to={linkToTrack}/>;
    }
    return (
    <div>
      <HeaderSection>
        <h1>Update track</h1>
      </HeaderSection>

    <Section>
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
            <label forhtml="author">Author:</label>
            <input type="text" className="form-control" onChange={this.handleAuthorChange} id="author" value={this.state.author} name="author"/>
        </div>
        <div className="form-group">
            <label forhtml="name">Name:</label>
            <input type="text" className="form-control" onChange={this.handleNameChange} id="name" value={this.state.name} name="name"/>
        </div>
        <div className="form-group">
            <label forhtml="author">Album:</label>
            <input type="text" className="form-control" onChange={this.handleAlbumChange} id="album" value={this.state.album} name="album"/>
        </div>
        <div className="form-group">
            <label forhtml="year">Year:</label>
            <input type="number" className="form-control" onChange={this.handleYearChange} id="year" value={this.state.year} name="year"/>
        </div>
            <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </Section>

    </div>);
  }
}

const trackUpdMapStateToProps = state => {
  // console.log("MAPPING TRACK UPDATE PAGE");
  // console.log(state.tracks);
  //// console.log(state.loggedInUser);
  return {
    isTrackUpdated : state.tracks.isTrackUpdated,
    track: state.tracks.trackOnView,
    isLoading: state.tracks.isFetchingTrackUpdate
  };
}
const TrackUpdatePageContainer = withRouter(connect(
  trackUpdMapStateToProps,
)(TrackUpdatePage));











class TrackCreatePage extends Component {
  constructor(props){
    super(props);
    this.dispatch = props.dispatch;
    
    this.state = {
      author : props.track ? props.track.author : null,
      name : props.track ? props.track.name : null,
      album : props.track ? props.track.album : null,
      year : props.track ? props.track.year : null,
      trackId : props.track ? props.track._id : props.match.params.id,
      trackCreated : false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    /*this.handleNameChange = this.handleNameChange.bind(this);
    this.handleAuthorChange = this.handleAuthorChange.bind(this);
    this.handleAlbumChange = this.handleAlbumChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);*/
  }

 /* handleNameChange (event) {
    this.setState({name: event.target.value});
  }
  handleAuthorChange (event) {
    this.setState({author: event.target.value});
  }
  handleAlbumChange (event) {
    this.setState({album: event.target.value});
  }
  handleYearChange (event) {
    this.setState({year: event.target.value});
  }
*/
  handleSubmit(event){
    event.preventDefault();
    let formEl = event.target;
    //let formData = new FormData(formEl);
    // console.log("FORM DATA");
    // console.log(formData);
    //let actual_FormData = {};

    let formData = new FormData();
    formData.append("author", formEl.elements["author"].value);
    formData.append("name", formEl.elements["name"].value);
    formData.append("album", formEl.elements["album"].value);
    formData.append("year", formEl.elements["year"].value);
    formData.append("image", formEl.elements["image"].files[0]);
    formData.append("track", formEl.elements["track"].files[0]);

    this.dispatch(fetchCreateTrack(formData));
  }


  componentWillMount(){
    // if(!this.props.track){
    //   this.dispatch(fetchTrackById(this.state.trackId))
    // }
  }

  componentWillReceiveProps(props){
    if(props.track) {
      let {author, name, album, year, _id} = props.track;
      let isLoading = props.isLoading;
      let trackCreated = true;
      this.setState({
        author,
        name,
        album,
        year,
        trackId: _id,
        isLoading,
        trackCreated
      })
    }else {
      let isLoading = props.isLoading;;
      this.setState({isLoading});
    }
  }
  render(){


    let header =(
      <HeaderSection>
        <h1>Create new track</h1>
      </HeaderSection>
    );

    if(this.state.trackCreated){
      let linkToTrack = `/tracks/${this.state.trackId}`;
      return <Redirect to={linkToTrack}/>;
    }
    if(this.state.isLoading){
      return (
        <div>
          {header}
          <Section>
            <div className="text-center">
            <Spinner/>
            </div>
          </Section>
        </div>
      );
    }



    return (
    <div>
      {header}

    <Section>
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
            <label forhtml="author">Author:</label>
            <input type="text" className="form-control" id="author" required name="author"/>
        </div>
        <div className="form-group">
            <label forhtml="name">Name:</label>
            <input type="text" className="form-control" id="name" required name="name"/>
        </div>
        <div className="form-group">
            <label forhtml="author">Album:</label>
            <input type="text" className="form-control" id="album" required name="album"/>
        </div>
        <div className="form-group">
            <label forhtml="year">Year:</label>
            <input type="number" className="form-control" id="year" required name="year"/>
        </div>
        <div className="form-group">
            <label forhtml="timage">Select track image:</label>
            <input type="file" id="timage" name="image" accept="image/*" required/>
        </div>
        <div className="form-group">
            <label forhtml="tfile">Select track:</label>
            <input type="file" id="tfile" name="track" accept = "audio/*" required/>
        </div>
            <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </Section>

    </div>);
  }
}

const trackNewMapStateToProps = state => {
  // console.log("MAPPING TRACK UPDATE PAGE");
  // console.log(state.tracks);
  //// console.log(state.loggedInUser);
  return {
    track: state.tracks.isTrackCreated,
    isLoading: state.tracks.isFetchingTrackCreate,
  };
}
const TrackNewPageContainer = withRouter(connect(
  trackNewMapStateToProps,
)(TrackCreatePage));













export {TrackListPageContainer, TrackPageContainer, TrackUpdatePageContainer, TrackNewPageContainer};