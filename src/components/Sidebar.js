import React, { useState, useEffect } from 'react'
import './Sidebar.css';
import ChatIcon from '@mui/icons-material/Chat';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SidebarChat from './SidebarChat';
import axios from '../axios';
import SearchResults from './SearchResults';

export default function Sidebar(props) {
    
    const [users, setUsers] = useState([]);    
    const id = localStorage.getItem('user_id')
    let dep;

    useEffect(() => {        
        axios.get(`/api/v1/users?search=${props.search}&leave=${id}`).then((response) => {
            setUsers(response.data);            
        })
    }, [props.search])
      
    function showUsers(event){
        if(event.target.value === ""){
            props.searchFunc(" ");
        }
        props.searchFunc(event.target.value);
    } 

    if(props.search.length != 0){
        console.log(props.search);
        if(users.length){
            dep = users.map((item) => {
                return(
                    <SearchResults createConv={props.createConv} key={item.id} item={item} />
                )
            })
        } else {
            dep = <div className="noconv">Search results do not match any user</div>
        }       
    } else {
        if(props.conversations.length == 0){
            dep = <div className="noconv">No prior conversations</div>
        } else {
            dep = props.conversations.map((item) => {
                return(
                    <SidebarChat key={item.conversation_id} messages={props.messages} item={item} toggle={props.toggle} users={props.users} />
                )
            })
        }        
    }    

  return (
    <div className="sidebar">
        <div className='sidebar_header'>
            <Avatar src={localStorage.getItem('image')}/>
            <div className='sidebar_headerRight'>
                <IconButton>
                    <DonutLargeIcon />
                </IconButton>
                <IconButton>
                    <ChatIcon />
                </IconButton>
                <IconButton>
                    <MoreVertIcon />
                </IconButton>               
            </div>
        </div>

        <div className='sidebar_search'>
            <div className='sidebar_searchContainer'>
                <SearchIcon />
                <input type='number' value={props.search} name="search_field" onChange={showUsers} placeholder='Search or start a new chat' autoComplete='off'/>
            </div>
        </div>


        <div className='sidebar_chats'>{dep}</div>
    </div>
  )
}
