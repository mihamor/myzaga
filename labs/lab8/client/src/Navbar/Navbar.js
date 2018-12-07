import React, { Component } from 'react';
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { Link } from 'react-router-dom'

function NavbarButton(props) {
  return (
    <li className="nav-item">
      <Link className="nav-link js-scroll-trigger" to={props.to}>{props.text}</Link>
    </li>
  );
}
function NavbarDropdownButton(props) {
  return (
    <li>
      <Link className="btn" to={props.to}>{props.text}</Link>
    </li>
  );
}
function checkIfTheSameUser(user1, user2) {
  let isNull1 = !user1;
  let isNull2 = !user2;
  return (isNull2 && isNull1)
    || ((!isNull1 && !isNull2)
      && (user1.login === user2.login));
}


class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = { user: props.user, isLoggedIn: props.user ? true : false };
  }

  componentWillReceiveProps(props) {
    const user = this.state.user;
    if (!checkIfTheSameUser(user, props.user)) {
      // console.log("SETTING ON NAVBAR NEW PROPS");
      this.setState({ user: props.user, isLoggedIn: props.user ? true : false });
    }
  }



  render() {

    let buttons;
    if (!this.state.isLoggedIn) {
      buttons =
        <ul className="navbar-nav ml-auto">
          <NavbarButton to="/about" text="About" />
          <NavbarButton to="/auth/login" text="Login" />
        </ul>
    } else {
      let isAdminDropDown = this.state.user.role === 1 ?
        <NavbarDropdownButton to="/admin_menu" text="Admin menu" /> : "";
      let isAdminList = this.state.user.role === 1 ?
        <NavbarButton to="/users" text="Users" /> : "";

      let dropdown =
        <li className="dropdown">
          <Link className="nav-link dropdown-toggle" to="/profile" data-toggle="dropdown" id="profileDrop">
            <span className="caret">{this.state.user.login}</span>
          </Link>
          <ul className="dropdown-menu">
            <NavbarDropdownButton to="/profile" text="Profile" />
            {isAdminDropDown}
            <NavbarDropdownButton to="/auth/logout" text="Logout" />
          </ul>
        </li>
      buttons =
        <ul className="navbar-nav ml-auto">
          <NavbarButton to="/about" text="About" />
          <NavbarButton to="/tracks" text="Tracks" />
          <NavbarButton to="/playlists" text="Playlists" />
          {isAdminList}
          {dropdown}
        </ul>
    }

    return (
      <nav className="navbar navbar-inverse navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
        <div className="container">
          <div className="js-scroll-trigger">
            <Link className="navbar-brand js-scroll-trigger" to="/">MyZaGa<img src="/images/logo.png" alt="Logo" className="img-logo"></img></Link>
          </div>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            {buttons}
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
