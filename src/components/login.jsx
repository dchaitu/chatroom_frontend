import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import {siteKey} from "../constants/constants";
// import './login.css'
import {Button} from "./ui/button";

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
            const response = await fetch('http://127.0.0.1:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    // recaptcha_token: recaptchaValue
                }),
            });
            // console.log("recaptcha token", recaptchaValue);

            const data = await response.json();
            console.log("Response:", data);

            if (response.ok) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh', data.refresh);
                console.log("Login successful, navigating to rooms");
                localStorage.setItem('username', username);
                navigate(`/rooms`);
            } else {
                if (response.status === 401) {
                    setError('Invalid username or password');
                } else {
                    setError(data.detail || 'Login failed. Please try again.');
                }
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
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">

                <h1 className="font-bold heading text-2xl content-center">Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="p-2">
                        <label className="p-1">Username</label>
                        <input className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                               type="text"
                               value={username}
                               onChange={(e) => setUsername(e.target.value)}
                               required
                        />
                    </div>
                    <div className="p-2">
                        <label className="p-1">Password</label>
                        <input className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                               type="password"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               required
                        />
                    </div>
                    <div className="p-2">
                        <ReCAPTCHA
                            sitekey={siteKey}
                            onChange={(value) => onClickCaptchaButton(value)}
                        />
                    </div>

                    <div className="flex flex-wrap p-2 items-center gap-2 md:flex-row">
                        <Button
                            disabled={!recaptchaValue}
                                className="text-white font-medium rounded-lg text-sm px-5 py-2.5 w-full max-w-xs"
                                type="submit">
                            Login
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
