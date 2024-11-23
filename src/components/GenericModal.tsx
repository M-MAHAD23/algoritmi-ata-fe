import React, { useState, useEffect, useRef } from 'react';

const GenericModal = ({
    isOpen,
    closeModal,
    title,
    content,
    onOkClick,
    cancelButtonText = 'Cancel',
    okButtonText = 'Save',
    hasScroll = true,
}) => {
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);
    const contentRef = useRef(null);

    // Scroll event listener to detect scroll position
    const handleScroll = () => {
        const content = contentRef.current;
        if (content) {
            const isAtEnd = content.scrollHeight - content.scrollTop <= content.clientHeight + 1; // Small threshold for precision
            setIsAtBottom(isAtEnd);
        }
    };

    // Check if the content is scrollable
    const checkScrollable = () => {
        const content = contentRef.current;
        if (content) {
            setIsScrollable(content.scrollHeight > content.clientHeight);
        }
    };

    useEffect(() => {
        if (isOpen) {
            checkScrollable();
            const content = contentRef.current;
            if (content) {
                content.addEventListener('scroll', handleScroll);
            }
        }

        return () => {
            if (contentRef.current) {
                contentRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isOpen, content]);

    // Toggle scroll between top and bottom based on the current position
    const toggleScroll = () => {
        if (contentRef.current) {
            const content = contentRef.current;
            if (isAtBottom) {
                // Scroll to top
                content.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // Scroll to bottom
                content.scrollTo({ top: content.scrollHeight, behavior: 'smooth' });
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg relative w-full max-w-lg mx-4 sm:mx-6 lg:max-w-3xl">
                <button
                    onClick={closeModal}
                    className="absolute top-3 right-3 text-white bg-black hover:bg-gray-500 rounded-full p-3 transition duration-200 ease-in-out"
                    aria-label="Close Modal"
                >
                    ✕
                </button>

                <h3 className="mb-4 text-lg font-bold text-center">{title}</h3>

                {/* Conditional scroll */}
                <div
                    ref={contentRef}
                    className={`space-y-4 ${hasScroll ? 'overflow-y-auto max-h-[250px]' : ''} px-6`}
                >
                    {content}
                </div>

                {/* Scroll arrow positioned above the "Save" button */}
                {hasScroll && isScrollable && (
                    <button
                        onClick={toggleScroll}
                        className={`absolute mb-3 bottom-16 left-1/2 transform -translate-x-1/2 bg-black text-white p-3 rounded-full shadow-lg transition duration-200 ${isAtBottom ? 'rotate-180' : ''}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-6 h-6"
                        >
                            <path d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                )}

                {/* Buttons */}
                <div className="w-full flex space-x-4 mt-4">
                    <button
                        onClick={closeModal}
                        className="w-full px-4 py-2 text-white bg-gray-300 hover:bg-gray-500 rounded-md"
                    >
                        {cancelButtonText}
                    </button>
                    <button
                        onClick={onOkClick}
                        className="w-full px-4 py-2 text-white bg-black hover:bg-gray-500 rounded-md"
                    >
                        {okButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenericModal;