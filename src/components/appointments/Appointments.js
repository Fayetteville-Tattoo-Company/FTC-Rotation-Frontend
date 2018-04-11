import React, {Component} from 'react';
import './Appointments.css';

export default class Appointments extends Component {
  render(){
    return (
      <div className="Appointments-wrapper">
        <header> APPOINTMENTS</header>
        <div className="Appointments-list">
          <div className="Appointments-item">
            <div className="design-img">
              <img alt="design"/>
            </div>
            <div className="Appointments-info">
              <span> 04/20/2018 </span>
              <span> Client Namejsjdfjsdjfsdfj </span>
              <span> Artist Name </span>
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}