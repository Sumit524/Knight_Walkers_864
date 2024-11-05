import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './App.css'
import ChatRoom from './components/chatRoom/ChatRoom';
import AvailableLocations from "./locations/AvailableLocations"

function App() {
    const [message, setMessage]= useState<string>('');
    useEffect(()=>{
        axios.get('http://localhost:8000/api/hello/')
        .then((response)=>{
           console.log("response from server", response);
        })
        .catch((error)=>{
          console.log("error ", error);
        })
    }, [])

  return (
    <>
      <ChatRoom /><AvailableLocations/>
    </>
  )
}

export default App
