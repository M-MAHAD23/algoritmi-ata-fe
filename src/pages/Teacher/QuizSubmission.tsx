import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../common/Loader';
import toast, { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faHourglassHalf, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Panel from '../../layout/Panel';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Utility function to render a table
const renderTable = ({ headers, rows, renderRow, keyExtractor }) => (
    <div>
        <div className={`grid grid-cols-${headers.length} bg-black text-white dark:bg-meta-4 rounded-sm`}>
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
    const [analyzingId, setAnalyzingId] = useState(null); // Declare analyzingId state
    const [isAnalyzing, setIsAnalyzing] = useState(false);
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
        fetchSubmissions(); // Initial fetch

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchSubmissions(); // Refetch batches when the page becomes visible again
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const handleAnalyzeClick = async (submission) => {
        const quizDeadline = new Date(submission.quizId.quizDead);
        const isPastDeadline = new Date() >= quizDeadline;

        if (!isPastDeadline) {
            toast.error("Please wait for the deadline to Analyze :)");
            return;
        }

        toast.success("Please wait submission being analyzed :)");
        try {
            setAnalyzingId(submission._id); // Set analyzing row
            await axios.post(`${API_BASE_URL}/quiz/analyzeQuiz`, { submission });
            fetchSubmissions(); // Refresh data after analyzing
            navigate(
                `/quiz-results?quizId=${submission?.quizId?._id}&submitterId=${submission?.submitterId?._id}`
            );
        } catch (err) {
            setError('Error analyzing submission');
        } finally {
            setAnalyzingId(null); // Reset analyzing state
        }
    };

    const handleViewReportClick = (submission) => {
        navigate(
            `/quiz-results?quizId=${submission?.quizId?._id}&submitterId=${submission?.submitterId?._id}`
        );
    };

    return (
        <>
            <Toaster />
            <Panel>
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    {/* Go Back Button */}
                    <button
                        onClick={() => navigate(-1)} // Navigate back to the previous page
                        className="text-black hover:underline mb-4"
                    >
                        &larr; Go Back
                    </button>
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <div className='mb-6'>
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
                                        // Student Name
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
                                                <FontAwesomeIcon
                                                    icon={faEye}
                                                    className="text-black hover:text-gray-600 cursor-pointer"
                                                    onClick={() => handleViewReportClick(submission)}
                                                    title="View Report"
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={analyzingId === submission._id ? faSpinner : faHourglassHalf} // Show spinner for the specific row
                                                    className={`cursor-pointer ${isPastDeadline ? 'text-black hover:text-gray-600' : 'text-gray-500 cursor-not-allowed'} ${analyzingId === submission._id ? 'animate-spin' : ''}`}
                                                    onClick={() => isPastDeadline && analyzingId !== submission._id && handleAnalyzeClick(submission)}
                                                    title={analyzingId === submission._id ? "Analyzing..." : "Analyze"}
                                                />
                                            )}
                                        </div>
                                    ];
                                },
                            })}
                        </div>
                    )}
                </div>
            </Panel>
        </>
    );
}

export default QuizSubmission;
