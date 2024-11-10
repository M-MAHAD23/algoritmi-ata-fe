import axios from "axios";

// const BASE_URL = "https://launchpad-wine-three.vercel.app/api";
const BASE_URL = "http://192.168.0.104:8080";

export const getBatches = async () => {
    //
    try {
        // data.userId = localStorage.getItem("userId");
        const response = await axios.post(
            `${BASE_URL}/batch/getAllBatches`, {

        }
            // data
        );
        return response.data;
    } catch (error) {
        console.error("Error getting User", error);
        throw error;
    }
};
export const postBatch = async (data) => {
    //
    try {
        // data.userId = localStorage.getItem("userId");
        const response = await axios.post(
            `${BASE_URL}/batch/createBatch`, data
            // data
        );
        return response.data;
    } catch (error) {
        console.error("Error getting User", error);
        throw error;
    }
};
export const editBatch = async (data) => {
    //
    try {
        // data.userId = localStorage.getItem("userId");
        const response = await axios.post(
            `${BASE_URL}/batch/updateBatch`, data
            // data
        );
        return response.data;
    } catch (error) {
        console.error("Error getting User", error);
        throw error;
    }
};
export const deleteBatch = async (data) => {
    //
    try {
        // data.userId = localStorage.getItem("userId");
        const response = await axios.post(
            `${BASE_URL}/batch/deleteBatch`, {
            id: data

        }
            // data
        );
        return response.data;
    } catch (error) {
        console.error("Error getting User", error);
        throw error;
    }
};





