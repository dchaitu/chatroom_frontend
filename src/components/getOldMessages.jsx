import { useState, useEffect, useMemo } from "react";
import { REST_API_PATH, formatMessageDate } from "../constants/constants";
import UserMessage from "../constants/UserMessage";
import { Separator } from "./ui/separator";

const GetOldMessages = ({ roomId, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const access_token = localStorage.getItem("access_token");
    
    const groupedMessages = useMemo(() => {
        const grouped = [];
        let currentDate = null;
        
        const sorted = [...messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        sorted.forEach((message) => {
            const messageDate = formatMessageDate(message.timestamp);
            
            if (messageDate !== currentDate) {
                grouped.push({
                    type: 'date',
                    date: messageDate,
                    id: `date-${messageDate}`
                });
                currentDate = messageDate;
            }
            
            grouped.push({
                ...message,
                type: 'message'
            });
        });
        
        return grouped;
    }, [messages]);

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
        <div className="space-y-1 p-4">
            {groupedMessages.length === 0 ? (
                <div className="text-gray-500 text-center">No messages in this room yet.</div>
            ) : (
                groupedMessages.map((item) => (
                    <div key={item.id}>
                        {item.type === 'date' ? (
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        {item.date}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <UserMessage message={item} currentUser={currentUser} />
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default GetOldMessages;
