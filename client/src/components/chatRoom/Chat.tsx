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
        if(message.length==0){
           return;

        }
       else  if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ message }));
            setMessage('');
        } else {
            console.error('WebSocket is not open');
        }
    };

    return (
        <div className="w-full max-w-md p-6 bg-yellow-200 rounded-lg shadow-lg mx-auto mt-6">
        <h2 className="text-xl font-semibold mb-4 bg-red-500 text-white rounded-md p-2 text-center shadow-md">
          Chat Room: <strong className="text-black">{roomName}</strong>
        </h2>
      
        {/* Message Container */}
        <div 
          className="bg-white h-64 overflow-y-auto p-4 mb-4 rounded-md shadow-inner"
          style={{ boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.1)' }}
        >
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className="p-3 mb-3 bg-green-300 text-black rounded-lg shadow-sm"
              >
                {msg}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
          )}
        </div>
      
        {/* Input Field and Button */}
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow p-3 rounded-l-md border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 placeholder-gray-400"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="p-3 bg-green-700 text-white rounded-r-md hover:bg-green-600 transition-all shadow-md"
          >
            Send
          </button>
        </div>
      </div>
      
    );
};

export default Chat;
