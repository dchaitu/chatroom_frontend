import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";


import { useReply } from "../context/ReplyContext";
import { useRoomMetadata } from "./useRoomMetadata";
import { REST_API_PATH, formatMessageDate } from "../constants/constants";
import RoomsSearchBar from "./roomsSearchBar";
import VerticalSideBar from "../constants/verticalSideBar";
import RoomSideBar from "./roomSideBar";
import RoomHeader from "../constants/roomHeader";
import SendMessageForm from "./sendMessageForm";
import GetReplyDrawer from "./getReplyDrawer";
import { useMessages } from "./useMessages";
import GetOldMessages from "./getOldMessages";
import { useWebSocketConnection } from "./useWebSocketConnection";
import { useTheme } from "../context/ThemeContext";
import { ReactionsProvider } from "../context/ReactionsContext";

const GetMessagesFromRoom = (props) => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const access_token = useMemo(() => localStorage.getItem("access_token"), []);
    const { showReply } = useReply();
    const { theme } = useTheme();

    const [newMessage, setNewMessage] = useState('');

    // Use custom hook for room data
    const { room: fetchedRoom, admins: fetchedAdmins } = useRoomMetadata(roomId, access_token);

    // Ensure safe defaults while loading
    const room = fetchedRoom || {
        room_id: "",
        room_name: "",
        description: "",
        users: [],
        admins: []
    };
    const roomAdmins = fetchedAdmins || [];

    const messagesEndRef = useRef(null);

    const { socket: ws, isConnected } = useWebSocketConnection(access_token, roomId);
    const { messages, loading, error, fetchMessages, setMessages } = useMessages(roomId, access_token, ws);
    const bgClass = theme === "gradient" ? "bg-gradient-to-r from-blue-200 to-red-300" : "bg-component-background";


    useEffect(() => {
        if (!roomId) return;

        fetch(`${REST_API_PATH}/room/${roomId}/mark-read`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
        });
    }, [roomId, access_token]);



    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [scrollToBottom]);

    const handleSendMessage = async (e, messageContent, file) => {
        e.preventDefault();
        if (!messageContent?.trim() && !file) return;

        const formData = new FormData();
        formData.append("room_id", roomId);
        if (messageContent) formData.append("content", messageContent);
        if (file) formData.append("file", file);

        try {
            // 1. Send to REST API to persist the message
            const response = await fetch(`${REST_API_PATH}/messages/send/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: formData,
            });

            const data = await response.json();
            console.log("Send response data:", data);

            if (response.ok) {
                // 2. Update local UI immediately for the sender
                setMessages(prevMessages => [...prevMessages, data]);
                setNewMessage("");

                // 3. Trigger WebSocket broadcast if connected
                // lambda.py 'broadcastMessage' route expects: { action: "broadcastMessage", room_id: ... }
                // It sends {"event": "new_message"} to other users, prompting them to fetch.
                if (ws && ws.readyState === WebSocket.OPEN) {
                    try {
                        const payload = {
                            action: "broadcastMessage",
                        };
                        ws.send(JSON.stringify(payload));
                        console.log("Sent broadcastMessage signal to WS");
                    } catch (wsErr) {
                        console.error("WebSocket broadcast error:", wsErr);
                    }
                }
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
        <ReactionsProvider roomId={roomId}>
            <div className={`${bgClass} text-text-on-background  flex flex-col h-screen`}>
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
                            <RoomHeader room={room} leaveRoom={handleLeaveRoom} roomAdmins={roomAdmins} />

                        </div>
                        {/* Messages */}


                        <div className={`flex-1 flex flex-row overflow-y-auto  ${showReply ? 'w-2/3' : 'w-full'}`}>
                            <div className="flex-1 " id="all-messages">
                                <GetOldMessages roomId={roomId} messages={messages} loading={loading} error={error} socket={ws} />
                                <div ref={messagesEndRef} />
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
                    {showReply && (
                        <div className={`fixed inset-y-0 right-0 w-1/3 bg-content border-l border-border transform transition-transform duration-300 ease-in-out ${showReply ? 'translate-x-0' : 'translate-x-full'
                            }`}><GetReplyDrawer socket={ws} />
                        </div>
                    )}
                </div>
            </div>
        </ReactionsProvider>
    );
};

export default GetMessagesFromRoom
