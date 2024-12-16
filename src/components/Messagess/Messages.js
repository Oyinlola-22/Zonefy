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

  console.log(selectedChat);

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
          receiver: encodeURIComponent(selectedChat.creatorEmail),
          propertyId: selectedChat.propertyId,
          pageNumber,
        })
      );
    }
  }, [dispatch, selectedChat, userEmail, pageNumber]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: crypto.randomUUID(), // Temporary ID until backend confirms
        senderId: userId,
        content: message,
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      dispatch(
        setMessages({
          data: [...(messages?.data || []), newMessage], // Fallback to empty array if messages.data is null/undefined
        })
      );

      const messageData = {
        propertyId: selectedChat.propertyId,
        senderEmail: userData?.email,
        receiverEmail: selectedChat.creatorEmail,
        content: message,
      };

      console.log(messageData);

      dispatch(SendMessage(messageData));
      setMessage("");
    }
  };

  // const handleSendMessage = () => {
  //   if (message.trim()) {
  //     const newMessage = {
  //       id: crypto.randomUUID(), // Temporary ID until backend confirms
  //       senderId: userId,
  //       content: message,
  //       timestamp: new Date().toISOString(),
  //       isRead: false,
  //     };

  //     // Update the Redux state with the new message
  //     dispatch(
  //       setMessages({
  //         data: [...(messages?.data || []), newMessage], // Fallback to empty array if messages.data is null/undefined
  //       })
  //     );

  //     // Send the message to the server
  //     dispatch(
  //       SendMessage({
  //         propertyId,
  //         senderEmail: receiverEmails,
  //         receiverEmail: userEmail,
  //         content: message,
  //       })
  //     );

  //     // Clear the input field
  //     setMessage("");
  //   }

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
                <div className="chat-name">{chat.creatorEmail}</div>
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
              {selectedChat.creatorEmail} - {selectedChat.propertyName}
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
