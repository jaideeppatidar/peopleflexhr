import React from "react";
import { FaPaperPlane } from "react-icons/fa";

const messages = [
  { sender: "Jennifer Fritz", text: "Your story continues on mobile...", time: "3:15 PM" },
  { sender: "Me", text: "I've always been on the fringe of people...", time: "3:18 PM" },
  { sender: "Jennifer Fritz", text: "Can you send the file of Losra United Group?", time: "3:21 PM" },
  { sender: "Me", text: "Yeah, sure. Here it is.", time: "3:25 PM", attachment: "Losra United logo.AI" },
];

const ChatWindow = () => {
  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="contact-info">
          <img src="assets/images/profile.jpg" alt="profile" className="profile-pic" />
          <div>
            <span className="contact-name">Jennifer Fritz</span>
            <span className="status">Active Now</span>
          </div>
        </div>
      </div>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender === "Me" ? "sent" : "received"}`}>
            <p>{message.text}</p>
            {message.attachment && (
              <div className="attachment">
                <span>{message.attachment}</span>
                <button>Download</button>
              </div>
            )}
            <span className="time">{message.time}</span>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input type="text" placeholder="Type a message..." />
        <button className="send-button">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
