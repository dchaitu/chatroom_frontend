import {useState} from "react";
import EmojiPicker from "emoji-picker-react";
import {REST_API_PATH} from "./constants";
import {LuSmilePlus} from "react-icons/lu";

const AddEmojiToMessage = ({messageId, onEmojiSelect}) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const access_token = localStorage.getItem("access_token");

    const handleClick = async (emojiData) => {
        setShowEmojiPicker(false);
        const emoji = emojiData.emoji;
        // setSelectedEmoji(emoji);
        onEmojiSelect(emojiData.emoji, messageId);

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
            const data = await response.json();
            console.log("Reaction saved",data);

            // if (!data) {
            //     setReactions((prev) =>
            //         prev.filter(
            //             (r) => !(r.message_id === messageId && r.username === currentUser && r.reaction_type === emoji)
            //         )
            //     );
            // } else {
            //     // Either new or updated reaction
            //     setReactions((prev) => [
            //         ...prev.filter(
            //             (r) => !(r.message_id === messageId && r.username === currentUser)
            //         ),
            //         data,
            //     ]);
            // }
            onEmojiSelect({
                message_id: messageId,
                reaction_type: emoji,
                reacted_at: new Date().toISOString(),
                ...data,
            });
        }catch(err) {
            console.error("Error saving reaction",err);
        }
    }

    return (
        <>
            <button className="flex items-center gap-1 text-gray-700 hover:text-black" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <LuSmilePlus /> <span>React</span>
            </button>
            {
                showEmojiPicker && <EmojiPicker
                    onEmojiClick={(emojiData)=> handleClick(emojiData)}/>
            }

        </>
    )
}

export default AddEmojiToMessage;