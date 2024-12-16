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
  const propertyId = location.state?.propertyId;
  const userEmail = location.state?.senderEmail; // userData.email;
  const userId = userData?.id;

  // const userEmails = userData?.email === userEmail;

  useEffect(() => {
    // Fetch all messages when the component loads or pageNumber changes
    dispatch(
      GetAllMessagesByIdentifier({
        sender: encodeURIComponent(userEmail),
        receiver: encodeURIComponent(receiverEmails),
        propertyId,
        pageNumber,
      })
    );
  }, [dispatch, userEmail, receiverEmails, propertyId, pageNumber]);

  useEffect(() => {
    if (location.state?.fromPropertyScreen) {
      // Logic when navigated from the property screen
      dispatch(
        GetAllMessagesByIdentifier({
          sender: encodeURIComponent(receiverEmails),
          receiver: encodeURIComponent(userEmail),
          propertyId,
          pageNumber,
        })
      );
    }
  }, [
    dispatch,
    location.state,
    userEmail,
    receiverEmails,
    propertyId,
    pageNumber,
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
        {sortedMessages.length > 0 ? (
          sortedMessages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${
                msg.senderId === userData.id ? "sent" : "received"
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
          ))
        ) : (
          <p className="no-messages">
            No messages yet. Start the conversation!
          </p>
        )}
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
