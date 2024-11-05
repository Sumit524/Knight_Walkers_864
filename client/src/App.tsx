import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './App.css'
import ChatRoom from './components/chatRoom/ChatRoom';

function App() {
    const [message, setMessage]= useState<string>('');
    useEffect(()=>{
        axios.get('http://localhost:8000/api/hello/')
        .then((response)=>{
           console.log("response", response);
        })
        .catch((error)=>{
          console.log("error ", error);
        })
    }, [])

  return (
    <>
      <ChatRoom />
    </>
  )
}

export default App
