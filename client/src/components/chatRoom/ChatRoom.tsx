import React, { useState } from "react";
import Chat from './Chat';
import chatImage from '../../images/chat.gif'

const ChatRoom: React.FC = () => {
    const [roomName, setRoomName] = useState<string>('general');
    
    return (
        <div className="min-h-screen flex items-center  justify-center px-4 sm:px-6 md:px-8">
            <div 
                className="bg-gray-800 rounded-lg flex flex-col sm:flex-row items-center justify-center w-full max-w-7xl p-4 space-y-6 sm:space-y-0 sm:space-x-6"
                style={{ boxShadow: '0 10px 20px rgba(255, 255, 255, 0.7)' }}
            >
                {/* Left Side: Image */}
                <div 
                    className="p-6 flex-1  rounded-lg shadow-lg mb-4 sm:mb-0"
                    // style={{ boxShadow: '0 2px 5px rgba(255, 255, 255, 0.7)' }}
                >
                    <img
                        src={chatImage}
                        alt="Chat App"
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
        
                {/* Right Side: Chat Application */}
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-4 text-center">Talksphere</h1>
                    <div className="flex flex-col items-center w-full">
                        <input
                            type="text"
                            placeholder="Enter room name"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className="p-3 mb-4 w-full sm:w-3/4 md:w-2/3 text-gray-800 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <div className="w-full">
                            <Chat roomName={roomName} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatRoom;
