import React, {Component} from 'react';
import {Rotation, Appointments} from "../";
import axios from 'axios';
import './Dashboard.css';
import {log} from '../../tools';
const key = process.env.REACT_APP_KEY;
const server = process.env.REACT_APP_SERVER;
const jwt = require('jsonwebtoken');

export default class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {settings: false, inviteForm: false, inviteType: null}
    this.main = props.main;
  }
  resetCount = () => {
    axios.put(`${server}/reset`,{}, {headers:{Authorization: window.localStorage.getItem('access_token')}})
    .then((res) => {
      log(res.data);
      alert(res.data);
    })
    .catch((err) => log(err));
  }
  logout = () => {
    window.localStorage.clear();
    window.location.reload();
  }
  invite = (e) => {
    e.preventDefault();
    const form = document.getElementById('invite');
    log(this.state.inviteType);
    axios.post(`${server}/invite`, {email: form.email.value, userType: this.state.inviteType}, {headers:{Authorization: window.localStorage.getItem('access_token')}})
    .then((res) => {
      log(res.data);
    })
    .catch((err) => log(err));
  }
  render(){
  const user = jwt.decode(window.localStorage.getItem('access_token'), key);
    if(this.main.state.main !== 'loaded') return <div/>;
    return (
      <div className="Dashboard-wrapper"> 
        <div className="Dashboard-header">
          <div>
            {user ? user.admin ? user.admin.role === 'master' ? <div onClick={() => this.setState({settings: !this.state.settings, inviteForm: false})}><i style={{margin: '1rem'}} className="fas fa-cogs -- hover-red -- pointer" /></div> : null : null : null}
          </div>
          <div style={{flex:1, fontFamily: 'Times New Roman'}}>Beta v1.0</div>
          <div onClick={() => this.logout()}>
            <i style={{margin: '1rem'}} className="fas fa-sign-out-alt -- hover-red -- pointer" />
          </div>
        </div>
        <div className="Dashboard-dropdown" style={this.state.settings ? {height: '3rem'} : null}>
          <div className="Dashboard-dropdown-btn" onClick={() => this.setState({settings: false, inviteForm: true, inviteType: 'admin'})} style={{display: 'flex', justifyContent: 'center', alignItems: 'center',background: 'rgb(38,38,38)', padding: '1rem', cursor: 'pointer'}}>CREATE ADMIN</div>
          <div className="Dashboard-dropdown-btn" onClick={() => this.setState({settings: false, inviteForm: true, inviteType: 'artist'})} style={{display: 'flex', justifyContent: 'center', alignItems: 'center',background: 'rgb(38,38,38)', padding: '1rem', cursor: 'pointer'}}>CREATE ARTIST</div>
          <div className="Dashboard-dropdown-btn" onClick={() => window.confirm('Are You Sure You Want To Reset Rotation') ? this.resetCount() : null} style={{display: 'flex', justifyContent: 'center', alignItems: 'center',background: 'rgb(38,38,38)', padding: '1rem', cursor: 'pointer'}}>RESET ROTATION</div>
        
        </div>
        <div className="Dashboard-dropdown" style={this.state.inviteForm ? {height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center'} : null}>
          <form id="invite" className="Dashboard-admin-form" style={{height: '90%', width: '90%',display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgb(38,38,38)', padding: '1rem'}}>
            <input name="email" placeholder="EMAIL" type="email"/>
            
            <div style={{textAlign: 'right', width: '80%', }}>
              <button onClick={(e) => this.invite(e)} >SUBMIT</button>
              <button onClick={(e) => {e.preventDefault(); this.setState({settings: false, inviteForm: false,inviteType: null})}}>CANCEL</button>
            </div>
          </form>
        </div>
        <Rotation />
        <Appointments />
      </div>
    );
  }
}