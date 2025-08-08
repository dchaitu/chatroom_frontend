import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import {REST_API_PATH, siteKey} from "../constants/constants";
import { Card, Input, Button } from "@material-tailwind/react";
import { CardHeader, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import { LockClosedIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [recaptchaValue, setRecaptchaValue] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!recaptchaValue) {
            setError('Please complete the CAPTCHA');
            return;
        }
        try {
            const response = await fetch(`${REST_API_PATH}/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    recaptcha_token: recaptchaValue
                }),
            });
            // console.log("recaptcha token", recaptchaValue);

            const data = await response.json();
            console.log("Response:", response);

            console.log("Response data:", data);

            if (data.status_code===200) {
                // Store only the necessary authentication data
                // Pass the username as state when navigating
                localStorage.setItem("token", data.access_token);
                console.log(`Access Token is ${data.access_token}`);
                console.log("Login successful, navigating to rooms");
                navigate(`/rooms/${username}`);
            } else if (data.status_code === 401)
                {
                    setError('Invalid username or password');
                    navigate('/');
                    console.log(response);
                }
                else if(data.status_code===404)
                {
                    setError('User Not Found');
                    navigate(`/register`);
                }
                else {
                    setError(data.detail || 'Login failed. Please try again.');
                }

        } catch (error) {
            console.error('Login error:', error);
            setError('Failed to connect to the server');
        }
    };


    const onClickCaptchaButton = (value) => {
        setRecaptchaValue(value);
        setError('');
        console.log("Recaptcha token is",value);

    }


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="border-0 shadow-lg">
                    <CardBody className="py-8 px-8">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserCircleIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type="text"
                                        label="Username"
                                        size="lg"
                                        className="pl-10"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="relative mt-4">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type="password"
                                        label="Password"
                                        size="lg"
                                        className="pl-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <ReCAPTCHA
                                    sitekey={siteKey}
                                    onChange={(value) => onClickCaptchaButton(value)}
                                    className="flex justify-center"
                                />
                            </div>

                            <div className="mt-6">
                                <Button
                                    type="submit"
                                    color="blue"
                                    size="lg"
                                    disabled={!recaptchaValue}
                                    fullWidth
                                    className="flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    Sign in
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                    <CardFooter className="bg-gray-50 py-4 px-8 border-t border-gray-200">
                        <div className="text-center text-sm text-gray-500">
                            <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">
                                Back to home
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Login;
