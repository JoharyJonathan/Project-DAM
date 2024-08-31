import { useState } from 'react';
import axios from 'axios';

function AdminSignup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secretKey, setSecretKey] = useState(''); // Secret key entered by the user
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/admin/signup', {
                name,
                email,
                password,
                role_id: 2, // Always send role_id as 2 for admin
                secretKey // Include the secret key in the request
            });
            setSuccess(response.data.message);
            setError(null);
        } catch (error) {
            console.error('Error during signup:', error);
            setError('Error during signup. Please try again.');
            setSuccess(null);
        }
    };

    return (
        <div>
            <h1>Admin Signup</h1>
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Secret Key:
                        <input
                            type="text"
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Register Admin</button>
            </form>
        </div>
    );
}

export default AdminSignup;