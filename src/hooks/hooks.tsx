import { useState, useEffect } from 'react';
const API_BASE_URL = import.meta.env.VITE_API_URL;
import axios from "axios";

export const useProfile = async (userId, token) => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/user/getUserById`, {  // Adjusted endpoint as needed
                    method: 'POST',  // Changed to POST request
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ id: userId }),  // Sending user ID in the request body
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const data = await response.json();
                setUserProfile(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId && token) {
            fetchProfile();
        }
    }, [userId, token]);

    return { userProfile, loading, error };
};

export const useProfileEdit = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to handle the profile update API call
    const updateProfile = async (profileData) => {
        setIsLoading(true);
        setError(null);
        try {
            // Create a FormData instance
            const formData = new FormData();
            // Append each field in profileData to formData
            for (const key in profileData) {
                formData.append(key, profileData[key]);
            }

            // Send the request with form data
            const response = await fetch(`${API_BASE_URL}/user/updateUser`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            const data = await response.json();
            return data; // Return the updated profile data if needed
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(err.message || "An error occurred while updating the profile.");
        } finally {
            setIsLoading(false);
        }
    };

    return { updateProfile, isLoading, error };
};

export const useSignIn = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
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
            setError({ message: error.message });
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

export const useSignUp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const signUp = async (name: string, email: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
                name,
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
        signUp,
        loading,
        error,
    };
};

export const useSubmit = (fileContent, fileName) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const submitFile = async () => {
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append('files', new Blob([fileContent], { type: 'text/plain' }), fileName);
        formData.append('batchId', '6730c8006027f9586b388377'); // Hardcoded batchId
        formData.append('submitterId', '67336d3a36ae0ae6a52132d7'); // Hardcoded submitterId
        formData.append('quizId', '6733a6fd14866b44118df226'); // Hardcoded quizId
        formData.append('submitDate', new Date().toISOString()); // Current timestamp

        try {
            const response = await fetch(`${API_BASE_URL}/quiz/submitQuiz`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('File submission failed.');

            setSuccess(true);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return { isSubmitting, error, success, submitFile };
}

export const useUserInfo = () => {
    const [token, setToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserInfo = localStorage.getItem('userInfo');

        if (storedUserInfo && storedToken) {
            setToken(storedToken);
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    return { token, userInfo };
};