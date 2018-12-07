import React, { Component } from 'react';
import './Users.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { Section, HeaderSection } from '../Sections/Sections';
import Spinner from '../Spinner/Spinner';
import {
  fetchUsers,
  fetchUserById,
  setUserOnView,
  fetchUpdateUser
} from '../actions/users';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
class User extends Component {
  constructor(props) {
    super(props);

    console.log("SHOT USER");
    console.log(props.user);
    let { _id, avaUrl, login, role, fullname, registeredAt } = props.user;
    this.avaUrl = avaUrl;
    this.fullname = fullname;
    this.role = role;
    this.login = login;
    this.registeredAt = registeredAt;
    this.id = _id;
    //this.state = {shouldUpdate:false};
  }

  render() {
    let uri_to_user = `/users/${this.id}`;
    let role_info = this.role === 1 ?
      <span className="user-status admin text-white rounded-circle user-table-unit">admin</span> :
      <span className="user-status user text-white rounded-circle user-table-unit">user</span>;

    return (
      <tr>
        <td>
          <Link to={{ pathname:uri_to_user, state:{ userOnView : this.props.user }}}>
            <img className="rounded-circle user-table-img"
              src={this.avaUrl}
              alt="User Ava" />
             {this.login}
          </Link>
          {role_info}
        </td>
        <td>{this.fullname}</td>
        <td>{this.registeredAt}</td>
      </tr>
    );
  }
}

class UserTable extends Component {
  constructor(props) {
    super(props);
    this.state = { users: [], isLoading: true };
  }

  componentWillReceiveProps(props) {
    if (this.state.users === props.users) return;
    console.log("RECEIVING PROPS VIEW USERLIST");
    console.log(props);
    this.setState({
      users: props.users ? props.users : [],
      isLoading: props.isLoading
    });
  }

  render() {
    let listUsers = null;
    let users = this.state.users;
    if (this.state.isLoading) 
      return <div className="text-center"><Spinner/></div>;
    else if (users.length === 0) 
      return <div className="text-center">Not found</div>;
    else listUsers = users.map((user) => <User key={user._id} user={user} />);
    return (
      <table className="table table-hover bg-light rounded-1">
        <tbody>
          <tr>
            <th>Login</th>
            <th>Fullname</th>
            <th>Registered</th>
          </tr>
          {listUsers}
        </tbody>
      </table>
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


class UserTablePage extends Component {
  constructor(props) {
    super(props);
    this.isLoggedIn = props.user;
    this.isAdmin = props.user ? props.user.role === 1 : false;
    this.state = {
      usersOnPage: props.usersOnPage ? props.usersOnPage : [],
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
    this.dispatch(fetchUsers(0, ""));
  }

  componentWillReceiveProps(props) {
    console.log("RECEIVING PROPS USER TABLE CONTAINER");
    console.log(props);
    this.setState({
      usersOnPage: props.usersOnPage ? props.usersOnPage : [],
      isLoading: props.isLoading,
      searchFilter: props.searchFilter,
      pageCount: props.pageCount,
      currentPage: props.currentPage,
    });
  }

  handleSearchSumbit(event) {
    event.preventDefault();
    let searchFilter = this.state.searchFilter;
    this.dispatch(fetchUsers(0, searchFilter));
  }
  handleFilterChange(event) {
    this.setState({ searchFilter: event.target.value });
  }
  handleEraseFilter(event) {
    event.preventDefault();
    this.dispatch(fetchUsers(0, ""));
  }
  handleNextPageClick(event) {
    event.preventDefault();
    this.dispatch(fetchUsers(this.state.currentPage + 1, this.props.searchFilter));
  }
  handlePrevPageClick(event) {
    event.preventDefault();
    this.dispatch(fetchUsers(this.state.currentPage - 1, this.props.searchFilter));
  }

  render() {

    if (!this.isLoggedIn) return <Redirect to="/auth/login" />;
    else if(!this.isAdmin) return <Redirect to="/"/>;

    const search_info = <SearchInfo onClick={this.handleEraseFilter} filter={this.props.searchFilter} />;
    let page_info = this.state.pageCount !== 0 ?
      <span className="track-page-info">{this.state.currentPage} out of {this.state.pageCount}</span> : "";

    const next_page_button = this.state.currentPage < this.state.pageCount ?
      <button type="button" onClick={this.handleNextPageClick} id="next_page" className='btn btn-primary'>&raquo; Next page</button> : "";
    const prev_page_button = this.state.currentPage > 1 ?
      <button type="button" onClick={this.handlePrevPageClick} id="prev_page" className='btn btn-primary'>&laquo; Previous page</button> : "";

    let userTable = <UserTable users={this.state.usersOnPage} isLoading={this.state.isLoading} />
    return (
      <div>
        <HeaderSection>
          <h3>Users</h3>
        </HeaderSection>
        <Section>
          <input className="user-filter" type="search" value={this.state.searchFilter} onChange={this.handleFilterChange} id="search_field" name="search" placeholder="Search user..." />
          <button id="search" onClick={this.handleSearchSumbit} className="btn btn-primary track-search" type="button" >Search</button>
          {search_info}
          <div className="row">
            <div className="col-lg-12 mx-auto">
              <div id="user_table">
                {userTable}
                </div>
            </div>
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


const usersMapStateToProps = state => {
  console.log("MAPPING USERS PAGE");
  //console.log(state.loggedInUser);
  return {
    usersOnPage: state.users.usersOnPage,
    isLoading: state.users.isFetchingUsers,
    pageCount: state.users.pageCount,
    currentPage: state.users.currentPage,
    searchFilter: state.users.searchFilter
  };
}
const UserTablePageContainer = withRouter(connect(
  usersMapStateToProps,
)(UserTablePage));


function is_user_owner(user, profile){
  return profile._id.toString() === user._id.toString();
}


class UserPage extends Component {
  constructor(props) {
    super(props);
    this.user = props.user;
    console.log("PROPS ON USER PAGE");
    console.log(this.props);
    let cashedUser = null;
    if (this.props.location.state)
      cashedUser = this.props.location.state.userOnView;
    console.log(cashedUser);
    this.state = {
      isDeleted: false,
      userOnView: cashedUser,
      isLoading: !cashedUser,
      userOnViewId: props.match.params.id
    };
    this.dispatch = props.dispatch;
  }

  componentWillMount() {
    if (!this.state.userOnView)
      this.dispatch(fetchUserById(this.state.userOnViewId));
    else this.dispatch(setUserOnView(this.state.userOnView));
  }

  componentWillReceiveProps(props) {
    console.log("RECEIVING PROPS USER CONTAINER");
    console.log(props);
    this.setState({
      userOnView: props.userOnView,
      isLoading: props.isLoading
    });
  }

  render() {

    let user = this.state.userOnView;
    console.log("USER IN USER PAGE");
    console.log(user);
    if (this.state.isLoading) {
      return (
        <div>
          <Section>
            <div className="text-center">
              <Spinner />
            </div>
          </Section>
        </div>);
    } else if (!user)
      return <HeaderSection><p className="lead">Error fetching</p></HeaderSection>;

    let isOwner = is_user_owner(this.user, user);
    let linkToUpdate = `/users/update/${user._id}`;
    let linkToUploaded = `/playlists/${user.uploaded_tracks}`;
    let linkToPlaylists= `/playlists?user=${user._id}`;
    let operButtons = isOwner ? 
      <Link className="btn btn-primary btn-user" to={linkToUpdate}>Update user</Link> : "";

    let role_info = user.role === 1 ?
      <span className="user-status user-page-status admin text-white rounded-circle">admin</span> :
      <span className="user-status user-page-status user text-white rounded-circle">user</span> ;
    return (
      <div>
        <HeaderSection>
          <img className="rounded-circle inline-block user-img" src={user.avaUrl} alt="User Ava"></img>
          <b className="bg-dark rounded user-page-login">{user.login}</b>
        
        {role_info}
        </HeaderSection>
        <Section>
          <div className="user-page-sect">
            <p><b>Fullname: </b>{user.fullname}</p>
            <p><b>Registration data:</b>{user.registeredAt}</p>
            <p><b>Bio: </b>{user.bio}</p>
            <hr/>
            <div className="text-center">
              <Link className="btn btn-primary btn-user" to={linkToUploaded}>Uploaded tracks</Link>
              <Link className="btn btn-primary btn-user" to={linkToPlaylists}>{user.login}`s playlists</Link>
              {operButtons}
            </div>
          </div>
        </Section>
      </div>);
  }
}

const userMapStateToProps = state => {
  console.log("MAPPING USER PAGE");
  //console.log(state.loggedInUser);
  return {
    userOnView: state.users.userOnView,
    isLoading: state.users.isFetchingUsers
  };
}

const UserPageContainer = withRouter(connect(
  userMapStateToProps,
)(UserPage));



 class UserUpdatePage extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;

    this.state = {
      isUserUpdated: false,
      isLoading: !props.userOnView,
      bio: props.userOnView ? props.userOnView.bio : null,
      fullname: props.userOnView ? props.userOnView.fullname : null,
      userId: props.userOnView ? props.userOnView._id : props.match.params.id
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit(event) {
    event.preventDefault();

    let formEl = event.target;
    let formData = new FormData(formEl);;
    console.log("UPDATE USE");
    this.dispatch(fetchUpdateUser(this.state.userId, formData));
  }


  componentWillMount() {
    if (!this.props.userOnView) {
      this.dispatch(fetchUserById(this.state.userId))
    }
  }

  componentWillReceiveProps(props) {
    if (props.userOnView) {
      let { bio, fullname, _id} = props.userOnView;
      let isLoading = props.isLoading;
      let isUserUpdated = props.isUserUpdated;
      this.setState({
        bio,
        fullname,
        userId: _id,
        isLoading,
        isUserUpdated
      })
    } else {
      //let isLoading = props.isLoading;;
      //let isTrackUpdated = props.isTrackUpdated;
      this.setState({
        isLoading: props.isLoading,
        isUserUpdated: props.isUserUpdated
      });
    }
  }
  render() {
    if (this.state.isLoading)
      return (
        <div>
          <HeaderSection>
            <h1>Update user</h1>
          </HeaderSection>
          <Section>
            <div className="text-center">
              <Spinner />
            </div>
          </Section>
        </div>);
    if (this.state.isUserUpdated) {
      let linkToUser = `/users/${this.state.userId}`;
      console.log("REDIRECT TO " + linkToUser);
      return <Redirect to={linkToUser} />;
    }
    return (
      <div>
        <HeaderSection>
          <h1>Update user</h1>
        </HeaderSection>

        <Section>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label forhtml="author">Fullname:</label>
              <input type="text" className="form-control" id="author" defaultValue={this.state.fullname} name="name"/>
            </div>
            <div className="form-group">
              <label forhtml="name">Bio:</label>
              <textarea type="text" className="form-control" id="name" defaultValue={this.state.bio} name="bio"/>
            </div>
            <div className="form-group">
              <label forhtml="ava">Change ava image:</label>
              <input type="file" id="ava" name="ava" accept="image/*"/>
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </Section>

      </div>);
  }
}

const userUpdMapStateToProps = state => {
  console.log("MAPPING USER UPDATE PAGE");
  console.log(state.users);
  //console.log(state.loggedInUser);
  return {
    isUserUpdated: state.users.isUserUpdated,
    userOnView: state.users.userOnView,
    isLoading: state.users.isFetchingUser
  };
}
const UserUpdatePageContainer = withRouter(connect(
  userUpdMapStateToProps,
)(UserUpdatePage));









export { 
  UserTablePageContainer,
  UserPageContainer,
  UserUpdatePageContainer,
  // TrackNewPageContainer
 };