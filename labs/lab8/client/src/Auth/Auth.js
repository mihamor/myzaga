import { Switch, Route, Redirect } from 'react-router-dom'
import React from 'react';
import {Section, HeaderSection} from '../Sections/Sections';
import './Auth.css'
import AuthApi from '../Api/AuthApi.js'
import { fetchLoginUser, fetchRegister, logoutUser } from '../actions/auth';
import { connect } from 'react-redux';
AuthApi.setHostName('http://localhost:3016');

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.dispatch = props.dispatch;
        this.state = { err:props.err, user: null, isLogedIn: false, login: '', password: ''};
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // console.log(props);
        //this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);
    }
    checkIfLoggedIn(){
        const jwt = localStorage.getItem("jwt");
        if(jwt) this.setState({isLogedIn:true});
    }
    componentDidMount() {
        this.checkIfLoggedIn();
    }
    componentWillReceiveProps(props) {
        this.setState({isLogedIn: props.isLogedIn, err: props.err});
    }
    handleLoginChange (event) {
        this.setState({login: event.target.value});
    }
    handlePasswordChange (event) {
        this.setState({password: event.target.value});
    }
    handleSubmit(event) {
        let login = this.state.login;
        let password = this.state.password;
        event.preventDefault();
        const loginData = { login, password}
        this.dispatch(fetchLoginUser(loginData)); //fix prikol
    }
    render()  {
        if(this.state.isLogedIn){
            return <Redirect to="/" />;
        }
        let error_display = this.state.err ? <span className="text-danger">{this.state.err}</span> : null;
        return (
        <div>
            <HeaderSection>
                <h1 className="col-lg-8 mx-auto">Login to MyZaGa</h1>
            </HeaderSection>

            <Section>
                <div className="text-justify col-lg-8 bg-light mx-auto border rounded auth-form"> 
                    <h2 className="text-center"><b>Login to your public MyZaGa account</b></h2>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="login">Login: {error_display}</label>
                            <input type="text" pattern="^(\w{3,})+$" title="Use only alphanumeric and underscore"
                                className="form-control" id="login" name="username" placeholder="Enter login..."
                                value={this.state.login} onChange={this.handleLoginChange} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="pass">Password:</label>
                            <input type="password" pattern="^(\w{3,})+$" title="Use only alphanumeric and underscore" 
                                className="form-control" id="pass" name="password" placeholder="Enter password..."
                                value={this.state.password} onChange={this.handlePasswordChange} required/>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary w-100" >Continue</button>
                        </div>
                    </form>
                </div>
            </Section>
        </div>
        );
    }
}


const loginMapStateToProps = state => {
    // console.log("MAPPING");
    // console.log(state.loggedInUser);
    return {
        err: state.auth.loginErr ? "Incorrect password or login" : null,
        isLogedIn: state.auth.loggedInUser ? true : false
    };
}
const LoginContainer = connect(
    loginMapStateToProps,
)(Login);




class Register extends React.Component{
    constructor(props){
        super(props);
        this.state = { 
            isRegistered: false,
            login: '',
            password: '',
            confpassword: '',
            errInfo: ''
        };
        this.dispatch = props.dispatch;
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleConfPasswordChange = this.handleConfPasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    checkIfLoggedIn(){
        const jwt = localStorage.getItem("jwt");
        if(jwt) this.setState({isRegistered:true});
    }
    componentWillReceiveProps(props) {
        this.setState({isRegistered: props.isRegistered, errInfo: props.errInfo});
    }
    componentDidMount() {
        this.checkIfLoggedIn();
    }
    handleLoginChange (event) {
        this.setState({login: event.target.value});
    }
    handlePasswordChange (event) {
        this.setState({password: event.target.value});
    }
    handleConfPasswordChange (event) {
        this.setState({confpassword: event.target.value});
    }
    handleSubmit(event) {
        event.preventDefault();
        if(this.state.password !== this.state.confpassword){
            this.setState({errInfo: "Passwords doesn't match"});
            return;
        }

        let login = this.state.login;
        let password = this.state.password;
        event.preventDefault();
        const registerData = { login, password };
        this.dispatch(fetchRegister(registerData)); //fix prikol
    }
    render() { 
        if(this.state.isRegistered)
            return <Redirect to="/" />;

        let errInfo = this.state.errInfo ? 
            <span className="text-danger">{this.state.errInfo}</span> : "";

        return (
            <div>
                <HeaderSection>
                    <h1 className="col-lg-8 mx-auto">Join MyZaGa to hear the latest from people you follow </h1>
                </HeaderSection>
                <Section>
                    <div className="text-justify col-lg-8 bg-light mx-auto border rounded auth-form"> 
                        <h2 className="text-center"><b>Create your public MyZaGa account</b></h2>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="login">Login: {errInfo}</label>
                                <input type="text" pattern="^(\w{3,})+$" title="Use only alphanumeric and underscore" 
                                    className="form-control" id="login" placeholder="Enter login..." name="login" 
                                    value={this.state.login} onChange={this.handleLoginChange} required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="pass">Choose a password:</label>
                                <input type="password" pattern="^(\w{3,})+$" title="Use only alphanumeric and underscore" 
                                    className="form-control" id="pass" placeholder="Enter password..." name="pass" 
                                    value={this.state.password} onChange={this.handlePasswordChange} required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="passconf">Confirm your password:</label>
                                <input type="password" pattern="^(\w{3,})+$" title="Use only alphanumeric and underscore" 
                                    className="form-control" id="passconf" placeholder="Confirm your password..." name="passconf" 
                                    value={this.state.confpassword} onChange={this.handleConfPasswordChange} required/>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary w-100">Continue</button>
                            </div>
                        </form>
                    </div>
                </Section>
            </div>
        );
    }
}


const registerMapStateToProps = state => {
    // console.log("MAPPING");
    //// console.log(state.loggedInUser);
    return {
        isRegistered: !state.auth.registerErr,
        errInfo: state.auth.registerErr
    };
}
const RegisterContainer = connect(
    registerMapStateToProps,
)(Register);





class Logout extends React.Component {
    constructor(props) {
        super(props);
        this.dispatch = props.dispatch;

        //// console.log(props);
        //this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);
    }
    componentDidMount() {
        const jwt = localStorage.getItem("jwt");
        if(jwt){
            localStorage.removeItem("jwt");
            this.dispatch(logoutUser());
        }
    }
    render()  {
        return <Redirect to="/" />;
    }
}


// const logoutMapStateToProps = state => {
//     // console.log("MAPPING LOGOUT");
//     // console.log(state.loggedInUser);
//     return {
//       isLogedIn: state.loggedInUser ? true : false
//     };
// }
const LogoutContainer = connect()(Logout);


class Auth extends React.Component{

    constructor(props){
        super(props);
        this.match = this.props.match;
    }

    render(){
        return (
            <Switch>
            <Route path={`${this.match}/logout`} render={props => <LogoutContainer/>}/>
            <Route path={`${this.match}/login`} render={props => <LoginContainer/>}/>
            <Route path={`${this.match}/register`} render={props => <RegisterContainer/>}/>
            </Switch>
        );
    }
}
export default Auth;
