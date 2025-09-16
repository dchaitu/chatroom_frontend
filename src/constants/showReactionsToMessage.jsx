import {REST_API_PATH} from "./constants";
import {useEffect, useState} from "react";

const ShowReactionsToMessage = ({roomId, messageId}) => {
    const [reactions, setReactions] = useState([]);
    const access_token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const fetchReactionsToMessages = async (roomId) => {
        try{
            const response = await fetch(`${REST_API_PATH}/reaction/${roomId}/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`

                }
            });
            const data = await response.json()
            setReactions(data);
        }catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchReactionsToMessages(roomId);
    },[roomId])


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
            if(response.status === 200 || response.status === 201) {
                const data = await response.json()
                if(!data)
                {
                    setReactions((prevState) => (
                        prevState.filter((r)=> !(r.username === username && r.reaction_type === emoji))
                    ))
                }
                else {
                    setReactions((prevState) => {
                        const updatedReaction = prevState.filter((r)=> r.username !== username)
                        return [...updatedReaction, data]
                    })
                }
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


    return (<div className="flex-1 flex-row gap-2 mt-1">
        {Object.entries(groupedReactions).map((emoji,count) => {
          return(
              <button key={emoji} onClick={()=>handleEmojiClick(emoji)}>
              <span key={`${emoji}-${messageId}`}
                         className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                <span>{emoji}</span>
              {count>0 &&
               <span key={`${emoji}-${messageId}-${count}`} className="text-sm ">
                  {count}
              </span>}
            </span>
              </button>
                  )

        })}
    </div>)
}

export default ShowReactionsToMessage
