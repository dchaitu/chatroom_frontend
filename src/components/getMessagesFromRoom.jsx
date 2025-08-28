import React, {useState, useEffect, useRef} from 'react';
import { Button, Input } from "@material-tailwind/react";
import {PaperAirplaneIcon, ArrowLeftIcon, ChevronDownIcon} from '@heroicons/react/24/solid';
import {FaRegUser, FaUser} from "react-icons/fa";

import {useNavigate, useParams} from 'react-router-dom';
import {POLLING_INTERVAL, REST_API_PATH} from "../constants/constants";
import GetOldMessages from "./getOldMessages";
import UserMessage from "../constants/UserMessage";
import RoomHeader from "../constants/roomHeader";
import * as PropTypes from "prop-types";
import RoomSideBar from "./roomSideBar";

const GetMessagesFromRoom = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [roomMembers, setRoomMembers] = useState([]);
    const [roomName, setRoomName] = useState("");
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const { room_id } = useParams();
    const roomId = room_id;
    const access_token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");



    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };


    // Fetch room details when component mounts or roomId changes
    useEffect(() => {

            fetchRoomDetails();
    }, [roomId]);

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
            intervalId = setInterval(fetchMessages, POLLING_INTERVAL);
        }

        return () => clearInterval(intervalId);
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
    const handleLeaveRoom = async (e) => {
        const response = await fetch(`${REST_API_PATH}/leave_room/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify({
                room_id: roomId,
            })
        })
        const data = await response.json();
        console.log("Leave room ", data);
        localStorage.removeItem('room_id');
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
    const sortedMessages = [...messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));





    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <RoomSideBar onClick={handleLeaveRoom} connected={isConnected}/>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                <div className="bg-white border-b p-4">
                    <RoomHeader roomName={roomName} roomMembers={roomMembers} leaveRoom={handleLeaveRoom} />
                    {/*<span className="text-sm text-gray-800 flex items-center gap-1"><FaUser />{roomMembers.length}</span>*/}
                    {/*<small className="mt-1 ">*/}
                    {/*    {roomMembers.join(', ') || 'No users present'}*/}
                    {/*</small>*/}

                </div>
                {/* Messages */}

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <GetOldMessages roomId={roomId} currentUser={username}/>
                    <div className="space-y-4 p-4">
                        {sortedMessages.map((message, index) => (
                            <div
                                key={index}
                                className={`${message.username === username ? 'justify-end' : 'justify-start'}`}
                            >
                                <UserMessage message={message} currentUser={username}/>

                            </div>
                        ))}
                        {/*<div ref={messagesEndRef} />*/}
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
