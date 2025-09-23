import {Button, Textarea} from "@material-tailwind/react";
import {PaperAirplaneIcon} from "@heroicons/react/24/solid";
import React, {useEffect, useState} from "react";
import {FiPlusCircle} from "react-icons/fi";
import {LuSmilePlus} from "react-icons/lu";
import EmojiPicker from "emoji-picker-react";


const SendMessageForm = (props) => {
    const {handleSendMessage,initialMessage='', onMessageChange} = props;
    const [newMessage, setNewMessage] = useState(initialMessage);
    const [file, setFile] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        setNewMessage(initialMessage);
    },[initialMessage]);

    const handleChange = (e) => {
        const value = e.target.value;
        setNewMessage(value);
        onMessageChange?.(value);
    }

    const onFileAndMessageSubmit = (e)=>{
        e.preventDefault();
        handleSendMessage(e,newMessage,file);
        setFile(null);
    }
    const handleEmojiSelect = (emojiData) => {
        const emoji = emojiData.emoji;
        setNewMessage((prev) => prev + emoji); // append emoji to message
        setShowEmojiPicker(false);
    };

    return (
        <div className="p-4 bg-white border-t">
            <form onSubmit={onFileAndMessageSubmit} className="flex flex-col gap-2">
                <div className="flex items-stretch gap-2">
                    <Textarea
                        type="text"
                        value={newMessage}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault(); // prevent newline on Enter
                                onFileAndMessageSubmit(e);
                            }
                        }}
                        placeholder="Type your message..."
                        className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4
                         ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900
                         focus:ring-gray-900/10"
                        labelProps={{
                            className: "hidden",
                        }}
                        containerProps={{className: "min-w-0 flex-1"}}/>

                    <Button
                        type="submit"
                        size="md"
                        className="rounded-lg flex items-center justify-center"
                        disabled={!newMessage.trim() && !file}
                    >
                        <PaperAirplaneIcon className="h-5 w-5"/>
                    </Button>
                </div>
                <div className="flex justify-start m-2">
                    <label htmlFor="file-upload" className="cursor-pointer text-gray-600 hover:text-black">
                        <FiPlusCircle className="h-6 w-6" />
                    </label>
                    <input type="file"
                           id="file-upload"
                           onChange={(e) => setFile(e.target.files[0])}
                           className="text-sm hidden" />
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="text-gray-600 hover:text-black"
                    >
                        <LuSmilePlus className="h-6 w-6 mx-2"/>
                    </button>
                </div>

                {/* Emoji Picker Dropdown */}
                {showEmojiPicker && (
                    <div className="absolute bottom-16 left-10 z-50">
                        <EmojiPicker onEmojiClick={handleEmojiSelect} />
                    </div>
                )}
            </form>
            {file && (
                <div className="mt-2 text-sm text-gray-500">
                    Attached: {file.name}
                </div>
            )}
        </div>
    )
}

export default SendMessageForm;