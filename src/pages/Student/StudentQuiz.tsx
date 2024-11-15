import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Panel from '../../layout/Panel';
import Loader from '../../common/Loader';
import { useLocation } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_URL;


function StudentQuiz() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
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

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const batchId = params.get('batchId') || userInfo?.batchId; // Use `batchId` from URL or fallback to user's batchId

        if (batchId) {
            // Fetch quizzes based on the batchId
            const endpoint = batchId === userInfo?.batchId
                ? `${API_BASE_URL}/quiz/getAllQuizzesByBatchId`
                : `${API_BASE_URL}/quiz/getQuizzesByBatch`;

            axios.post(endpoint, { batchId })
                .then(response => {
                    setQuizzes(response.data.data);
                    setLoading(false);
                })
                .catch(err => {
                    setError('Error fetching Quizzes');
                    setLoading(false);
                });
        }
    }, [location, userInfo]);

    const headers = [
        'Quiz Name',
        'Quiz Topic',
        'Description',
        'Issued Date',
        'Deadline',
        'Actions'
    ];

    const handleSubmitQuiz = (quizId) => {
        // Call the submit quiz endpoint or perform the necessary logic
        console.log(`Submitting quiz with ID: ${quizId}`);
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Panel>
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Quizzes</h4>

                <div className="flex flex-col">
                    {/* Dynamic Headers */}
                    <div className="grid grid-cols-6 sm:grid-cols-6 rounded-sm bg-gray-2 dark:bg-meta-4">
                        {headers.map((header, index) => (
                            <div key={index} className="p-2.5 text-center xl:p-5">
                                <h5 className="text-sm font-medium uppercase xsm:text-base">{header}</h5>
                            </div>
                        ))}
                    </div>

                    {/* Dynamic Rows */}
                    {quizzes.length === 0 ? (
                        <div className="text-center text-lg p-5">No quizzes available.</div>
                    ) : (
                        quizzes.map((quiz, rowIndex) => (
                            <div
                                className={`grid grid-cols-6 sm:grid-cols-6 ${rowIndex === quizzes.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
                                key={rowIndex}
                            >
                                <div className="flex items-center justify-center p-2.5 xl:p-5">
                                    <p className="text-black dark:text-white">{quiz.quizName || '-'}</p>
                                </div>
                                <div className="flex items-center justify-center p-2.5 xl:p-5">
                                    <p className="text-black dark:text-white">{quiz.quizTopic || '-'}</p>
                                </div>
                                <div className="flex items-center justify-center p-2.5 xl:p-5">
                                    <p className="text-black dark:text-white">{quiz.quizDescription || '-'}</p>
                                </div>
                                <div className="flex items-center justify-center p-2.5 xl:p-5">
                                    <p className="text-black dark:text-white">{quiz.quizIssued || '-'}</p>
                                </div>
                                <div className="flex items-center justify-center p-2.5 xl:p-5">
                                    <p className="text-black dark:text-white">{quiz.quizDead || '-'}</p>
                                </div>
                                <div className="flex items-center justify-center p-2.5 xl:p-5">
                                    {/* Submit Button */}
                                    <button
                                        onClick={() => handleSubmitQuiz(quiz._id)}
                                        className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Panel>
    );
}

export default StudentQuiz;
