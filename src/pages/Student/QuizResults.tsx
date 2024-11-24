import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../common/Loader";
import Panel from "../../layout/Panel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faEye } from "@fortawesome/free-solid-svg-icons";
import profileImage from "../../images/ata/profile.png";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function QuizResults() {
    const location = useLocation();
    const navigate = useNavigate();

    const [submissionDetails, setSubmissionDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEthicsVisible, setIsEthicsVisible] = useState(false);

    // Separate pagination states for each table
    const [pagination, setPagination] = useState({
        textMatched: { currentPage: 1, itemsPerPage: 5 },
        syntaxMatched: { currentPage: 1, itemsPerPage: 5 },
        logicMatched: { currentPage: 1, itemsPerPage: 5 },
    });

    const toggleEthicsVisibility = () => {
        setIsEthicsVisible((prevState) => !prevState);
    };

    // Extract quizId and submitterId from the query string
    const queryParams = new URLSearchParams(location.search);
    const quizId = queryParams.get("quizId");
    const submitterId = queryParams.get("submitterId");

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

    // Visibility change logic
    useEffect(() => {
        fetchSubmissionDetails(); // Refetch the submission details when the page becomes visible again
        const handleVisibilityChange = () => {
            console.log('Visibility state:', document.visibilityState); // Check if it's being called
            if (document.visibilityState === 'visible') {
                fetchSubmissionDetails(); // Refetch the submission details when the page becomes visible again
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

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

    // Pagination handling functions
    const handlePageChange = (table, direction) => {
        setPagination((prev) => {
            const newPagination = { ...prev };
            if (direction === "next") {
                if (newPagination[table].currentPage < Math.ceil(matches[table].length / newPagination[table].itemsPerPage)) {
                    newPagination[table].currentPage += 1;
                }
            } else if (direction === "prev") {
                if (newPagination[table].currentPage > 1) {
                    newPagination[table].currentPage -= 1;
                }
            }
            return newPagination;
        });
    };

    const renderMatchTable = (title, matches, tableKey) => {
        const { currentPage, itemsPerPage } = pagination[tableKey];

        // Calculate the items to be displayed on the current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const currentMatches = matches.slice(startIndex, startIndex + itemsPerPage);

        return (
            <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-16">
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
                    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">{title}</h4>

                    {matches?.length === 0 ? (
                        <div className="text-center text-lg p-5">No matches found.</div>
                    ) : (
                        <div className="flex flex-col">
                            <div className="grid grid-cols-3 rounded-sm bg-black text-white dark:bg-meta-4">
                                <div className="p-2.5 text-center xl:p-5">Image</div>
                                <div className="p-2.5 text-center xl:p-5">Student Name</div>
                                <div className="p-2.5 text-center xl:p-5">Percentage</div>
                            </div>

                            {currentMatches?.map((match, index) => (
                                <div
                                    className={`grid grid-cols-3 ${index === currentMatches?.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
                                    key={match._id}
                                >
                                    <div className="p-2.5 text-center xl:p-5 flex justify-center items-center">
                                        <img
                                            src={match.studentId?.image || profileImage}
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

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => handlePageChange(tableKey, "prev")}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <div className="text-center">
                            Page {currentPage} of {Math.ceil(matches.length / itemsPerPage)}
                        </div>
                        <button
                            onClick={() => handlePageChange(tableKey, "next")}
                            disabled={currentPage === Math.ceil(matches.length / itemsPerPage)}
                            className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Panel>
                {
                    loading
                        ?
                        <Loader />
                        :
                        (
                            <>
                                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

                                    {/* Go Back Button */}
                                    <button
                                        onClick={() => navigate(-1)} // Navigate back to the previous page
                                        className="text-black hover:underline mb-4"
                                    >
                                        &larr; Go Back
                                    </button>
                                    <div className="rounded-sm mb-6 border border-stroke bg-white px-5 pt-6 pb-6 shadow-lg dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">

                                        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Submission Details</h4>

                                        {/* Submitter Information */}
                                        <div className="mb-6">
                                            <div className="flex items-center space-x-2 mb-4">
                                                <span className="font-semibold text-lg text-black dark:text-gray-200">Submitter:</span>
                                                <span className="text-gray-700 dark:text-gray-400">{submissionDetails?.submitterId?.name || "Unknown"}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-4">
                                                <span className="font-semibold text-lg text-black dark:text-gray-200">Submission Date:</span>
                                                <span className="text-gray-700 dark:text-gray-400">
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
                                                <span className="font-semibold text-lg text-black dark:text-gray-200">Ethics Evaluation:</span>
                                                <span className={`text-lg ${ethics === "Passed" ? 'text-gray-800' : 'text-gray-500'} dark:text-gray-300 ml-2`}>
                                                    {isEthicsVisible ? ethics : `${ethics?.slice(0, 10)}...`}
                                                </span>
                                                {ethics && (
                                                    <span className="ml-2">
                                                        <button
                                                            className="text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-gray-100 focus:outline-none"
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
                                                <span className="font-semibold text-lg text-black dark:text-gray-200">Copied from AI:</span>
                                                <span className={`text-lg ${copiedFromAI === 0 ? 'text-gray-800' : 'text-gray-500'} dark:text-gray-300`}>
                                                    {copiedFromAI === 0 ? "No" : "Yes"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Submitted Code Link */}
                                        <div className="mb-6">
                                            <div className="flex items-center space-x-2 mb-4">
                                                <FontAwesomeIcon icon={faCode} className="text-gray-600 dark:text-gray-400" />
                                                <span className="font-semibold text-lg text-black dark:text-gray-200">Submitted Code:</span>
                                                <a
                                                    href={s3Url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-gray-800 hover:text-black hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                                >
                                                    View Code
                                                    <FontAwesomeIcon icon={faEye} className="ml-2 text-gray-600 dark:text-gray-400" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Matching Details Tables */}
                                    {renderMatchTable("Text Matches", textMatched, "textMatched")}
                                    {renderMatchTable("Syntax Matches", syntaxMatched, "syntaxMatched")}
                                    {renderMatchTable("Logic Matches", logicMatched, "logicMatched")}
                                </div>
                            </>
                        )
                }
            </Panel>
        </>
    );
}

export default QuizResults;
