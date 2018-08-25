import React, {Component} from 'react';
import './Signin.css';
const jwt = require('jsonwebtoken');
const key = process.env.REACT_APP_KEY;

export default class Signin extends Component {
  constructor(props){
    super(props);
    this.state = {
      view: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait' 
    }
    this.main = props.main;
  }

  signin = (e) => {
    e.preventDefault();
    const token = jwt.sign({username: e.target.username.value, pass: e.target.pass.value}, key); 
    window.localStorage.setItem('access_token', token);
    window.localStorage.removeItem('invite_token');
    this.main.setState({status: 'active', main: 'loading'});
    this.main.verifyToken(token);
  }

  render(){
    window.onresize = () => this.setState({view: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'});     
    return (
      <div className="Signin-wrapper">
          <div className="flex-center" style={{ [this.state.view === "landscape" ? 'borderRight' : 'borderBottom']: '1px solid white',width: this.state.view === "landscape" ? '50%' : '100%'}}>
            <img alt="logo" width="100%" src="https://scontent-atl3-1.xx.fbcdn.net/v/t1.0-9/29511489_1704760912910824_2222018091826378716_n.jpg?_nc_cat=0&oh=c2bf09d9a1c8434a7c965d271b06f93c&oe=5B3BB901" />
          </div>
          <form className="flex-center -- form" style={{flex:1,flexDirection: 'column', padding: '1rem', overflowY: 'auto'}} onSubmit={(e) => this.signin(e)}>
            <p>AUTHORIZATION</p>
            <input type='type' name="username" placeholder="Username"/>
            <input type='password' name="pass" placeholder="Password"/>
            <input type='submit' hidden/>
          </form>
      </div>
    );
  }
}