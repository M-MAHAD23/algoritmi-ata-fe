import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Panel from '../../layout/Panel';

function TeacherBatches() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newBatch, setNewBatch] = useState({ batchNumber: '', batchSession: '', batchName: '' });
    const [showUserModal, setShowUserModal] = useState(false); // User creation modal visibility
    const [newUser, setNewUser] = useState({
        name: '',
        role: 'Student', // Default role
        email: '',
        cnic: '',
        contact: [],
        education: [],
        batchId: '', // to be populated from the selected batch
        image: '',
    });
    const { batchId } = useParams();

    useEffect(() => {
        const fetchBatches = async () => {
            setLoading(true);
            try {
                let response;
                if (batchId) {
                    response = await axios.post('http://localhost:8000/batch/getBatchById', { batchId });
                } else {
                    response = await axios.post('http://localhost:8000/batch/getAllBatches');
                }
                setBatches(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching batches');
                setLoading(false);
            }
        };

        fetchBatches();
    }, [batchId]);

    const headers = ['Batch Number', 'Batch Session', 'Batch Name', 'Actions'];

    // Handle Create Batch
    const handleCreateBatch = async () => {
        try {
            const response = await axios.post('http://localhost:8000/batch/createBatch', newBatch);
            setBatches([...batches, response.data.data]);
            setShowCreateModal(false);
            setNewBatch({ batchNumber: '', batchSession: '', batchName: '' });
        } catch (err) {
            setError('Error creating batch');
        }
    };

    // Handle Delete Batch
    const handleDeleteBatch = async (batchId) => {
        try {
            await axios.delete(`http://localhost:8000/batch/deleteBatch/${batchId}`);
            setBatches(batches.filter(batch => batch._id !== batchId));
        } catch (err) {
            setError('Error deleting batch');
        }
    };

    // Handle Archive Batch
    const handleArchiveBatch = async (batchId) => {
        try {
            const response = await axios.put(`http://localhost:8000/batch/archiveBatch/${batchId}`);
            setBatches(batches.map(batch =>
                batch._id === batchId ? { ...batch, archived: true } : batch
            ));
        } catch (err) {
            setError('Error archiving batch');
        }
    };

    // Handle Create User
    const handleCreateUser = async () => {
        try {
            const response = await axios.post('http://localhost:8000/user/createUser', newUser);
            // Optionally add the user to the batch's user list here
            setShowUserModal(false);
            setNewUser({
                name: '',
                role: 'Student',
                email: '',
                cnic: '',
                contact: [],
                education: [],
                batchId: '',
                image: '',
            });
        } catch (err) {
            setError('Error creating user');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Panel>
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Batches</h4>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="mb-6 bg-blue-500 text-white py-2 px-4 rounded"
                >
                    Create Batch
                </button>

                <div className="flex flex-col">
                    {/* Dynamic Headers */}
                    <div className="grid grid-cols-4 sm:grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4">
                        {headers.map((header, index) => (
                            <div key={index} className="p-2.5 text-center xl:p-5">
                                <h5 className="text-sm font-medium uppercase xsm:text-base">{header}</h5>
                            </div>
                        ))}
                    </div>

                    {/* Dynamic Rows */}
                    {batches.length === 0 ? (
                        <div className="text-center text-lg p-5">No batches available.</div>
                    ) : (
                        batches.map((batch, rowIndex) => (
                            <div
                                key={batch._id}
                                className={`grid grid-cols-4 sm:grid-cols-4 ${rowIndex === batches.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
                            >
                                <div className="flex items-center justify-center p-2.5 xl:p-5">
                                    <p className="text-black dark:text-white">{batch.batchNumber || '-'}</p>
                                </div>
                                <div className="flex items-center justify-center p-2.5 xl:p-5">
                                    <p className="text-black dark:text-white">{batch.batchSession || '-'}</p>
                                </div>
                                <div className="flex items-center justify-center p-2.5 xl:p-5">
                                    <p className="text-black dark:text-white">{batch.batchName || '-'}</p>
                                </div>
                                <div className="flex items-center justify-center p-2.5 xl:p-5">
                                    <button
                                        onClick={() => handleArchiveBatch(batch._id)}
                                        className="bg-yellow-500 text-white py-1 px-3 rounded"
                                    >
                                        {batch.archived ? 'Archived' : 'Archive'}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBatch(batch._id)}
                                        className="bg-blue-500 text-white py-1 px-3 rounded ml-2"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => {
                                            setNewUser({ ...newUser, batchId: batch._id });
                                            setShowUserModal(true);
                                        }}
                                        className="bg-green-500 text-white py-1 px-3 rounded ml-2"
                                    >
                                        +User
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Create User Modal */}
            {showUserModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Create User</h3>
                        <input
                            type="text"
                            placeholder="User Name"
                            value={newUser.name}
                            onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                            className="border p-2 mb-4 w-full"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                            className="border p-2 mb-4 w-full"
                        />
                        <input
                            type="text"
                            placeholder="CNIC"
                            value={newUser.cnic}
                            onChange={e => setNewUser({ ...newUser, cnic: e.target.value })}
                            className="border p-2 mb-4 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Contact"
                            value={newUser.contact.join(', ')}
                            onChange={e => setNewUser({ ...newUser, contact: e.target.value.split(', ') })}
                            className="border p-2 mb-4 w-full"
                        />
                        <select
                            value={newUser.role}
                            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                            className="border p-2 mb-4 w-full"
                        >
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                        </select>
                        <input
                            type="file"
                            onChange={e => setNewUser({ ...newUser, image: e.target.files[0] })}
                            className="border p-2 mb-4 w-full"
                        />
                        <button
                            onClick={handleCreateUser}
                            className="bg-green-500 text-white py-2 px-4 rounded w-full"
                        >
                            Create User
                        </button>
                        <button
                            onClick={() => setShowUserModal(false)}
                            className="bg-gray-500 text-white py-2 px-4 rounded w-full mt-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            {/* Create Batch Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Create Batch</h3>
                        <input
                            type="text"
                            placeholder="Batch Number"
                            value={newBatch.batchNumber}
                            onChange={e => setNewBatch({ ...newBatch, batchNumber: e.target.value })}
                            className="border p-2 mb-4 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Batch Session"
                            value={newBatch.batchSession}
                            onChange={e => setNewBatch({ ...newBatch, batchSession: e.target.value })}
                            className="border p-2 mb-4 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Batch Name"
                            value={newBatch.batchName}
                            onChange={e => setNewBatch({ ...newBatch, batchName: e.target.value })}
                            className="border p-2 mb-4 w-full"
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="bg-gray-400 text-white py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateBatch}
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Panel>
    );
}

export default TeacherBatches;
