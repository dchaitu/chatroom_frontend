import {Button, Textarea} from "@material-tailwind/react";
import {PaperAirplaneIcon} from "@heroicons/react/24/solid";
import React, {useEffect, useState} from "react";


const SendMessageForm = (props) => {
    const {handleSendMessage,initialMessage='', onMessageChange} = props;
    const [newMessage, setNewMessage] = useState(initialMessage);

    useEffect(() => {
        setNewMessage(initialMessage);
    },[initialMessage]);

    const handleChange = (e) => {
        const value = e.target.value;
        setNewMessage(value);
        onMessageChange?.(value);
    }

    return (
        <div className="p-4 bg-white border-t">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Textarea
                    type="text"
                    value={newMessage}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault(); // prevent newline on Enter
                            handleSendMessage(e);
                        }
                    }}
                    placeholder="Type your message..."
                    className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                    labelProps={{
                        className: "hidden",
                    }}
                    containerProps={{className: "min-w-0 flex-1"}}
                />
                <Button
                    type="submit"
                    size="md"
                    className="rounded-lg flex items-center justify-center"
                    disabled={!newMessage.trim()}
                >
                    <PaperAirplaneIcon className="h-5 w-5"/>
                </Button>
            </form>
        </div>
    )
}

export default SendMessageForm;