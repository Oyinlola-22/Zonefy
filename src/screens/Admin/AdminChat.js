import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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

function AdminChat() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedChat, setSelectedChat] = useState(null);
  const { userData, interestedMessage, messages, isLoading } =
    useAppSelector(selectZonefy);
  const [message, setMessage] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const messageEndRef = useRef(null);

  const userId = userData?.id;
  const userEmail = "adeyemi.adenipekun@outlook.com";

  const isOwner =
    "adeyemi.adenipekun@outlook.com" === interestedMessage?.creatorEmail;

  const isOwners = "adeyemi.adenipekun@outlook.com" === selectedChat?.userEmail;

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
    const fetchPropertyStats = async () => {
      dispatch(
        GetPropertyStatisticsByEmail({
          email: "adeyemi.adenipekun@outlook.com",
          pageNumber,
        })
      );
    };

    if ("adeyemi.adenipekun@outlook.com") fetchPropertyStats();
  }, [dispatch, userData?.email, pageNumber]);

  useEffect(() => {
    if (selectedChat) {
      const fetchData = async () => {
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
      };

      fetchData();
    }
  }, [dispatch, selectedChat, userEmail, pageNumber]);

  const getReceiverEmail = (isOwners, selectedChat) => {
    return isOwners ? selectedChat?.creatorEmail : selectedChat?.userEmail;
  };

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
        propertyId: "00000000-0000-0000-0000-000000000000",
        senderEmail: "adeyemi.adenipekun@outlook.com",
        receiverEmail: getReceiverEmail(isOwners, selectedChat),
        content: message,
      };

      console.log("Sending message:", messageData);

      dispatch(SendMessage(messageData));
      setMessage("");
    }
  };

  useEffect(() => {
    if (messages?.data) {
      messageEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [messages]);

  const groupedChats = interestedMessage?.data
    ? interestedMessage.data.reduce((acc, chat) => {
        const key = `${chat.propertyId}-${chat.userEmail}`; // Unique combination
        if (!acc.has(key)) {
          acc.set(key, chat); // Add to Map if not already present
        }
        return acc;
      }, new Map())
    : [];

  // Convert Map values to an array for rendering
  const uniqueChats = Array.from(groupedChats.values());

  const adminEmail = "adeyemi.adenipekun@outlook.com";

  // Filter Admin Chats
  const adminChats = uniqueChats.filter(
    (chat) => chat.userEmail === adminEmail
  );

  const uniqueMessages = messages?.data
    ? Array.from(new Map(messages?.data?.map((msg) => [msg.id, msg])).values())
    : [];

  return (
    <div className="messages-container">
      {!selectedChat ? (
        // Chat List View
        <div className="chat-list-view">
          <div className="headers">
            <button className="back-buttons" onClick={() => navigate(-1)}>
              Back
            </button>
            <h3>Chats</h3>
          </div>
          {isLoading ? (
            <div className="spinner">
              <div className="loading-spinner"></div>
              <p>Loading chats...</p>
            </div>
          ) : (
            <div className="chat-list">
              {adminChats.map((chat, index) => (
                <div
                  key={`${chat.propertyId}-${chat.userEmail}-${index}`}
                  className="chat-item"
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="chat-info">
                    <div className="chat-name">{chat.propertyName}</div>
                    <div className="chat-email">
                      {adminEmail === chat.creatorEmail
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
          )}
        </div>
      ) : (
        // Chat Conversation View
        <div className="chat-conversation-view">
          <div className="chat-header">
            <button
              className="back-button"
              onClick={() => {
                setSelectedChat(null);
                dispatch(setMessages({ data: [] }));
              }}
            >
              Back
            </button>
            <h4>
              {selectedChat.propertyName} -{" "}
              {adminEmail === selectedChat.creatorEmail
                ? selectedChat.userEmail
                : selectedChat.creatorEmail}
            </h4>
          </div>

          {isLoading ? (
            <div className="spinner">
              <div className="loading-spinner"></div>
              <p>Loading messages...</p>
            </div>
          ) : (
            <div className="messages">
              {uniqueMessages.map((msg) => (
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
                            msg.isRead ? "double-tick" : "double-ticks"
                          }`}
                        >
                          {msg.isRead ? "✔✔" : "✔"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
          )}
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

export default AdminChat;
