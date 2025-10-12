import { useEffect, useState } from "react";
import {useUser} from "../context/userContext";

const AvatarWithInitials = ({ username }) => {
    const { users, fetchUser } = useUser();
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        const loadUser = async () => {
            if (users[username]) {
                console.log("load user", users[username]);
                setAvatar(users[username].avatar);
            } else {
                const userData = await fetchUser(username);
                if (userData) {
                    setAvatar(userData.avatar);
                }
            }
        };

        loadUser();
    }, [username, users, fetchUser]);

    return (
        <div className="flex items-start  h-[36px] bg-green-900  text-white rounded">
            {avatar || username[0].toUpperCase()}
        </div>
    );
};

export default AvatarWithInitials;