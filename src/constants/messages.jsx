import {formatMessageDate} from "./constants";

export function groupMessagesByDate(messages = []) {
    if (!Array.isArray(messages) || messages.length === 0) return [];


    const sorted = [...messages].sort((a, b) => {
        const ta = new Date(a.timestamp).getTime();
        const tb = new Date(b.timestamp).getTime();
        return ta - tb;
    });

    const grouped = [];
    let currentDate = null;
    let currentGroup = [];

    const pushCurrentGroup = () => {
        if (currentGroup.length === 0) return;
        grouped.push({
            type: "messageGroup",
            id: `group-${currentGroup[0].message_id}`,
            user: currentGroup[0].username,
            messages: currentGroup,
        });
        currentGroup = [];
    };

    for (const msg of sorted) {
        const msgDate = new Date(msg.timestamp);
        // format date string (you can adapt locale)
        const dateKey = msgDate.toLocaleDateString();
        // console.log("dateKey", dateKey);
        // console.log("curr Date ", formatMessageDate(msgDate));

        // new date header?
        if (dateKey !== currentDate) {
            // flush previous message group
            pushCurrentGroup();

            // add date separator item
            grouped.push({
                type: "date",
                id: `date-${dateKey}`,
                date: formatMessageDate(msgDate),
            });

            currentDate = dateKey;
        }

        // Should we start a new group? start if different user
        const lastMsg = currentGroup[currentGroup.length - 1];
        const isSameUser = lastMsg && lastMsg.username === msg.username;

        if (!isSameUser) {
            // flush previous group
            pushCurrentGroup();
        }

        currentGroup.push(msg);
    }

    pushCurrentGroup();

    return grouped;
}
