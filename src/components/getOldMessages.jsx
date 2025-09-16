import React, {useState, useEffect, useMemo, useRef} from "react";
import {REST_API_PATH, formatMessageDate, POLLING_INTERVAL} from "../constants/constants";
import UserMessage from "../constants/UserMessage";
import {useReply} from "../context/ReplyContext";
import DateSeparationLine from "../constants/dateSeparationLine";

const GetOldMessages = ({ roomId, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const access_token = localStorage.getItem("access_token");
    const scrollToBottomRef = useRef(null);
    const {showReply} = useReply();


    const groupedMessages = useMemo(() => {
        const grouped = [];
        let currentDate = null;

        messages.forEach((message) => {
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
                type: 'message',
                id: message.message_id
            });
        });
        
        return grouped;
    }, [messages]);

    // Scroll to bottom
    // useEffect(() => {
    //     scrollToBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, [messages.length]);

    console.log("GetOldMessages from console", roomId);
    useEffect(() => {
        if(!roomId) return;
        let intervalId;

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

        fetchMessages();
        // intervalId = setInterval(fetchMessages, POLLING_INTERVAL)
        // return () => clearInterval(intervalId);
    }, [roomId,access_token]);

    if (loading) {
        return <div>Loading messages...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div>
        <div className="space-y-1 p-4">
            {groupedMessages.length === 0 ? (
                <div className="text-gray-500 text-center">No messages in this room yet.</div>
            ) : (
                groupedMessages.map((item) => (
                    <div key={item.id}>
                        {/*date related separator*/}
                        {item.type === 'date' ? (
                            <DateSeparationLine item={item} />
                        ) : (
                            <UserMessage message={item} currentUser={currentUser} />
                        )}
                    </div>
                ))
            )}
            <div ref={scrollToBottomRef}></div>
        </div>



        </div>
    );
};

export default GetOldMessages;
