import React, {useState, useEffect, useRef} from 'react';
import {Button, Input, Typography} from "@material-tailwind/react";
import {PaperAirplaneIcon, ArrowLeftIcon} from '@heroicons/react/24/solid';
import {useNavigate, useParams} from 'react-router-dom';
import {REST_API_PATH} from "../constants/constants";
import GetOldMessages from "./getOldMessages";

const GetMessagesFromRoom = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [roomMembers, setRoomMembers] = useState([]);
    const [roomName, setRoomName] = useState("");
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const [ws, setWs] = useState(null);
    console.log("params", useParams())
    const {username,room_id} = useParams();
    console.log("GetMessagesFromRoom", username, room_id);
    const roomId = room_id;
    const access_token = localStorage.getItem("access_token");



    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Establish WebSocket connection
    useEffect(() => {
        if (!username || !roomId)  {
            console.warn("Missing username or roomId, skipping WebSocket connection");
            return;
        }
        const websocketUrl = `wss://c4plozmo3f.execute-api.us-east-1.amazonaws.com/production?username=${username}&room_id=${roomId}`;
        console.log("Attempting to connect:", { username, roomId, websocketUrl });

        let socket;
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 5;
        let reconnectTimeout;

        const connectWebSocket = () => {
            if (reconnectAttempts >= maxReconnectAttempts) {
                console.error("Max reconnection attempts reached");
                return;
            }

            socket = new WebSocket(websocketUrl);

            socket.onopen = () => {
                console.log("WebSocket connected");
                setIsConnected(true);
                reconnectAttempts = 0; // Reset reconnection attempts on successful connection
            };

            socket.onmessage = (event) => {
                console.log("Received raw data:", event.data);
                try {
                    const messageData = JSON.parse(event.data);
                    console.log("Received message:", messageData);
                    setMessages(prevMessages => {
                        const updated = [...prevMessages, messageData];
                        return updated.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                    });
                    setNewMessage('');

                } catch (error) {
                    console.error("Error parsing message:", error, event.data);
                }
            };

            socket.onclose = (event) => {
                setIsConnected(false);
                console.log("WebSocket disconnected. Code:", event.code, "Reason:", event.reason);

                // Attempt to reconnect with exponential backoff
                if (event.code !== 1000) { // 1000 is a normal closure
                    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000); // Max 30s delay
                    console.log(`Reconnecting in ${delay}ms...`);
                    reconnectTimeout = setTimeout(() => {
                        reconnectAttempts++;
                        connectWebSocket();
                    }, delay);
                }
            };

            socket.onerror = (error) => {
                console.error("WebSocket error:", error);
                socket.close();
            };

            setWs(socket);
        };

        connectWebSocket();
        // Cleanup on unmount
        return () => {
            console.log("Cleaning up WebSocket");
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
            if (ws) ws.close();
        };
    }, [username, roomId]);

    // Fetch room details when component mounts or roomId changes
    useEffect(() => {

            fetchRoomDetails();
    }, [roomId]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle sending a new message via WebSocket
    const handleSendMessage = (e) => {
        e.preventDefault();
        const messageToSend = newMessage.trim();
        if (!messageToSend || !ws || ws.readyState !== WebSocket.OPEN) {
            console.warn("Cannot send message - WebSocket not ready");
            return;
        }

        const message = {
            action: "sendmessage",
            content: messageToSend,
            username: username,
            room_id: roomId,
            timestamp: new Date().toISOString()
        };

        try {
            console.log("Sending message:", message);
            console.log("Sending message (string):", JSON.stringify(message));
            ws.send(JSON.stringify(message));
            // setMessages(prevMessages => [...prevMessages, message]);
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Handle leaving the room
    const handleLeaveRoom = () => {
        if (ws) {
            ws.close();
        }
        // localStorage.removeItem('room_id');
        navigate(`/rooms/`);
    }
    const fetchRoomDetails = async () => {
        try {
            const response = await fetch(`${REST_API_PATH}/room_details/${roomId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            });
            console.log("Room details response status:", response.status);
            const data = await response.json();
            console.log("Room details response:", data);
            if (response.ok) {
                setRoomName(data.room_name || 'Unnamed Room');
                setRoomMembers(data.room_members || []);
            }
        } catch (error) {
            console.error("Error fetching room details:", error);
        }
    };





    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <div className="w-1/4 bg-white border-r border-gray-200 p-4 flex flex-col">
                <Button
                    onClick={handleLeaveRoom}
                    color="red"
                    variant="outlined"
                    className="flex items-center gap-2 mb-4"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Leave Room
                </Button>
                <div className="mt-auto">
                    <p className={`text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                        Status: {isConnected ? 'Connected' : 'Disconnected'}
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
            <div className="bg-white border-b p-4">
                    <Typography variant="h4" color="blue-gray" className="font-bold">
                        Current Room {roomName}
                    </Typography>
                    <Typography variant="small" color="gray" className="mt-1">
                        Users: {roomMembers.join(', ') || 'No users present'}
                    </Typography>
                </div>
                {/* Messages */}

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <GetOldMessages roomId={roomId} currentUser={username} />
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.username === username ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md p-3 rounded-xl ${message.username === username ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white shadow-md'}`}>
                                    <p className="font-semibold text-sm">{message.username}</p>
                                    <p className="text-md break-words">{message.content}</p>

                                    <p className="text-xs opacity-75 mt-1 text-right">
                                        {message.timestamp && new Date(message.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="p-4 bg-white border-t">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <Input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
                            placeholder="Type your message..."
                            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                            labelProps={{
                                className: "hidden",
                            }}
                            containerProps={{className: "min-w-0 flex-1"}}
                        />
                        <Button
                            type="submit"
                            size="md"
                            className="rounded-lg flex items-center justify-center"
                            disabled={!newMessage.trim()}
                        >
                            <PaperAirplaneIcon className="h-5 w-5"/>
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GetMessagesFromRoom;
