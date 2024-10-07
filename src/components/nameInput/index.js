import React, { useEffect, useState } from "react";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";

export default function CustomizedInputBase(props) {
  const [conversationId, setConversationId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [show, setShow] = useState(true);

  // Handle input changes
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Handle sending messages
  const handleSend = () => {
    if (inputValue.trim()) {
      console.log("Sending message:", inputValue);
      props.actionProvider.addNameToState(inputValue);
      props.actionProvider.loginForm();
      setInputValue("");
      setShow(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  // Function to push messages to the server
  const pushMessagesToServer = async (messagesToPush) => {
    console.log("messagesToPush : ", messagesToPush);
    try {
      const response = await fetch(
        "https://api-utility-02885d450e64.herokuapp.com/history/interact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: conversationId,
            messages: messagesToPush,
          }),
        }
      );
      const data = await response.json();
      console.log("Messages pushed to server:", data);
    } catch (error) {
      console.error("Error pushing messages:", error);
    }
  };

  // On component mount, retrieve or create a unique conversation ID
  useEffect(() => {
    const savedConversationId = localStorage.getItem("conversationId");
    if (savedConversationId) {
      setConversationId(savedConversationId);
    } else {
      const newConversationId = Math.round(Date.now() * Math.random());
      setConversationId(newConversationId);
      localStorage.setItem("conversationId", newConversationId);
    }
  }, []);
  useEffect(() => {
    const chatInputContainer = document.querySelector(
      ".react-chatbot-kit-chat-input-container"
    );

    if (chatInputContainer) {
      chatInputContainer.style.display =  "none";
    }
  }, []);

  // Periodically push messages to the server every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = props.actionProvider.stateRef.messages;
      if (messages.length > 0) {
        pushMessagesToServer(messages);
      }
    }, 60000); // Every 1 minute

    // Clean up the interval on unmount
    return () => clearInterval(interval);
  }, [props.actionProvider.stateRef.messages, conversationId]);

  return (
    <>
      {show ? (
        <div
          style={{
            width: 300,
            marginLeft: "6.2%",
            marginTop: "10px",
            padding: "20px  20px 0 ",
            background: "#fff",
          }}
        >
          <div
            style={{
              padding: "2px 4px 0",
              display: "flex",
              alignItems: "center",
              border: "2px solid #e6237e",
              borderRadius: "5px",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Enter your name"
              inputProps={{ "aria-label": "Enter your name" }}
              value={inputValue} // Bind the input value to state
              onChange={handleInputChange} // Handle input change
              onKeyPress={handleKeyPress} // Handle Enter key press
            />
            <IconButton
              type="button"
              sx={{ p: "10px" }}
              aria-label="send"
              onClick={handleSend} // Handle send button click
            >
              <SendIcon />
            </IconButton>
          </div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              textAlign: "left",
              padding: "10px 0 ",
              color: "#3a3b3d",
            }}
          >
            Press enter to send
          </p>
        </div>
      ) : null}
    </>
  );
}
