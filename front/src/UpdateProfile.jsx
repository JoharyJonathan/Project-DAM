import { useEffect, useState } from "react";
import axios from "axios";

function UpdateProfile() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        profile_picture: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get('http://localhost:8080/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            setUser(response.data.user);
            setLoading(false);
        }).catch(error => {
            console.error('Error fetching profile:', error);
            setError('Error fetching profile information.');
            setLoading(false);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('email', user.email);
        formData.append('profile_picture', file);

        axios.put('http://localhost:8080/users/profile', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            setSuccess(response.data.message);
            setError(null);
        }).catch(error => {
            console.error('Error updating profile:', error);
            setError('Error updating profile.');
            setSuccess(null);
        });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Update Profile</h1>
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Profile Picture:
                        <input
                            type="file"
                            name="profile_picture"
                            onChange={handleFileChange}
                        />
                        {user.profile_picture && (
                            <img
                                src={`http://localhost:8080/${user.profile_picture}`}
                                alt="Profile"
                                style={{ width: '100px', height: '100px' }}
                            />
                        )}
                    </label>
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
}

export default UpdateProfile;