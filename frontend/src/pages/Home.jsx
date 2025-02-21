import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/logout', {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                navigate('/login');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-4xl font-bold mb-4">Welcome to Our Website</h1>
            <p className="text-lg mb-8">Your journey begins here.</p>
            <div className="flex space-x-4">
                <Link
                    to="/login"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Login
                </Link>
                <Link
                    to="/signup"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                    Sign Up
                </Link>
                <Link
                    to="/profile"
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
                >
                    Profile
                </Link>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Home;
