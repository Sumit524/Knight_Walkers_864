// FindMatch.tsx

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

// Define the user type
interface User {
    id: number;
    username: string;
    distance: number;
}

const FindMatch: React.FC = () => {
    const user = useSelector((state:RootState) =>(state.auth.user));
    const [users, setUsers] = useState<User[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const [messages, setMessages]= useState<string[]>([]);

    useEffect(() => {
        if (user) {
            // Initialize WebSocket connection
            console.log("user id type : : ", typeof(user.id))
            const ws = new WebSocket(`ws://localhost:8000/ws/match/${user.id}/`);
            setSocket(ws);

            // On connection open, send initial message
            ws.onopen = () => {
                ws.send(JSON.stringify({
                    'id' : 1,
                    'latitude' : 25.496330,
                    'longitude' : 81.869049,
                    'range_radius' : 5000,
                    'preference' : 'zoo'
                }));
            };


            // On receiving a message from WebSocket
            ws.onmessage = (e: MessageEvent) => {
                const data = JSON.parse(e.data);
                if (data.action === 'nearby_users') {
                    // setUsers(data.users);  // Update state with nearby users
                    setMessages((prev) => [...prev, data.users]);
                    console.log("Nearby Users:: ", data.users)
                }
            };

            // Cleanup WebSocket connection when component unmounts
            return () => {
                ws.close();
            };
        }
    }, [user]);

    const sendConnectRequest = (userId: number) => {
        if (socket) {
            socket.send(JSON.stringify({
                action: 'send_request',
                user_id: userId,
            }));
        }
    };

    return (
        <div>
            <h2>Nearby Users Interested in the Zoo</h2>
            <ul id="user-list">
                {messages.map(message => (
                    // <li key={user.id}>
                    //     {user.username} - {user.distance.toFixed(2)} meters away
                    //     <button onClick={() => sendConnectRequest(user.id)}>Connect</button>
                    // </li>
                    <h1>{message}</h1>
                ))}
            </ul>
        </div>
    );
};

export default FindMatch;
