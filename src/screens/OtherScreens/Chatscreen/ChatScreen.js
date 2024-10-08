import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import "./chatscreen.css";

function ChatScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const ownerName = location.state?.ownerName || "Owner";

  // Preload some messages to simulate chat between user and owner
  useEffect(() => {
    const initialMessages = [
      {
        sender: "owner",
        text: "Hello! How can I assist you today?",
        time: "10:00 AM",
      },
      {
        sender: "user",
        text: "Hi, I'm interested in the property listed.",
        time: "10:05 AM",
      },
      {
        sender: "owner",
        text: "Great! Do you have any specific questions?",
        time: "10:06 AM",
      },
    ];
    setMessages(initialMessages);
  }, []);

  // Handle sending messages
  const handleSendMessage = () => {
    if (message.trim()) {
      const timeStamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: message, time: timeStamp },
      ]);
      setMessage("");

      // Simulate owner's response after a short delay
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "owner",
            text: "Thank you for reaching out!",
            time: timeStamp,
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="chat-screen">
      {/* Header */}
      <div className="chat-header">
        <ArrowLeft
          onClick={() => navigate(-1)}
          size={30}
          className="back-button"
        />
        <p className="chat-title">{`Chat with ${ownerName}`}</p>
      </div>

      {/* Chat messages */}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === "user" ? "user-message" : "owner-message"
            }`}
          >
            <p>{msg.text}</p>
            <span className="message-time">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Message input */}
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
