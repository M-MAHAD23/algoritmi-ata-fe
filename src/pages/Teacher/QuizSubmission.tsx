import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../common/Loader';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Utility function to render a table
const renderTable = ({ headers, rows, renderRow, keyExtractor }) => (
    <div>
        <div className={`grid grid-cols-${headers.length} bg-gray-2 dark:bg-meta-4 rounded-sm`}>
            {headers.map((header, index) => (
                <div key={index} className="p-2.5 text-center font-medium uppercase">
                    {header}
                </div>
            ))}
        </div>
        {rows.length ? (
            rows.map((row) => (
                <div
                    key={keyExtractor(row)}
                    className={`grid grid-cols-${headers.length} items-center border-b border-stroke dark:border-strokedark`}
                >
                    {renderRow(row)}
                </div>
            ))
        ) : (
            <div className="text-center p-5">No submissions available.</div>
        )}
    </div>
);

function QuizSubmission() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchSubmissions = async () => {
        const queryParams = new URLSearchParams(location.search);
        const quizId = queryParams.get('quizId');

        if (!quizId) return;

        setLoading(true);
        try {
            const payload = { quizId };
            const response = await axios.post(
                `${API_BASE_URL}/quiz/getQuizSubmissionsById`,
                payload
            );
            setSubmissions(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching submissions');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const handleAnalyzeClick = async (submission) => {
        const quizDeadline = new Date(submission.quizId.quizDead); // Get the quiz deadline
        const isPastDeadline = new Date() >= quizDeadline;

        if (!isPastDeadline) {
            toast.error("Please wait for the deadline to Analyze :)", {
                position: 'top-right',
            });
            return;
        }
        try {
            await axios.post(`${API_BASE_URL}/quiz/analyzeQuiz`, { submission });
            fetchSubmissions();
            navigate(
                `/teacher/quiz/results?quizId=${submission?.quizId?._id}&submissionId=${submission?._id}`
            );
        } catch (err) {
            setError('Error analyzing submission');
        }
    };

    const handleViewReportClick = (submission) => {
        navigate(
            `/teacher/quiz/results?quizId=${submission?.quizId?._id}&submitterId=${submission?.submitterId?._id}`
        );
    };

    return (
        <>
            <Toaster />
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                {loading ? (
                    <Loader />
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <>
                        <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
                            Quiz Submissions
                        </h4>
                        {renderTable({
                            headers: [
                                'Student Name',
                                'Submission Date',
                                'Quiz Deadline',
                                'Actions',
                            ],
                            rows: submissions,
                            keyExtractor: (submission) => submission._id,
                            renderRow: (submission) => {
                                const { submitterId, submitDate, analyzed, quizId } = submission;
                                const quizDeadline = new Date(quizId.quizDead);
                                const isPastDeadline = new Date() > quizDeadline;

                                return [
                                    // Student Name (simple text, no action)
                                    <div className="p-2.5 text-center text-black dark:text-white">
                                        {submitterId.name || '-'}
                                    </div>,
                                    // Submission Date
                                    <div className="p-2.5 text-center text-black dark:text-white">
                                        {new Date(submitDate).toLocaleDateString() || '-'}
                                    </div>,
                                    // Quiz Deadline
                                    <div className="p-2.5 text-center text-black dark:text-white">
                                        {quizDeadline.toLocaleDateString() || '-'}
                                    </div>,
                                    // Actions
                                    <div className="p-2.5 text-center">
                                        {analyzed ? (
                                            <button
                                                onClick={() => handleViewReportClick(submission)}
                                                className="px-4 py-2 text-white rounded bg-blue-500 hover:bg-blue-600"
                                            >
                                                View Report
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleAnalyzeClick(submission)}
                                                className={`px-4 py-2 text-white rounded ${isPastDeadline
                                                        ? 'bg-blue-500 hover:bg-blue-600'
                                                        : 'bg-gray-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                Analyze
                                            </button>
                                        )}
                                    </div>,
                                ];
                            },
                        })}
                    </>
                )}
            </div>
        </>
    );
}

export default QuizSubmission;
