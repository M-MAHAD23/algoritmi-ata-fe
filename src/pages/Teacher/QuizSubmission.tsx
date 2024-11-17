import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../common/Loader';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL;

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

    const handleStudentClick = (studentId) => {
        navigate(`/student-report/${studentId}`);
    };

    const handleAnalyzeClick = async (submission) => {
        const quizDeadline = new Date(submission.quizId.quizDead); // Get the quiz deadline
        const isPastDeadline = new Date() >= quizDeadline;

        if (!isPastDeadline) {
            toast.error(
                "Please wait for the deadline to Analyze :)",
                {
                    position: 'top-right',
                }
            );
            return;
        }
        try {
            const response = await axios.post(
                `${API_BASE_URL}/quiz/analyzeQuiz`,
                { submission }
            );
            fetchSubmissions();
            navigate(`/teacher/quiz/results?quizId=${submission?.quizId?._id}&submissionId=${submission?._id}`);
        } catch (err) {
            setError('Error analyzing submission');
        }
    };

    const handleViewReportClick = (submission) => {
        navigate(`/teacher/quiz/results?quizId=${submission?.quizId?._id}&submitterId=${submission?.submitterId?._id}`);
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
                        <h4 className="text-xl font-semibold text-black dark:text-white mb-4">Quiz Submissions</h4>
                        <div className="grid grid-cols-4 bg-gray-2 dark:bg-meta-4 rounded-sm">
                            <div className="p-2.5 text-center font-medium uppercase">Student Name</div>
                            <div className="p-2.5 text-center font-medium uppercase">Submission Date</div>
                            <div className="p-2.5 text-center font-medium uppercase">Quiz Deadline</div>
                            <div className="p-2.5 text-center font-medium uppercase">Actions</div>
                        </div>
                        {submissions.length ? (
                            submissions.map((submission) => {
                                const { submitterId, submitDate, _id, analyzed, quizId } = submission;
                                const quizDeadline = new Date(quizId.quizDead); // Get the quiz deadline

                                // Check if the current date is past the quiz deadline
                                const isPastDeadline = new Date() > quizDeadline;

                                return (
                                    <div
                                        key={_id}
                                        className="grid grid-cols-4 border-b border-stroke dark:border-strokedark"
                                    >
                                        <div
                                            className="p-2.5 text-center text-blue-500 cursor-pointer hover:underline"
                                            onClick={() => handleStudentClick(submitterId._id)}
                                        >
                                            {submitterId.name || '-'}
                                        </div>
                                        <div className="p-2.5 text-center">
                                            {new Date(submitDate).toLocaleDateString() || '-'}
                                        </div>
                                        <div className="p-2.5 text-center">
                                            {quizDeadline.toLocaleDateString() || '-'}
                                        </div>
                                        <div className="p-2.5 text-center">
                                            {analyzed ? (
                                                <button
                                                    onClick={() => handleViewReportClick(submission)}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    View Report
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleAnalyzeClick(submission)}
                                                    className={`px-4 py-2 text-white rounded-md hover:bg-blue-600 ${isPastDeadline ? 'bg-blue-500' : 'bg-gray-500'}`}
                                                >
                                                    Analyze
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center p-5">No submissions available.</div>
                        )}
                    </>
                )}
            </div>
        </>

    );
}

export default QuizSubmission;
