import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Panel from '../../layout/Panel';
import Loader from '../../common/Loader';
const API_BASE_URL = import.meta.env.VITE_API_URL;


function BatchDetails() {
    const { id } = useParams();  // Get the batch ID from the URL
    const [batchDetails, setBatchDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch batch details (Teachers, Students, Quizzes) using the batch ID
        axios.post(`${API_BASE_URL}/batch/getBatchDetails`, { batchId: id })
            .then(response => {
                setBatchDetails(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Error fetching batch details');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            {loading && <Loader />}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">{batchDetails.batchName}</h4>

                <div className="mb-6">
                    <h5 className="text-lg font-medium">Teachers</h5>
                    <ul>
                        {batchDetails.teachers.map((teacher, index) => (
                            <li key={index}>{teacher.name}</li>
                        ))}
                    </ul>
                </div>

                <div className="mb-6">
                    <h5 className="text-lg font-medium">Students</h5>
                    <ul>
                        {batchDetails.students.map((student, index) => (
                            <li key={index}>{student.name}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h5 className="text-lg font-medium">Quizzes</h5>
                    <ul>
                        {batchDetails.quizzes.map((quiz, index) => (
                            <li key={index}>{quiz.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default BatchDetails;
