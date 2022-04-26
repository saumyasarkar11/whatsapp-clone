import React from 'react'
import { Avatar } from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import './SearchResults.css'

export default function SearchResults(props) {    
  return (
    <div className='sidebarChat' onClick={() => props.createConv(props.item.user_id)} >
      <Avatar src={props.item.image} />
      <div className='sidebarChat_info'>
          <span>{props.item.name}</span>
          <p>{props.item.bio}</p>
      </div>
    </div>
  )
}
