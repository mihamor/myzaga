import React, { Component } from 'react';
import './App.css';
import Navbar from '../Navbar/Navbar';
import Main from '../Main/Main'
import Player from '../Player/Player';
import UserApi from '../Api/UserApi.js'
import PlaylistApi from '../Api/PlaylistApi.js'
//import { fetchLoginUser, fetchAuth } from '../actions/auth';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
UserApi.setHostName('http://localhost:3016');
PlaylistApi.setHostName('http://localhost:3016');


const Footer = () => (
  <footer className="py-5 bg-dark">
    <div className="container">
      <p className="m-0 text-center text-white">Copyright &copy; MyZaGa 2018-2019</p>
    </div>  
  </footer>
);

function checkIfTheSameUser(user1, user2){
  let isNull1 = !user1;
  let isNull2 = !user2;
  return (isNull2 && isNull1)
  || ((!isNull1 && !isNull2) 
  && (user1.login ===  user2.login));
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {user: props.user};
  }

  componentWillReceiveProps(props) {
    const user = this.state.user;
  
    if (!checkIfTheSameUser(user, props.user)) {
      this.setState({user: props.user});
    }
  }
  render() {
    // console.log("FULL APP RENDER");
    // console.log("USER IN APP CLASS");
    // console.log(this.state.user);
    //<Footer user={this.state.user} />
    return (
      <div className="App">
        <Navbar user={this.state.user}  />
        <Main user={this.state.user}/>
        <Player user={this.state.user} />
      </div>
    );
  }
}

class AppWrapper extends Component {
  constructor(props){
    super(props);
    this.state = {isLoaded : false, user: null};
  }

  
  componentWillReceiveProps(props) {
    // console.log("SETTING ON APP_WRAPPER NEW PROPS");
    const user = this.state.user;
    if (!checkIfTheSameUser(user, props.user)) {
        this.setState({user: props.user, isLoaded : true});
    }else this.setState({isLoaded: props.isLoaded});
  }
  render() {
    if(!this.state.isLoaded) return (<div>Loading..</div>);
    const user = this.state.user;
    // console.log("IN APP WRAPPER USER");
    // console.log(user);
    return <App user={user}/>;
  }
}
const mapStateToProps = state => {
  // console.log("MAPPING");
  // console.log(state.loggedInUser);
  return {
    user: state.auth.loggedInUser,
    isLoaded: !state.auth.isFetchingAuth
  };
}
export default withRouter( connect(
  mapStateToProps,
)(AppWrapper));