import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@material-tailwind/react';
import { HomeIcon } from '@heroicons/react/24/solid';

const InvalidRoute = () => {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
                <p className="text-gray-600 mb-6">The page you are looking for does not exist or has been moved.</p>
                <Button 
                    onClick={goToHome}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                >
                    <HomeIcon className="h-5 w-5" />
                    Go to Home
                </Button>
            </div>
        </div>
    );
};

export default InvalidRoute;
