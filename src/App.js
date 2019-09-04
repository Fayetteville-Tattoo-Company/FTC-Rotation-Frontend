import React, { Component } from 'react';
import {Signin, Dashboard, Access, MasterCreate} from './components';
import axios from 'axios';
import './App.css';
import {log} from  './tools';
require('dotenv').config();
const jwt = require('jsonwebtoken');
const key = process.env.REACT_APP_KEY;
const server = process.env.REACT_APP_SERVER;

const checkUsername = (e) => {
  const username = document.getElementsByName('username')[0];
  if(!username.value) username.style.border = '2px solid black';
  if(username.value)
  axios.get(`${server}/exist/${username.value}`, {headers:{Authorization: window.localStorage.getItem('access_token')}})
  .then((res) => {
    if(res.data === 1) return username.style.border = '2px solid green';
    if(res.data === 0) return username.style.border = '2px solid red';
  })
  .catch((err) => {
    log(err);
  })
}



class Invite extends Component {

  constructor(props){
    super(props);
    this.main = props.main;
    this.state = {
      image: null
    }
  }
  addUser = (e, type, iKey, email, main) => {
    e.preventDefault();
    const username = e.target.username.value;
    const name = e.target.name.value;
    const pass = e.target.pass.value;
    const confirm = e.target.confirm.value;
    if(!iKey) return alert('ACCESS KEY MISSING');
    if(!username || !name || !pass || !confirm) return alert('ALL FIELDS ARE REQUIRED');
    if(pass !== confirm) return alert('PASSWORDS DO NOT MATCH');
      
      const fields = {
        username,
        name,
        pass,
        role: 'admin',
        key: iKey,
        email, 
        type
      };
      const token = jwt.sign(fields, key);
      console.log(token);
      axios.post(`${server}/invite-signup`, fields, {headers:{Authorization: token}})
      .then( (res) => {
        console.log(res.data);
        if(res.data === 'UNAUTHORIZED') {
          alert('KEY IS NO LONGER VALID');
          window.localStorage.clear();
           this.main.setState({main:'loading', status: 'signin'});
        }
        if(res.data.status === 'SUCCESS') {
          window.localStorage.clear();
          window.localStorage.setItem('access_token', res.data.token);
          alert('SUCCESS');
          this.main.setState({main:'loading', status: 'signin'});
        }
      })
      .catch((err) => {alert(err); console.log(err)});
    }
  

  render(){
    const user = jwt.decode(window.localStorage.getItem('invite_token'), key);
    log(user);
    return this.main.state.main === "loaded" ? (
    <div className="Invite-wrapper" style={{position: 'fixed', justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'center', display: 'flex', width: '100%', height: '100%', background: 'black'}}>
      <header style={{width: '100%', background: 'black', borderBottom: '1px solid white'}}><h2>{`${user.type.toUpperCase()} FORM`}</h2></header>
      <form encType='multipart/form-data' onSubmit={(e) => this.addUser(e, user.type, user.key, user.email, this.main)}style={{width: '80%', minWidth: 300, maxWidth: '50%', margin: '2rem',display: 'flex', background:'rgb(86, 86, 86)',border: '1px solid white', borderRadius: 5, padding: '1rem', flexWrap: 'wrap'}}>
        {/*<input onChange={(e) => this.setState({image: e.target.files[0]})} type="file" name='image' />*/}
        <input onChange={(e) => checkUsername(e)} name="username" placeholder="USERNAME" />
        <input name="name" placeholder="NAME"/>
        <input type="password" name="pass" placeholder="PASSWORD"/>
        <input type="password" name="confirm" placeholder="CONFIRM"/>
        <div style={{display: 'flex', paddingRight: '1rem', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', width: '100%'}}>
          <button ><i style={{fontSize: '1.5rem', color: 'green', cursor: 'pointer'}} className="far fa-check-circle"/></button>
          <button onClick={(e) => {e.preventDefault(); this.main.setState({main: 'loading', status: 'signin'}); window.localStorage.clear()}}><i style={{fontSize: '1.5rem', color: 'red', cursor: 'pointer'}} className="fas fa-ban"/></button>
        </div>
      </form>
      
    </div>
   ) : <div/>;
  } 
}


class App extends Component {
  constructor(){
    super();
    this.state = {main: 'loading', status: 'unactive', network: 'disconnected'}
    this.loadingDelay = 2000;
    this.token = window.localStorage.getItem('access_token');
  }

  componentDidMount(){
    this.systemConnect(); 
    log(process.env.NODE_ENV); 
    
  }
  componentWillMount(){
    document.location.href.split('://')[0] === 'http' && 
    process.env.NODE_ENV === 'production' && 
    document.location.replace(`https://${document.location.hostname}`);
  }


  verifyToken = (token, input) => {
    axios.get(`${server}/verify`, {headers:{Authorization:token}})
    .then((r) => {
      if(this.state.status === 'invite-signup') return;
      if(this.state.status === 'unactive'){
        if(r.data.access === "AUTHORIZED") {
          log("AUTHORIZED ACCESS");
          window.localStorage.setItem('access_token', token);
          return this.setState({status: 'master-create'});
        }
        if(r.data.access === "UNAUTHORIZED"){
          window.localStorage.removeItem('access_token');
          log("UNAUTHORIZED ACCESS");
          if(input) input.style.border = '2px solid red';
        }
      }
      if(this.state.status === 'active'){
        if(r.data.access === 'UNAUTHORIZED') {
          window.localStorage.removeItem('access_token');
          this.setState({status: 'signin'});
        }
        if(r.data.access === 'AUTHORIZED'){
          log(r.data);
          window.localStorage.setItem('access_token', r.data.token);
          this.setState({status: 'authenticated'});
        }
      }
      
    })
    .catch((err) => log(err));
  }

  systemConnect = () => {
    axios.get(`${server}/status`)
    .then((res) => {
      const token = window.localStorage.getItem('access_token');
      log(token);
      this.verifyToken(token);
      this.setState({status: res.data, network: 'connected'});
      log("Connected", res.data);
    })
    .catch((err) => {
      this.setState({network: 'disconnected'});
      setTimeout(() => { log('Reconnecting'); this.systemConnect();}, 5000);
    });
  }

  load = () => {
    const load = document.getElementById('load');
    if(load)
      load.style.opacity = 0;
    setTimeout(() => this.setState({main: 'loaded'}), this.loadingDelay / 2);
  }
  render() {
   
    if(this.state.main === 'loaded' && window.localStorage.getItem('invite_token') && this.state.status !== 'invite-signup'){
      this.setState({status: 'invite-signup'});
    }
    this.state.main === 'loading' ? setTimeout(() => this.load(), this.loadingDelay) : log("loaded");        
    if(this.state.main === 'loaded' && window.location.hash.length){
      window.localStorage.clear();
      window.localStorage.setItem('invite_token', window.location.hash.split('#')[1]);
      window.location.hash = '';
      this.setState({status: 'invite-signup'});
    } 
    return (
      <div className="App">
        {this.state.network === 'disconnected' && this.state.main === 'loaded' ? <div className="network-indicator">NETWORK DISCONNECTED</div> : null}
        {
          this.state.main === "loading" ? 
            <div id="load" className="load">
              <p> LOADING... </p>
              <div className="load-img">
                <img src={"images/ftc-logo-circle-white.png"} alt="logo" width="100%"/>
              </div> 
            </div>
          : null
        }
        {this.state.status === 'unactive'? <Access main={this} /> : null}
        {this.state.status === 'master-create' ? <MasterCreate main={this}/> : null}        
        {this.state.status === 'signin' && this.state.main === 'loaded' ? <Signin main={this}/> : null}
        {this.state.status === 'invite-signup' ? <Invite main={this} />: null}
        {this.state.status === 'authenticated' && this.state.main === 'loaded' ? <Dashboard main={this}/> : null}
      </div>
    );
  }
}

export default App;
