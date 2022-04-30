import React, {useEffect, useState} from 'react'
import { Avatar } from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import './SidebarChat.css'
import axios from '../axios';

export default function SidebarChat(props) {
  let conv_id;
  const date = new Date();
  let month; let day; let year;
  year = date.getFullYear();
  if(date.getMonth()<10){
    month = '0' + date.getMonth();
  } else {
    month = date.getMonth();
  }

  if(date.getDate()<10){
    day = '0' + date.getDate();
  } else {
    day = date.getDate();
  }
  const [lastMsg, setLastMsg] = useState({});
  const id = localStorage.getItem('user_id');
  if(props.item.user1 == id){
    conv_id = props.item.user2;
  } else {
    conv_id = props.item.user1;
  }  
  let icon;
  icon = (lastMsg.seen) ? <DoneAllIcon style={{color: "#1a8fb9"}} /> : <DoneAllIcon />;
  let dateTime;
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
                <div className='info_div'><span className='info_name'>{item.name}</span><span className='last_time'>{(lastMsg.date === year+'-'+month+'-'+day) ? lastMsg.time : lastMsg.date}</span></div>
                <p>{id == lastMsg.from ? icon : ''}&nbsp;{lastMsg.msg}</p>
            </div>
        </div>
    }
  })

  

  return element;
}
