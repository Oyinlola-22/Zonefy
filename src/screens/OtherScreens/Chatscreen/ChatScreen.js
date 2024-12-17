import React, { useState, useEffect, useRef } from "react";
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
  UpdateMessages,
} from "../../../Features/zonefySlice";

function ChatScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const { userData, messages } = useAppSelector(selectZonefy);
  const messageEndRef = useRef(null);

  const ownerName = location.state?.ownerName;
  const receiverEmails = location.state?.receiverEmail;
  const propertyId = location.state?.propertyId;
  const userEmail = location.state?.senderEmail; // userData.email;
  const userId = userData?.id;
  const messageId = messages?.id;

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

  useEffect(() => {
    // Fetch all messages when the component loads or pageNumber changes
    const fetchData = () => {
      dispatch(
        GetAllMessagesByIdentifier({
          sender: encodeURIComponent(userEmail),
          receiver: encodeURIComponent(receiverEmails),
          propertyId,
          pageNumber,
        })
      );
    };

    fetchData();

    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, [dispatch, userEmail, receiverEmails, propertyId, pageNumber]);

  useEffect(() => {
    const fetchData = () => {
      if (location.state?.fromPropertyScreen) {
        dispatch(
          GetAllMessagesByIdentifier({
            sender: encodeURIComponent(receiverEmails),
            receiver: encodeURIComponent(userEmail),
            propertyId,
            pageNumber,
          })
        );
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, [
    dispatch,
    location.state,
    userEmail,
    receiverEmails,
    propertyId,
    pageNumber,
  ]);

  useEffect(() => {
    // Scroll to the latest message when the component loads
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Update isRead if the user is the receiverId
    if (userData?.id === location.state?.receiverId) {
      const unreadMessages = messages?.data?.filter(
        (msg) => !msg.isRead && msg.receiverId === userData.id
      );

      if (unreadMessages?.length > 0) {
        // Optimistically update Redux state with updated messages
        dispatch(
          setMessages({
            data: messages.data.map((msg) =>
              unreadMessages.find((um) => um.id === msg.id)
                ? { ...msg, isRead: true }
                : msg
            ),
          })
        );

        // Trigger the backend update by re-fetching messages to persist the changes
        dispatch(
          GetAllMessagesByIdentifier({
            sender: encodeURIComponent(userEmail),
            receiver: encodeURIComponent(receiverEmails),
            propertyId,
            pageNumber,
          })
        );
      }
    }
  }, [
    dispatch,
    userData,
    messages,
    userEmail,
    receiverEmails,
    propertyId,
    pageNumber,
    location.state,
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Define messageData based on navigation state
      const messageData = location.state?.fromPropertyScreen
        ? {
            propertyId,
            senderEmail: receiverEmails,
            receiverEmail: userEmail,
            content: message,
          }
        : {
            propertyId,
            senderEmail: userData.email,
            receiverEmail: receiverEmails,
            content: message,
          };

      // Temporary new message for optimistic update
      const newMessage = {
        id: crypto.randomUUID(), // Temporary ID until backend confirms
        senderId: userId,
        content: message,
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      // Update the Redux state with the new message
      dispatch(
        setMessages({
          data: [...(messages?.data || []), newMessage], // Fallback to empty array if messages.data is null/undefined
        })
      );

      // Send the message to the server with the constructed messageData
      dispatch(SendMessage(messageData));

      // Clear the input field
      setMessage("");
    }
  };

  const sortedMessages = messages?.data
    ? [...messages.data].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      )
    : [];

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

  return (
    <div className="chat-screen" onScroll={handleMessageSeen}>
      <div className="chat-header">
        <ArrowLeft
          onClick={() => navigate(-1)}
          size={30}
          className="back-button"
        />
        <p className="chat-title">{`Chat with ${ownerName}`}</p>
      </div>

      <div className="chat-messages">
        {sortedMessages.length > 0 ? (
          sortedMessages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${
                msg.senderId === userData.id ? "sent" : "received"
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
                        msg.isRead ? "double-tick" : "double-ticks"
                      }`}
                    >
                      {msg.isRead ? "✔✔" : "✔"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-messages">
            No messages yet. Start the conversation!
          </p>
        )}
        <div ref={messageEndRef} />
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
