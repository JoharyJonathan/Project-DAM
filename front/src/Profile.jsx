import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get('http://localhost:8080/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            setUser(response.data.user);
            console.log(response.data.user);
            setLoading(false);
        }).catch(error => {
            console.error('Error fetching profile:', error);
            setError('Error fetching profile information.');
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>User Information</h1>
            {user ? (
                <div>
                    <p>Username: {user.name}</p>
                    <p>Email: {user.email}</p>
                </div>
            ) : (
                <p>No user data available.</p>
            )}
            <button onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }}>Logout</button>
        </div>
    );
}

export default Profile;