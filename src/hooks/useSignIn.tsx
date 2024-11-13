// useSignIn.jsx
import { useState } from 'react';
import axios from 'axios';
const Base_Url = "http://localhost:8000"

export const useSignIn = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${Base_Url}/auth/signin`, {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // Handle successful sign-in
            console.log('Signed in successfully', response.data);
            return response.data;
        } catch (error: any) {
            setError(error.response?.data?.message || 'Sign-in failed');
            console.error('Error during sign-in', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        signIn,
        loading,
        error,
    };
};
