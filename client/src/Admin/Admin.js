import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import {FlexSection as Section, HeaderSection } from '../Sections/Sections';
import Spinner from '../Spinner/Spinner';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  fetchAdminMenuUpdate,
  fetchAdminMenuData,
}from '../actions/users'
import Select from 'react-select';


class AdminMenu extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.user = props.user;
    this.state = {
      isLoading: true,
      selected: [],
      not_selected: [],
      isAdminsUpdated : false
    }
    this.handleSubmit =  this.handleSubmit.bind(this);
    this.handleAdminChange =  this.handleAdminChange.bind(this);
  }
  componentWillMount(){
    this.dispatch(fetchAdminMenuData());
  }
  handleAdminChange (value) {
    this.setState({selected: value});
  }

  handleSubmit (event){
    event.preventDefault();
    let selected = this.state.selected.map(user => user._id);
    this.dispatch(fetchAdminMenuUpdate(selected));
  }

  componentWillReceiveProps(props) {
    //console.log("RECEIVING PROPS CONTAINER");
    //console.log(props);
    if(props.data){
      this.setState({
        isLoading: props.isLoading,
        selected: props.data.selected,
        not_selected : props.data.not_selected,
        isAdminsUpdated : props.isAdminsUpdated
      });
    }else this.setState({
      isLoading: props.isLoading,
      isAdminsUpdated : props.isAdminsUpdated
    });
  }

  render() {
    if(!this.user) return <Redirect to="/auth/login"/>;
    else if(this.user.role !== 1 || this.state.isAdminsUpdated) return <Redirect to="/"/>;

    if(this.state.isLoading)
      return (
      <Section>
        <div className="text-center">
          <Spinner />
        </div>
      </Section>);
     return (
      <div>
        <HeaderSection>
          <h1>Admin Menu</h1>
        </HeaderSection>
  
      <Section>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
              <label forhtml="admins">Admins:</label>
              <Select
                isMulti
                name="admins"
                options={this.state.not_selected}
                value={this.state.selected}
                isOptionDisabled={(user) => user.role === 1}
                getOptionLabel={({login}) => `${login}`}
                getOptionValue={val => val._id}
                className="basic-multi-select"
                classNamePrefix="select"
                id="admins"
                onChange={this.handleAdminChange}
                />
          </div>
              <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </Section>
      </div>);
  }
}

const mapStateToProps = state => {
  // console.log("MAPPING TRACKS PAGE");
  //// console.log(state.loggedInUser);
  return {
    isLoading: state.users.isFetchingAdminMenu,
    data: state.users.adminMenuData,
    isAdminsUpdated: state.users.isAdminsUpdated
  };
}
export default withRouter(connect(
  mapStateToProps,
)(AdminMenu));