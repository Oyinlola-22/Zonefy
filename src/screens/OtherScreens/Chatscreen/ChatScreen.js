import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import "./chatscreen.css";
import {
  useAppDispatch,
  useAppSelector,
  selectZonefy,
} from "../../../Store/store";
import {
  SendMessage,
  GetAllMessagesByIdentifier,
  setMessages,
} from "../../../Features/zonefySlice";

function ChatScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const { userData, messages } = useAppSelector(selectZonefy);

  const ownerName = location.state?.ownerName;
  const receiverEmails = location.state?.receiverEmail;
  const propertyIds = location.state?.propertyId;
  const userEmail = userData.email;
  const userId = userData?.id;

  useEffect(() => {
    // Fetch all messages when component loads or when pagination changes
    dispatch(
      GetAllMessagesByIdentifier({
        sender: encodeURIComponent(userEmail),
        receiver: encodeURIComponent(receiverEmails),
        propertyId: propertyIds,
        pageNumber,
      })
    );
  }, [dispatch, userEmail, receiverEmails, pageNumber]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const timeStamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Add user's message
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: userEmail, content: message, time: timeStamp },
      ]);

      const messageData = {
        propertyId: propertyIds,
        senderEmail: userEmail,
        receiverEmail: receiverEmails,
        content: message,
      };

      dispatch(SendMessage(messageData));
      setMessage("");
    }
  };

  // console.log("messages: ", messages?.data);

  return (
    <div className="chat-screen">
      <div className="chat-header">
        <ArrowLeft
          onClick={() => navigate(-1)}
          size={30}
          className="back-button"
        />
        <p className="chat-title">{`Chat with ${ownerName}`}</p>
      </div>

      <div className="chat-messages">
        {Array.isArray(messages?.data) &&
          messages?.data.map((msg) => (
            <div
              key={msg.chatIdentifier}
              className={`message ${
                msg.senderId === userId ? "user-message" : "owner-message"
              }`}
            >
              <p>{msg.content}</p>
              <span className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatScreen;
