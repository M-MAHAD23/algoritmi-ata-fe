import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Panel from '../../layout/Panel';
import Loader from '../../common/Loader';
import { useParams } from 'react-router-dom';
import profileImage from '../../images/ata/profile.png';
const API_BASE_URL = import.meta.env.VITE_API_URL;


function Teachers() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { batchId } = useParams();  // This will get the batchId from the URL

    useEffect(() => {
        const fetchTeachers = async () => {
            setLoading(true);
            try {
                let response;
                if (batchId) {
                    // Fetch teachers by batchId if it's present in the URL
                    response = await axios.post(`${API_BASE_URL}/user/getTeachersByBatch`, { batchId });
                } else {
                    // Fetch all teachers if no batchId is present
                    response = await axios.post(`${API_BASE_URL}/user/getAllTeachers`, { role: 'Teacher' });
                }
                setTeachers(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching teachers');
                setLoading(false);
            }
        };

        fetchTeachers();
    }, [batchId]);  // This will trigger the effect when batchId changes

    const headers = [
        'Image',
        'Name',
        'Email',
        'Contact',
        'About',
    ];

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <Panel>
                {loading && <Loader />}
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Teachers</h4>

                    <div className="flex flex-col">
                        {/* Dynamic Headers */}
                        <div className="grid grid-cols-5 sm:grid-cols-5 rounded-sm bg-black text-white dark:bg-meta-4">
                            {headers.map((header, index) => (
                                <div key={index} className="p-2.5 text-center xl:p-5">
                                    <h5 className="text-sm font-medium uppercase xsm:text-base">{header}</h5>
                                </div>
                            ))}
                        </div>

                        {/* Dynamic Rows */}
                        {teachers?.length === 0 ? (
                            <div className="text-center text-lg p-5">No teachers available.</div>
                        ) : (
                            teachers?.map((teacher, rowIndex) => (
                                <div
                                    className={`grid grid-cols-5 sm:grid-cols-5 ${rowIndex === teachers?.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
                                    key={rowIndex}
                                >
                                    {/* Image Column */}
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <img
                                            src={teacher?.image || profileImage} // Add default image URL if teacher? doesn't have one
                                            alt={teacher?.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    </div>
                                    {/* Other Columns */}
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{teacher?.name || '-'}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{teacher?.email || '-'}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{teacher?.contact?.join(', ') || '-'}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{teacher?.about || '-'}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Panel>
        </>
    );
}

export default Teachers;
