import { faRobot, faComments, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Message } from '../../components/Message/index.js';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
const API_BASE_URL = import.meta.env.VITE_API_URL;
import Panel from '../../layout/Panel'
import Spinner from './../../components/Spinner';
import Loader from '../../common/Loader/index.js';

export default function ChatPage({ title, messages = [] }) {
    const localStorageChatOwner = localStorage.getItem('chatOwner');
    const [cO, setCO] = useState(localStorageChatOwner);
    const chatId = localStorage.getItem('chatId');
    const [cI, setCI] = useState(chatId);
    const [newChatId, setNewChatId] = useState(null);
    const [incomingMessage, setIncomingMessage] = useState('');
    const [messageText, setMessageText] = useState('');
    const [newChatMessages, setNewChatMessages] = useState([]);
    const [generatingResponse, setGeneratingResponse] = useState(false);
    const [fullMessage, setFullMessage] = useState('');
    const [originalChatId, setOriginalChatId] = useState(chatId);
    const router = useNavigate();
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem('userInfo'));
    const batchId = user.batchId;
    const chatOwner = user ? user._id : null;
    const chatName = Math.random().toString(36).substring(2, 10);

    const routeHasChanged = chatId !== originalChatId;

    // Check if chatOwner exists; if not, call the createChat API
    useEffect(() => {
        // If no chatOwner, create a new chat
        fetch(`${API_BASE_URL}/chat/createChat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chatName, batchId, chatOwner }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data?.data) {
                    localStorage.setItem('chatId', data.data._id); // Use data._id directly
                    localStorage.setItem('chatOwner', data.data.chatOwner); // Save chatOwner if needed
                    setNewChatId(data._id);
                } else {
                    console.error('Failed to retrieve chatId');
                }
            })
            .catch((error) => console.error('Error creating chat:', error));
    }, [!cO || !cI]);

    // Reset messages when route changes
    useEffect(() => {
        setNewChatMessages([]);
        setNewChatId(null);
    }, [chatId]);

    // Append new assistant message once the response is generated
    useEffect(() => {
        if (!routeHasChanged && !generatingResponse && fullMessage) {
            setNewChatMessages((prev) => [
                ...prev,
                {
                    _id: uuid(),
                    role: 'assistant',
                    content: fullMessage,
                },
            ]);
            setFullMessage('');
        }
    }, [generatingResponse, fullMessage, routeHasChanged]);

    useEffect(() => {
        if (!generatingResponse && newChatId) {
            setNewChatId(null);
            router(`/chat/${newChatId}`);
        }
    }, [newChatId, generatingResponse, router]);

    // Fetch chat data when the component loads and when cO changes
    const fetchChatData = async () => {
        const chatId = localStorage.getItem('chatId');
        const payload = { chatId: chatId };

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/chat/getChatById`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error('Failed to retrieve chat data.');
                setLoading(false);
                return;
            }

            const data = await response.json();
            localStorage.setItem('chatId', data._id);
            localStorage.setItem('chatOwner', data.chatOwner);

            // Update messages from the API response
            const updatedMessages = data.chat.map((msg) => ({
                _id: msg._id,
                role: msg.role === 'User' ? 'user' : 'assistant',
                content: msg.message,
            }));

            setNewChatMessages(updatedMessages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching chat data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChatData();
    }, []);

    // Call fetchChatData whenever the page visibility changes
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // Refetch chat data when the page becomes visible again
                fetchChatData();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Clean up the event listener when the component is unmounted
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneratingResponse(true);
        setOriginalChatId(chatId);

        setNewChatMessages((prev) => [
            ...prev,
            {
                role: 'user',
                content: messageText,
            },
        ]);

        const payload = {
            id: chatId || null,
            batchId: batchId,
            chatName: chatName,
            chatOwner: chatOwner,
            message: [
                {
                    role: 'User',
                    message: messageText,
                },
            ],
        };

        try {
            const response = await fetch(`${API_BASE_URL}/chat/updateChatById`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error('Failed to send message.');
                setGeneratingResponse(false);
                return;
            }

            const data = await response.json();
            localStorage.setItem('chatId', data._id);

            // Update messages from the API response
            const updatedMessages = data.chat.map((msg) => ({
                _id: msg._id,
                role: msg.role === 'User' ? 'user' : 'assistant',
                content: msg.message,
            }));

            setNewChatMessages(updatedMessages);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setGeneratingResponse(false);
            setMessageText('');
        }
    };

    const allMessages = [...messages, ...newChatMessages];

    return (
        <Panel>
            {loading && <Loader />}
            <div className="flex-1 overflow-y-auto text-gray-900">
                {!allMessages.length && !incomingMessage && (
                    <div className="flex items-center justify-center h-full text-center">
                        <div>
                            <FontAwesomeIcon icon={faComments} className="text-6xl text-black mt-45" />
                            <h1 className="mt-2 text-4xl font-bold text-black mb-75">Ask me a question!</h1>
                        </div>
                    </div>
                )}
                {!!allMessages.length && (
                    <div className="p-4 space-y-2">
                        {allMessages.map((message) => (
                            <Message key={message._id} role={message.role} content={message.content} />
                        ))}
                        {!!incomingMessage && !routeHasChanged && (
                            <Message role="assistant" content={incomingMessage} />
                        )}
                        {!!incomingMessage && !!routeHasChanged && (
                            <Message role="notice" content="Only one message at a time. Please allow any other responses to complete before sending another message." />
                        )}
                    </div>
                )}
            </div>

            <footer className="bg-black rounded-full p-4 shadow-md">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder={generatingResponse ? '' : 'Send a message...'}
                        className={`w-full rounded-full resize-none bg-white p-2 pl-10 text-black placeholder-black focus:ring-2 focus:ring-emerald-500 ${generatingResponse ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={generatingResponse}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        className={`bg-white text-black p-4 rounded-full hover:bg-gray-500 focus:outline-none ${generatingResponse ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={generatingResponse || !messageText.trim()}
                    >
                        {generatingResponse ? (
                            <Spinner size="small" color="black" />
                        ) : (
                            <FontAwesomeIcon icon={faArrowUp} className="text-black" />
                        )}
                    </button>
                </form>
            </footer>
        </Panel>
    );
}
