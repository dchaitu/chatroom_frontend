import React, {useContext, useEffect, useState} from 'react';

import {useReply} from "../context/ReplyContext";
import {REST_API_PATH} from "../constants/constants";
import SendMessageForm from "../constants/sendMessageForm";
import UserMessage from "../constants/UserMessage";
import {MdClose} from "react-icons/md";

const GetReplyDrawer = () => {
    const [replyText, setReplyText] = useState("")
    const [replies, setReplies] = useState([]);
    const {currentMessage, clearReply } = useReply()
    const [userMessages, setUserMessages] = useState([]);
    const access_token = localStorage.getItem("access_token")
    // console.log("GetReplyDrawer ", message)

    const fetchMessageDetails = async () => {
        // console.log(roomId,"message last seen pressed");
        const response = await fetch(`${REST_API_PATH}/message-info?room_id=${currentMessage.room_id}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }

        });
        const data = await response.json()
        console.log("UserMessage last seen data from fetch",data);
        setUserMessages(data);
        return data
    }

    const getMessageReplies = async () => {
        if (!currentMessage) {return}
        try {
            const response = await fetch(`${REST_API_PATH}/reply/show-replies-for/${currentMessage.message_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                },
            });
            const data = await response.json();
            console.log("Get replies ",data);
            setReplies(data);

        }
        catch (error) {
            console.error("Failed to get replies:", error)
        }
    }
    useEffect(() => {
        if(currentMessage) {
            getMessageReplies();
            fetchMessageDetails()

        }
    },[currentMessage])
    if (!currentMessage) {
        return null
    }

    const handleReplySubmit = async (e) => {
        e.preventDefault()
        if (!replyText.trim()) return;
        console.log("Reply text", replyText)

        try {
            const response = await fetch(`${REST_API_PATH}/reply/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    message_id: currentMessage.message_id,
                    content: replyText,
                })
            })

            if (response.ok) {
                setReplyText("")
                getMessageReplies();
                // You might want to refresh messages or update the UI here
            }
        } catch (error) {
            console.error("Failed to send reply:", error)
        }
    }

    const handleClose = () => {
        clearReply()
        // onClose?.()
    }

    return (
        <div className="top-0 right-0 h-full bg-white border-t border-l border-gray-200 rounded-tl-lg  flex flex-col">
            <div className="flex justify-between p-4 border-b border-gray-200">
                <h1 className="text-xl font-semibold">Thread</h1>
                <button 
                    onClick={handleClose}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close thread"
                >
                    <MdClose className="h-5 w-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-4 p-3">
                    <UserMessage message={currentMessage} userMessages={userMessages} />
                </div>

                <div className="space-y-4 border-t-2 py-2" id="thread-replies">
                    {replies.length>0?
                        replies.map((reply) => (
                            <div key={reply.reply_id} className="flex items-center justify-between">
                                <UserMessage key={reply.reply_id} message={reply} notReply={false} userMessages={userMessages} />
                            </div>
                        )) : (
                            <div></div>
                        )

                    }
                </div>
                <SendMessageForm handleSendMessage={handleReplySubmit}
                                 initialMessage={replyText}
                                 onMessageChange={setReplyText}
                />

            </div>


        </div>
    )
}

export default GetReplyDrawer