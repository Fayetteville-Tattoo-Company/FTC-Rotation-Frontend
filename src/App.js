import React, { Component } from 'react';
import {Signin, Dashboard, Access, MasterCreate} from './components';
import axios from 'axios';
import './App.css';
const server = require('./config.json').server;


class App extends Component {
  constructor(){
    super();
    this.state = {main: 'loading', status: 'unactive', network: 'disconnected'}
    this.loadingDelay = 2000;
    this.token = window.localStorage.getItem('access_token');
  }

  componentWillMount(){
    this.systemConnect();
  }

  verifyToken = (token, input) => { 
    axios.get(`${server}/verify`, {headers:{Authorization: token}})
    .then((r) => {
      if(this.state.status === 'unactive'){
        if(r.data === "AUTHORIZED") {
          console.log("AUTHORIZED ACCESS");
          window.localStorage.setItem('access_token', token);
          return this.setState({status: 'master-create'});
        }
        if(r.data === "UNAUTHORIZED"){
          window.localStorage.clear();
          console.log("UNAUTHORIZED ACCESS");
          if(input) input.style.border = '2px solid red';
        }
      }
      if(this.state.status === 'active'){
        if(r.data === 'UNAUTHORIZED') {
          window.localStorage.clear();
          this.setState({status: 'signin'});
        }
        if(r.data === 'AUTHORIZED'){
          this.setState({status: 'authenticated'});
        }
      }
      
    });
  }

  systemConnect = () => {
    axios.get(`${server}/status`)
    .then((res) => {
      const token = window.localStorage.getItem('access_token');
      this.verifyToken(token);
      this.setState({status: res.data, network: 'connected'});
      console.log("Connected");
    })
    .catch((err) => {
      this.setState({network: 'disconnected'});
      setTimeout(() => { console.log('Reconnecting'); this.systemConnect();}, 5000);
    });
  }

  load = () => {
    const load = document.getElementById('load');
    if(load)
      load.style.opacity = 0;
    setTimeout(() => this.setState({main: 'loaded'}), this.loadingDelay / 2);
  }
  render() {
    
    this.state.main === 'loading' ? setTimeout(() => this.load(), this.loadingDelay) : console.log("loaded");        
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
        {this.state.status === 'unactive' ? <Access main={this} /> : null}
        {this.state.status === 'master-create' ? <MasterCreate /> : null}        
        {this.state.status === 'signin' ? <Signin main={this}/> : null}
        {this.state.status === 'authenticated' && this.state.main === 'loaded' ? <Dashboard /> : null}
      </div>
    );
  }
}

export default App;
