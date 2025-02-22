import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/logout', {}, {
                withCredentials: true
            });
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-4xl font-bold mb-4">Welcome to Our Website</h1>
            <div className="flex space-x-4">
                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Login
                </Link>
                <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Sign Up
                </Link>
                <Link to="/profile" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                    Profile
                </Link>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Home;
