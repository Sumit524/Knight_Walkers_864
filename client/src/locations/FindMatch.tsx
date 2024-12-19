import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

// Define the user and message types
interface User {
    id: number;
    username: string;
    distance: number;
}

interface MessageType {
    [key: number]: string;
}

const FindMatch: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [users, setUsers] = useState<User[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [requestSentByUser, setRequestSentByUser] = useState<number[]>([]);
    const [messages, setMessages] = useState<MessageType>({});

    useEffect(() => {
        if (user) {
            // Initialize WebSocket connection
            const ws = new WebSocket(`ws://localhost:8000/ws/match/${user.id}/`);
            setSocket(ws);

            ws.onopen = () => {
                ws.send(JSON.stringify({
                    action: 'send_connect',
                    id: 1,
                    latitude: 25.496330,
                    longitude: 81.869049,
                    range_radius: 5000,
                    preference: 'zoo'
                }));
            };

            ws.onmessage = (e: MessageEvent) => {
                const data = JSON.parse(e.data);
                if (data.action === 'nearby_users') {
                    setUsers((prevUsers) => [...prevUsers, ...data.users]);
                }
                if (data.action === 'user_disconnected') {
                    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== data.user_id));
                }
                if (data.action === 'send_match_request' || data.action === 'send_match_response' || data.action === 'send_error') {
                    setMessages((prevMessages) => ({
                        ...prevMessages,
                        [data.user_id]: data.message
                    }));
                    setRequestSentByUser((prevValue) => [...prevValue, data.user_id]);
                }

            };

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

    const acceptConnectRequest = (userId: number) => {
        if (socket) {
            socket.send(JSON.stringify({
                action: 'send_accept',
                respond_to_user_id: userId,
            }));
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Nearby Users Interested in the Zoo</h2>
            <ul id="user-list" className="w-full max-w-md space-y-4">
                {users.map(user => (
                    <li key={user.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                        <div>
                            <p className="text-lg font-medium text-gray-900">{user.username}</p>
                            <p className="text-sm text-gray-500">{user.distance.toFixed(2)} meters away</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={() => sendConnectRequest(user.id)}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow"
                            >
                                Connect
                            </button>
                        </div>
                        {requestSentByUser.includes(user.id) && (
                            <div className="mt-4 text-center w-full">
                                <p className="text-green-600 font-semibold">{messages[user.id]}</p>
                                <button 
                                    className="mt-2 px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                                    onClick={() => acceptConnectRequest(user.id)}
                                >
                                    Accept
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FindMatch;
