import { useEffect, useState } from "react";
import {useUser} from "../context/userContext";

const AvatarWithInitials = (props) => {
    const {username, imgClass="w-8 h-8"} = props
    const { users, fetchUser } = useUser();
    const [avatar, setAvatar] = useState("");
    const [userPicUrl, setUserPicUrl] = useState("")
    const fallbackText = username ? username[0].toUpperCase() : "?";
    // console.log("user AvatarInitials", username);

    useEffect(() => {
        const loadUser = async () => {
            if (users[username]) {
                console.log("load user", users[username]);
                setAvatar(users[username].avatar);
                setUserPicUrl(users[username].pic_url);
                console.log("user pic_url", userPicUrl);

            }
            else {
                const userData = await fetchUser(username);
                if (userData) {
                    setAvatar(userData.avatar);
                    setUserPicUrl(userData.pic_url);
                    console.log("user data", userData);
                    console.log("user pic_url", userPicUrl);
                }
            }
        };

        loadUser();
    }, [username, users, fetchUser]);

    return (
        <div className="flex items-center justify-center text-white">
            {userPicUrl ? (
                <img
                    src={userPicUrl}
                    alt="profile"
                    className={`rounded object-cover ${imgClass}`} // ✅ applies w-8 h-8 correctly
                />
            ) : avatar ? (
                <span className="text-2xl">{avatar}</span>
            ) : (
                <span className="text-lg">{fallbackText}</span>
            )}
        </div>

    );
};

export default AvatarWithInitials;