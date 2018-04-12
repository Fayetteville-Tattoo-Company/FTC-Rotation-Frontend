import React, {Component} from 'react';
import {Rotation, Appointments} from "../";
import './Dashboard.css';
const key = require('../../config.json').secret;
const jwt = require('json-web-token');

export default class Dashboard extends Component {
  render(){
  const user = jwt.decode(key, window.localStorage.getItem('access_token')).value;
  console.log(user);
    return (
      <div className="Dashboard-wrapper"> 
        <div className="Dashboard-header"> DASHBOARD {} </div>
        <Rotation />
        <Appointments />
      </div>
    );
  }
}