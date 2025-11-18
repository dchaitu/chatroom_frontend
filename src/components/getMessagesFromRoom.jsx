import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";


import { useReply } from "../context/ReplyContext";
import {useRoomMetadata} from "./useRoomMetadata";
import {REST_API_PATH, formatMessageDate} from "../constants/constants";
import RoomsSearchBar from "./roomsSearchBar";
import VerticalSideBar from "../constants/verticalSideBar";
import RoomSideBar from "./roomSideBar";
import RoomHeader from "../constants/roomHeader";
import SendMessageForm from "./sendMessageForm";
import GetReplyDrawer from "./getReplyDrawer";
import {useMessages} from "./useMessages";
import MessageItem from "./MessageItem";
import GetOldMessages from "./getOldMessages";
import {useWebSocketConnection} from "./useWebSocketConnection";
import MessagesList from "./messagesList";

const GetMessagesFromRoom = (props) => {
    // const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [room, setRoom] = useState({
        room_id: "",
        room_name: "",
        description: "",
        users: [],
        admins: []
    });
    const [roomAdmins, setRoomAdmins] = useState([]);
    // const {showReply} = useReply();
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const { room_id } = useParams();
    const roomId = room_id;
    const access_token = localStorage.getItem("access_token");
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    const { showReply } = useReply();

    const ws = useRef(null);
    const { messages, loading, error, fetchMessages, setMessages } = useMessages(roomId, access_token, ws);
    useEffect(() => {
        if (!access_token) return;
        const socket = new WebSocket(
            `wss://3raigmqws9.execute-api.us-east-1.amazonaws.com/production`
        );

        socket.onopen = () => {
            console.log("WS connected");

            // Send initial message to register/join room
            // This should match whatever route your backend expects
            socket.send(JSON.stringify({
                action: "sendMessage", // or create a new "joinRoom" action
                room_id: roomId,
                message: "joined" // or any initial message
            }));
        };
        socket.onclose = (event) => {
            console.log("WS disconnected", {
                code: event.code,
                reason: event.reason,
                wasClean: event.wasClean
            });
        };
        socket.onerror = (err) => console.error("WS error", err);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("WS message:", data);

            if (data.event === "new_message" && data.room_id === roomId) {
                fetchMessages();
            }
        };

        ws.current = socket;

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [roomId, access_token, fetchMessages]);




    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const fetchRoomAdmins = useCallback(async () => {
        try {
            const response = await fetch(`${REST_API_PATH}/room/${roomId}/admins`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                console.log("Room admins response", data);
                setRoomAdmins(data);
            }
        } catch (error) {
            console.error("Error fetching room admins:", error);
        }
    }, [roomId, access_token]);

    const fetchRoomDetails = useCallback(async () => {
        try {
            const response = await fetch(`${REST_API_PATH}/room/${roomId}`, {
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
            fetchRoomDetails();
            fetchRoomAdmins();
        }
        }, [roomId, fetchRoomDetails, fetchRoomAdmins]);


    useEffect(() => {
        scrollToBottom();
    }, []);

    const handleSendMessage = async (e, messageContent, file) => {
        e.preventDefault();
        if (!messageContent?.trim() && !file) return;

        const formData = new FormData();
        formData.append("room_id", roomId);
        if (messageContent) formData.append("content", messageContent);
        if (file) formData.append("file", file);

        try {
            const response = await fetch(`${REST_API_PATH}/messages/send/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: formData,
            });

            const data = await response.json();
            console.log("Data is ...",data);
            if (response.ok) {
                setMessages(prevMessages => [...prevMessages, data]);
                console.log("File Data is ", data)
                setNewMessage("");
            }
        } catch (err) {
            console.error("Send message error:", err);
        }
    };

    // Handle leaving the room
    const handleLeaveRoom = async () => {
        try {
            const res = await fetch(`${REST_API_PATH}/leave_room/?room_id=${roomId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
            });
            await res.json();
            navigate(`/room/user/`);
        } catch (err) {
            console.error("Error leaving room:", err);
        }
    };





    return (
        <div className="bg-background text-text-on-background  flex flex-col h-screen">
        {/*<div className="mr-2">*/}
            <RoomsSearchBar />

        <div className="flex flex-1 overflow-hidden font-sans min-w-0 w-full mb-2 ">
            {/* Vertical Sidebar */}

            <VerticalSideBar
            />
            {/* Sidebar */}
            <RoomSideBar
                connected={isConnected}
                currentRoomId={roomId}
            />

            {/* Chat Area */}
            <div className={`bg-content text-text-on-content flex-1 flex flex-col rounded-tr-lg rounded-br-lg mr-2 shadow-xl ${showReply ? 'w-2/3' : 'w-full'}`}>
                <div className=" border-b border-border p-4 flex-shrink-0 rounded-tr-lg ">
                    {/*Room Header */}
                    <RoomHeader room={room} leaveRoom={handleLeaveRoom} roomAdmins={roomAdmins}/>

                </div>
                {/* Messages */}

                <div className={`flex-1 flex flex-row overflow-y-auto  ${showReply ? 'w-2/3' : 'w-full'}`}>
                    <div className="flex-1 " id="all-messages">
                        <GetOldMessages roomId={roomId} messages={messages} loading={loading} error={error} />
                        {/*<MessagesList*/}
                        {/*    messages={messages}*/}
                        {/*    roomId={roomId}*/}
                        {/*    loading={loading}*/}
                        {/*    error={error}*/}
                        {/*/>*/}
                        <div ref={messagesEndRef}/>
                    </div>

                </div>
                <div className="content-end flex-shrink-0 mb-3 rounded-br-lg ">
                <SendMessageForm handleSendMessage={handleSendMessage}
                                 initialMessage={newMessage}
                                 onMessageChange={setNewMessage}
                />

                </div>

            </div>


            {/*<div ref={scrollToBottom}></div>*/}
            { showReply && (
                <div className={`fixed inset-y-0 right-0 w-1/3 bg-content border-l border-border transform transition-transform duration-300 ease-in-out ${ 
                    showReply ? 'translate-x-0' : 'translate-x-full'
                }`}><GetReplyDrawer/>
                </div>
            )}
        </div>
        </div>
    );
};

export default GetMessagesFromRoom
