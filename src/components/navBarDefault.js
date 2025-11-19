import React from "react";
import {
    Navbar,
    Typography,
    Button,
    IconButton, Collapse,
} from "@material-tailwind/react";
import {useNavigate} from "react-router-dom";
import {CgProfile} from "react-icons/cg";
import {FaUserCircle} from "react-icons/fa";
import {IoMdClose} from "react-icons/io";
import {FiMenu} from "react-icons/fi";

const NavbarDefault = () => {
    const [openNav, setOpenNav] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false),
        );
    }, []);

    const userProfile = () => {
        navigate(`/user/`);
    }

    const userLogout = () => {
        navigate("/");
        localStorage.removeItem("access_token");
    }

    const navList = (
        <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <div className="flex flex-col gap-2 lg:hidden">
                <Button 
                    variant="text" 
                    onClick={userProfile} 
                    className="flex items-center gap-3 justify-start"
                    fullWidth
                >
                    <FaUserCircle size={15}/>
                    Profile
                </Button>
                <Button 
                    onClick={userLogout} 
                    variant="text" 
                    className="flex items-center justify-start"
                    fullWidth
                >
                    Log Out
                </Button>
            </div>
        </ul>
    );

    return (
        <Navbar className="mx-auto max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4">
            <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
                <Typography
                    as="a"
                    href="/"
                    className="mr-4 cursor-pointer py-1.5 font-medium"
                >
                    Home
                </Typography>
                <div className="hidden lg:block">{navList}</div>
                <div className="flex items-center gap-x-1">
                    <Button variant="text" onClick={userProfile} className="flex items-center gap-3">
                        <FaUserCircle size={15}/>
                        Profile
                    </Button>
                    <Button onClick={userLogout} variant="text" size="sm" className="hidden lg:inline-block">
                        <span>Log Out</span>
                    </Button>
                </div>
                <IconButton
                    variant="text"
                    className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                    ripple={false}
                    onClick={() => setOpenNav(!openNav)}
                >
                    {openNav ? (
                        <IoMdClose size={20}/>
                    ) : (
                        <FiMenu size={20}/>
                    )}
                </IconButton>
            </div>
            <Collapse open={openNav}>
                <div className="container mx-auto">
                    {navList}
                </div>
            </Collapse>
        </Navbar>
    );
}

export default NavbarDefault;