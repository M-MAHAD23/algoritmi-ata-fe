// HintModal.jsx (no changes needed)
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import GenericModal from '../../../components/GenericModal';

const HintModal = ({
    isOpen,
    closeModal,
    hintForm,
    setHintForm,
    hintErrors,
    handleHintChange,
    handleAddHint,
    quizHints,
    setQuizHints,
    addHint,
    currentQuizId,
    setHintErrors,  // Receiving setHintErrors from parent
}) => {
    const content = (
        <div>
            {Object.keys(hintForm).map((key) => (
                <div key={key} className="mb-4">
                    <label className="block text-sm font-medium mb-2">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    {key === 'hintType' ? (
                        <select
                            name="hintType"
                            value={hintForm.hintType}
                            onChange={handleHintChange}
                            className={`w-full rounded border p-2 ${hintErrors[key] ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="Input">Input</option>
                            <option value="Output">Output</option>
                        </select>
                    ) : key === 'image' ? (
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setHintForm((prev) => ({ ...prev, image: file }));
                            }}
                            className={`w-full rounded border p-2 ${hintErrors[key] ? 'border-red-500' : 'border-gray-300'}`}
                        />
                    ) : (
                        <input
                            type="text"
                            name={key}
                            value={hintForm[key]}
                            onChange={handleHintChange}
                            className={`w-full rounded border p-2 ${hintErrors[key] ? 'border-red-500' : 'border-gray-300'}`}
                        />
                    )}
                    {hintErrors[key] && <p className="mt-1 text-sm text-red-500">{hintErrors[key]}</p>}
                </div>
            ))}

            <button
                onClick={handleAddHint}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Add Hint
            </button>

            {quizHints.length > 0 && (
                <div className="mb-8">
                    {/* Hints Table */}
                    <div className="grid grid-cols-4 bg-gray-200 rounded-sm">
                        <div className="p-2.5 text-center font-medium uppercase">Hint Image</div>
                        <div className="p-2.5 text-center font-medium uppercase">Hint Type</div>
                        <div className="p-2.5 text-center font-medium uppercase">Hint Description</div>
                        <div className="p-2.5 text-center font-medium uppercase">Action</div>
                    </div>
                    {quizHints.map((hint, index) => (
                        <div key={index} className="grid grid-cols-4 items-center border-b">
                            <div className="p-2.5 flex justify-center">
                                {hint.image && <img src={URL.createObjectURL(hint.image)} alt="Hint" className="w-12 h-12 rounded" />}
                            </div>
                            <div className="p-2.5 text-center">{hint.hintType || '-'}</div>
                            <div className="p-2.5 text-center">{hint.description || '-'}</div>
                            <div className="p-2.5 flex justify-center">
                                <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    className="text-2xl hover:text-red cursor-pointer"
                                    onClick={() => setQuizHints((prev) => prev.filter((_, i) => i !== index))}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <GenericModal
            isOpen={isOpen}
            closeModal={closeModal}
            title="Add Hints to Quiz"
            content={content}
            onOkClick={() => {
                if (quizHints.length === 0) {
                    setHintErrors({ general: 'At least one hint is required.' });
                    return;
                }

                addHint(currentQuizId, quizHints);
                closeModal();
                setQuizHints([]);
                setHintErrors({});
            }}
            cancelButtonText="Cancel"
            okButtonText="Submit"
        />
    );
};

export default HintModal;
