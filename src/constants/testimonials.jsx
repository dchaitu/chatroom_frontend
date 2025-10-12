const Testimonials = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">What Our Users Say</h2>

            <div className="flex flex-nowrap overflow-x-auto pb-8 -mx-4 px-4 gap-6 scrollbar-hide">
                {/* Testimonial 1 */}
                <div className="flex-shrink-0 w-80 md:w-96 bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:w-[32rem] hover:shadow-xl group">
                    <div className="flex items-center mb-4">
                        <img
                            className="h-12 w-12 rounded-full object-cover"
                            src="https://randomuser.me/api/portraits/women/43.jpg"
                            alt="User testimonial"
                        />
                        <div className="ml-4">
                            <h4 className="font-medium text-gray-900">Sarah Johnson</h4>
                            <p className="text-indigo-600 text-sm">CEO, TechCorp</p>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm group-hover:text-base transition-all duration-300">
                        "This platform has transformed how our team collaborates. The real-time messaging and file sharing features are exceptional."
                    </p>
                </div>

                {/* Testimonial 2 - Video */}
                <div className="flex-shrink-0 w-80 md:w-96 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:w-[32rem] hover:shadow-xl group">
                    <div className="relative pt-[56.25%] bg-black">
                        <video
                            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src="https://assets.mixkit.co/videos/preview/mixkit-woman-talking-about-her-work-on-a-video-call-4383-large.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <div className="bg-white bg-opacity-90 rounded-full p-3">
                                <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <h4 className="font-medium text-gray-900">Michael Chen</h4>
                        <p className="text-indigo-600 text-sm mb-2">Product Manager, DesignHub</p>
                        <p className="text-gray-600 text-sm group-hover:text-base transition-all duration-300">
                            "The video integration is seamless. Our team can now have face-to-face conversations without leaving the platform."
                        </p>
                    </div>
                </div>

                {/* Testimonial 3 */}
                <div className="flex-shrink-0 w-80 md:w-96 bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:w-[32rem] hover:shadow-xl group">
                    <div className="flex items-center mb-4">
                        <img
                            className="h-12 w-12 rounded-full object-cover"
                            src="https://randomuser.me/api/portraits/men/32.jpg"
                            alt="User testimonial"
                        />
                        <div className="ml-4">
                            <h4 className="font-medium text-gray-900">David Wilson</h4>
                            <p className="text-indigo-600 text-sm">CTO, StartupX</p>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm group-hover:text-base transition-all duration-300">
                        "The security features give us peace of mind when discussing sensitive company information. Highly recommended!"
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Testimonials