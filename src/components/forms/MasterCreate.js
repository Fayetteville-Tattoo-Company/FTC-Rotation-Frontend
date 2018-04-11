import React, {Component} from 'react';
import './MasterCreate.css'

export default class MasterCreate extends Component {
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
  render(){
    return (
      <form className="Master_Create-wrapper">
        <header><h2>MASTER SIGNUP</h2></header>
        
        <div style={{height: '100%', width: '100%',flexWrap: 'wrap', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        
          <div style={{width: '80%', alignItems:'center', padding: '1%', display: 'flex', flexDirection: 'column', borderRadius: 5,minWidth:300, maxWidth: 400}}>
            <div className="Master_Create-image">
              <img id="logo" alt="logo" id="preview" src={'images/ftc-logo-black.png'} width="100%"/>
              <input style={{height: '100%', width: '100%', position: 'absolute', opacity: 0, cursor: 'pointer'}}onChange={(e) => this.preview(e)} type="file" />
              
            </div>            
            <input name="username" placeholder="username" />
            <input name="name" placeholder="name" />
            <input name="password" placeholder="password" type="password"/>
            <input name="confirm" placeholder="confirm" type="password" />
          </div>
        </div>
      </form>
    );
  }
}