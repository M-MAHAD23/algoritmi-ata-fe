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
      className={`relative rounded-[15px] grid max-w-fit grid-cols-[30px_1fr] items-center gap-3 p-4 shadow-md 
        ${role === "user" ? "justify-self-end bg-gray-400" : ""} 
        ${role === "assistant" ? "justify-self-start bg-gray-300" : ""} 
        ${role === "notice" ? "bg-red-600 text-white justify-self-center" : ""}`}
    >
      {/* Triangle for Assistant */}
      {role === "assistant" && (
        <div
          className="absolute top-2 left-[-15px] w-0 h-0 
    border-t-[15px] border-t-transparent 
    border-b-[15px] border-b-transparent 
    border-r-[20px] border-r-gray-300"
        ></div>
      )}

      {/* Triangle for User */}
      {role === "user" && (
        <div
          className="absolute top-2 right-[-15px] w-0 h-0 
    border-t-[15px] border-t-transparent 
    border-b-[15px] border-b-transparent 
    border-l-[20px] border-l-gray-400"
        ></div>
      )}


      {/* Avatar Section */}
      <div className="flex items-center justify-center rounded-full h-[30px] w-[30px] shadow-md bg-white">
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
