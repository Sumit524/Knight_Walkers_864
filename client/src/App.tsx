// import { useEffect, useState } from 'react';
// import axios from 'axios';

// function App() {
//     const [message, setMessage] = useState('');

//     useEffect(() => {
//         axios.get('http://127.0.0.1:8000/api/hello/')
//             .then(response => setMessage(response.data.message))
//             .catch(error => console.error(error));
//     }, []);

//     return (
//         <div className="App">
//             <h1>{message}</h1>
//         </div>
//     );
// }

// export default App;


import React, { useState } from "react";
import Chat from './components/chatRoom/Chat';

const App: React.FC = () => {
    const [roomName, setRoomName] = useState<string>('general');
    return (
        <div>
            <h1>Chat Application</h1>
            <input
                type="text"
                placeholder="Enter room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}

            />
            <Chat roomName={roomName}/>
        </div>

    );
};

export default App;
