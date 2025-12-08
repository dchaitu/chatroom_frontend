import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { REST_API_PATH } from "./constants";
import { LuSmilePlus } from "react-icons/lu";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { useReactions } from "../context/ReactionsContext";

const AddEmojiToMessage = ({ messageId, roomId, socket }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { fetchReactions } = useReactions();

    const access_token = localStorage.getItem("access_token");

    const handleClick = async (emojiData) => {
        setShowEmojiPicker(false);
        const emoji = emojiData.emoji;

        try {
            const response = await fetch(`${REST_API_PATH}/reaction/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify({
                    message_id: messageId,
                    reaction_type: emoji,
                }),
            });
            if (response.ok) {
                await fetchReactions();

                if (socket && socket.readyState === WebSocket.OPEN) {
                    try {
                        const payload = {
                            action: "broadcastMessage",
                            reaction: emoji
                        };
                        socket.send(JSON.stringify(payload));
                        console.log("Sent reaction broadcast to WS");
                    } catch (wsErr) {
                        console.error("WebSocket reaction broadcast error:", wsErr);
                    }
                }
            }

        } catch (err) {
            console.error("Error saving reaction", err);
        }
    }

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <button className="flex items-center gap-1 text-gray-700 hover:text-black" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                        <LuSmilePlus />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="p-0 border-0 w-auto">
                    <EmojiPicker onEmojiClick={handleClick} />
                </PopoverContent>
            </Popover>

        </>
    )
}

export default AddEmojiToMessage;