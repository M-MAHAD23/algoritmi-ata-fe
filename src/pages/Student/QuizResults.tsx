import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../common/Loader";
import Panel from "../../layout/Panel";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function QuizResults() {
    const location = useLocation();
    const navigate = useNavigate();

    const [submissionDetails, setSubmissionDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEthicsVisible, setIsEthicsVisible] = useState(false);

    const toggleEthicsVisibility = () => {
        setIsEthicsVisible((prevState) => !prevState);
    };

    // Extract quizId and submitterId from the query string
    const queryParams = new URLSearchParams(location.search);
    const quizId = queryParams.get("quizId");
    const submitterId = queryParams.get("submitterId");

    useEffect(() => {
        const fetchSubmissionDetails = async () => {
            if (!quizId || !submitterId) {
                setError("Invalid parameters.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.post(
                    `${API_BASE_URL}/quiz/submissionDetailsStudent`,
                    { quizId, submitterId }
                );
                setSubmissionDetails(response.data.data); // Adjusted to match the response data structure
                setLoading(false);
            } catch (err) {
                setError("Error fetching submission details");
                setLoading(false);
            }
        };

        fetchSubmissionDetails();
    }, [quizId, submitterId]);

    if (loading) return <Loader />;
    if (error) return <div>{error}</div>;

    console.log('===========', submissionDetails)

    const {
        ethics,
        copiedFromAI,
        submitDate,
        textMatched = [],
        syntaxMatched = [],
        logicMatched = [],
        student,
        s3Url,
    } = submissionDetails || {};

    const renderMatchTable = (title, matches) => (
        <div className="mb-8">
            <h5 className="mt-25 mb-4 text-lg font-semibold text-black dark:text-white">{title}</h5>
            {matches?.length === 0 ? (
                <div className="text-center text-lg p-5">No matches found.</div>
            ) : (
                <div className="flex flex-col">
                    <div className="grid grid-cols-3 rounded-sm bg-black text-white dark:bg-meta-4">
                        <div className="p-2.5 text-center xl:p-5">Image</div>
                        <div className="p-2.5 text-center xl:p-5">Student Name</div>
                        <div className="p-2.5 text-center xl:p-5">Percentage</div>
                    </div>
                    {matches?.map((match, index) => (
                        <div
                            className={`grid grid-cols-3 ${index === matches?.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
                            key={match._id}
                        >
                            <div className="p-2.5 text-center xl:p-5 flex justify-center items-center">
                                <img
                                    src={match.studentId?.image}
                                    alt={match.studentId?.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            </div>
                            <div className="p-2.5 text-center xl:p-5">{match.studentId?.name || "Unknown"}</div>
                            <div className="p-2.5 text-center xl:p-5">{match.percentage}%</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <Panel>
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">

                    {/* Go Back Button */}
                    <button
                        onClick={() => navigate(-1)} // Navigate back to the previous page
                        className="text-blue-500 dark:text-blue-400 hover:underline mb-4"
                    >
                        &larr; Go Back
                    </button>

                    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Submission Details</h4>

                    {/* Submitter Information */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">Submitter:</span>
                            <span className="text-gray-600 dark:text-gray-400">{submissionDetails?.submitterId?.name || "Unknown"}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">Submission Date:</span>
                            <span className="text-gray-600 dark:text-gray-400">
                                {submissionDetails?.submitDate
                                    ? new Date(submissionDetails.submitDate).toLocaleString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                        second: "numeric",
                                        hour12: true,
                                    })
                                    : "Unknown"}
                            </span>
                        </div>
                    </div>

                    {/* Ethics Evaluation - with "See More" */}
                    <div className="mb-6">
                        <div className="flex items-center mb-4">
                            <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">Ethics Evaluation:</span>
                            <span className={`text-lg ${ethics === "Passed" ? 'text-green-500' : 'text-red-500'} dark:text-green-400 ml-2`}>
                                {isEthicsVisible ? ethics : `${ethics.slice(0, 10)}...`}
                            </span>
                            {ethics && (
                                <span className="ml-2">
                                    <button
                                        className="text-blue-500 dark:text-blue-400 hover:underline"
                                        onClick={toggleEthicsVisibility}
                                    >
                                        {isEthicsVisible ? "See Less" : "See More"}
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Copied from AI */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">Copied from AI:</span>
                            <span className={`text-lg ${copiedFromAI === 0 ? 'text-green-500' : 'text-red-500'} dark:text-green-400`}>
                                {copiedFromAI === 0 ? "No" : "Yes"}
                            </span>
                        </div>
                    </div>

                    {/* Submitted Code Link */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">Submitted Code:</span>
                            <a
                                href={s3Url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                {/* SVG Eye Icon */}
                                View Code
                                <svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-eye ml-5">
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                </div>

                {renderMatchTable("Text Matches", textMatched)}
                {renderMatchTable("Syntax Matches", syntaxMatched)}
                {renderMatchTable("Logic Matches", logicMatched)}
            </div>
        </Panel>
    );
}

export default QuizResults;