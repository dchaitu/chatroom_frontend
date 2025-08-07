import { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import {REST_API_PATH} from "../constants/constants";

const GetOldMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { roomId } = useParams();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${REST_API_PATH}/messages/${roomId}/`);
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
            <h1 className="text-4xl font-bold text-white">Messages of room {roomId}</h1>
            {messages.length === 0 ? (
                <div className="text-gray-500 text-center">No messages in this room yet.</div>
            ) : (
                messages.map((message) => (
                    <div
                        key={`${message.room_id}-${message.timestamp}`}
                        className="bg-white p-4 rounded-lg shadow"
                    >
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="font-semibold">{message.username}</span>
                            <span className="text-sm text-gray-500">
                                {message.timestamp ? new Date(message.timestamp).toLocaleString() : 'No timestamp'}
                            </span>
                        </div>
                        <p className="text-gray-800">{message.content}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default GetOldMessages;
