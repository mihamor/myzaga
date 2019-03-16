import React, { Component } from 'react';
import './Player.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

function checkIfTheSameUser(user1, user2) {
  let isNull1 = !user1;
  let isNull2 = !user2;
  return (isNull2 && isNull1)
    || ((!isNull1 && !isNull2)
      && (user1.login === user2.login));
}

function checkIfTheSameTrack(track1, track2) {
  let isNull1 = !track1;
  let isNull2 = !track2;
  return (isNull2 && isNull1)
    || ((!isNull1 && !isNull2)
      && (track1._id === track2._id)
      && (track1.name === track2.name));
}



class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      isLoggedIn: props.user ? true : false,
      trackUrl: props.track ? props.track.location : null,
      name: props.track ? props.track.name : null,
      author: props.track ? props.track.author : null,
    };
  }

  componentWillReceiveProps(props) {
    const user = this.state.user;
    if(!checkIfTheSameUser(user, props.user) 
    || !checkIfTheSameTrack(props.track, this.props.track)) {
      console.log("SETTING ON PLAYER NEW PROPS");

      this.setState({
        user: props.user,
        isLoggedIn: props.user ? true : false,
        trackUrl: props.track ? props.track.location : null,
        name: props.track ? props.track.name : null,
        author: props.track ? props.track.author : null,
      }, () => {
        if(props.user){
          this.refs.audio.pause();
          this.refs.audio.load();
          this.refs.audio.play();
          console.log(this.refs.audio.readyState);
        }
      });
      console.log(this.state);
    }

  }

  render() {
    if (!this.state.isLoggedIn)
      return null;
    let name = this.state.name ? 
      `${this.state.name} - ${this.state.author}` : "Select track...";

    console.log(this.state.trackUrl);
    let shouldShow = !this.state.trackUrl ;
    let audioEl =
      <audio className="player-audio" controls ref="audio" hidden={shouldShow}>
        <source src={this.state.trackUrl} type='audio/mpeg'/>
        Your browser does not support the audio element.
      </audio>;
    return (
      <div className="fixed-bottom bg-dark player float-left text-white">
        <p>{name}</p>
        {audioEl}
      </div>);
  }
}

const playerMapStateToProps = state => {
  console.log("MAPPING PLAYER SETTING");
  //console.log(state.loggedInUser);
  return {
    track: state.player.trackOnPlay,
  };
}





const PlayerContainer = withRouter(connect(
  playerMapStateToProps,
)(Player));



export default PlayerContainer;
