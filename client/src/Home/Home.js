import React, { Component } from 'react';
import {Section, HeaderSection} from '../Sections/Sections';
import { Link } from 'react-router-dom'


function checkIfTheSameUser(user1, user2){
    let isNull1 = !user1;
    let isNull2 = !user2;

    return (isNull2 && isNull1)
    || ((!isNull1 && !isNull2) 
    && (user1.login ===  user2.login));
}



class Home extends Component {
    
    constructor(props) {
        super(props);
        this.user = props.user;
        this.state = {isLoggedIn: this.user ? true : false};
    }


    componentWillReceiveProps(props) {
        // console.log("SETTING ON HOME NEW PROPS");
        const user = this.user;
        if (!checkIfTheSameUser(user, props.user)) {
            // console.log("SETTING ON HOME NEW PROPS");
            this.setState({ isLoggedIn : props.user ? true: false});
        }
    }

    render() {

        let registerLink = !this.user ? (
            <div>
                <Link className ="btn btn-light" to="/auth/register">Join the MyZaGa</Link>
            </div>
        ) : "";

        return (
            <div>
                <HeaderSection>
                    <h1>Welcome to MyZaGa!</h1>
                    <p className="w-50 lead d-inline-block">
                        A world’s leading social sound platform where anyone can listen to or create sounds and share them everywhere.
                    </p>
                    {registerLink}
                </HeaderSection>
                <Section>
                    <h2>Be a creator</h2>
                    <p className="lead">Easily record and upload sounds to MyZaGa and share them privately or publicly to friends, blogs,
                    sites and all your social networks. Comprehensive stats make evaluating your performance a piece of cake. Engage
                    directly with your fans with comments and promote your work.</p>
                </Section>
                <Section className="bg-light">
                    <h2>Be a listener</h2>
                    <p className="lead">Find new music to love. Follow creators on MyZaGa that you are interested in and watch your
                    Stream grow with new audio everyday. Save your favorite tracks and playlists in your Likes and get surprised when
                    our Related tracks recommendations help you discover even more.</p>
                </Section>
            </div>
        );
    }
}

const About = () => (
    <div>
        <HeaderSection>
            <div className="col-lg-8 mx-auto">  
                <h2>About MyZaGa</h2>
                <p className="lead">It enables its users to upload, promote, and share audio.
                It was created by a student of National Technical University of Ukraine Moroz Mykhailo.</p>
            </div>
        </HeaderSection>
        <Section>
            <p className="lead">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer pulvinar suscipit facilisis. Nam lectus augue, egestas
                eget orci a, elementum sodales ligula. Vivamus eget sapien vitae purus commodo commodo id non urna. Etiam pretium
                arcu arcu, eget tincidunt nisl pretium sit amet. Ut pretium scelerisque felis et egestas. Nulla leo mauris, scelerisque
                viverra massa dapibus, tristique vestibulum nibh. Nunc sodales mauris quam, semper bibendum lorem pharetra nec.
                Quisque consequat tempor enim porttitor varius. Pellentesque a eros porttitor, eleifend libero ac, congue dui.
                Integer consequat purus id hendrerit ullamcorper. Nunc imperdiet, orci ut tincidunt accumsan, tortor ante malesuada
                ligula, auctor hendrerit enim ex ut libero. Quisque vitae dapibus mi. Sed sollicitudin, enim eget vestibulum maximus,
                ligula lacus fermentum sem, quis imperdiet lacus elit in sem. Nullam nec augue a diam sollicitudin aliquet in a
                ligula.
            </p>
        </Section>
        <Section className="bg-light">
            <p className="lead">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer pulvinar suscipit facilisis. Nam lectus augue, egestas
                eget orci a, elementum sodales ligula. Vivamus eget sapien vitae purus commodo commodo id non urna. Etiam pretium
                arcu arcu, eget tincidunt nisl pretium sit amet. Ut pretium scelerisque felis et egestas. Nulla leo mauris, scelerisque
                viverra massa dapibus, tristique vestibulum nibh. Nunc sodales mauris quam, semper bibendum lorem pharetra nec.
                Quisque consequat tempor enim porttitor varius. Pellentesque a eros porttitor, eleifend libero ac, congue dui.
                Integer consequat purus id hendrerit ullamcorper. Nunc imperdiet, orci ut tincidunt accumsan, tortor ante malesuada
                ligula, auctor hendrerit enim ex ut libero. Quisque vitae dapibus mi. Sed sollicitudin, enim eget vestibulum maximus,
                ligula lacus fermentum sem, quis imperdiet lacus elit in sem. Nullam nec augue a diam sollicitudin aliquet in a
                ligula.
            </p>
        </Section>
    </div>
);

const ApiInfo = () => {
    return(
    <div>
    <HeaderSection>
        <h1>MyZaGa API</h1>
        <p class="w-50 lead d-inline-block">Integrate with MyZaGa via API</p>
    </HeaderSection>

    <Section>
        <h2>Endpoints</h2>
        <p class="lead"><b>NOTE:</b> <code>entities</code> is refers to <code>users</code>,<code>tracks</code>, <code>playlists</code>, <code>comments</code>.</p>
        <p>Get current user: <code>GET /api/v1/me</code></p>
        <p>Get list of entities: <code>GET /api/v1/entities</code>
        <ul>
            <li>queries: <i>search: search throught list by string, page: page number </i></li>
            <li><i>user: get playlists by user id </i><b>only for <code>playlists</code> model</b></li>
        </ul>
        <b>Responses with a paginated list</b>
        </p>
        <p>Get entity by id: <code>GET /api/v1/entities/:id</code><br/>
        <b>Responses with a single entity</b></p>
        <p>Create new entity: <code>POST /api/v1/entities}new</code><ul>
            <li>params for <code>users</code>: <i>login: alphanumeric string, pass: alphanumeric string</i></li>
            <li>params for <code>playlists</code>: <i>desc: string, tracks: array of <code>track</code> ids</i></li>
            <li>params for <code>tracks</code>: <i>author, album, name: string, year: number, track: audio file, image: image file</i></li>
        </ul>
        <b>Responses with a created entity</b>
        </p>
        <p>Update entity by id: <code>PUT /api/v1/entities/:id</code><ul>
            <li>params for <code>users</code>: <i>bio, fullname: string, ava: image file</i></li>
            <li>params for <code>playlists</code>: <i>desc: string, tracks: array of <code>track</code> ids</i></li>
            <li>params for <code>tracks</code>: <i>author, album, name: string, year: number</i></li>
        </ul>
        </p>
        <b>Responses with a replaced entity</b>
        <p>Delete entity by id: <code>DELETE /api/v1/entities/:id</code><br/>
        <b>Responses with a deleted entity</b>
        </p>
        <h2>Errors</h2>
        <p>Format: <code>err: error_message</code></p>
        <p>Messages: 
        <ul>
            <li><code>No such entity</code> - Requested entity is not exist</li>
            <li><code>Bad request</code> - Invalid inputs in request</li>
            <li><code>Forbidden</code> - Current user is not allowed to do operation</li>
            <li><code>Unathorized</code> - User is not authenticated</li>
        </ul></p>
        <h2>Authentication</h2>
        <p>Strategy: JWT</p>
        <p>Headers: <code>Authorization: Bearer %JWT_TOKEN%</code></p>
    </Section>
    </div>);
}




export { Home, About, ApiInfo};