import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import {REST_API_PATH, siteKey} from "../constants/constants";
import { Card, Input, Button } from "@material-tailwind/react";
import { CardBody, CardFooter } from "@material-tailwind/react";
import { UserCircleIcon, LockClosedIcon, IdentificationIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import {MailIcon} from "lucide-react";

const Register = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [fullName, setFullName] = useState('');
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const navigate = useNavigate();



    const handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch(`${REST_API_PATH}/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                fullname: fullName,
                recaptcha_token: recaptchaValue
            }),
        });


        const data = await response.json();
        console.log("Response Status:", data);
        console.log("username:", data.username);
        // console.log("email:", data.email);
        if (response.status === 201) {
            // Redirect to tasks page if login is successful
            console.log("New User created",data.username);
            navigate('/login');
        } else {
            setError(data.error || 'Login failed');
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create a new account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        sign in to your account
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
                                <Input
                                    type="text"
                                    label="Username"
                                    size="lg"
                                    icon={<UserCircleIcon className="h-4 w-4" />}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mt-4">
                                <Input
                                    type="text"
                                    label="Full Name"
                                    size="lg"
                                    icon={<IdentificationIcon className="h-4 w-4" />}
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <Input
                                    type="email"
                                    label="Email"
                                    size="lg"
                                    icon={<MailIcon className="h-4 w-4" />}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mt-4">
                                <Input
                                    type="password"
                                    label="Password"
                                    size="lg"
                                    icon={<LockClosedIcon className="h-4 w-4" />}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>


                            <div className="mt-6">
                                <ReCAPTCHA
                                    sitekey={siteKey}
                                    onChange={(value) => setRecaptchaValue(value)}
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
                                    Create Account
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

}


export default Register;