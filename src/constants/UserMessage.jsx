import AvatarWithInitials from "./AvatarWithInitials";
import {formatMessageDate, getTimeStamp, REST_API_PATH} from "./constants";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import React, {memo, useEffect, useState} from "react";

import {Popover, PopoverContent, PopoverTrigger} from "@radix-ui/react-popover";
import {useReply} from "../context/ReplyContext";
import {PiDotsThreeOutlineVerticalFill} from "react-icons/pi";
import {BiMessageRoundedDetail} from "react-icons/bi";
import AddEmojiToMessage from "./addEmojiToMessage";
import ShowReactionsToMessage from "./showReactionsToMessage";
import {useUsers} from "../context/allUserContext";
import {hover} from "@testing-library/user-event/dist/hover";

const UserMessage = (props) => {
    const {message, replyCount,userMessages,showHeader = true,notReply=true} = props;
    const [showMessageOptions, setShowMessageOptions] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const {toggleReply} = useReply();
    const userMap = useUsers();
    console.log("userMessages data ",userMessages)
    console.log("messages data ",message)

    const handleReplyClick = (message) => {
        toggleReply(message);
    };


    const getFileType = (filename) => {
        if (!filename) return 'file';
        const ext = filename.split('.').pop().toLowerCase();
        const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        const docTypes = ['doc', 'docx', 'txt', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx'];

        if (imageTypes.includes(ext)) return 'image';
        if (docTypes.includes(ext)) return 'document';
        return 'file';
    };

    const getUserProfilePic = (username) => {
        console.log("userMap ",userMap)
        if (userMap && userMap[username] && userMap[username].pic_url) {
            const profilePic = userMap[username].pic_url;
            return (
                <img
                    src={profilePic}
                    alt="profile"
                    className="rounded object-cover w-8 h-8"
                />
            );
        }
        return <AvatarWithInitials username={username} />;
    };




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
        p: (props) => <p className="text-[15px]" {...props} />,
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
        <div key={message.id} className={` flex items-start justify-start px-5 hover:bg-gray-100`}
             onMouseEnter={() => setShowMessageOptions(true)}
             onMouseLeave={() => setShowMessageOptions(false)}>
        {showHeader ? (
                <div className="mr-1 flex-shrink-0">
                    {getUserProfilePic(message.username)}
                </div>
            ) : (
                <div className="flex items-center group hover:cursor-pointer">
                    <div className="w-8 mr-1 flex-shrink-0 relative">
                        <span className="left-0 text-xs text-gray-500 ">
                          {getTimeStamp(message.timestamp)}
                        </span>
                    </div>
                </div>
                    )}
        <div className="flex-1 flex-col">
        <div
            key={`${message.room_id}-${message.timestamp}`} id="message-info"
            className="flex"
        >

            <Popover open={showMessageOptions} onOpenChange={setShowMessageOptions}>
                <div
                    className="relative h-full w-full p-0.5 text-gray-800"

                >
                    {/* Username + Timestamp */}
                    { showHeader &&
                    <div className="flex justify-start items-baseline ">
                        <span className="font-semibold text-sm hover:underline hover:cursor-pointer">{message.username}</span>
                        <span className="text-xs text-gray-500 px-2" >{message.timestamp ? getTimeStamp(message.timestamp) : ""}</span>
                    </div>}
                    {message.file_url && (
                        <div className="my-1 border border-gray-200 rounded-md bg-white">
                            {getFileType(message.file_url) === 'image' ? (
                                <a
                                    href={message.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <img
                                        src={message.file_url}
                                        alt="Attachment"
                                        className="max-w-xs max-h-48 rounded-md border cursor-pointer hover:opacity-90 transition-opacity"
                                    />
                                </a>
                            ) : (
                                <a
                                    target="_blank"
                                    href={`${REST_API_PATH}${message.file_url}`}
                                    download
                                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    <span className="text-xl">📄</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {message.file_url.split('/').pop()}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {getFileType(message.file_url).toUpperCase()} File
                                        </p>
                                    </div>
                                    <span className="text-blue-600 text-sm font-medium">Download</span>
                                </a>
                            )}
                        </div>
                    )}


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
                            {/*<ChevronDownIcon className="h-5 w-5" />*/}
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
                        <AddEmojiToMessage
                            messageId={message.message_id}
                        />

                        <button
                            onClick={() => handleReplyClick(message)}
                            className="flex items-center gap-1 text-gray-700 hover:text-black"
                        >
                            <BiMessageRoundedDetail />
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
                                    {userMessages.filter((item) =>  item.message_id === message.message_id).map(
                                        (item) =>(
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
            <div>
                <ShowReactionsToMessage roomId={message.room_id} messageId={message.message_id} />
                {/*{replyCount}*/}
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
export default memo(UserMessage);