import React, { useState } from 'react';
import axios, {head} from 'axios';

import { useHistory } from 'react-router-dom';
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        const apiUrl = "http://localhost:8083/api/v1/bookings/";
        const loginUrl = "http://localhost:8080/api/v1/auth/authenticate";

        const loginData = {
            email: email,
            password: password
        };

        fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to log in');
                }
                return response.json();
            })
            .then(data => {
                console.log("login success");
                localStorage.setItem("accessToken", data.token);
                window.location.href = "/booking"; // replace with your main page URL
            })
            .catch(error => {
                console.log('Error:', error);
            });
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type="text" value={email} onChange={handleEmailChange} />
                </label>
                <br/>
                <label>
                    Password:
                    <input type="password" value={password} onChange={handlePasswordChange} />
                </label>
                <br/>
                <button type="submit">Login</button>
            </form>

            {error && <div>{error}</div>}
        </div>
    );
}

export default Login;
