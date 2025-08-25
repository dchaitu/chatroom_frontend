
const AvatarWithInitials = ({username}) => {
    const initalizedUsername = username[0].toUpperCase();
    return (
        <div
            className="inline-flex items-center justify-center w-12 h-12 text-xl text-white bg-indigo-500 rounded-full">
            {initalizedUsername}
        </div>
    )
}
export default AvatarWithInitials