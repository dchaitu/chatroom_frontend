import {useCallback, useEffect, useState} from "react";
import {REST_API_PATH} from "../constants/constants";

export function useMessages(roomId, token, wsRef) {
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
        if (!wsRef.current) return;

        wsRef.current.onmessage = (event) => {
            let data = {};
            try {
                data = JSON.parse(event.data);
            } catch {}

            if (data.event === "new_message" && data.room_id === roomId) {
                fetchMessages();
            }
        };
    }, [roomId, fetchMessages, wsRef]);

    return { messages, loading, error, fetchMessages, setMessages };
}
