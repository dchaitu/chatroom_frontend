import React from 'react';
import DateSeparationLine from "../constants/dateSeparationLine";
import UserMessage from "../constants/UserMessage";

const MessageItem = ({ item }) => {
    // console.log("MessageItem ",item);
    if (item.type === 'date') {
        return <DateSeparationLine date={item.date} />;
    }

    if (item.type === 'message'|| item.type === 'messageGroup') {
        // console.log("message item", item);
        return (
            <UserMessage
                message={item.message}
                replyCount={item.replyCount}
                showHeader={item.isFirstInGroup}
                userMessages={item.userMessages}
            />
        );
    }

    return null;
};

export default MessageItem;
