import { faRobot, faComments, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import Markdown from "react-markdown";

export const Message = ({ role, content }) => {
  const [userProfile, setUserProfile] = useState(null);

  // Load user profile from localStorage
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUserProfile(userInfo);
  }, []);

  return (
    <div
      className={`grid max-w-fit grid-cols-[30px_1fr] items-center gap-3 p-4 
        rounded-full shadow-md 
        ${role === "user" ? "justify-self-end bg-gray-400" : ""} 
        ${role === "assistant" ? "justify-self-start bg-gray-300" : ""} 
        ${role === "notice" ? "bg-red-600 text-white justify-self-center" : ""}`}
    >
      {/* Avatar Section */}
      <div className="flex items-center justify-center h-[30px] w-[30px] rounded-full shadow-md bg-white">
        {role === "user" ? (
          userProfile?.image && userProfile.image !== "" ? (
            <img
              src={userProfile.image}
              alt="User avatar"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <FontAwesomeIcon icon={faUser} className="text-black" />
          )
        ) : (
          <FontAwesomeIcon icon={faComments} className="text-black" />
        )}
      </div>

      {/* Message Content */}
      <div className="prose prose-invert text-black text-lg">
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
};
