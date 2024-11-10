import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./messages.css";

function Messages() {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const goBack = () => {
    navigate(-1);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const userTimeStamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: message, time: userTimeStamp },
      ]);

      setMessage("");

      // Simulate owner's response after a short delay
      setTimeout(() => {
        const ownerTimeStamp = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "owner",
            text: "Thank you for reaching out!",
            time: ownerTimeStamp,
          },
        ]);
      }, 1000);
    }
  };

  const chatList = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alex Brown" },
    // Add more chat data here
  ];

  return (
    <div className="bodys">
      <div className="fixeds-header">
        <div className="right-section">
          <span className="text1" onClick={goBack}>
            <Link style={{ color: "white" }}>Back</Link>
          </span>
        </div>
      </div>

      <div className="mains-content">
        <div className="chat-list">
          {chatList.map((chat) => (
            <div
              key={chat.id}
              className="chat-item"
              onClick={() => setSelectedChat(chat)}
            >
              <div className="chat-name">{chat.name}</div>
              {/* <div className="chat-preview">{chat.lastMessage}</div> */}
            </div>
          ))}
        </div>

        <div className="chat-conversation">
          {selectedChat ? (
            <>
              <div className="chat-header">{selectedChat.name}</div>
              <div className="messages">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${
                      msg.sender === "user" ? "sent" : "received"
                    }`}
                  >
                    <span className="message-text">{msg.text}</span>
                    <span className="message-time">{msg.time}</span>
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
            </>
          ) : (
            <div className="no-chat-selected">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
