import { useEffect, useState } from "react";
import {useUser} from "../context/userContext";

const AvatarWithInitials = ({ username }) => {
    const { users, fetchUser } = useUser();
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        const loadUser = async () => {
            if (users[username]) {
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
        <div className="inline-flex items-center justify-center w-16 h-16 text-5xl text-white rounded-full">
            {avatar || username[0].toUpperCase()}
        </div>
    );
};

export default AvatarWithInitials;