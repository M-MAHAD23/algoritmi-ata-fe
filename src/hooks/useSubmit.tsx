import { useState } from 'react';
import axios from 'axios'; // Import axios

const useSubmit = (fileContent, fileName) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const submitFile = async () => {
        if (!fileContent) return;

        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        // Create a FormData object to send file content and other fields
        const formData = new FormData();
        formData.append('fileName', fileName);
        formData.append('fileContent', fileContent);

        // Add any other additional fields you might have
        // Object.keys(additionalFields).forEach((key) => {
        //     formData.append(key, additionalFields[key]);
        // });

        try {
            // API request to submit the file using axios and FormData
            const response = await axios.post('/api/submit-file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
                },
            });

            if (response.status === 200) {
                setSuccess(true); // Set success state if the file was submitted successfully
            } else {
                throw new Error('Failed to submit file');
            }
        } catch (error) {
            setError(error.response ? error.response.data.message : error.message); // Set error if the API call fails
        } finally {
            setIsSubmitting(false);
        }
    };

    return { isSubmitting, error, success, submitFile };
};

export default useSubmit;
