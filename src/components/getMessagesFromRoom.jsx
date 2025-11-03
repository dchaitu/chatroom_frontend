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
    const {showReply} = useReply();
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const { room_id } = useParams();
    const roomId = room_id;
    const access_token = localStorage.getItem("access_token");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);




    // const scrollToBottom = useCallback(() => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, []);

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
            fetch(`${REST_API_PATH}/room/${roomId}/mark-read`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-Type": "application/json"
                }
            });
        }
    }, [roomId, access_token]);

    // Fetch room details when component mounts or roomId changes
    useEffect(() => {
        if (roomId) {
            fetchRoomDetails();
            fetchRoomAdmins();
        }
    }, [roomId, fetchRoomDetails, fetchRoomAdmins]);

    // Auto-scroll to bottom when messages change
    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages]);

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
                    setError(null);
                } else {
                    setIsConnected(false);
                    setError("Failed to fetch messages");
                }
            } catch (error) {
                console.error("Polling error:", error);
                setIsConnected(false);
                setError("Failed to fetch messages");
            } finally {
                setLoading(false);
            }
        };

        if (roomId) {
            fetchMessages(); // initial fetch
            intervalId = setInterval(fetchMessages, POLLING_INTERVAL);
        }

        return () => clearInterval(intervalId);
    }, [roomId, access_token]);


    const handleSendMessage = async (e, messageContent, file) => {
        e.preventDefault();
        if (!messageContent?.trim() && !file) {
            console.error("Cannot send empty message and no file");
            return;
        }

        const formData = new FormData();
        formData.append("room_id", roomId);
        if(messageContent) {
            formData.append("content", messageContent);
        }
        if(file){
            formData.append("file", file);
            console.log('File details:', {
                name: file.name,
                type: file.type,
                size: file.size
            });
        }

        try {
            console.log('Sending request to:', `${REST_API_PATH}/messages/send/`);
            console.log('Request payload:', {
                room_id: roomId,
                hasContent: !!messageContent?.trim(),
                hasFile: !!file
            });

            const response = await fetch(`${REST_API_PATH}/messages/send/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${access_token}`
                },
                body: formData
            });

            const data = await response.json();
            console.log("Data is ...",data);
            if (response.ok) {
                setMessages(prevMessages => [...prevMessages, data]);
                console.log("File Data is ", data)
                setNewMessage("");
            }
        } catch (err) {
            console.error("Send message error:", {
                message: err.message,
                name: err.name,
                stack: err.stack
            });
            alert(`Failed to send message: ${err.message}`);
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
        // </div>
    );
};

export default GetMessagesFromRoom;
