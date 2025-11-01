import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">PRODUCT</h3>
                        <ul className="space-y-2">
                            <li><Link to="/demo" className="hover:text-blue-600">Watch demo</Link></li>
                            <li><Link to="/pricing" className="hover:text-blue-600">Pricing</Link></li>
                            <li><Link to="/compare" className="hover:text-blue-600">Paid vs Free</Link></li>
                            <li><Link to="/accessibility" className="hover:text-blue-600">Accessibility</Link></li>
                            <li><Link to="/releases" className="hover:text-blue-600">Featured releases</Link></li>
                            <li><Link to="/changelog" className="hover:text-blue-600">Change log</Link></li>
                            <li><Link to="/status" className="hover:text-blue-600">Status</Link></li>
                        </ul>
                    </div>
                    {/* --- Legal / Copyright Bar --- */}
                    <div className="mt-16 pt-8 border-t border-gray-200 text-xs">
                        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500">
                            {/* Left Side: Legal Links */}
                            <div className="flex flex-wrap space-x-6">
                                <Link to="/#" className="hover:text-blue-600">Privacy</Link>
                                <Link to="/#" className="hover:text-blue-600">Terms</Link>
                                <Link to="/#" className="hover:text-blue-600">Cookie preferences</Link>
                                <Link to="/#" className="hover:text-blue-600 flex items-center">
                                    Your privacy choices
                                    {/* Custom icon approximation for 'Your privacy choices' */}
                                    <span className="ml-1 inline-block h-3 w-4 border-2 border-green-500 bg-white rounded-sm relative">
                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-1 w-1 bg-green-500 rounded-full"></span>
                            <span className="text-[8px] absolute -right-2 -bottom-2 text-green-500 font-bold">CA</span>
                        </span>
                                </Link>
                            </div>

                            {/* Right Side: Copyright */}
                            <p className="mt-4 md:mt-0">
                                &copy; {new Date().getFullYear()} Slack Technologies, LLC, a Salesforce company. All rights reserved.
                                <br />
                                Various trademarks held by their respective owners.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;