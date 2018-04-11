import React, {Component} from 'react';
import './Rotation.css';

export default class Rotation extends Component {
  render(){
    return (
      <div className="Rotation-wrapper">
        <div className="Rotation-item">
          <div className="Artist-img">
            <img alt="artist" src="https://scontent-atl3-1.xx.fbcdn.net/v/t1.0-9/28055656_10211614126494102_1213128860185249397_n.jpg?_nc_cat=0&oh=bddd84178cefd125cfaa639146be7b56&oe=5B6E2A80" height="100%"/>
          </div>
          <div className="Artist-info">
            <p> #1 </p>
            <p> ARTIST NAME </p>
          </div>
          <div className="Rotation-item-info" >
            <p style={{alignSelf: 'flex-start'}}> ID: lkjsddkjsdlfkjsdlfkjsdflkjsdf87987sdflkjsdf98uwefkjlk </p>
            <button>ACTIVATE</button>
          </div>
        </div>
      </div>
    );
  }
}