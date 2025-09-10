import AvatarWithInitials from "./AvatarWithInitials";
import {getTimeStamp} from "./constants";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';


const UserMessage = ({message, currentUser}) => {
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
        <AvatarWithInitials username={message.username}/>
        <div
            key={`${message.room_id}-${message.timestamp}`}
            className={`flex-1 ${message.username === currentUser ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg 2xl:max-w-xl p-3 m-2 shadow bg-gray-100 text-gray-800`}>
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
                        components={markdownComponents}>{message.content.trim()}</ReactMarkdown>
                </section>

            </div>
        </div>
        </div>
    )
}
export default UserMessage;