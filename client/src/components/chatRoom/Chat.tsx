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
        <div className="w-full max-w-md p-4 bg-yellow-200 rounded-lg shadow-md "style={{ boxShadow: '0 10px 20px rgba(255, 255, 255, 0.7)' }}>
            <h2 className="text-xl font-semibold mb-4 bg-red-500 rounded-md p-1" >Chat Room: {roomName}</h2>
            <div className="bg-white h-64 overflow-y-auto p-2 mb-4 bg-gray-900 rounded-md" style={{ boxShadow: '2px 2px 2px rgba(18, 17, 17, 0.7)' }}>
                {messages.map((msg, index) => (
                    <div key={index} className="p-2 mb-2 bg-blue-500 rounded-lg text-white" >
                        {msg}
                    </div>
                ))}
            </div>
            <div className="flex">
                <input 
                
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="text-black flex-grow p-2 rounded-l-md text-gray-900 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
