import axios from 'axios';
import { useHistory } from 'react-router-dom'; // If you're using react-router for navigation
const API_BASE_URL = import.meta.env.VITE_API_URL;

const getUserProfile = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo) {
        console.log('User is not logged in.');
        return null;
    }

    try {
        // Show loader while request is in progress
        document.body.classList.add('loading');  // Assuming you have a 'loading' class to show loader

        const response = await axios.post(`${API_BASE_URL}/user/getUserById`, { id: userInfo._id });

        const updatedUserInfo = response.data.data;

        // If user is not found (404 from server)
        if (response.status === 404 || !updatedUserInfo) {
            clearLocalStorageAndRedirect();
            return null;
        }

        // If user is not registered (user.isEnable is false)
        if (!updatedUserInfo.isEnable) {
            clearLocalStorageAndRedirect();
            return null;
        }

        // Update userInfo in localStorage if necessary
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

        // Hide loader after receiving response
        document.body.classList.remove('loading');

        return updatedUserInfo;
    } catch (error) {
        console.error('Failed to fetch user info:', error);

        // Handle unauthorized access (401 error)
        if (error.response?.status === 401) {
            clearLocalStorageAndRedirect();
            return;
        }

        // Handle unauthorized access (401 error)
        if (error.response?.status === 404) {
            clearLocalStorageAndRedirect();
            return;
        }
        // Hide loader in case of error
        document.body.classList.remove('loading');
    }
};

// Function to clear localStorage and redirect user to '/'
const clearLocalStorageAndRedirect = () => {
    // Show loader before clearing storage and navigating (if needed)
    document.body.classList.add('loading');

    // Clear localStorage
    localStorage.clear();

    // Redirect user to home page (assuming you're using react-router for navigation)
    window.location.href = '/';  // or use useHistory().push('/') if you're using react-router
};

export default getUserProfile;
