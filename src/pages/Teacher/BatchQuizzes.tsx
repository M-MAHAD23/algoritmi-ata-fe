import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Panel from '../../layout/Panel';
import Loader from '../../common/Loader';
import { useLocation } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_URL;


function BatchQuizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const batchId = params.get('batchId');  // Fetch batchId from URL query parameters

        if (batchId) {
            // Fetch quizzes for a specific batch
            axios.post(`${API_BASE_URL}/quiz/getQuizzesByBatch`, { batchId })
                .then(response => {
                    setQuizzes(response.data.data);
                    setLoading(false);
                })
                .catch(err => {
                    setError('Error fetching Quizzes');
                    setLoading(false);
                });
        } else {
            // Fetch all quizzes if no batchId is present
            axios.post(`${API_BASE_URL}/quiz/getAllQuizzes`, {})
                .then(response => {
                    setQuizzes(response.data.data);
                    setLoading(false);
                })
                .catch(err => {
                    setError('Error fetching Quizzes');
                    setLoading(false);
                });
        }
    }, [location]);

    const headers = [
        'Quiz Name',
        'Quiz Topic',
        'Description',
        'Issued Date',
        'Deadline',
    ];

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

                <div className="flex flex-col mb-6">
                    {/* Dynamic Headers */}
                    <div className="grid grid-cols-5 sm:grid-cols-5 rounded-sm bg-black text-white dark:bg-meta-4">
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
                                className={`grid grid-cols-5 sm:grid-cols-5 ${rowIndex === quizzes.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
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
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Panel>
    );
}

export default BatchQuizzes;
