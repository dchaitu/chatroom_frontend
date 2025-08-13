import { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import {REST_API_PATH} from "../constants/constants";

const GetOldMessages = ({roomId, currentUser}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sortedMessages = messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const access_token = localStorage.getItem("access_token");

    console.log("GetOldMessages from console", roomId);
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                console.log("GetOldMessages from console requesting...", roomId);
                const response = await fetch(`${REST_API_PATH}/messages/${roomId}`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    }
                });
                const data = await response.json();
                console.log("Get old messages ",data);

                setMessages(data);
                console.log(response);
                setError(null);
            } catch (err) {
                console.error("Error fetching messages:", err);
                setError("Failed to load messages. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        console.log("GetOldMessagesFromRoom", roomId);


        if (roomId) {
            fetchMessages();
        }
    }, [roomId]);

    if (loading) {
        return <div>Loading messages...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-4 p-4">
            {messages.length === 0 ? (
                <div className="text-gray-500 text-center">No messages in this room yet.</div>
            ) : (
                messages.map((message) => (
                    <div
                        key={`${message.room_id}-${message.timestamp}`}
                        className={`flex ${message.username === currentUser ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-xs lg:max-w-md xl:max-w-lg 2xl:max-w-xl p-4 rounded-lg shadow ${
                            message.username === currentUser 
                                ? 'bg-blue-500 text-white rounded-br-none' 
                                : 'bg-white text-gray-800 rounded-bl-none'
                        }`}>
                            <div className="flex justify-between items-baseline mb-1">
                                <span className={`font-semibold ${message.username === currentUser ? 'text-blue-100' : 'text-gray-700'}`}>
                                    {message.username}
                                </span>
                                <span className={`text-xs ${message.username === currentUser ? 'text-blue-200' : 'text-gray-500'}`}>
                                    {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : ''}
                                </span>
                            </div>
                            <p className={message.username === currentUser ? 'text-white' : 'text-gray-800'}>
                                {message.content}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default GetOldMessages;
