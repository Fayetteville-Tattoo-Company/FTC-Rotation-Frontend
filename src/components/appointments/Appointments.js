import React, {Component} from 'react';
import axios from 'axios';
import './Appointments.css';
import { format } from 'url';
const jwt = require('json-web-token');
const server = process.env.SERVER || require('../../config.json').server;
const key = process.env.KEY || require('../../config.json').secret;

const Appointment = (props) => {
  const date = new Date(props.createdAt);
  const curr = new Date().toISOString().split('T')[0];
  return (
    
    <tr>
      <td>{date.toISOString().split('T')[0] !== curr ? <span style={{color: 'red'}}>{date.toISOString().split('T')[0]}</span> : null} {date.toLocaleTimeString()}</td>
      <td>{props.client}</td>
      {props.artist ? <td>{props.artist}</td> : null}
      <td>{props.date.split('T')[0]}</td>
      <td>{props.time}</td>
      <td className="Appointments-id" onClick={(e) => console.log(e)} style={{background: 'black', color: 'white', flex: 1, display: 'flex', width: '100%',position: 'absolute'}}>
        
        {
          props.rotationID ? 
            <i style={{paddingLeft: '1%', paddingRight: '0.4rem'}} className="fas fa-id-card"/> 
          : null
        }{props.rotationID} 

        {
          props.number ? 
            <i style={{paddingLeft: '1%', paddingRight: '0.4rem'}} className="fas fa-phone-square" /> 
          : null
        }{props.number} 
        
        {props.master ? <button onClick={() => props.main.removeAppointment(props.id)}><i style={{paddingLeft: '1%', paddingRight: '0.4rem', cursor: 'pointer'}} className="fas fa-trash-alt -- hover-red" /></button> : null}
      </td>
    </tr>
  );
}

export default class Appointments extends Component {
  constructor(){
    super();
    this.state = {appointments: []}
  }
  componentWillMount(){   
    this.findAppointments();
    setInterval(() => this.findAppointments(), 5000);
  }
  componentWillUnmount(){
    clearInterval();
  }
  removeAppointment = (id) => {
    axios.delete(`${server}/remove-appointment/${id}`, {headers:{Authorization: window.localStorage.getItem('access_token')}})
    .then((res) => alert(res.data))
    .catch((err) => alert(err));
  }
  findAppointments = () => {
    axios.get(`${server}/appointments`, {headers:{Authorization: window.localStorage.getItem('access_token')}})
    .then((res) => {
      if(res.data.length !== this.state.appointments.length) return this.setState({appointments: res.data});
    })
    .catch((err) => console.log(err));
  }
  render(){
    const user = jwt.decode(key, window.localStorage.getItem('access_token')).value;
    
   return user ? (
      <div className="Appointments-wrapper">
        <div style={{textAlign: 'left', padding: '0.5rem 1rem',borderTop: '1px solid white',borderBottom: '1px solid white'}}>
          {user.admin ? user.admin.role !== "master" ? <i className="fas fa-key"/> : <i className="fas fa-chess-king" />: <i className="fas fa-paint-brush" />} {user.admin ? <span style={{color: 'red'}}>{user.admin.role ? user.admin.role.toUpperCase() : null}</span> : null} {user.artist ? `#${user.artist.location}` : null} {(user.admin ? user.admin.name.toUpperCase() : user.artist ? user.artist.name.toUpperCase() : null)}  
        </div>
        <div className="Appointments-list">
        
          {this.state.appointments.length ?

            <table style={{width: '100%'}}>
              <tbody>
                <tr>
                  <th>CREATED</th>
                  <th>CLIENT</th>
                  {user.admin ? <th>ARTIST</th> : null}
                  <th>DATE</th>
                  <th>TIME</th>
                </tr>
                {
                  this.state.appointments.map((appointment, i) => {
                    return <Appointment 
                              key={i} 
                              main={this}
                              id={appointment._id}
                              createdAt={appointment.createdAt}
                              time={appointment.time}
                              client={appointment.client} 
                              date={appointment.date}
                              rotationID={user.admin ? appointment.rotationID._id : null} 
                              artist={user.admin ? appointment.rotationID.artist.name : null}
                              number={user.admin ? appointment.number : null}
                              master={user.admin ? user.admin.role === 'master' ? 1 : 0  : 0}
                            />
                  }) 
                }
              </tbody>
            </table>
            :
            <div>NO APPOINTMENTS </div>
          }
        </div>
      </div>
    )
    : <div/>;
  }
}