import { useState }from "react";
import axios from 'axios';

function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/signup', {
                name,
                email,
                password
            });
    
            console.log(response.data.message);
        } catch (error) {
            console.error("There was an error signing up!", error);
        }
    };

    return (
        <div>
            <h1>Sign up</h1>
            <form onSubmit={handleSignup}>
            <div>
                <label>Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Sign Up</button>
        </form>
        </div>
    );
}

export default SignUp;