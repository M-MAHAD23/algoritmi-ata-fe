import React, { useState, useEffect } from 'react';
import GenericModal from '../../../components/GenericModal';

const UpdateBatchModal = ({ isOpen, closeModal, handleUpdateBatch, batch, setBatch }) => {
    // Local state to track updated batch values
    const [updatedBatch, setUpdatedBatch] = useState({
        batchNumber: batch.batchNumber,
        batchStart: batch.batchStart,
        batchEnd: batch.batchEnd,
        batchName: batch.batchName,
        id: batch._id,
    });

    const [errors, setErrors] = useState({});

    // Ensure the updatedBatch state is updated when batch prop changes
    useEffect(() => {
        setUpdatedBatch({
            batchNumber: batch.batchNumber,
            batchStart: batch.batchStart,
            batchEnd: batch.batchEnd,
            batchName: batch.batchName,
            id: batch._id,
        });
    }, [batch]);

    // Validate fields before submission
    const validateFields = () => {
        const newErrors = {};
        if (!updatedBatch.batchNumber) {
            newErrors.batchNumber = 'Batch number is required.';
        } else if (isNaN(updatedBatch.batchNumber)) {
            newErrors.batchNumber = 'Batch number must be a valid number.';
        }
        if (!updatedBatch.batchStart) newErrors.batchStart = 'Batch start date is required.';
        if (!updatedBatch.batchEnd) newErrors.batchEnd = 'Batch end date is required.';
        if (!updatedBatch.batchName) newErrors.batchName = 'Batch name is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle update batch
    const onUpdateBatch = () => {
        if (validateFields()) {
            handleUpdateBatch(updatedBatch); // Pass updated batch data to parent
        }
    };

    const content = (
        <div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Batch Number"
                    value={updatedBatch.batchNumber}
                    onChange={(e) => setUpdatedBatch({ ...updatedBatch, batchNumber: e.target.value })}
                    className={`border p-2 w-full ${errors.batchNumber ? 'border-red-500' : ''}`}
                />
                {errors.batchNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.batchNumber}</p>
                )}
            </div>
            <div className="mb-4">
                <input
                    type="date"
                    placeholder="Batch Start"
                    value={updatedBatch.batchStart}
                    onChange={(e) => setUpdatedBatch({ ...updatedBatch, batchStart: e.target.value })}
                    className={`border p-2 w-full ${errors.batchStart ? 'border-red-500' : ''}`}
                />
                {errors.batchStart && (
                    <p className="text-red-500 text-sm mt-1">{errors.batchStart}</p>
                )}
            </div>
            <div className="mb-4">
                <input
                    type="date"
                    placeholder="Batch End"
                    value={updatedBatch.batchEnd}
                    onChange={(e) => setUpdatedBatch({ ...updatedBatch, batchEnd: e.target.value })}
                    className={`border p-2 w-full ${errors.batchEnd ? 'border-red-500' : ''}`}
                />
                {errors.batchEnd && (
                    <p className="text-red-500 text-sm mt-1">{errors.batchEnd}</p>
                )}
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Batch Name"
                    value={updatedBatch.batchName}
                    onChange={(e) => setUpdatedBatch({ ...updatedBatch, batchName: e.target.value })}
                    className={`border p-2 w-full ${errors.batchName ? 'border-red-500' : ''}`}
                />
                {errors.batchName && (
                    <p className="text-red-500 text-sm mt-1">{errors.batchName}</p>
                )}
            </div>
        </div>
    );

    return (
        <GenericModal
            isOpen={isOpen}
            closeModal={closeModal}
            title="Update Batch"
            content={content}
            onOkClick={onUpdateBatch}
            cancelButtonText="Cancel"
        />
    );
};

export default UpdateBatchModal;
