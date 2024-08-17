import React, { useState, useEffect } from "react";
import axios from "axios";

function ProfileEdit() {
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setFormData({
                name: user.name,
                email: user.email
            });
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await axios.put(
                'http://localhost:8080/users/profile', 
                formData, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Update the user info in localStorage
            localStorage.setItem('user', JSON.stringify(response.data.user));

            setMessage('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Error updating profile');
        }
    };

    return (
        <div>
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Save Changes</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ProfileEdit;