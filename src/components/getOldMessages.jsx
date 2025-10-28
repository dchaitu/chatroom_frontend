import React, {useState, useEffect, useMemo, useRef} from "react";
import {REST_API_PATH, formatMessageDate, POLLING_INTERVAL} from "../constants/constants";
import UserMessage from "../constants/UserMessage";
import {useReply} from "../context/ReplyContext";
import DateSeparationLine from "../constants/dateSeparationLine";
import MessageItem from "./MessageItem";

const GetOldMessages = ({ roomId }) => {
    console.log("GetOldMessages", roomId);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [replyCounts, setReplyCounts] = useState({});
    const access_token = localStorage.getItem("access_token");
    const scrollToBottomRef = useRef(null);
    const [userMessages, setUserMessages] = useState([]);

    const {showReply} = useReply();

    useEffect(() => {
        if (!messages.length) return;

        const fetchReplyCounts = async () => {
            try {
                const messageIds = messages.map(msg => msg.message_id);
                if (messageIds.length === 0) return;

                const response = await fetch(`${REST_API_PATH}/reply/counts/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access_token}`
                    },
                    // body: JSON.stringify({ message_ids: messageIds })
                });
                const data = await response.json();
                setReplyCounts(prev => ({ ...prev, ...data }));
            } catch (error) {
                console.error("Error fetching reply counts:", error);
            }
        };

        fetchReplyCounts();
    }, [messages, access_token]);

    const fetchMessageDetails = async (roomId) => {
        console.log(roomId,"message last seen pressed");
        const response = await fetch(`${REST_API_PATH}/messages/info/${roomId}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }

        });
        const data = await response.json()
        console.log("UserMessage last seen data from fetch",data);
        setUserMessages(data);
        return data
    }

    useEffect(() => {

        fetchMessageDetails(roomId)
        console.log("UserMessage last seen data",userMessages)

    },[roomId])

    const groupedMessages = useMemo(() => {
    if (!messages.length) return [];
    
    const grouped = [];
    let currentDate = null;
    let lastUser = null;
    let lastTime = null;
    let messageGroup = [];

    const processGroup = () => {
        if (messageGroup.length > 0) {
            grouped.push({
                type: 'messageGroup',
                messages: [...messageGroup],
                user: messageGroup[0].username,
                id: `group-${messageGroup[0].message_id}`
            });
            messageGroup = [];
        }
    };

    messages.forEach((message) => {
        const messageDate = formatMessageDate(message.timestamp);
        const messageTime = new Date(message.timestamp).getTime();
        
        // Check if we need a new date header
        if (messageDate !== currentDate) {
            processGroup(); // Process any pending message group
            grouped.push({
                type: 'date',
                date: messageDate,
                id: `date-${messageDate}`
            });
            currentDate = messageDate;
            lastUser = null;
            lastTime = null;
        }

        // Check if we should start a new message group
        const isSameUser = message.username === lastUser;
        // const isWithinOneMinute = lastTime && (messageTime - lastTime) <= 60000; // 60,000 ms = 1 minute

        if (!isSameUser) {
            processGroup(); // Process any pending message group
        }

        // Add message to current group
        messageGroup.push(message);
        lastUser = message.username;
        lastTime = messageTime;
    });

    // Process any remaining messages in the last group
    processGroup();
    
    return grouped;
}, [messages]);

    const allItems = useMemo(() => {
        if (!groupedMessages.length) return [];
        const items = [];
        groupedMessages.forEach(item => {
            if (item.type === 'date') {
                items.push({
                    type: 'date',
                    id: item.id,
                    date: item.date
                });
            } else if (item.type === 'messageGroup') {
                item.messages.forEach((message, index) => {
                    items.push({
                        type: 'message',
                        id: message.message_id,
                        message: message,
                        isFirstInGroup: index === 0,
                        replyCount: replyCounts[message.message_id] || 0,
                        userMessages: userMessages
                    });
                });
            }
        });
        return items;
    }, [groupedMessages, replyCounts, userMessages]);

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
        intervalId = setInterval(fetchMessages, POLLING_INTERVAL)
        return () => clearInterval(intervalId);
    }, [roomId,access_token]);

    if (loading) {
        return <div>Loading messages...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div id="all-messages">
            <ul className="flex flex-col">
                {allItems.map((item) => (
                    <li key={item.id} className="m-0">
                        <MessageItem item={item} />
                    </li>
                ))}
            </ul>
            <div ref={scrollToBottomRef} />
        </div>
    );
};

export default GetOldMessages;
