import { useCallback, useEffect, useState } from "react";
import { REST_API_PATH } from "../constants/constants";

export function useMessages(roomId, token, socket) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMessages = useCallback(async () => {
        if (!roomId || !token) return;

        try {
            const response = await fetch(`${REST_API_PATH}/messages/${roomId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to fetch messages");

            const data = await response.json();
            setMessages(data);
            setError(null);
        } catch (err) {
            console.error("Fetch Messages Error:", err);
            setError("Failed to fetch messages");
        } finally {
            setLoading(false);
        }
    }, [roomId, token]);

    // Initial load
    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // WS listener
    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            console.log("WS message received:", event.data);
            let data = {};
            try {
                data = JSON.parse(event.data);
                console.log("Parsed WS data:", data);
            } catch (e) {
                console.error("Failed to parse WS message:", e);
                return;
            }

            // Handle broadcast signal from lambda.py ({"event": "new_message", "room_id": ...})
            // Use loose equality to handle potential string/number mismatches
            if (data.event === "new_message" && data.room_id === roomId) {
                console.log("Received new_message signal, fetching messages...");
                fetchMessages();
                return;
            }
            if(data.event==="reply"&& data.room_id === roomId)
            {
                console.log("Received reply");
                fetchMessages()
            }
            if(data.event==="reaction"&& data.room_id === roomId)
            {
                console.log("Received reaction");
                fetchMessages()
            }

            // Fallback for full message objects (if architecture changes back)
            if (data.message_id && data.room_id === roomId) {
                setMessages(prevMessages => {
                    if (prevMessages.some(msg => msg.message_id === data.message_id)) {
                        return prevMessages;
                    }
                    return [...prevMessages, data];
                });
            }
        };
    }, [roomId, socket, fetchMessages]);

    return { messages, loading, error, fetchMessages, setMessages };
}
