// import React, { useState } from "react";
// import Chat from './Chat';

// const ChatRoom: React.FC = () => {
//     const [roomName, setRoomName]= useState<string>('general');
//     return (
//         <div>
//             <h1>Chat Application</h1>
//             <input 
//             type="text"
//             placeholder="Enter room name"
//             value={roomName}
//             onChange={(e) => setRoomName(e.target.value)}

//             />
//             <Chat roomName= {roomName} />
//         </div>
//     )
// }

// export default ChatRoom;



import React, { useState } from "react";
import Chat from './Chat';

const ChatRoom: React.FC = () => {
    const [roomName, setRoomName] = useState<string>('general');
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
            <h1 className="text-3xl font-bold mb-6">Chat Application</h1>
            <input 
                type="text"
                placeholder="Enter room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="p-2 mb-4 text-gray-800 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Chat roomName={roomName} />
        </div>
    );
}

export default ChatRoom;
