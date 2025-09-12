import AvatarWithInitials from "./AvatarWithInitials";
import {formatMessageDate, getTimeStamp, REST_API_PATH} from "./constants";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import {ChevronDownIcon} from "@heroicons/react/24/outline";
import React, {useEffect, useState} from "react";

import {Popover, PopoverContent, PopoverTrigger} from "@radix-ui/react-popover";


const UserMessage = ({message, currentUser}) => {
    const [userMessages, setUserMessages] = useState([]);

    const access_token = localStorage.getItem("access_token");

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

        <div
            key={`${message.room_id}-${message.timestamp}`}
            className={`flex-1 ${message.username === currentUser ? 'justify-end' : 'justify-start'}`}
        >


            <div className={`bg-yellow-900 max-w-xs lg:max-w-md xl:max-w-lg 2xl:max-w-xl p-3 m-2 shadow bg-gray-100 text-gray-800`}>
                <div className="flex justify-between items-baseline mb-1">
                                <span className={`font-semibold text-gray-700'`}>
                                    {message.username}
                                </span>
                    <span className={`text-xs 'text-gray-500'`}>
                                    {message.timestamp ? getTimeStamp(message.timestamp) : ''}
                                </span>
                </div>
                <section className="prose max-w-none text-gray-800 break-words">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}>{message.content.trim()}
                    </ReactMarkdown>
                </section>

                    <Popover>
                    <PopoverTrigger asChild >
                    <button className="flex justify-self-end">

                        <ChevronDownIcon className="h-5 w-5 text-gray-500" onClick={()=> fetchMessageDetails(message.message_id)}/>

                    </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 z-50 p-2 bg-gray-50 shadow-lg border rounded">
                        <p>Last seen</p>
                        <ul className="px-4 py-2 bg-white">
                            {userMessages.map((item) => (
                                <div key={`${item.message_id}-${item.username}`}>
                                <li key={`${item.message_id}-${item.username}`}>
                                    {item.username}
                                </li>
                                    <div className="flex justify-start text-gray-600">
                                        <span className="text-sm">{formatMessageDate(item.read_at)} <span className="text-xs ">{getTimeStamp(item.read_at)}</span></span>

                                    </div>
                                </div>
                            ))}
                        </ul>
                    </PopoverContent>
                    </Popover>

            </div>

        </div>
        </div>
    )
}
export default UserMessage;