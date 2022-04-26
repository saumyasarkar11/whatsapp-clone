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

    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);    
    const id = localStorage.getItem('user_id')
    let dep;

    useEffect(() => {        
        axios.get(`/api/v1/users?search=${search}&leave=${id}`).then((response) => {
            setUsers(response.data);            
        })
    }, [search])
      
    function showUsers(event){
        if(event.target.value === ""){
            setSearch(" ");
        }
        setSearch(event.target.value);
    } 

    if(users.length){
        dep = users.map((item) => {
            return(
                <SearchResults createConv={props.createConv} key={item.id} item={item} />
            )
        })
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
                <input type='number' value={search} name="search_field" onChange={showUsers} placeholder='Search or start a new chat' autoComplete='off'/>
            </div>
        </div>


        <div className='sidebar_chats'>{dep}</div>
    </div>
  )
}
