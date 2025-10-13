const Footer = () => {

    return (// Add this at the bottom of your Home component, before the final closing </div>

        <footer className="bg-white text-gray-700 pt-12 pb-8 text-sm">
            <div className="flex">
                <div className="flex  items-start grow">
                    <img src="https://a.slack-edge.com/38f0e7c/marketing/img/nav/logo.svg" alt="logo"/>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Main Content Grid: 5 Columns + Separate 'Why Slack?' Section */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-12">

                        {/* Column 1: PRODUCT */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">PRODUCT</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-blue-600">Watch demo</a></li>
                                <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                                <li><a href="#" className="hover:text-blue-600">Paid vs Free</a></li>
                                <li><a href="#" className="hover:text-blue-600">Accessibility</a></li>
                                <li><a href="#" className="hover:text-blue-600">Featured releases</a></li>
                                <li><a href="#" className="hover:text-blue-600">Change log</a></li>
                                <li><a href="#" className="hover:text-blue-600">Status</a></li>
                            </ul>
                        </div>

                        {/* Column 2: FEATURES + WHY SLACK? */}
                        <div className="flex flex-col space-y-8">
                            {/* FEATURES */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">FEATURES</h3>
                                <ul className="space-y-2">
                                    <li><a href="#" className="hover:text-blue-600">Channels</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Slack Connect</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Workflow Builder</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Messaging</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Huddles</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Canvas</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Lists</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Clips</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Apps & Integrations</a></li>
                                    <li><a href="#" className="hover:text-blue-600">File sharing</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Slack AI</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Agentforce</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Enterprise search</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Security</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Enterprise Key Management</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Slack Atlas</a></li>
                                    <li><a href="#" className="hover:text-blue-600">See all features</a></li>
                                </ul>
                            </div>

                            {/* WHY SLACK? */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">WHY SLACK?</h3>
                                <ul className="space-y-2">
                                    <li><a href="#" className="hover:text-blue-600">Slack vs email</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Enterprise</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Small business</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Productivity</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Task management</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Scale</a></li>
                                    <li><a href="#" className="hover:text-blue-600">Trust</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Column 3: SOLUTIONS */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">SOLUTIONS</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-blue-600">Engineering</a></li>
                                <li><a href="#" className="hover:text-blue-600">IT</a></li>
                                <li><a href="#" className="hover:text-blue-600">Customer service</a></li>
                                <li><a href="#" className="hover:text-blue-600">Sales</a></li>
                                <li><a href="#" className="hover:text-blue-600">Project management</a></li>
                                <li><a href="#" className="hover:text-blue-600">Marketing</a></li>
                                <li><a href="#" className="hover:text-blue-600">Security</a></li>
                                <li><a href="#" className="hover:text-blue-600">Manufacturing, auto and energy</a></li>
                                <li><a href="#" className="hover:text-blue-600">Technology</a></li>
                                <li><a href="#" className="hover:text-blue-600">Media</a></li>
                                <li><a href="#" className="hover:text-blue-600">Financial services</a></li>
                                <li><a href="#" className="hover:text-blue-600">Retail</a></li>
                                <li><a href="#" className="hover:text-blue-600">Public sector</a></li>
                                <li><a href="#" className="hover:text-blue-600">Education</a></li>
                                <li><a href="#" className="hover:text-blue-600">Health and life sciences</a></li>
                                <li><a href="#" className="hover:text-blue-600">See all solutions</a></li>
                            </ul>
                        </div>

                        {/* Column 4: RESOURCES */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">RESOURCES</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-blue-600">Help Centre</a></li>
                                <li><a href="#" className="hover:text-blue-600">What's new</a></li>
                                <li><a href="#" className="hover:text-blue-600">Resources library</a></li>
                                <li><a href="#" className="hover:text-blue-600">Slack blog</a></li>
                                <li><a href="#" className="hover:text-blue-600">Community</a></li>
                                <li><a href="#" className="hover:text-blue-600">Customer stories</a></li>
                                <li><a href="#" className="hover:text-blue-600">Events</a></li>
                                <li><a href="#" className="hover:text-blue-600">Developers</a></li>
                                <li><a href="#" className="hover:text-blue-600">Partners</a></li>
                                <li><a href="#" className="hover:text-blue-600">Partner offers</a></li>
                                <li><a href="#" className="hover:text-blue-600">Slack Marketplace</a></li>
                                <li><a href="#" className="hover:text-blue-600">Slack Certified</a></li>
                            </ul>
                        </div>

                        {/* Column 5: COMPANY */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">COMPANY</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-blue-600">About us</a></li>
                                <li><a href="#" className="hover:text-blue-600">News</a></li>
                                <li><a href="#" className="hover:text-blue-600">Media kit</a></li>
                                <li><a href="#" className="hover:text-blue-600">Brand centre</a></li>
                                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                                <li><a href="#" className="hover:text-blue-600">Slack shop</a></li>
                                <li><a href="#" className="hover:text-blue-600">Engineering blog</a></li>
                                <li><a href="#" className="hover:text-blue-600">Design blog</a></li>
                                <li><a href="#" className="hover:text-blue-600">Contact us</a></li>
                            </ul>
                        </div>

                    </div>
                    {/* --- Legal / Copyright Bar --- */}
                    <div className="mt-16 pt-8 border-t border-gray-200 text-xs">
                        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500">
                            {/* Left Side: Legal Links */}
                            <div className="flex flex-wrap space-x-6">
                                <a href="#" className="hover:text-blue-600">Privacy</a>
                                <a href="#" className="hover:text-blue-600">Terms</a>
                                <a href="#" className="hover:text-blue-600">Cookie preferences</a>
                                <a href="#" className="hover:text-blue-600 flex items-center">
                                    Your privacy choices
                                    {/* Custom icon approximation for 'Your privacy choices' */}
                                    <span className="ml-1 inline-block h-3 w-4 border-2 border-green-500 bg-white rounded-sm relative">
                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-1 w-1 bg-green-500 rounded-full"></span>
                            <span className="text-[8px] absolute -right-2 -bottom-2 text-green-500 font-bold">CA</span>
                        </span>
                                </a>
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

}
export default Footer;