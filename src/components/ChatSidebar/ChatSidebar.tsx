import {
  faMessage,
  faPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export const ChatSidebar = ({ chatId }) => {
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    const loadChatList = async () => {
      const response = await fetch(`/api/chat/getChatList`, {
        method: "POST",
      });
      const json = await response.json();
      console.log("CHAT LIST: ", json);
      setChatList(json?.chats || []);
    };
    loadChatList();
  }, [chatId]);

  return (
    <div className="flex flex-col overflow-hidden bg-gray-900 text-white">
      <a
        href="/chat"
        className="side-menu-item bg-emerald-500 hover:bg-emerald-600"
      >
        <FontAwesomeIcon icon={faPlus} /> New chat
      </a>
      <div className="flex-1 overflow-auto bg-gray-950">
        {chatList.map((chat) => (
          <a
            key={chat._id}
            href={`/chat/${chat._id}`}
            className={`side-menu-item ${chatId === chat._id ? "bg-gray-700 hover:bg-gray-700" : ""
              }`}
          >
            <FontAwesomeIcon icon={faMessage} className="text-white/50" />{" "}
            <span
              title={chat.title}
              className="overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {chat.title}
            </span>
          </a>
        ))}
      </div>
      <a href="/api/auth/logout" className="side-menu-item">
        <FontAwesomeIcon icon={faRightFromBracket} /> Logout
      </a>
    </div>
  );
};
