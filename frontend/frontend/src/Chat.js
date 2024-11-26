import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://j4jl6y-5000.csb.app");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState("");
  const [isUserNameSet, setIsUserNameSet] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    // Listen for messages
    socket.on("chatMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Listen for active user updates
    socket.on("activeUsers", (users) => {
      setActiveUsers(users);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("activeUsers");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chatMessage", message);
      setMessage("");
    }
  };

  const setUserNameHandler = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      socket.emit("setUserName", userName);
      setIsUserNameSet(true);
    }
  };

  return (
    <div className="chat-container">
      {!isUserNameSet ? (
        <div className="username-form">
          <h2>Enter your Username</h2>
          <form onSubmit={setUserNameHandler}>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Username"
              required
            />
            <button type="submit">Set Username</button>
          </form>
        </div>
      ) : (
        <div className="chat-wrapper">
          <div className="chat-box">
            <h1>Chat Application</h1>
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className="message">
                  <strong>{msg.user}: </strong>
                  <span>{msg.message}</span>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="message-form">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
              />
              <button type="submit">Send</button>
            </form>
          </div>
          <div className="active-users">
            <h2>Active Users</h2>
            <ul>
              {activeUsers.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
