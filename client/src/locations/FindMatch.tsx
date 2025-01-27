import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { Load_UserPreferences, fetchUserProfileImageByID, load_user_profile_by_id } from "../feature/auth/authActions";
import { api_url } from "../config/config";

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
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const preferences = useSelector((state: RootState) => state.auth.preferences);
    const profileImage = useSelector((state: RootState) => state.auth.profileImage);
    const profile = useSelector((state: RootState) => state.auth.profile);

    const [users, setUsers] = useState<User[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [requestSentByUser, setRequestSentByUser] = useState<number[]>([]);
    const [messages, setMessages] = useState<MessageType>({});
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle WebSocket connection
    useEffect(() => {
        if (user) {
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
                try {
                    const data = JSON.parse(e.data);

                    if (data.action === 'nearby_users' && Array.isArray(data.users)) {
                        setUsers((prevUsers) => {
                            const newUsers = data.users.filter(
                                (newUser: User) => !prevUsers.some((u) => u.id === newUser.id)
                            );
                            return [...prevUsers, ...newUsers];
                        });
                    } else if (data.action === 'user_disconnected') {
                        setUsers((prevUsers) =>
                            prevUsers.filter((user) => user.id !== data.user_id)
                        );
                    } else if (['send_match_request', 'send_match_response', 'send_error'].includes(data.action)) {
                        setMessages((prevMessages) => ({
                            ...prevMessages,
                            [data.user_id]: data.message,
                        }));
                        setRequestSentByUser((prevValue) => {
                            if (!prevValue.includes(data.user_id)) {
                                return [...prevValue, data.user_id];
                            }
                            return prevValue;
                        });
                    }
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                }
            };

            return () => {
                ws.close();
            };
        }
    }, [user]);

    // Dispatch Load_UserPreferences when selectedUserId changes
    useEffect(() => {
        if (selectedUserId !== null) {
            console.log('Selected User ID:', selectedUserId);

            try {
                dispatch(Load_UserPreferences(selectedUserId))
                    .then(() => console.log('Preferences loaded successfully'))
                    .catch((err) => console.error('Error loading preferences:', err));

                dispatch(fetchUserProfileImageByID(selectedUserId))
                    .then(() => console.log('Profile image fetched successfully'))
                    .catch((err) => console.error('Error fetching profile image:', err));

                dispatch(load_user_profile_by_id(selectedUserId))
                    .then(() => console.log('Profile loaded successfully'))
                    .catch((err) => console.error('Error loading profile:', err));
            } catch (err) {
                console.error('Error dispatching actions:', err);
            }
        }
    }, [dispatch, selectedUserId]);

    const sendConnectRequest = (userId: number) => {
        if (socket) {
            socket.send(JSON.stringify({
                action: 'send_request',
                user_id: userId,
            }));
        }
    };

    const showDetails = (userId: number) => {
        setSelectedUserId(userId); // Set the selected user ID for details
        setIsModalOpen(true);
    };

    const acceptConnectRequest = (userId: number) => {
        if (socket) {
            socket.send(JSON.stringify({
                action: 'send_accept',
                respond_to_user_id: userId,
            }));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        console.log('User Preferences:', preferences || 'No preferences loaded'); // Add fallback
        console.log('User Profile Image:', profileImage || 'No profile image'); // Add fallback
        console.log('User info', profile || 'No profile '); // Add fallback
    }, [preferences, profileImage, profile]);

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col items-center p-8">
            <h2 className="text-2xl font-bold mb-6 text-white">
                Nearby Users Interested in the <strong className="text-yellow-500">Zoo</strong>
            </h2>
            <ul id="user-list" className="w-full max-w-md space-y-4">
                {users.map((user) => (
                    <li
                        key={user.id}
                        className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
                        style={{ boxShadow: '0 1px 10px rgba(255, 255, 255, 0.7)' }}
                    >
                        <div>

                            
                            <p className="text-lg font-medium text-gray-900">hii: {user.username}</p>
                            <p className="text-lg font-medium text-gray-900">{user.id}</p>
                            <p className="text-sm text-gray-500">{user.distance.toFixed(2)} meters away</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => sendConnectRequest(user.id)}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow"
                            >
                                Connect
                            </button>
                            <button
                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg shadow"
                                onClick={() => showDetails(user.id)}
                            >
                                Know your friend
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
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
                    <div className="bg-white rounded-lg shadow-lg w-5/6 h-5/6 overflow-y-auto relative">
                        <div className="p-6">
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl"
                            >
                                &times;
                            </button>
                            <h3 className="text-xl text-red-600 font-bold mb-2  ">Profile Image</h3>
                            <div className='flex item-center justify-center  mb-4'>
                            <div className='bg-gray-600 border p-2 m-4 rounded-xl w-1/2 ' 
                            
                            
                            >

                            {profileImage && (
                                <img
                                    src={`${api_url}${profileImage}`}
                                    alt="Profile"
                                    className="w-70 h-80  rounded-full mx-auto "
                                />
                                
                            )}
                            </div>
                            </div>

    <div className="mb-6">
<h3 className="text-xl text-red-600 font-bold mb-2  ">User Information</h3>
                            <div className="border p-3">
                            
                            <p className=" px-4 ">First Name: <strong  className='text-green-600 ml-2 '>{profile?.first_name} </strong> </p>
                            <p className=" px-4 ">Last Name:<strong className='text-green-600 ml-2 '> {profile?.last_name}</strong></p>
                            <p className=" px-4 ">Gender:<strong className='text-green-600 ml-2 '> {profile?.gender}</strong></p>
                            <p className=" px-4 ">DOB: <strong className='text-green-600 ml-2 '>{profile?.dob}</strong></p>
                            <p className=" px-4 ">Address:<strong className='text-green-600 ml-2 '> {profile?.address}</strong></p>
                            <p className=" px-4 ">Contact:<strong className='text-green-600 ml-2 '> {profile?.contact}</strong></p>
                            <p className=" px-4">About: <strong className='text-green-600 ml-2 '>{profile?.about}</strong></p>
                            


                            </div>
                            </div>




                            {preferences?.selected_categories?.preferences && (
    <div className="p-4">
        <h3 className="text-xl text-red-600 font-bold mb-2  ">Preferences</h3>
        <table className="table-auto w-full text-left border-collapse border p-3">
    <thead>
        <tr className="bg-gray-200">
            <th className="px-4 py-2 font-semibold text-gray-800 border-r">Category</th>
            <th className="px-4 py-2 font-semibold text-gray-800">Preferences</th>
        </tr>
    </thead>
    <tbody>
        {Object.entries(preferences.selected_categories.preferences).map(([key, value]) => (
            <tr key={key} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2 capitalize text-gray-700 border-r">
                    {key.replace(/_/g, ' ')}
                </td>
                <td className="px-4 py-2 text-green-600">{String(value)}</td>
            </tr>
        ))}
    </tbody>
</table>

    </div>
)}

                           
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindMatch;
