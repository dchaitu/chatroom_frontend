import { useEffect, useState, useRef } from "react";

export const useWebSocketConnection = (token, roomId) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!token) {
            return;
        }

        const wsUrl = roomId
            ? `wss://3raigmqws9.execute-api.us-east-1.amazonaws.com/production/?token=${token}&room_id=${roomId}`
            : `wss://3raigmqws9.execute-api.us-east-1.amazonaws.com/production/?token=${token}`;

        console.log("Attempting to connect to WebSocket:", wsUrl);

        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connection established.");
            setIsConnected(true);
        };

        ws.onclose = (event) => {
            console.log("WebSocket connection closed.", event.code, event.reason);
            setIsConnected(false);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            // Optionally, you might want to trigger a disconnect state here as well
            setIsConnected(false);
        };

        // Cleanup function to close the WebSocket connection when the component unmounts
        // or when dependencies change.
        return () => {
            if (socketRef.current) {
                console.log("Closing WebSocket connection.");
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, [token, roomId]); // Dependencies for the effect

    // The hook returns the current socket instance and its connection status.
    // Note: The component using this hook will not re-render when socketRef.current changes.
    // It will re-render when `isConnected` changes.
    return { socket: socketRef.current, isConnected };
};
