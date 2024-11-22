import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Panel from '../../layout/Panel';
import Loader from '../../common/Loader';
import RenderCards from '../../components/RenderCards';
const API_BASE_URL = import.meta.env.VITE_API_URL;

function TeacherBatches() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const userProfile = JSON.parse(localStorage.getItem("userInfo"));

    const fetchBatches = async () => {
        if (!userProfile?._id) return; // Ensure userProfile and userId are available
        setLoading(true);
        const payload = { userId: userProfile._id };
        try {
            const response = await axios.post(`${API_BASE_URL}/batch/getAllBatches`, payload);
            setBatches(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching batches');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches(); // Initial fetch

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchBatches(); // Refetch batches when the page becomes visible again
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <>
            {loading && <Loader />}
            <div className="rounded-sm mb-6 border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Batches</h4>
                {batches.length === 0 && !loading && (
                    <p className="text-center text-gray-600 dark:text-gray-400">No batches available.</p>
                )}
                {batches.length > 0 && (
                    <RenderCards
                        data={batches.map((batch) => ({
                            batchName: batch.batchName || 'Unnamed Batch',
                            batchNumber: batch.batchNumber || '-',
                            batchSession: batch.batchSession || '-',
                            batchStudent: batch.batchStudent || [],
                            batchQuiz: batch.batchQuiz || [],
                        }))}
                    />
                )}
            </div>
        </>
    );
}

export default TeacherBatches;
