import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState('');
    const [editData, setEditData] = useState({ name: '', email: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/profile', {
                withCredentials: true
            });
            setProfileData(response.data);
            setEditData({ name: response.data.name, email: response.data.email });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch profile data');
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put('http://localhost:5000/api/profile', editData, {
                withCredentials: true
            });
            setProfileData(response.data.user);
            alert('Profile updated');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleSoftDelete = async () => {
        try {
            const response = await axios.delete('http://localhost:5000/api/profile', {
                withCredentials: true
            });
            alert(response.data.message);
            // Optionally, redirect to login page after deletion:
            window.location.href = '/login';
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete profile');
        }
    };

    if (error) {
        return <div className="p-4 font-serif">{error}</div>;
    }

    if (!profileData) {
        return <div className="p-4 font-serif">Loading...</div>;
    }

    return (
        <div className="p-4 font-serif">
            <h2 className="text-2xl font-bold mb-4">Profile Data</h2>
            <div className="mb-4">
                <p><strong>Name:</strong> {profileData.name}</p>
                <p><strong>Email:</strong> {profileData.email}</p>
                <p><strong>JWT:</strong> {profileData.jwt}</p>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-bold mb-2">Update Profile</h3>
                <input
                    type="text"
                    className="border border-gray-300 px-3 py-2 rounded-md mr-2 focus:outline-none focus:border-blue-500"
                    placeholder="Name"
                    value={editData.name}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                />
                <input
                    type="email"
                    className="border border-gray-300 px-3 py-2 rounded-md mr-2 focus:outline-none focus:border-blue-500"
                    placeholder="Email"
                    value={editData.email}
                    onChange={e => setEditData({ ...editData, email: e.target.value })}
                />
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none"
                    onClick={handleUpdate}
                >
                    Update
                </button>
            </div>

            <div>
                <h3 className="text-lg font-bold mb-2">Soft Delete Profile</h3>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none"
                    onClick={handleSoftDelete}
                >
                    Soft Delete & Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;
