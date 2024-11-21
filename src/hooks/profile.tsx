import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL;

const getUserProfile = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo) {
        console.log('User is not logged in.');
        return null;
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/user/getUserById`, { id: userInfo._id });
        const updatedUserInfo = response.data.data;

        if (!updatedUserInfo.batchId.isEnable) {
            // Handle batch disabled scenario
            alert('Your batch is no longer active. Logging out.');
            localStorage.clear(); // Clear all data on logout
            return null;
        }

        // Update userInfo in localStorage if necessary
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        return updatedUserInfo;
    } catch (error) {
        console.error('Failed to fetch user info:', error);
        if (error.response?.status === 401) {
            // Clear all data on unauthorized access
            localStorage.clear();
            return null;
        }
    }
};

export default getUserProfile;
