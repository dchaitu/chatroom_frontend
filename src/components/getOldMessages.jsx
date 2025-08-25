import { useState, useEffect } from "react";
import {REST_API_PATH} from "../constants/constants";
import UserMessage from "../constants/UserMessage";

const GetOldMessages = ({roomId, currentUser}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sortedMessages = [...messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
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
            {sortedMessages.length === 0 ? (
                <div className="text-gray-500 text-center">No messages in this room yet.</div>
            ) : (
                sortedMessages.map((message) => (
                    <div key={message.id}>
                    <UserMessage message={message} currentUser={currentUser} />
                    </div>
                ))
            )}
        </div>
    );
};

export default GetOldMessages;
