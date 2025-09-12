import React, {useState, useEffect, useRef, useCallback} from 'react';
import { Button, Textarea } from "@material-tailwind/react";
import {PaperAirplaneIcon} from '@heroicons/react/24/solid';
import {useNavigate, useParams} from 'react-router-dom';
import {POLLING_INTERVAL, REST_API_PATH} from "../constants/constants";
import GetOldMessages from "./getOldMessages";
import RoomHeader from "../constants/roomHeader";
import RoomSideBar from "./roomSideBar";

const GetMessagesFromRoom = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [room, setRoom] = useState({
        room_id: "",
        room_name: "",
        description: "",
        users: [],
        admins: []
    });
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const { room_id } = useParams();
    const roomId = room_id;
    const access_token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");



    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const fetchRoomDetails = useCallback(async () => {
        try {
            const response = await fetch(`${REST_API_PATH}/room/room_details/${roomId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                console.log("Room details response", data);
                setRoom(data);
            }
        } catch (error) {
            console.error("Error fetching room details:", error);
        }
    }, [roomId, access_token]);


    useEffect(() => {
        if (roomId) {
            fetch(`${REST_API_PATH}/room/${roomId}/mark-read/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-Type": "application/json"
                }
            });
        }
    }, [roomId]);

    // Fetch room details when component mounts or roomId changes
    useEffect(() => {
        if (roomId) {
            fetchRoomDetails();
        }
    }, [roomId, fetchRoomDetails]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Polling effect
    useEffect(() => {
        let intervalId;

        const fetchMessages = async () => {
            try {
                const response = await fetch(
                    `${REST_API_PATH}/messages/${roomId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${access_token}`
                        }
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                    setIsConnected(true);
                } else {
                    setIsConnected(false);
                }
            } catch (error) {
                console.error("Polling error:", error);
                setIsConnected(false);
            }
        };

        if (roomId) {
            fetchMessages(); // initial fetch
            // intervalId = setInterval(fetchMessages, POLLING_INTERVAL);
        }

        // return () => clearInterval(intervalId);
    }, [roomId, access_token]);


    const handleSendMessage = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${REST_API_PATH}/send_message/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify({
                    content: newMessage,
                    room_id: roomId,
                }),
            });
            const data = await response.json();
            console.log("Data is ...",data);
            if (response.ok) {
                setMessages(prevMessages => [...prevMessages, data]);
                setNewMessage(""); // reset input
                // Optional: immediately append pending message
                // Will be refreshed by polling automatically
            }
        } catch (err) {
            console.error("Send message error:", err);
        }
    };

    // Handle leaving the room
    const handleLeaveRoom = async () => {
        try {
            const response = await fetch(`${REST_API_PATH}/leave_room/?room_id=${roomId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
            });
            const data = await response.json();
            console.log("Leave room ", data);
            navigate(`/room/user/`);
        } catch (error) {
            console.error("Error leaving room:", error);
        }
    };





    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <RoomSideBar 
                connected={isConnected} 
                currentRoomId={roomId}
            />

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                <div className="bg-white border-b p-4">
                    <RoomHeader room={room} leaveRoom={handleLeaveRoom} />

                </div>
                {/* Messages */}

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <GetOldMessages roomId={roomId} currentUser={username} />

                </div>

                <div className="p-4 bg-white border-t">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <Textarea
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault(); // prevent newline on Enter
                                handleSendMessage(e);
                            }
                            }}
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
            <div ref={scrollToBottom}></div>
        </div>
    );
};

export default GetMessagesFromRoom;
