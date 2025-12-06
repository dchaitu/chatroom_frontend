import {REST_API_PATH} from "./constants";
import {useReactions} from "../context/ReactionsContext";

const ShowReactionsToMessage = ({messageId}) => {
    const {reactions, addReaction, removeReaction, fetchReactions} = useReactions();
    const access_token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    const handleEmojiClick = async (emoji) => {
        try{
            const response = await fetch(`${REST_API_PATH}/reaction/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    message_id: messageId,
                    reaction_type: emoji
                })
            });
            if(response.ok) {
                const result = await response.text();
                const data = result ? JSON.parse(result) : null;
                fetchReactions();
            }
        }catch (error) {
            console.log("Error toggling",error);
        }
    }



    const reactionsForMessage = reactions.filter(reaction => reaction.message_id === messageId);

    const groupedReactions = reactionsForMessage.reduce((acc, reaction) => {
        acc[reaction.reaction_type] = (acc[reaction.reaction_type] || 0) + 1;
        return acc;
    }, {});


    return (<div className="flex flex-row gap-2">
        {Object.entries(groupedReactions).map(([emoji, count]) => (
              <span key={`${emoji}-${messageId}`}
                         className="px-2 py-1 bg-gray-100 rounded-full text-sm cursor-pointer">
              <button onClick={()=>handleEmojiClick(emoji)}>
                  <span>{emoji}</span>
              </button>

              {count > 0 &&
               <span key={`${emoji}-${messageId}-${count}`} className="text-sm ml-1">
                  {count}
              </span>}
            </span>
        ))}
    </div>)
}

export default ShowReactionsToMessage
