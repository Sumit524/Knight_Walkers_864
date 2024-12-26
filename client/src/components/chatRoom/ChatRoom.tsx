import React, { useState } from "react";
import Chat from './Chat';
import chatImage from '../../images/chat.gif'
const ChatRoom: React.FC = () => {
    const [roomName, setRoomName] = useState<string>('general');
    
    return (
        <div className="min-h-screen flex items-center justify-center " >
          <div className="bg-gray-800 rounded flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl p-4 space-y-8 lg:space-y-0 lg:space-x-8"  style={{ boxShadow: '0 10px 20px rgba(255, 255, 255, 0.7)' }} >
            {/* Left Side: Image */}
            <div className="flex-1 lg:block"  style={{ boxShadow: '0 2px 5px rgba(255, 255, 255, 0.7)' }}>
              <img
                src={chatImage}
                alt="Chat App"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
      
            {/* Right Side: Chat Application */}
            <div className="flex-1 items-center justify-center bg-gray-900 text-white p-6 rounded-lg shadow-lg"  style={{ boxShadow: '0 1px 5px rgba(255, 255, 255, 0.7)' }}>
                <div className="">
              <h1 className="text-3xl font-bold mb-6 text-center">Chat Application</h1>
      
              <input
                type="text"
                placeholder="Enter room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="p-3 mb-4 w-full sm:w-96 text-gray-800 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
      
              <Chat roomName={roomName} />
              </div>
            </div>
          </div>
        </div>
      );
}

export default ChatRoom;
