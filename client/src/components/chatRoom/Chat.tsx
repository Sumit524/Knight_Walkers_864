import React, { useEffect, useRef, useState } from "react";

interface ChatProps {
    roomName: string;
}

const Chat: React.FC<ChatProps> = ({roomName}) => {
    const [message, setMessage]= useState<string>('');
    const [messages, setMessages]= useState<string[]>([]);
    const socketRef= useRef<WebSocket | null>(null);

    useEffect(() => {
         socketRef.current= new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
         socketRef.current.onmessage= (event) => {
            const data= JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, data.message]);
         };

         return ()=>{
            socketRef.current?.close();
         };
    }, [roomName]);
    
    const sendMessage= () => {
        if(socketRef.current && socketRef.current.readyState=== WebSocket.OPEN){
            socketRef.current.send(JSON.stringify({message}));
            setMessage('');
        } else{
            console.error('WebSocket is not open');
        }
    };

    return (
         <div>
            <div>
                <h2>ChatRoom: {roomName}</h2>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
         </div>
    );
};

export default Chat;