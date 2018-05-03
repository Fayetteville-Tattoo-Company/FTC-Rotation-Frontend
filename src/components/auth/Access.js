import React, {Component} from 'react';
import './Access.css';
export default class Access extends Component {
  constructor(props){
    super(props);
    this.main = props.main;
  }
  authorize = (e) => {
    e.preventDefault();
    this.main.setState({main: 'loading'});
    this.main.verifyToken(e.target.token.value, e.target.token);    
    e.target.token.value = "";
    e.target.token.blur();
  }

  sizeUp = () => document.getElementById('logo').style.width = '80%';
  sizeDown = () => document.getElementById('logo').style.width = '40%';
  render(){
    return (
      <form onSubmit={(e) => this.authorize(e)} className="Access-wrapper" >
        <div  className="Access-section">
          <img id="logo" alt="logo" src={'images/ftc-logo-black.png'} width="80%"/>
        </div>
        <div className="Access-section">
          <p>Please Enter The Access Token</p>
          <input onFocus={(e) => window.innerHeight > window.innerWidth ? this.sizeDown() : null} onBlur={() => this.sizeUp()} name="token" placeholder="ACCESS TOKEN" autoComplete="off"/>
        </div>
      </form>
    );
  }
}