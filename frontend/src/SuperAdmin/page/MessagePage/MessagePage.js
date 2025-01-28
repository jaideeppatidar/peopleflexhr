import React, { useState } from "react";
import { FaSearch, FaPaperPlane ,FaDownload } from "react-icons/fa";
import "./MessageContainer.css";

const MessageContainer = () => {
  const contacts = [
    {
      id: 1,
      name: "Jennifer Fritz",
      lastMessage: "I'm looking ",
      time: "3:15 PM",
      profileImage: "/assets/images/profile.jpg",
      isActive: true,
      messages: [
        {
          sender: "Jennifer Fritz",
          text: "Your story continues on mobile...",
          time: "3:15 PM",
        },
        {
          sender: "Me",
          text: "I've always been on the fringe of people...",
          time: "3:18 PM",
        },
        {
          sender: "Jennifer Fritz",
          text: "Can you send the file of Losra United Group?",
          time: "3:21 PM",
        },
        {
          sender: "Me",
          text: "Yeah, sure. Here it is.",
          time: "3:25 PM",
          attachment: "Losra United logo.AI",
        },
      ],
    },
    {
      id: 2,
      name: "Laney Gray",
      lastMessage: "Individuals and interactions over...",
      time: "5:15 PM",
      profileImage: "/assets/images/profile.jpg",
      isActive: false,
      messages: [
        { sender: "Laney Gray", text: "Hello there!", time: "5:00 PM" },
        { sender: "Me", text: "Hi, how can I help you?", time: "5:10 PM" },
      ],
    },
    {
      id: 3,
      name: "Oscar Thomsen",
      lastMessage: "Responding",
      time: "11:15 PM",
      profileImage: "/assets/images/profile.jpg",
      isActive: true,
      messages: [
        {
          sender: "Oscar Thomsen",
          text: "Thank you for your help!",
          time: "11:00 PM",
        },
      ],
    },
  ];

  const [selectedChat, setSelectedChat] = useState(contacts[0]);

  const handleChatSelection = (contact) => {
    setSelectedChat(contact);
  };

  return (
    <div className="app-container">
      {/* Left Sidebar - Chat List */}
      <div className="chat-list">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
        <div className="contacts">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`contact ${
                selectedChat.id === contact.id ? "active" : ""
              }`}
              onClick={() => handleChatSelection(contact)}
            >
              <div className="profile-container">
                <img
                  src={contact.profileImage}
                  alt={contact.name}
                  className="contact-profile-pic"
                />
                {contact.isActive && <span className="active-indicator"></span>}
              </div>
              <div className="contact-infos">
                <div className="Information">
                  <div className="contact-name">{contact.name}</div>
                </div>
                <div>
                  <div className="last-message">{contact.lastMessage}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat Window */}
      <div className="chat-window">
        <div className="chat-headers">
          <div className="contact-info">
            <div className="profile-container">
              <img
                src={selectedChat.profileImage}
                alt="profile"
                className="profile-pic"
              />
              {selectedChat.isActive && (
                <div className="active-indicator"></div>
              )}
            </div>
            <div>
              <div className="contact-name">{selectedChat.name}</div>
              <div className="status">Active Now</div>
            </div>
          </div>
        </div>

        <div className="messages">
          {selectedChat.messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.sender === "Me" ? "sent" : "received"
              }`}
            >
              <p>{message.text}</p>
              {message.attachment && (
                <div className="attachment">
                  <span>{message.attachment}</span>
                  <button><FaDownload/></button>
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
    </div>
  );
};

export default MessageContainer;
