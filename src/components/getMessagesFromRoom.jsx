import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {POLLING_INTERVAL, REST_API_PATH} from "../constants/constants";
import GetOldMessages from "./getOldMessages";
import RoomHeader from "../constants/roomHeader";
import RoomSideBar from "./roomSideBar";
import {useReply} from "../context/ReplyContext";
import GetReplyDrawer from "./getReplyDrawer";
import SendMessageForm from "./sendMessageForm";
import VerticalSideBar from "../constants/verticalSideBar";
import RoomsSearchBar from "./roomsSearchBar";

const GetMessagesFromRoom = (props) => {
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
    const [roomAdmins, setRoomAdmins] = useState([]);
    const [file, setFile] = useState(null);
    const {showReply} = useReply();
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const { room_id } = useParams();
    const roomId = room_id;
    const access_token = localStorage.getItem("access_token");




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
            fetchRoomAdmins();
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


    const handleSendMessage = async (e, messageContent, file) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("room_id", roomId);
        if(messageContent) {
            formData.append("content", messageContent);
        }
        if(file){
            formData.append("file", file);
        }

        try {
            const response = await fetch(`${REST_API_PATH}/messages/send/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: formData
            });
            const data = await response.json();
            // console.log("Data is ...",data);
            if (response.ok) {
                setMessages(prevMessages => [...prevMessages, data]);
                console.log("File Data is ", data)
                setNewMessage("");
                setFile(null);
                // reset input
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
        <div className="bg-indigo-800 ">
            <RoomsSearchBar />

        <div className="flex flex-col h-screen overflow-hidden">


        <div className="flex flex-1 overflow-hidden bg-gray-100 font-sans min-w-0 w-full">
            {/* Vertical Sidebar */}

            <VerticalSideBar
            />
            {/* Sidebar */}
            <RoomSideBar
                connected={isConnected}
                currentRoomId={roomId}
            />

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${showReply ? 'w-2/3' : 'w-full'}`}>
                <div className="bg-white border-b p-4 flex-shrink-0">
                    {/*Room Header */}
                    <RoomHeader room={room} leaveRoom={handleLeaveRoom} roomAdmins={roomAdmins}/>

                </div>
                {/* Messages */}

                <div className={`flex flex-row overflow-y-auto  ${showReply ? 'w-2/3' : 'w-full'}`}>
                    <div className="flex-1 " id="all-messages">
                        <GetOldMessages roomId={roomId}/>
                        <div ref={messagesEndRef}/>
                    </div>

                </div>
                <div className="flex-1 content-end flex-shrink-0">
                <SendMessageForm handleSendMessage={handleSendMessage}
                                 initialMessage={newMessage}
                                 onMessageChange={setNewMessage}
                />

                </div>

            </div>


            {/*<div ref={scrollToBottom}></div>*/}
            { showReply && (
                <div className={`fixed inset-y-0 right-0 w-1/3 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out ${
                    showReply ? 'translate-x-0' : 'translate-x-full'
                }`}><GetReplyDrawer/>
                </div>
            )}
        </div>
        </div>
        </div>
    );
};

export default GetMessagesFromRoom;
