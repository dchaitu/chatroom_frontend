import {Link} from "react-router-dom";
import {Home} from "lucide-react";

const Hero = ()=> {
    return <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
            {/*<h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">*/}
            {/*    <span className="block">Welcome to ChatRoom</span>*/}
            {/*</h1>*/}
            <h1 className="mt-3 text-5xl font-semibold tracking-tight  max-w-md mx-auto ">
                Where <span>work</span> happens
            </h1>
            <p className="mt-5 max-w-md mx-auto text-lg text-gray-600">
                Share it. Discuss it. Get it done. Side by side with AI agents.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                    <Link to="/register"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                        Get Started
                    </Link>
                </div>
            </div>
        </div>
    </div>;
}
export default Hero;