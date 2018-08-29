import React, {Component} from 'react';
import axios from 'axios';
import './Rotation.css';
import {log} from '../../tools';
const key = process.env.REACT_APP_KEY;
const server = process.env.REACT_APP_SERVER;
const jwt = require('jsonwebtoken');

export default class Rotation extends Component {
  constructor(){
    super();
    this.state = {artists: [], height: window.innerHeight, width: window.innerWidth, rotation: null, form: false, curr: (new Date()).toISOString().split('T')[0],  date: (new Date()).toISOString().split('T')[0]};
    this.par = false;
    this.dash = false;
  }
  componentWillMount(){
    this.findRotation();
    setInterval(() => this.findRotation(), 5000);
  }
  componentDidMount(){
    axios.get(`${server}/artists`, {headers:{Authorization:window.localStorage.getItem('access_token')}})
    .then((res) => {
      log('running');
      this.setState({artists: res.data});
    })
    .catch((err) => console.error(err));
  }

  componentWillUnmount(){
    clearInterval();
  }

  findRotation = () => {
    axios.get(`${server}/rotation`, {headers:{Authorization:window.localStorage.getItem('access_token')}})
    .then((res) => {
      if(res.data !== this.state.rotation)
        this.setState({rotation: res.data});
    })
    .catch((err) => console.error(err));
  }
  addClient = (e) => {
    e.preventDefault();
    if(!e.target.client.value || !e.target.number.value) return alert('Client Name & Number Required');
    if(e.target.date.value !== this.state.curr && e.target.time.value === '--') return alert('Time Required For Scheduled Appointment');
    axios.put(`${server}/create-appointment`, {
      client: e.target.client.value,
      number: e.target.number.value,
      date: e.target.date.value,
      artist: this.state.artists[this.state.rotation]._id,
      time: e.target.time.value === '--' ? (new Date()).toLocaleTimeString() : e.target.time.value
    }, {headers:{Authorization: window.localStorage.getItem('access_token')}})
    .then((res) => {
      log(res.data);
      this.setState({form: false, date: this.state.curr})
    })
    .catch((err) => console.error(err));
  }

  checkNumber = (e) => {
    if(Number.isNaN(Number(e.target.value.split('')[e.target.value.length - 1])) || e.target.value.length > 13) {
      const num = e.target.value.split('');
      num.pop();
      e.target.value = num.join('');
    }
    if(e.target.value.length < 3) this.par = false;
    if(e.target.value.length < 8) this.dash = false;
    
    if(e.target.value.length >= 3 && !this.par){
      const num = e.target.value.split('');
      num.splice(3,0,')');
      num.unshift('(');
      e.target.value = num.join('');
      this.par = true;
    }
    if(e.target.value.length >= 8 && !this.dash){
      const num = e.target.value.split('');
      num.splice(8,0,'-');
      e.target.value = num.join('');
      this.dash = true;
    }
  }

  render(){
    const user = jwt.decode(window.localStorage.getItem('access_token'), key);
    window.onresize = () => this.setState({height: window.innerHeight, width: window.innerWidth});
    return (
      <div className="Rotation-wrapper">
      {
        this.state.form ?
        <div className="Rotation-form">
        
          <form onSubmit={(e) => this.addClient(e)}>
            <input name="client" placeholder="Client Name" autoFocus="on"/>
            <input onChange={(e) => this.checkNumber(e)} name="number" placeholder="Client Number" />
            <input style={{fontSize: '1rem'}} value={this.state.date} onChange={(e) => this.setState({date: e.target.value})} name="date" type="date" placeholder="Appointment Date" />
            <div style={{width: '90%',margin: '0.5rem', display: 'flex', justifyContent: 'flex-start'}}>
            <label style={{marginRight: '0.5rem'}}>Time: </label>
            <select style={{textAlign: "center"}} name="time" placeholder="Appointment Time">
              <option style={{height: 100}}>--</option>
              <option>12PM</option>
              <option>1PM</option>
              <option>2PM</option>
              <option>4PM</option>
              <option>5PM</option>
              <option>6PM</option>
              <option>7PM</option>
              <option>8PM</option>
              <option>9PM</option>
              <option>10PM</option>
              <option>11PM</option>
              
            </select>
            </div>
            <div style={{display: 'flex', paddingRight: '1rem', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', width: '100%'}}>
              <button><i style={{fontSize: '1.5rem', color: 'green', cursor: 'pointer'}} className="far fa-check-circle"/></button>
              <button onClick={(e) => {e.preventDefault(); this.setState({form: false, date: this.state.curr})}}><i style={{fontSize: '1.5rem', color: 'red'}} className="fas fa-ban"/></button>
            </div>
          </form>
        
        </div>
        : null
      }
      {this.state.artists[this.state.rotation] ?  <div className="Rotation-item">
          <div className="Artist-img">
            <img alt="artist" src={`${server}/image/artist/${this.state.artists[this.state.rotation].username}`} onError={(e) => e.target.src = 'images/ftc-logo-black.png'}height="100%"/>
          </div>
          <div className="Artist-info" style={this.state.height > this.state.width ? {borderRadius: 5} : null}>
            <p>{this.state.artists[this.state.rotation].location} </p>
            <p> {this.state.artists[this.state.rotation].name} </p>
          </div>
          <div className="Rotation-item-info" style={this.state.height < this.state.width ? {borderBottomLeftRadius: 10, borderTopLeftRadius: 10} : null}>
            <p style={{alignSelf: 'flex-start'}}> <i style={{fontSize: '1.5rem', margin: '0 0.5rem'}} className="fas fa-id-badge"/> {this.state.artists[this.state.rotation]._id} </p>
            {user.admin ? <button style={{padding: '0.5rem', marginRight: '0.2rem', background: 'rgb(35,35,35)', borderRadius: '100%', outline: 'none', cursor: 'pointer'}} onClick={() => this.setState({form: true})}><i style={{fontSize: '2rem'}} className="fas fa-syringe -- hover-red"/></button> : null}
          </div>
        </div> : null}
      </div>
    );
  }
}