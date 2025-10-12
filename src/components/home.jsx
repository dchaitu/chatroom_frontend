// In home.jsx
import { Link } from "react-router-dom";
import Footer from "../constants/footer";
import Testimonials from "../constants/testimonials";
import Hero from "../constants/hero";
import {SearchIcon} from "lucide-react";



const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-indigo-600">
                                <img src="https://a.slack-edge.com/38f0e7c/marketing/img/nav/logo.svg" alt="logo"/>
                            </span>
                            <div className="hidden md:flex items-center space-x-8 pr-1 text-black font-bold">
                                <a href="#features"
                                   className="px-3 py-2 rounded-md text-sm ">Features</a>
                                <a href="#solutions"
                                   className="px-3 py-2 rounded-md text-sm ">Solutions</a>
                                <a href="#enterprise"
                                   className="px-3 py-2 rounded-md text-sm ">Enterprise</a>
                                <a href="#resources"
                                   className="px-3 py-2 rounded-md text-sm font-medium">Resources</a>

                                <a href="#pricing"
                                   className="px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link to="#">
                                <SearchIcon/>
                            </Link>

                            <Link to="/login"
                                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Log
                                in</Link>
                            <Link to="/register"
                                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Sign
                                up</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <Hero/>

            {/* Features Section */}
            <section id="features" className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center">Features</h2>
                    {/* Add your features here */}
                </div>
            </section>

            <section id="testimonials" className="py-12 bg-gray-50">
                <Testimonials/>
            </section>

            {/* Other sections can be added similarly */}
            <Footer/>
        </div>
    );
};

export default Home;