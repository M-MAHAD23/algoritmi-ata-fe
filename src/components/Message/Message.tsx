import { faRobot, faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Markdown from "react-markdown";

export const Message = ({ role, content }) => {
  const user = 0;
  console.log("USER: ", user);
  return (
    <div
      className={`grid grid-cols-[30px_1fr] gap-5 p-5 ${role === "assistant"
        ? "bg-gray-600"
        : role === "notice"
          ? "bg-red-600"
          : ""
        }`}
    >
      <div>
        {role === "user" && !!user && (
          <img
            src={user.picture}
            width={30}
            height={30}
            alt="User avatar"
            className="rounded-sm shadow-md shadow-black/50"
          />
        )}
        {role === "assistant" && (
          <div className="flex h-[30px] w-[30px] items-center justify-center rounded-sm bg-gray-800 shadow-md shadow-black/50">
            <FontAwesomeIcon
              icon={faComments}
              className="text-white"

            />
          </div>
        )}
      </div>
      <div className="prose prose-invert text-white">
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
};
