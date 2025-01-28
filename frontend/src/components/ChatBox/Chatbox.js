import React, { useState, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import IconMapper from "../IconMapper/IconMapper";
import {
  ChatSendMessage,
  fetchGreetMessage,
} from "../../Employee/EmpApiServices";
import "./chatbox.css";
import { useSelector } from "react-redux";
const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { employeeId } = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (isOpen) {
      const loadGreetMessage = async () => {
        try {
          const greetMessage = await fetchGreetMessage();
          const newMessages = greetMessage.map((item) => ({
            text: item.message,
            sender: "bot",
          }));

          setMessages((prevMessages) => [...prevMessages, ...newMessages]);
        } catch (error) {
          console.error("Error fetching greet message:", error);
        }
      };

      loadGreetMessage();
    }
  }, [isOpen]);

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: newMessage, sender: "user" },
    ]);

    try {
      const botResponse = await ChatSendMessage(employeeId, newMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse.message, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setNewMessage("");
  };

  return (
    <div className="chat-box">
      <IconMapper
        iconName="Query"
        onClick={toggleChatBox}
        className="IconQuery"
      />
      {isOpen && (
        <div className="chatbox_Model">
          <Box className="chat-box-popup show">
            <Box className="chat-header">
              <h4>Chat Support</h4>
              <IconMapper
                iconName={"close"}
                isFontAwesome="true"
                onClick={toggleChatBox}
              />
            </Box>

            <Box className="chat-messages">
              {Array.isArray(messages) && messages.length > 0 ? (
                messages.map((message, index) => (
                  <Box key={index} className={`chat-message ${message.sender}`}>
                    {message.text}
                  </Box>
                ))
              ) : (
                <Box>No messages yet...</Box>
              )}
            </Box>

            <Box className="chat-input">
              <TextField
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="What's on your mind?"
                fullWidth
                variant="outlined"
                className="chat-textfield"
                sx={{
                  ".MuiOutlinedInput-input": {
                    padding: "7px",
                  },
                }}
              />
              <IconMapper
                variant="contained"
                iconName={"chatIconSend"}
                onClick={handleSendMessage}
                className="send-button"
              />
            </Box>
          </Box>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
