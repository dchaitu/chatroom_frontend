import AvatarWithInitials from "./AvatarWithInitials";
import {formatMessageDate, getTimeStamp, REST_API_PATH} from "./constants";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import {ChevronDownIcon} from "@heroicons/react/24/outline";
import React, {useEffect, useState} from "react";

import {Popover, PopoverContent, PopoverTrigger} from "@radix-ui/react-popover";
import {useReply} from "../context/ReplyContext";
import {PiDotsThreeOutlineVerticalFill} from "react-icons/pi";
import {BiMessageRoundedDetail} from "react-icons/bi";
import {LuSmilePlus} from "react-icons/lu";
import AddEmojiToMessage from "./addEmojiToMessage";
import ShowReactionsToMessage from "./showReactionsToMessage";

const UserMessage = (props) => {
    const {message, currentUser, notReply=true} = props;
    const [userMessages, setUserMessages] = useState([]);
    const [showMessageOptions, setShowMessageOptions] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [replyCount, setReplyCount] = useState(null);
    const {toggleReply} = useReply();
    const access_token = localStorage.getItem("access_token");

    const handleReplyClick = (message) => {
        toggleReply(message);
    };

    const handleEmojiSelect = (emoji, messageId) => {
        // The emoji is already handled by AddEmojiToMessage
        // This callback is kept for any future needs
    };

    const fetchMessageDetails = async (message_id) => {
        console.log(message_id,"message last seen pressed");
        const response = await fetch(`${REST_API_PATH}/message-info?message_id=${message_id}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }

        });
        const data = await response.json()
        console.log("UserMessage data",data)
        setUserMessages(data);
        return data
    }


    const showReplies = (count)=> {
        if (count)
            return <div>{count} replies</div>
        else
            return null;
    }

    const showButtonFunc = ()=> {
        console.log("show button");
        setShowButton(!showButton);
    }




    useEffect(() => {
        fetchMessageDetails(message.message_id);
        const fetchReply = async () => {
            try {
                const response = await fetch(`${REST_API_PATH}/reply/${message.message_id}/count/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access_token}`
                    }
                });
                const data = await response.json(); // { message_id: count }
                setReplyCount(data[message.message_id]);  // pick the count from response
            } catch (error) {
                console.error("Error fetching reply count:", error);
            }
        };

        fetchReply();
        console.log("message.message_id ", message.message_id);
    },[message.message_id, access_token]);


    const markdownComponents = {
        a: (props) => (
            <a
                {...props}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
            />
        ),
        ul: (props) => <ul className="list-disc pl-5 my-2" {...props} />,
        ol: (props) => <ol className="list-decimal pl-5 my-2" {...props} />,
        li: (props) => <li className="my-1" {...props} />,
        h1: (props) => <h1 className="text-3xl font-bold my-3" {...props} />,
        h2: (props) => <h2 className="text-2xl font-semibold my-2" {...props} />,
        h3: (props) => <h3 className="text-xl font-semibold my-1.5" {...props} />,
        code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-md text-sm my-2"
                    {...props}
                >
                    {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
            ) : (
                <code
                    className="bg-gray-200 rounded px-1 py-0.5 text-sm font-mono"
                    {...props}
                >
                    {children}
                </code>
            );
        },
    };

    return (
        <div key={message.id} className="flex items-center justify-start">
        <div className="flex self-start m-2">
            <AvatarWithInitials username={message.username}/>
        </div>
        <div className="flex-1 flex-col">
        <div
            key={`${message.room_id}-${message.timestamp}`} id="message-info"
            className="flex bg-red-300"
        >

            <Popover open={showMessageOptions} onOpenChange={setShowMessageOptions}>
                <div
                    className="relative h-full max-w-xs lg:max-w-md xl:max-w-lg 2xl:max-w-xl p-3 m-2 shadow bg-gray-100 text-gray-800 rounded-md"
                    onMouseEnter={showButtonFunc}
                    // onMouseLeave={() => setShowMessageOptions(false)}
                >
                    {/* Username + Timestamp */}
                    <div className="flex justify-start items-baseline mb-1">
                        <span className="font-semibold text-gray-700">{message.username}</span>
                        <span className="text-xs text-gray-500 px-2" >{message.timestamp ? getTimeStamp(message.timestamp) : ""}</span>
                    </div>


                    {/* Markdown content */}
                    <div className="prose max-w-none text-gray-800 break-words">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                            {message.content}
                        </ReactMarkdown>
                        {/*{message_id_wise_count[message.message_id]} replies*/}

                    </div>

                    {/* Menu Trigger (top-right overlay) */}
                    <PopoverTrigger asChild>
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
                            <ChevronDownIcon className="h-5 w-5" />
                        </button>
                    </PopoverTrigger>
                </div>

                {/* Popover Content (menu) */}
                <PopoverContent
                    className="z-50 px-3 py-2 bg-white shadow-lg border rounded-full"
                    align="end"
                    side="top"
                >
                    <div className="flex items-center gap-4">
                        {/* ✅ Single source of truth */}
                        <AddEmojiToMessage
                            messageId={message.message_id}
                            onEmojiSelect={handleEmojiSelect}
                        />

                        <button
                            onClick={() => handleReplyClick(message)}
                            className="flex items-center gap-1 text-gray-700 hover:text-black"
                        >
                            <BiMessageRoundedDetail /> <span>Reply</span>
                        </button>

                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="flex items-center gap-1 text-gray-700 hover:text-black">
                                    <PiDotsThreeOutlineVerticalFill />
                                </button>
                            </PopoverTrigger>

                            <PopoverContent
                                align="end"
                                side="top"
                                className="z-50 w-80 p-2 bg-gray-50 shadow-lg border rounded"
                            >
                                <p className="font-semibold mb-2">Last seen</p>
                                <ul className="px-4 py-2 bg-white rounded-md">
                                    {userMessages.map((item) => (
                                        <li
                                            key={`${item.message_id}-${item.username}`}
                                            className="mb-2 border-b border-gray-200 pb-1"
                                        >
                                            <div className="flex justify-between">
                                                <span className="font-medium">{item.username}</span>
                                                <span className="text-xs text-gray-500">
                                                    {getTimeStamp(item.read_at)}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                            {formatMessageDate(item.read_at)}
                                          </span>
                                        </li>
                                    ))}
                                </ul>
                            </PopoverContent>
                        </Popover>
                    </div>
                </PopoverContent>
            </Popover>

        </div>
            <div className="mt-1">
                <ShowReactionsToMessage roomId={message.room_id} messageId={message.message_id} />
            </div>

            <div
                className="px-5 text-sm text-gray-500 hover:text-blue-500 cursor-pointer flex items-center gap-1"
                onMouseEnter={() => setShowButton(true)}
                onMouseLeave={() => setShowButton(false)}
                onClick={() => handleReplyClick(message)}
            >
                {replyCount > 0 && notReply && (
                    <span className="flex items-center gap-1">
                    <BiMessageRoundedDetail className="h-4 w-4" />
                        {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                </span>
                )}
                {showButton && replyCount>0 &&  (
                    <span className="ml-1 text-gray-500"> View Thread</span>
                )}
            </div>
        </div>
        </div>
    )
}
export default UserMessage;