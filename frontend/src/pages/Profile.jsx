import React, { useEffect, useState } from 'react';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/profile', {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await response.json();
                if (!response.ok) {
                    setError(data.message);
                } else {
                    setProfileData(data);
                }
            } catch (err) {
                setError('Failed to fetch profile data');
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
