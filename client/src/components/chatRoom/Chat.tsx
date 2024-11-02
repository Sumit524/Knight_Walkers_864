// import React, { useEffect, useRef, useState } from "react";

// interface ChatProps {
//     roomName: string;
// }

// const Chat: React.FC<ChatProps> = ({roomName}) => {
//     const [message, setMessage]= useState<string>('');
//     const [messages, setMessages]= useState<string[]>([]);
//     const socketRef= useRef<WebSocket | null>(null);

//     useEffect(() => {
//          socketRef.current= new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
//          socketRef.current.onmessage= (event) => {
//             const data= JSON.parse(event.data);
//             setMessages((prevMessages) => [...prevMessages, data.message]);
//          };

//          return ()=>{
//             socketRef.current?.close();
//          };
//     }, [roomName]);
    
//     const sendMessage= () => {
//         if(socketRef.current && socketRef.current.readyState=== WebSocket.OPEN){
//             socketRef.current.send(JSON.stringify({message}));
//             setMessage('');
//         } else{
//             console.error('WebSocket is not open');
//         }
//     };

//     return (
//          <div>
//             <div>
//                 <h2>ChatRoom: {roomName}</h2>
//                 {messages.map((msg, index) => (
//                     <div key={index}>{msg}</div>
//                 ))}
//             </div>
//             <input 
//             type="text" 
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             />
//             <button onClick={sendMessage}>Send</button>
//          </div>
//     );
// };

// export default Chat;



import React, { useEffect, useRef, useState } from "react";

interface ChatProps {
    roomName: string;
}

const Chat: React.FC<ChatProps> = ({ roomName }) => {
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<string[]>([]);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        socketRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, data.message]);
        };

        return () => {
            socketRef.current?.close();
        };
    }, [roomName]);

    const sendMessage = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ message }));
            setMessage('');
        } else {
            console.error('WebSocket is not open');
        }
    };

    return (
        <div className="w-full max-w-md p-4 bg-gray-700 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Chat Room: {roomName}</h2>
            <div className="h-64 overflow-y-auto p-2 mb-4 bg-gray-900 rounded-md">
                {messages.map((msg, index) => (
                    <div key={index} className="p-2 mb-2 bg-blue-500 rounded-lg text-white">
                        {msg}
                    </div>
                ))}
            </div>
            <div className="flex">
                <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-grow p-2 rounded-l-md text-gray-900 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your message..."
                />
                <button 
                    onClick={sendMessage} 
                    className="p-2 bg-blue-600 rounded-r-md hover:bg-blue-700 text-white">
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
