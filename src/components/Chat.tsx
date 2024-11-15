import { faRobot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Message } from './Message/index.js';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ChatPage({ title, messages = [] }) {
  const localStorageChatOwner = localStorage.getItem('chatOwner');
  const [cO, setCO] = useState(localStorageChatOwner);
  const chatId = localStorage.getItem('chatId');
  const [newChatId, setNewChatId] = useState(null);
  const [incomingMessage, setIncomingMessage] = useState('');
  const [messageText, setMessageText] = useState('');
  const [newChatMessages, setNewChatMessages] = useState([]);
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const [fullMessage, setFullMessage] = useState('');
  const [originalChatId, setOriginalChatId] = useState(chatId);
  const router = useNavigate();
  const [loading, setLoading] = useState();

  const user = JSON.parse(localStorage.getItem('userInfo'));
  const batchId = user.batchId;
  const chatOwner = user ? user._id : null;
  const chatName = Math.random().toString(36).substring(2, 10);

  const routeHasChanged = chatId !== originalChatId;

  // Check if chatOwner exists; if not, call the createChat API
  useEffect(() => {
    if (!cO) {
      // If no chatOwner, create a new chat
      fetch('http://localhost:8000/chat/createChat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatName, batchId, chatOwner }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.data) {
            localStorage.setItem('chatId', data.data._id);  // Use data._id directly
            localStorage.setItem('chatOwner', data.data.chatOwner);  // Save chatOwner if needed
            setNewChatId(data._id);
          } else {
            console.error('Failed to retrieve chatId');
          }
        })
        .catch((error) => console.error('Error creating chat:', error));
    }
  }, []);

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
      const response = await fetch(
        `http://localhost:8000/chat/updateChatById`,
        {
          method: 'POST',
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

      const data = await response.json();
      localStorage.setItem('chatId', data._id);

      // Update messages from the API response
      const updatedMessages = data.chat.map((msg) => ({
        _id: msg._id,
        role: msg.role === 'User' ? 'user' : 'assistant',
        content: msg.message,
      }));

      setNewChatMessages(updatedMessages);
      console.log('API response:', data);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setGeneratingResponse(false);
      setMessageText('');
    }
  };

  const allMessages = [...messages, ...newChatMessages];

  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden bg-[#1C2434]">
        <div className="flex flex-1 flex-col-reverse overflow-scroll text-white">
          {/* Display a prompt when there are no messages */}
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

          {/* Map and render all messages */}
          {!!allMessages.length && (
            <div className="mb-auto">
              {allMessages.map((message) => (
                <Message
                  key={message._id}
                  role={message.role}
                  content={message.content}
                />
              ))}
              {/* Render incoming message if route hasn't changed */}
              {!!incomingMessage && !routeHasChanged && (
                <Message role="assistant" content={incomingMessage} />
              )}
              {/* Show notice message if route has changed */}
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