import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/profile', {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await response.json();
                if (!response.ok) {
                    navigate('/login');
                } else {
                    setProfileData(data);
                }
            } catch (err) {
                setError('Failed to fetch profile data');
            }
        };

        fetchProfile();
    }, [navigate]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {error}
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
                <div className="flex items-center mb-6">
                    <img
                        src="https://burst.shopifycdn.com/photos/professional-man-portrait.jpg?width=1000&format=pjpg&exif=0&iptc=0"
                        alt="Profile Avatar"
                        className="w-24 h-24 rounded-full mr-4"
                    />
                    <div>
                        <h1 className="text-3xl font-bold">{profileData.name}</h1>
                        <p className="text-gray-600">{profileData.email}</p>
                    </div>
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">About Me</h2>
                    <p className="text-gray-700">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                        vehicula justo quis quam fermentum, vitae convallis risus condimentum.
                    </p>
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
                    <ul className="list-disc pl-5 text-gray-700">
                        <li>Logged in from New York</li>
                        <li>Updated profile picture</li>
                        <li>Joined a new group: Developers Unite</li>
                    </ul>
                </div>
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-blue-500 hover:underline">
                        Home
                    </Link>
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Logout
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;
