import { Avatar, IconButton } from '@mui/material'
import React from 'react'
import './Chat.css'
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import Illustration from '../images/illustration.png';
import LockIcon from '@mui/icons-material/Lock';
import DoneAll from '@mui/icons-material/DoneAll';

export default function Chat(props) {

  function sendMessage(e){
    e.preventDefault();
    props.send();
  }

  let display;

  if(props.curr.currUser == 0){
    display = 
        <div className='chat_initial'>
            <img src={Illustration} />
            <h1>WhatsApp Web <span>NEW</span></h1>          
            <p>
                Now send and receive messages without keeping your phone online.<br />
                Use WhatsApp on upto 4 linked devices and 1 phone at the same time.
            </p>
            <p id='encrypted_tag'>
            <LockIcon />
            End-to-end encrypted
            </p>
        </div>
  } else {
    let user;

    for(let i=0; i<props.users.length; i++){
      if(props.users[i].user_id == props.curr.currUser){
        user = props.users[i];     
        break;
      }  
    }
    const tick = <DoneAll style={{color: "#1a8fb9"}} />;
    const messageBody = 
        
    display =    
        <div className="chat">
            <div className='chat_header'>
                <Avatar src={user.image}/>
                <div className='chat_headerInfo'>
                    <span className="head">{user.name}</span>
                    <p>{user.status}</p>   
                </div>
                <div className='chat_headerRight'>
                    <IconButton>
                        <SearchIcon />
                    </IconButton>   
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>   
                </div>
            </div>

            <div className="chat_body">                
                {props.messages.map((message) => (
                    
                    <div>                            
                        <div className={`chat_message ${message.from == localStorage.getItem('user_id') && 'chat_receiver'}`}>
                            <span className='chat_msg'>{message.message}</span>
                            <span className='chat_time'>
                                {message.time}
                                {message.from == localStorage.getItem('user_id') && (message.seen == true ? tick : <DoneAll />)}
                            </span>                
                        </div>
                    </div>
                
                ))}          
            </div>
            <div className='chat_footer'>
                <IconButton>
                    <InsertEmoticonIcon />
                </IconButton>
                <IconButton>
                    <AttachFileIcon />
                </IconButton>  
                <form>
                    <input onChange={(event) => {props.setMsg(event.target.value);}} name="message" value={props.msg} placeholder="Type a message" type="text" autoComplete="off" required/>
                    <button onClick={sendMessage} type="submit" hidden>Send a message</button>
                </form>
                <IconButton>
                    <MicIcon />
                </IconButton>            
            </div>
        </div> 
  }

  return display; 
}
