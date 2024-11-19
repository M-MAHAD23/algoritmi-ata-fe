// QuizModal.jsx
import React from 'react';
import GenericModal from '../../../components/GenericModal';

const QuizModal = ({
    isOpen,
    closeModal,
    quizForm,
    setQuizForm,
    quizErrors,
    handleInputChange,
    createQuiz,
}) => {
    const content = (
        <div>
            {Object.keys(quizForm).map((key, index) => (
                <div key={key} className={`p-4 ${index < 2 ? '' : 'border-t'}`}>
                    <label className="block text-sm font-medium mb-2">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input
                        type={key === 'quizIssued' || key === 'quizDead' ? 'date' : 'text'}
                        name={key}
                        value={quizForm[key]}
                        onChange={handleInputChange}
                        className={`w-full rounded border p-3 text-sm sm:text-base ${quizErrors[key] ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {quizErrors[key] && <p className="mt-1 text-sm text-red-500">{quizErrors[key]}</p>}
                </div>
            ))}
        </div>
    );

    return (
        <GenericModal
            isOpen={isOpen}
            closeModal={closeModal}
            title="Create Quiz"
            content={content}
            onOkClick={createQuiz}
            cancelButtonText="Cancel"
            okButtonText="Create Quiz"
        />
    );
};

export default QuizModal;
