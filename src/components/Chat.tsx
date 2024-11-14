import { faRobot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Message } from './Message/index.js';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ChatPage({ title, messages = [] }) {
  const chatId = localStorage.getItem('chatId');

  const [newChatId, setNewChatId] = useState(null);
  const [incomingMessage, setIncomingMessage] = useState('');
  const [messageText, setMessageText] = useState('');
  const [newChatMessages, setNewChatMessages] = useState([]);
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const [fullMessage, setFullMessage] = useState('');
  const [originalChatId, setOriginalChatId] = useState(chatId);
  const router = useNavigate();

  const user = JSON.parse(localStorage.getItem('userInfo'));
  const batchId = user.batchId; // hardcoded batchId
  const chatOwner = user ? user._id : null;
  const chatName = 'Programming Fundamentals Discussion'; // hardcoded chatName

  const routeHasChanged = chatId !== originalChatId;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneratingResponse(true);
    setOriginalChatId(chatId);

    // Add the user's message to new chat messages
    setNewChatMessages((prev) => [
      ...prev,
      {
        // _id: uuid(),
        role: 'user',
        content: messageText,
      },
    ]);

    // Construct the payload
    const payload = {
      id: chatId || null, // Use existing chatId or null if it doesn't exist
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
    // debugger;

    console.log('Payload:', payload); // Console the payload for debugging

    try {
      const response = await fetch(
        `http://192.168.0.104:8000/chat/updateChatById`,
        {
          method: 'UPDATE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        console.error('Failed to send message.');
        setGeneratingResponse(false);
        return;
      }

      const data = await response.json(); // Wait for the full response
      console.log('API response:', data); // Only console the response as requested
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setGeneratingResponse(false); // Reset the state
      setMessageText(''); // Clear the input field
    }
  };

  const allMessages = [...messages, ...newChatMessages];

  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden bg-[#1C2434]">
        <div className="flex flex-1 flex-col-reverse overflow-scroll text-white">
          {!allMessages.length && !incomingMessage && (
            <div className="m-auto flex items-center justify-center text-center">
              <div>
                <FontAwesomeIcon
                  icon={faRobot}
                  className="text-6xl text-emerald-200"
                />
                <h1 className="mt-2 text-4xl font-bold text-white/50">
                  Ask me a question!
                </h1>
              </div>
            </div>
          )}
          {!!allMessages.length && (
            <div className="mb-auto">
              {allMessages.map((message) => (
                <Message
                  key={message._id}
                  role={message.role}
                  content={message.content}
                />
              ))}
              {!!incomingMessage && !routeHasChanged && (
                <Message role="assistant" content={incomingMessage} />
              )}
              {!!incomingMessage && !!routeHasChanged && (
                <Message
                  role="notice"
                  content="Only one message at a time. Please allow any other responses to complete before sending another message"
                />
              )}
            </div>
          )}
        </div>
        <footer className="bg-gray-800 p-10">
          <form onSubmit={handleSubmit}>
            <fieldset className="flex gap-2" disabled={generatingResponse}>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={generatingResponse ? '' : 'Send a message...'}
                className="w-full resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-500 focus:bg-gray-600 focus:outline focus:outline-emerald-500"
              />
              <button type="submit" className="btn">
                Send
              </button>
            </fieldset>
          </form>
        </footer>
      </div>
    </>
  );
}
