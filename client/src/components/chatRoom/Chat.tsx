import React, { useState, useRef, useEffect } from "react";

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
        <div className="w-full max-w-md p-4 bg-yellow-200 rounded-lg shadow-md mt-0"style={{ boxShadow: '0 2px 5px rgba(255, 255, 255, 0.7)' }}>
            <h2 className="text-xl font-semibold mb-4 bg-red-500 rounded-md p-1 mt-0" >Chat Room: <strong className="text-black">  {roomName}</strong></h2>
            <div className="bg-white h-64 overflow-y-auto p-2 mb-4  rounded-md" style={{ boxShadow: '2px 2px 2px rgba(18, 17, 17, 0.7)' }}>
                {messages.map((msg, index) => (
                    <div key={index} className="p-2 mb-2 bg-green-300 rounded-lg text-black" >
                        {msg}
                    </div>
                ))}
            </div>
            <div className="flex">
                <input 
                
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="text-black flex-grow p-2 rounded-l-md text-gray-900 border border-black focus:outline-none focus:ring-2 focus:ring-black "
                    placeholder="Type your message..."
                    
                />
                <button 
                    onClick={sendMessage} 
                    className="p-2 bg-green-700 rounded-r-md hover:bg-green-600 text-black">
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
