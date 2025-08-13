import { Link, useNavigate } from "react-router-dom";
import { Button, Card } from "@material-tailwind/react";
import { Typography, CardBody, CardFooter } from "@material-tailwind/react";
import {
    ChatBubbleLeftRightIcon,
    ArrowRightOnRectangleIcon,
    UserPlusIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import {NavbarDefault} from "./navBarDefault";

const Home = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        const username = localStorage.getItem("username");
        const token = localStorage.getItem("token");
        if(username && token){
            navigate(`/rooms/${username}`);
        }
        navigate('/login');  // Redirect to login page on button click
    };

    const handleSignUpClick = () => {
        navigate('/register');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Welcome to</span>{' '}
                                    <span className="block text-indigo-600 xl:inline">ChatRoom</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Connect with friends and colleagues in real-time. Create or join chat rooms and start conversations instantly.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <Button
                                            onClick={handleLoginClick}
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                                        >
                                            <ArrowRightOnRectangleIcon className="-ml-1 mr-2 h-4 w-4" />
                                            Sign In
                                        </Button>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <Button
                                            onClick={handleSignUpClick}
                                            variant="outlined"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                                        >
                                            <UserPlusIcon className="-ml-1 mr-2 h-4 w-4" />
                                            Sign Up
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>

            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            A better way to communicate
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                                <CardBody>
                                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white mb-4">
                                        <ChatBubbleLeftRightIcon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Real-time Messaging</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Chat with others in real-time with our fast and reliable messaging system.
                                    </p>
                                </CardBody>
                            </Card>

                            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                                <CardBody>
                                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white mb-4">
                                        <UserGroupIcon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Multiple Rooms</h3>
                                    <p className="mt-2 text-base text-gray-500">
                                        Create or join different chat rooms based on your interests or projects.
                                    </p>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-50">
                <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
                    <p className="mt-8 text-center text-base text-gray-400">
                        &copy; {new Date().getFullYear()} ChatRoom App. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )



}
export default Home;