import React, { useState, useEffect, useContext } from "react";
import { GlobalInfo } from "../../../../App";
import { useParams } from "react-router-dom";
import { MdOutlineAccountCircle } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { MdRefresh } from "react-icons/md";
import axios from "axios";
import { IoSend } from "react-icons/io5";
import useAuth from "../../../../hooks/useAuth";
import moment from "moment";
import { io } from "socket.io-client";
import { IconExternalLink } from "@tabler/icons-react";

const Chat = ({ student_id, document_id }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const tokenData = useAuth();
  const { client_id, first_name, last_name } = useAuth();
  const [messages, setMessages] = useState([]);

  const [socket, setSocket] = useState(null);

  const [currentMessage, setCurrentMessage] = useState("");

  const context = useContext(GlobalInfo);

  useEffect(() => {
    const socket11 = io(context.apiEndPoint);
    setSocket(socket11);
    socket11.emit(
      "joinGroupChat",
      "indephysio" + document_id + student_id + "room"
    );

    socket11.on("message", (message) => {
      // console.log("message:", message);

      setMessages((prevMessages) => [...prevMessages, message]);
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    });

    getMessages();
  }, []);

  const getMessages = async () => {
    try {
      const response = await axios.get(
        `${context.apiEndPoint}admin/student/translations/chat/${student_id}/${document_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMessages(response.data);
      console.log(response.data);
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const newMessage = {
        translation_doc_id: document_id,
        student_id: student_id,
        client_id: client_id,
        is_student: 0,
        message: maskSensitiveInfo(currentMessage),
        is_file: 0,
        filepath: "",
        message_timestamp: Date.now().toString().slice(0, -3),
        admin_first_name: tokenData.first_name,
        admin_last_name: tokenData.last_name,
        student_first_name: null,
        student_last_name: null
      };

      socket.emit("messageToGroupChat", {
        roomName: "indephysio" + document_id + student_id + "room",
        message: newMessage
      });

      //   const response = await axios.post(
      //     `${context.apiEndPoint}admin/student/translations/chat`,
      //     {
      //       message: currentMessage,
      //       student_id: student_id,
      //       document_id: document_id,
      //       is_student: 0
      //     },
      //     {
      //       headers: {
      //         Authorization: `Bearer ${token}`
      //       }
      //     }
      //   );
      //   console.log("====================================");
      //   console.log(response.data);
      //   console.log("====================================");
      setCurrentMessage("");
      scrollToBottom();
    } catch (error) {
      console.log(error);
    }
  };

  function maskSensitiveInfo(text) {
    // Regular expression for URLs
    const urlPattern = /https?:\/\/[^\s]+/gi;

    // Regular expression for email addresses
    const emailPattern =
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi;

    // Regular expression for phone numbers (generic pattern)
    const phonePattern = /\b\d{8,15}\b/g; // Adjust this pattern based on specific phone number formats

    // Replace URLs, emails, and phone numbers with ********
    return text
      .replace(urlPattern, "********")
      .replace(emailPattern, "********")
      .replace(phonePattern, "********");
  }

  const scrollToBottom = () => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight + 400;
    }
  };

  return (
    <div className="border border-gray-300 rounded-md p-4 h-full flex flex-col gap-4">
      <div
        className="flex flex-col gap-2 overflow-y-auto max-h-[35rem] scrollbar-hide"
        id="chat-container"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-md ${
              message.is_request_order == 1 ? "bg-sky-200 !text-black" : ""
            } ${
              message.is_student === 0 && message.client_id === client_id
                ? "bg-cyan-600 text-white self-end max-w-[80%]"
                : "bg-gray-200 self-start max-w-[80%]"
            }`}
          >
            {message.is_file === 0 ? (
              <div
                className={`flex flex-col gap-2 `}
              >
                <p
                  className={`${
                    message.is_student === 0 ? "" : "text-black"
                  }`}
                >
                  <strong>
                    {message.client_id == client_id && message.is_student === 0
                      ? ""
                      : message.is_student === 0
                      ? `${message.admin_first_name} ${message.admin_last_name} :`
                      : `${message.student_first_name} ${message.student_last_name} :`}
                  </strong>
                  {message.message}
                </p>
                <span
                  className={`text-xs ${
                    message.is_request_order == 1 ? "!text-black" : ""
                  } ${
                    message.client_id == client_id && message.is_student === 0
                      ? "text-slate-300"
                      : "text-gray-500"
                  }`}
                >
                  {moment(parseInt(message.message_timestamp) * 1000).format(
                    "hh:mm:ss a , DD MMM, YYYY"
                  )}
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="p-2 rounded-md">
                  <p className={message.is_student === 0 ? "" : "text-black"}>
                    <strong>
                      {message.client_id == client_id &&
                      message.is_student === 0
                        ? ""
                        : message.is_student === 0
                        ? `${message.admin_first_name} ${message.admin_last_name} :`
                        : `${message.student_first_name} ${message.student_last_name} :`}
                    </strong>

                    {message.message}
                  </p>

                  <div
                    className="text-xs mt-2 text-white flex items-center justify-center gap-1 bg-teal-500 p-2 rounded-md cursor-pointer"
                    onClick={() => {
                      window.open(
                        context.filesServerUrl + message.filepath,
                        "_blank"
                      );
                    }}
                  >
                    <IconExternalLink size={16} />
                    Open
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <span className="text-xs ">
                      {moment(
                        parseInt(message.message_timestamp) * 1000
                      ).format("hh:mm:ss a , DD MMM, YYYY")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-center gap-2">
        <input
          type="text"
          className="w-full text-black border border-gray-300 rounded-md p-2"
          placeholder="Type your message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <button
          disabled={currentMessage.length === 0}
          className="bg-blue-600 text-white p-2 rounded-md disabled:opacity-50"
          onClick={handleSendMessage}
        >
          <IoSend size={24} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
