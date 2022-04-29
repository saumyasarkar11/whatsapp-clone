import React, { useEffect, useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Pusher from 'pusher-js';
import axios from './axios';
import Login from './components/Login';


export default function App (){
  const [messages, setMessages] = useState([]);
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem('user') === null || localStorage.getItem('rememberMe') === 'false'
    ? false : true
  );  
  const [loading, setLoading] = useState(false);
  const [currChat, setCurrChat] = useState({
    "currUser": 0,
    "conv_id": 0
  });
  const [allUsers, setAllUsers] = useState([]);
  const [messageSend, setMessageSend] = useState("");
  const [conversations, setConversations] = useState([]);

  async function fetchConv(){
    await axios.get(`/api/v1/conversations?id=${localStorage.getItem('user_id')}`).then(response => {
      setConversations((prevData) => response.data);
    });
  }

  useEffect(() => {
      axios.get(`/api/v1/allUsers?id=${localStorage.getItem('user_id')}`).then((response) => {
        setAllUsers(response.data);      
      }) 

      fetchConv();

      setTimeout(()=>{
        setLoading(false);
      }, 500)

      setInterval(() => {
          axios.put(`api/v1/setStatus?id=${localStorage.getItem('user_id')}`);
        
          axios.get(`/api/v1/allUsers?id=${localStorage.getItem('user_id')}`).then((response) => {
            setAllUsers(response.data);      
          })
      }, 30000);
  }, [loggedIn]) 
  

  useEffect(() => {
    axios.get(`/api/v1/messages/sync?convId=${currChat.conv_id}`).then((response) => {
      setMessages(response.data);
    })
    fetchConv();
    if(currChat.currUser != 0){
      axios.put(`/api/v1/setSeen?convId=${currChat.conv_id}&user=${currChat.currUser}`);
    }
  }, [currChat])

  function sendMsg(){
    const date = new Date();
    let month; let minutes; let day; let seconds; let hours;

    if(date.getMonth()<10){
      month = '0' + date.getMonth();
    } else {
      month = date.getMonth();
    }
    if(date.getMinutes()<10){
      minutes = '0' + date.getMinutes();
    } else {
      minutes = date.getMinutes();
    }
    if(date.getSeconds()<10){
      seconds = '0' + date.getSeconds();
    } else {
      seconds = date.getSeconds();
    }
    if(date.getHours()<10){
      hours = '0' + date.getHours();
    } else {
      hours = date.getHours();
    }
    if(date.getDate()<10){
      day = '0' + date.getDate();
    } else {
      day = date.getDate();
    }

    const data = 
    {
      "message": messageSend,
      "convId": currChat.conv_id,
      "from": localStorage.getItem('user_id'),
      "date": date.getFullYear()+"-"+month+"-"+day,
      "time": hours+":"+minutes+":"+seconds,
      "seen": false      
    }
    axios.post('api/v1/messages/new', data);
    setMessageSend("");
  }

  useEffect(() => {
    const pusher = new Pusher('c1be2d02d293fe98ccbc', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    const channel1 = pusher.subscribe('messages');
    channel.bind('inserted', function(newMessage) { 
      setMessages([...messages, newMessage])  
      fetchConv();        
    });
    channel1.bind('updated', function(newMessage) {  
      const updatedList = messages.map((item) => {
        if(item._id === newMessage._id){
           item.seen = true; return item; 
        } else {
          return item;
        }
      })
      setMessages(updatedList);      
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      channel1.unbind_all();
      channel1.unsubscribe();
    }
    
  }, [messages]) 

  function toggleChat(user, conv){    
    setCurrChat(() => {
        return ({
          "currUser": user,
          "conv_id": conv
        })
    })  
  }

  function setMsg(content){
    setMessageSend(content);
  }

  function createConv(id){
    const date = new Date();
    let month; let day;

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

    const data = 
    {
      "user1": localStorage.getItem('user_id'),
      "user2": id,
      "startDate": date.getFullYear()+'-'+month+'-'+day,
      "blocked": 0
    }
    axios.post('api/v1/conversations/new', data).then((response) => {
      toggleChat(id, parseInt(response.data));
    });
  }

  function createConvUtil(id){   
    createConv(id);
  }

  let DashBoard;

  loading == false   
  ? DashBoard = 
  <div className="app">
    <div className='app_body'>
      <Sidebar conversations={conversations} createConv={createConvUtil} toggle={toggleChat} users={allUsers} messages={messages}/>
      <Chat curr={currChat} send={sendMsg} messages={messages} setMsg={setMsg} msg={messageSend} users={allUsers} />
    </div>      
  </div>

  :DashBoard = 
  <div className="app">
    <div className='app_loader'>

    </div>      
  </div>

  return (
    loggedIn ? DashBoard : <Login setStat={setLoggedIn} loader={setLoading}/> 
    
  );
}