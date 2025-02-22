import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/profile', {
                    withCredentials: true
                });
                setProfileData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch profile data');
            }
        };

        fetchProfile();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Profile Data</h2>
            <p><strong>Name:</strong> {profileData.name}</p>
            <p><strong>Email:</strong> {profileData.email}</p>
            <p><strong>JWT:</strong> {profileData.jwt}</p>
            <p><strong>Hashed Password:</strong> {profileData.hashedPassword}</p>
            <p><strong>Unhashed Password:</strong> {profileData.unHashedPassword}</p>
        </div>
    );
};

export default Profile;
