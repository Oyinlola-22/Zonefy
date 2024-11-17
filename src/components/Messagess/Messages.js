import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./messages.css";
import {
  selectZonefy,
  useAppDispatch,
  useAppSelector,
} from "../../Store/store";
import {
  GetPropertyStatisticsByEmail,
  SendMessage,
  GetAllMessagesByIdentifier,
  setMessages,
} from "../../Features/zonefySlice";

function Messages() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedChat, setSelectedChat] = useState(null); // Tracks the selected chat
  const { userData, interestedMessage, messages } =
    useAppSelector(selectZonefy);
  const [message, setMessage] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const userId = userData?.id;
  const userEmail = userData?.email;
  const receiverEmails = interestedMessage?.data?.creatorEmail;
  const propertyIds = interestedMessage?.data?.propertyId;

  useEffect(() => {
    dispatch(
      GetPropertyStatisticsByEmail({
        email: userData?.email,
        pageNumber,
      })
    );
  }, [dispatch, pageNumber]);

  useEffect(() => {
    if (selectedChat) {
      dispatch(
        GetAllMessagesByIdentifier({
          sender: encodeURIComponent(userEmail),
          receiver: encodeURIComponent(selectedChat.userEmail),
          propertyId: selectedChat.propertyId,
          pageNumber,
        })
      );
    }
  }, [dispatch, selectedChat, userEmail, pageNumber]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const timeStamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: userData?.email, content: message, time: timeStamp },
      ]);

      const messageData = {
        propertyId: interestedMessage?.propertyId,
        senderEmail: userData?.email,
        receiverEmail: interestedMessage?.creatorEmail,
        content: message,
      };

      dispatch(SendMessage(messageData));
      setMessage("");
    }
  };

  return (
    <div className="messages-container">
      {!selectedChat ? (
        // Chat List View
        <div className="chat-list-view">
          <div className="header">
            <button className="back-buttons" onClick={() => navigate(-1)}>
              Back
            </button>
            <h2>Chats</h2>
          </div>
          <div className="chat-list">
            {interestedMessage?.data?.map((chat) => (
              <div
                key={chat.id}
                className="chat-item"
                onClick={() => setSelectedChat(chat)}
              >
                <div className="chat-name">{chat.userEmail}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Chat Conversation View
        <div className="chat-conversation-view">
          <div className="chat-header">
            <button
              className="back-button"
              onClick={() => setSelectedChat(null)}
            >
              Back
            </button>
            <h2>
              {selectedChat.userEmail} - {selectedChat.propertyName}
            </h2>
          </div>
          <div className="messages">
            {messages?.data?.map((msg) => (
              <div
                key={msg.id}
                className={`message ${
                  msg.senderId === userId ? "sent" : "received"
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
          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage} className="send-button">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
