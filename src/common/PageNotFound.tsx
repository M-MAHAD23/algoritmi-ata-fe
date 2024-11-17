import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

const PageNotFound = () => {
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate a loading delay
        const timer = setTimeout(() => setIsLoading(false), 500); // Adjust the delay as needed
        return () => clearTimeout(timer);
    }, []);

    const handleGoHome = () => {
        navigate('/');
    };

    if (isLoading) {
        return <Loader />; // Show the Loader while loading
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
            <div className="text-center max-w-2xl px-6 py-12 bg-white rounded-lg shadow-xl">
                <div className="mb-8">
                    <svg
                        className="mx-auto w-20 h-20 mb-6 cursor-pointer"
                        onClick={handleGoHome}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8 16L3.54223 12.3383C1.93278 11.0162 1 9.04287 1 6.96005C1 3.11612 4.15607 0 8 0C11.8439 0 15 3.11612 15 6.96005C15 9.04287 14.0672 11.0162 12.4578 12.3383L8 16ZM3 6H5C6.10457 6 7 6.89543 7 8V9L3 7.5V6ZM11 6C9.89543 6 9 6.89543 9 8V9L13 7.5V6H11Z"
                            fill="#000000"
                        />
                    </svg>
                    <h1 className="text-5xl font-extrabold mb-4 text-black">404</h1>
                    <h2 className="text-3xl font-semibold mb-6 text-black">Oops! Page Not Found</h2>
                    <p className="text-lg text-black mb-8">
                        Sorry, we couldn’t find the page you were looking for. It might have been moved, deleted or not existed.
                    </p>
                    <button
                        onClick={handleGoHome}
                        className="px-6 py-3 bg-black text-white font-bold rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-300"
                    >
                        Go Back Home
                    </button>
                </div>
                <div className="text-sm text-gray-500 mt-6">
                    <p>&copy; {new Date().getFullYear()} Algoritmi. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;
