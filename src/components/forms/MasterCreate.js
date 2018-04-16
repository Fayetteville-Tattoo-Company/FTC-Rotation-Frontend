import React, {Component} from 'react';
import axios from 'axios';
import './MasterCreate.css'
const jwt = require('json-web-token');
const server = process.env.SERVER;
const key = process.env.KEY;

export default class MasterCreate extends Component {
  constructor(props){
    super(props);
    this.main = props.main;
  }
  preview = (evt) => {  
    const img = evt.target.files[0];
    if(img){
      if(img.type.split('/')[0] !== 'image') return console.log('UNSUPPORTED TYPE');
      const reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = (e) => {
        const preview = document.getElementById('preview');
        preview.src = e.target.result || "images/ftc-logo-black.png";
      }
    } 
  }
  create = (e) => {
    e.preventDefault();
    const {username, name, password, confirm} = e.target;
    !username.value ? username.style.border = '2px solid red' : username.style.border = '2px solid green';
    !name.value ? name.style.border = '2px solid red' : name.style.border = '2px solid green';
    !password.value ? password.style.border = '2px solid red' : password.style.border = '2px solid green';
    !confirm.value ? confirm.style.border = '2px solid red' : confirm.style.border = '2px solid green';
    if(!username.value || !name.value || !password.value || !confirm.value) return alert('Form Must Be Completed');
    if(password.value !== confirm.value){
      password.style.border = '2px solid red';
      confirm.style.border = '2px solid red';
      return alert('PASSWORDS DONT MATCH');
    } 
     
      const fields = {
        username: username.value,
        name: name.value,
        password: password.value,
        role: 'master'
      }
      const token = jwt.encode(key, fields).value;
      axios.post(`${server}/create-admin`, {token}, {headers:{Authorization:window.localStorage.getItem('access_token')}})
      .then((res) => {
        if(res.data.access === 'AUTHORIZED'){
          window.localStorage.setItem('access_token', res.data.token);
          return this.main.setState({main: 'loading', status: 'authenticated'});
        }
        console.log('UNAUTHORIZED');
      })
      .catch((err) => {
        console.log(err);
      });
    
  }

  checkUsername = (e) => {
    const username = document.getElementsByName('username')[0];
    if(!username.value) username.style.border = '2px solid black';
    if(username.value)
    axios.get(`${server}/exist/${username.value}`, {headers:{Authorization: window.localStorage.getItem('access_token')}})
    .then((res) => {
      if(res.data === 1) return username.style.border = '2px solid green';
      if(res.data === 0) return username.style.border = '2px solid red';
    })
    .catch((err) => {
      console.log(err);
    })
  }

  render(){
    return (
      <form className="Master_Create-wrapper" onSubmit={(e) => this.create(e)}>
        <header><h2>MASTER SIGNUP</h2></header>
        
        <div style={{ width: '100%',flexWrap: 'wrap', display: 'flex', justifyContent: 'center', flexDirection:'column', alignItems: 'center'}}>
        
          <div style={{width: '80%', alignItems:'center', display: 'flex', flexDirection: 'column', borderRadius: 5}}>
            <div className="Master_Create-image">
              <img className="logo" alt="logo" id="preview" src={'images/ftc-logo-black.png'} width="100%"/>
              <input style={{ width: '100%', position: 'absolute', opacity: 0, cursor: 'pointer'}}onChange={(e) => this.preview(e)} type="file" />
              
            </div> 
            <div style={{display: 'flex', flexDirection: 'row', width: "100%",  flexWrap: 'wrap', maxWidth: 330, justifyContent: 'center', alignItems: 'center'}}>           
              <input autoComplete="off" onChange={(e) => this.checkUsername(e)} name="username" placeholder="username" />
              <input autoComplete="off" name="name" placeholder="name" />
              <input name="password" placeholder="password" type="password"/>
              <input name="confirm" placeholder="confirm" type="password" />
              <input type="submit" style={{display: 'none'}}/>
            </div>
          </div>
        </div>
      </form>
    );
  }
}