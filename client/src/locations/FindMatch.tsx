// FindMatch.tsx

import React, { useEffect, useState } from 'react';

// Define the user type
interface User {
    user_id: number;
    username: string;
    distance: number;
}

const FindMatch: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        // Initialize WebSocket connection
        const ws = new WebSocket(`ws://localhost:8000/ws/match/`);
        setSocket(ws);

        // On connection open, send initial message
        ws.onopen = () => {
            ws.send(JSON.stringify({
                action: 'find_nearby',
                interest: 'zoo',
            }));
        };

        // On receiving a message from WebSocket
        ws.onmessage = (e: MessageEvent) => {
            const data = JSON.parse(e.data);
            if (data.action === 'nearby_users') {
                setUsers(data.users);  // Update state with nearby users
            }
        };

        // Cleanup WebSocket connection when component unmounts
        return () => {
            ws.close();
        };
    }, []);

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
                {users.map(user => (
                    <li key={user.user_id}>
                        {user.username} - {user.distance.toFixed(2)} meters away
                        <button onClick={() => sendConnectRequest(user.user_id)}>Connect</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FindMatch;
