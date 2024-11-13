// Navbar.js
import React from 'react';

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center p-5 bg-white text-[#0E0D15] shadow-md">
            <div className="text-2xl font-semibold">Artificial Teaching Assistant</div>
            <div>
                <button className="mr-4 px-5 py-2 font-semibold text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-500 hover:shadow-lg transition-all duration-200 ease-in-out">
                    Sign Up
                </button>
                <button className="px-5 py-2 font-semibold text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-500 hover:shadow-lg transition-all duration-200 ease-in-out">
                    Sign In
                </button>

            </div>
        </nav>
    );
};

export default Navbar;
