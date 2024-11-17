import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Panel from '../../layout/Panel';
import Loader from '../../common/Loader';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_URL;

function ActiveBatch() {
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const userProfile = JSON.parse(localStorage.getItem("userInfo"));

    const fetchBatchDetails = async () => {
        if (!userProfile?.batchId) return; // Ensure batchId is available
        setLoading(true);
        const payload = { batchId: userProfile.batchId };
        try {
            const response = await axios.post(`${API_BASE_URL}/batch/getBatchById`, payload);
            setBatch(response.data.data[0]);
            setLoading(false);
        } catch (err) {
            setError('Error fetching batch details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatchDetails();
    }, []);

    // Function to handle quiz click
    const handleQuizClick = (quizId) => {
        navigate(`/quizSubmission?quizId=${quizId}`);
    };

    return (
        loading ? (
            <Loader />
        ) : (
            <Panel>
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    {error && <p className="text-red-500">{error}</p>}
                    {batch ? (
                        <>
                            {/* Batch Details */}
                            <div className="mb-6">
                                <h4 className="text-xl font-semibold text-black dark:text-white mb-4">Batch Details</h4>
                                <p><strong>Batch Number:</strong> {batch.batchNumber || '-'}</p>
                                <p><strong>Batch Session:</strong> {batch.batchSession || '-'}</p>
                                <p><strong>Batch Name:</strong> {batch.batchName || '-'}</p>
                                <p><strong>Total Students:</strong> {batch.batchStudent?.length || 0}</p>
                                <p><strong>Total Quizzes:</strong> {batch.batchQuiz?.length || 0}</p>
                            </div>

                            {/* Students Table */}
                            <div className="mb-8">
                                <h4 className="text-xl font-semibold text-black dark:text-white mb-4">Students</h4>
                                <div className="grid grid-cols-5 bg-gray-2 dark:bg-meta-4 rounded-sm">
                                    <div className="p-2.5 text-center font-medium uppercase">Image</div>
                                    <div className="p-2.5 text-center font-medium uppercase">Roll ID</div>
                                    <div className="p-2.5 text-center font-medium uppercase">Name</div>
                                    <div className="p-2.5 text-center font-medium uppercase">Email</div>
                                    <div className="p-2.5 text-center font-medium uppercase">Contact</div>
                                </div>
                                {batch.batchStudent?.length ? (
                                    batch.batchStudent.map(student => (
                                        <div
                                            key={student._id}
                                            className="grid grid-cols-5 items-center border-b border-stroke dark:border-strokedark"
                                        >
                                            {/* Student Image */}
                                            <div className="p-2.5 text-center">
                                                {student.image ? (
                                                    <img
                                                        src={student.image}
                                                        alt={student.name}
                                                        className="w-10 h-10 rounded-full mx-auto"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gray-300 mx-auto"></div>
                                                )}
                                            </div>

                                            {/* Student Roll ID */}
                                            <div className="p-2.5 text-center">
                                                <p className="text-black dark:text-white">{student.rollId || '-'}</p>
                                            </div>

                                            {/* Student Name */}
                                            <div className="p-2.5 text-center">
                                                <p className="text-black dark:text-white">{student.name || '-'}</p>
                                            </div>

                                            {/* Student Email */}
                                            <div className="p-2.5 text-center">
                                                <p className="text-black dark:text-white">{student.email || '-'}</p>
                                            </div>

                                            {/* Student Contact */}
                                            <div className="p-2.5 text-center">
                                                <p className="text-black dark:text-white">{student.contact?.[0] || '-'}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center p-5">No students available.</div>
                                )}
                            </div>

                            {/* Quizzes Table */}
                            <div>
                                <h4 className="text-xl font-semibold text-black dark:text-white mb-4">Quizzes</h4>
                                <div className="grid grid-cols-6 bg-gray-2 dark:bg-meta-4 rounded-sm">
                                    <div className="p-2.5 text-center font-medium uppercase">Topic</div>
                                    <div className="p-2.5 text-center font-medium uppercase">Quiz Name</div>
                                    <div className="p-2.5 text-center font-medium uppercase">Description</div>
                                    <div className="p-2.5 text-center font-medium uppercase">Issued Date</div>
                                    <div className="p-2.5 text-center font-medium uppercase">Deadline</div>
                                    <div className="p-2.5 text-center font-medium uppercase">Submissions</div>
                                    <div className="p-2.5 text-center font-medium uppercase">Actions</div> {/* Add a column for the button */}
                                </div>
                                {batch.batchQuiz?.length ? (
                                    batch.batchQuiz.map(quiz => (
                                        <div
                                            key={quiz._id}
                                            className="grid grid-cols-7 border-b border-stroke dark:border-strokedark"
                                        >
                                            {/* Quiz Topic */}
                                            <div className="p-2.5 text-center">
                                                <p className="text-black dark:text-white">{quiz.quizTopic || '-'}</p>
                                            </div>

                                            {/* Quiz Name */}
                                            <div className="p-2.5 text-center">
                                                <p className="text-black dark:text-white">{quiz.quizName || '-'}</p>
                                            </div>

                                            {/* Quiz Description */}
                                            <div className="p-2.5 text-center">
                                                <p className="text-black dark:text-white">{quiz.quizDescription || '-'}</p>
                                            </div>

                                            {/* Quiz Issued Date */}
                                            <div className="p-2.5 text-center">
                                                <p className="text-black dark:text-white">{quiz.quizIssued || '-'}</p>
                                            </div>

                                            {/* Quiz Deadline */}
                                            <div className="p-2.5 text-center">
                                                <p className="text-black dark:text-white">{quiz.quizDead || '-'}</p>
                                            </div>

                                            {/* Quiz Submissions */}
                                            <div className="p-2.5 text-center">
                                                <p className="text-black dark:text-white">{quiz.quizSubmitters?.length || 0}</p>
                                            </div>

                                            {/* Action Button */}
                                            <div className="p-2.5 text-center">
                                                <button
                                                    onClick={() => handleQuizClick(quiz._id)} // Redirect on button click
                                                    className="text-blue-500 hover:text-blue-700 font-semibold px-4 py-2 rounded-md bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white"
                                                >
                                                    View Quiz
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center p-5">No quizzes available.</div>
                                )}
                            </div>


                        </>
                    ) : (
                        <div className="text-center p-5">No batch details available.</div>
                    )}
                </div>
            </Panel>
        )
    );
}

export default ActiveBatch;
