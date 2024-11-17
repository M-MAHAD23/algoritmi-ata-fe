import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../common/Loader';

const API_BASE_URL = import.meta.env.VITE_API_URL;

function QuizSubmission() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
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
        fetchSubmissions();
    }, []);

    const handleStudentClick = (studentId) => {
        navigate(`/student-report/${studentId}`);
    };

    const handleAnalyzeClick = async (submissionId) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/quiz/analyzeQuiz`,
                { submissionId }
            );
            const updatedSubmissions = submissions.map(submission =>
                submission._id === submissionId ? { ...submission } : submission
            );
            setSubmissions(updatedSubmissions);
        } catch (err) {
            setError('Error analyzing submission');
        }
    };

    const handleViewReportClick = (submissionId) => {
        navigate(`/submission-result/${submissionId}`);
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            {loading ? (
                <Loader />
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    <h4 className="text-xl font-semibold text-black dark:text-white mb-4">Quiz Submissions</h4>
                    <div className="grid grid-cols-3 bg-gray-2 dark:bg-meta-4 rounded-sm">
                        <div className="p-2.5 text-center font-medium uppercase">Student Name</div>
                        <div className="p-2.5 text-center font-medium uppercase">Submission Date</div>
                        <div className="p-2.5 text-center font-medium uppercase">Actions</div>
                    </div>
                    {submissions.length ? (
                        submissions.map((submission) => {
                            const { submitterId, submitDate, _id, analyzed } = submission;
                            return (
                                <div
                                    key={_id}
                                    className="grid grid-cols-3 border-b border-stroke dark:border-strokedark"
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
                                        {analyzed ? (
                                            <button
                                                onClick={() => handleViewReportClick(_id)}
                                                className="text-blue-500 hover:underline"
                                            >
                                                View Report
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleAnalyzeClick(_id)}
                                                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
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
    );
}

export default QuizSubmission;
