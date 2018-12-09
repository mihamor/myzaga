import { Switch, Route, Redirect } from 'react-router-dom'
import React, { Component } from 'react';
import {Home, About, ApiInfo, NoMatch} from '../Home/Home';
import Auth from '../Auth/Auth';
import '../Sections/Sections.css'
import {
  TrackListPageContainer as TrackListPage,
  TrackPageContainer as TrackPage,
  TrackUpdatePageContainer as TrackUpdatePage,
  TrackNewPageContainer as TrackNewPage,
} from '../Tracks/Tracks';

import AdminMenu from '../Admin/Admin';

import {
  PlaylistsListPageContainer as PlaylistListPage,
  PlaylistPageContainer as PlaylistPage,
  PlaylistUpdatePageContainer as PlaylistUpdatePage,
  PlaylistCreatePageContainer as PlaylistCreatePage
} from '../Playlists/Playlists';

import {
  UserTablePageContainer as UserTablePage,
  UserPageContainer as UserPage,
  UserUpdatePageContainer as UserUpdatePage
  // TrackUpdatePageContainer as TrackUpdatePage,
  // TrackNewPageContainer as TrackNewPage
} from '../Users/Users'



function checkIfTheSameUser(user1, user2){
    let isNull1 = !user1;
    let isNull2 = !user2;
    return (isNull2 && isNull1)
    || ((!isNull1 && !isNull2) 
    && (user1.login ===  user2.login));
}

const OpTrackRoute = ({user, socket}) => (
  <Switch>
    <Route
      path='/tracks/update/:id'
      render={props => <TrackUpdatePage user={user}/>}
    />
    <Route
      path='/tracks/new'
      render={props => <TrackNewPage user={user}/>}
    />
    <Route
      exact path='/tracks/:id'
      render={props => <TrackPage user={user} socket={socket}/>}
    />
  </Switch>
);

const TracksRoute = ({user, socket}) => (
  <Switch>
     <Route
        exact path='/tracks'
        render={props => <TrackListPage user={user}/>}
      />
      <Route
        path='/tracks/:id'
        render={props => <OpTrackRoute user={user} socket={socket}/>}
      />

  </Switch>
);

const OpUserRoute = ({user}) => (
  <Switch>
    <Route
      path='/users/update/:id'
      render={props => <UserUpdatePage user={user}/>}
    />
    <Route
      exact path='/users/:id'
      render={props => <UserPage user={user}/>}
    />
  </Switch>
);



const UsersRoute = ({user}) => (
  <Switch>
     <Route
        exact path='/users'
        render={props => <UserTablePage user={user}/>}
      />
      <Route
        path='/users/:id'
        render={props => <OpUserRoute user={user}/>}
      />

  </Switch>
);


const OpPlaylistRoute = ({user}) => (
  <Switch>
    <Route
      path='/playlists/update/:id'
      render={props => <PlaylistUpdatePage user={user}/>}
    />
    <Route
      path='/playlists/new'
      render={props => <PlaylistCreatePage user={user}/>}
    />
    <Route
      exact path='/playlists/:id'
      render={props => <PlaylistPage user={user}/>}
    />
  </Switch>
);

const PlaylistsRoute = ({user}) => (
  <Switch>
     <Route
        exact path='/playlists'
        render={props => <PlaylistListPage user={user}/>}
      />
      <Route
        path='/playlists/:id'
        render={props => <OpPlaylistRoute user={user}/>}
      />

  </Switch>
);






  // <Route
  // path='/tracks/:id(update)'
  // render={props => <About user={user}/>}
  // />
  // <Route
  // path='/tracks/:id(new)'
  // render={props => <ApiInfo user={user}/>}
  // />

class Main extends Component{
  constructor(props){
    super(props);
    this.state = {user: props.user};
    this.socket = props.socket;
    // console.log(props);
  }

  componentWillReceiveProps(props) {
    // console.log("SETTING ON MAIN NEW PROPS");
    const user = this.state.user;
    if (!checkIfTheSameUser(user, props.user)) {
        // console.log("SETTING ON MAIN NEW PROPS");
        this.setState({ user : props.user});
    }
  }

  render() {
    //// console.log(this.user);
    let path_to_user = this.state.user ?
       `/users/${this.state.user._id}` : "/auth/login";
    return (
        <main className="bg-gray">
          <Switch>
            <Route
              exact path="/"
              render={props => <Home user={this.state.user}/>}
            />
            <Route path='/about' component={About}/>
            <Route path='/profile' render={props => <Redirect to={path_to_user}/>}/>
            <Route path='/developer/v3' component={ApiInfo}/>
            <Route path='/admin_menu' render={props => <AdminMenu user={this.state.user}/>}/>
            <Route 
              path ='/tracks'
              render={props => <TracksRoute user={this.state.user} socket={this.socket}/>}
            />
            <Route 
              path ='/users'
              render={props => <UsersRoute user={this.state.user}/>}
            />
            <Route 
              path ='/playlists'
              render={props => <PlaylistsRoute user={this.state.user}/>}
            />
            <Route 
              path='/auth' 
              render={props => <Auth match='/auth'/>}
            />
            <Route component={NoMatch} />
          </Switch>
        </main>
    );
  }
}



export default Main;
