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
} from "../../Features/zonefySlice";

function Messages() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedChat, setSelectedChat] = useState(null);
  const { userData, interestedMessage } = useAppSelector(selectZonefy);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  const userId = userData?.id;
  const userEmail = userData.email;
  const receiverEmails = interestedMessage?.data.creatorEmail;
  const propertyIds = interestedMessage?.data.propertyId;
  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    // Fetch all messages when component loads or when pagination changes
    dispatch(
      GetPropertyStatisticsByEmail({
        email: userData.email,
        pageNumber,
      })
    );
  }, [dispatch, pageNumber]);

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
      if (message.trim()) {
        const timeStamp = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Add user's message
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: userData.email, content: message, time: timeStamp },
        ]);

        const messageData = {
          propertyId: interestedMessage.propertyId,
          senderEmail: userData.email,
          receiverEmail: interestedMessage.creatorEmail,
          content: message,
        };

        dispatch(SendMessage(messageData));
        setMessage("");
      }
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
          {Array.isArray(interestedMessage?.data) &&
          interestedMessage.data.map ? (
            <>
              <div className="chat-header">{interestedMessage.userEmail}</div>
              <div className="messages">
                {interestedMessage?.data.map((msg) => (
                  <div
                    key={msg.chatIdentifier}
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
