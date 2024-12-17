import React, { useState, useEffect, useRef } from "react";
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
  UpdateMessages,
} from "../../Features/zonefySlice";

function Messages() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedChat, setSelectedChat] = useState(null); // Tracks the selected chat
  const { userData, interestedMessage, messages } =
    useAppSelector(selectZonefy);
  const [message, setMessage] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const messageEndRef = useRef(null);

  const userId = userData?.id;
  const userEmail = userData?.email;

  const isOwner = userData?.email === interestedMessage?.creatorEmail;

  useEffect(() => {
    // Scroll to the latest message when the component loads
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (userId && messages?.data?.length > 0) {
      const unreadMessageIds = messages.data
        .filter((msg) => !msg.isRead && msg.receiverId === userId)
        .map((msg) => msg.id);

      unreadMessageIds.forEach((msgId) => {
        dispatch(UpdateMessages({ userId, messageId: msgId }));
      });
    }
  }, [dispatch, userId, messages]);

  const handleMessageSeen = () => {
    const unreadMessages = messages?.data?.filter(
      (msg) => !msg.isRead && msg.receiverId === userData.id
    );

    if (unreadMessages?.length > 0) {
      // Update Redux state to mark messages as read
      dispatch(
        setMessages({
          data: messages.data.map((msg) =>
            unreadMessages.find((um) => um.id === msg.id)
              ? { ...msg, isRead: true }
              : msg
          ),
        })
      );

      // Call UpdateMessages for each unread message
      unreadMessages.forEach((msg) => {
        dispatch(UpdateMessages({ userId: userData.id, messageId: msg.id }));
      });
    }
  };

  useEffect(() => {
    dispatch(
      GetPropertyStatisticsByEmail({
        email: userData?.email,
        pageNumber,
      })
    );
  }, [dispatch, pageNumber]);

  useEffect(() => {
    const fetchData = () => {
      if (selectedChat) {
        dispatch(
          GetAllMessagesByIdentifier({
            sender: encodeURIComponent(
              isOwner ? userEmail : selectedChat.creatorEmail
            ),
            receiver: encodeURIComponent(
              isOwner ? selectedChat.creatorEmail : selectedChat.userEmail
            ),
            propertyId: selectedChat.propertyId,
            pageNumber,
          })
        );
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
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
        receiverEmail: selectedChat.userEmail,
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
                key={chat.propertyId}
                className="chat-item"
                onClick={() => setSelectedChat(chat)}
              >
                <div className="chat-info">
                  <div className="chat-name">{chat.propertyName}</div>
                  <div className="chat-email">
                    {userData?.email === chat.creatorEmail
                      ? chat.userEmail
                      : chat.creatorEmail}
                  </div>
                </div>
                <div className="chat-timestamp">
                  Last updated: {new Date(chat.updatedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Chat Conversation View
        <div className="chat-conversation-view" onScroll={handleMessageSeen}>
          <div className="chat-header">
            <button
              className="back-button"
              onClick={() => setSelectedChat(null)}
            >
              Back
            </button>
            <h2>
              {selectedChat.propertyName} -{" "}
              {userData?.email === selectedChat.creatorEmail
                ? selectedChat.userEmail
                : selectedChat.creatorEmail}
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
                <div className="message-footer">
                  <div className="message-info">
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {msg.senderId === userData.id && (
                      <span
                        className={`message-ticks ${
                          msg.isRead ? "double-tick green" : "double-tick grey"
                        }`}
                      >
                        {msg.isRead ? "✔✔" : "✔"}
                      </span>
                    )}
                  </div>
                </div>
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
