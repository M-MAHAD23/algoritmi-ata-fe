import { useState, useEffect } from 'react';
const API_BASE_URL = import.meta.env.VITE_API_URL;
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';

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
                rollId: name,
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // Handle successful sign-in
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

export const useSubmit = (fileContent, fileName, quizId, submitterId, batchId) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const submitFile = async () => {
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append('files', new Blob([fileContent], { type: 'text/plain' }), fileName);
        formData.append('batchId', batchId); // Dynamically passed batchId
        formData.append('submitterId', submitterId); // Dynamically passed submitterId
        formData.append('quizId', quizId); // Dynamically passed quizId
        formData.append('submitDate', new Date().toISOString()); // Current timestamp

        try {
            const response = await fetch(`${API_BASE_URL}/quiz/submitQuiz`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('File submission failed.');

            setSuccess(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return { isSubmitting, error, success, submitFile };
};

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

export const useGetUserInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const publicRoutes = ['/signin', '/signup', '/']; // Add public routes here
        if (publicRoutes.includes(location.pathname)) return;

        const fetchUserInfo = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));

            if (!userInfo) {
                // Clear all localStorage data and redirect to login
                localStorage.clear();
                navigate('/signin');
                return;
            }

            try {
                const response = await axios.post(
                    `${API_BASE_URL}/user/getUserById`,
                    { id: userInfo._id }
                );
                const updatedUserInfo = response.data.data;

                if (!updatedUserInfo.batchId.isEnable) {
                    // Handle batch disabled scenario
                    alert('Your batch is no longer active. Logging out.');
                    localStorage.clear(); // Clear all data on logout
                    navigate('/signin');
                } else {
                    // Update userInfo in localStorage if necessary
                    localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
                }
            } catch (error) {
                console.error('Failed to fetch user info:', error);
                if (error.response?.status === 401) {
                    // Clear all data on unauthorized access
                    localStorage.clear();
                    navigate('/signin');
                }
            }
        };

        fetchUserInfo();
    }, [location, navigate]);
};
