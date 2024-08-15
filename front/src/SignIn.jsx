import React, { useState } from "react";
import axios from "axios";

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/login', {
                email,
                password
            });

            console.log('Response data:', response.data);

            // Store JWT token and user info in local storage 
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            console.log('Login succesfull');
            console.log(response.data.user);
            console.log('Response after user:',response.data);
        } catch (error) {
            console.log('There was an error logging in!', error);
        }
    };

    return (
        <div>
            <h1>Sign in</h1>
            <form onSubmit={handleLogin}>
            <div>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Login</button>
        </form>
        </div>
    );
}

export default SignIn;