import React, {useEffect, useState} from 'react'
import { Avatar } from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import './SidebarChat.css'
import axios from '../axios';

export default function SidebarChat(props) {
  let conv_id;
  const [lastMsg, setLastMsg] = useState({msg: '', from: '', seen: '', conv_id: ''});
  const id = localStorage.getItem('user_id');
  if(props.item.user1 == id){
    conv_id = props.item.user2;
  } else {
    conv_id = props.item.user1;
  }  
  let icon;
  icon = (lastMsg.seen) ? <DoneAllIcon style={{color: "#1a8fb9"}} /> : <DoneAllIcon />;

  useEffect(() => {
    axios.get(`/api/v1/conversations/lastTxt/?id=${props.item.conversation_id}`).then((response) => {
      setLastMsg(response.data);
    })
  }, [props.messages])
  
  let element;

  props.users.map((item) => {
    if(item.user_id == conv_id){
      element = 
        <div className='sidebarChat' id={conv_id} onClick={() => props.toggle(conv_id, props.item.conversation_id)}>
            <Avatar src={item.image} />
            <div className='sidebarChat_info'>
                <span>{item.name}</span>
                <p>{id == lastMsg.from ? icon : ''}&nbsp;{lastMsg.msg}</p>
            </div>
        </div>
    }
  })

  

  return element;
}
