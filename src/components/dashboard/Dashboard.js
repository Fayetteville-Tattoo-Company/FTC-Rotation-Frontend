import React, {Component} from 'react';
import {Rotation, Appointments} from "../";
import './Dashboard.css';

export default class Dashboard extends Component {
  render(){
    return (
      <div className="Dashboard-wrapper"> 
        <div className="Dashboard-header"> DASHBOARD </div>
        <Rotation />
        <Appointments />
      </div>
    );
  }
}