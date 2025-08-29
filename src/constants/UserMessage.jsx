import AvatarWithInitials from "./AvatarWithInitials";
import {getTimeStamp} from "./constants";

const UserMessage = ({message, currentUser}) => {
    return (
        <div key={message.id} className="flex items-center justify-start">
        <AvatarWithInitials username={message.username}/>
        <div
            key={`${message.room_id}-${message.timestamp}`}
            className={`flex-1 ${message.username === currentUser ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg 2xl:max-w-xl p-3 rounded-2xl shadow ${
                message.username === currentUser
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none'
            }`}>
                <div className="flex justify-between items-baseline mb-1">
                                <span className={`font-semibold ${message.username === currentUser ? 'text-blue-100' : 'text-gray-700'}`}>
                                    {message.username}
                                </span>
                    <span className={`text-xs ${message.username === currentUser ? 'text-blue-200' : 'text-gray-500'}`}>
                                    {message.timestamp ? getTimeStamp(message.timestamp) : ''}
                                </span>
                </div>
                <p className={message.username === currentUser ? 'text-white' : 'text-gray-800'}>
                    {message.content}
                </p>
            </div>
        </div>
        </div>
    )
}
export default UserMessage;