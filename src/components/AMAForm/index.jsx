import React, { useState } from "react";
import { Button } from "@mui/material";

export default function AMAForm(props) {
  const [inputValue, setInputValue] = useState("");
  const [show, setShow] = useState(true);
  const [down, setDown] = useState(true);

  // Handle input changes
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Handle sending messages
  const handleSend = async (question) => {
    // Prevent sending if "stop" or "end" is typed
    const sanitizedInput = question.trim().toLowerCase();
    if (sanitizedInput === "stop" || sanitizedInput === "end") {
      console.log("Action stopped. No request sent.");
      return;
    }

    // Proceed to send a request if input is valid
    if (sanitizedInput) {
      console.log("Asking question: ", question);

      setDown(true);
      props.actionProvider.handleAMA(question);
      // Reset the input and hide the form
      setInputValue("");
      setShow(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend(inputValue);
    }
  };

  return (
    <>
      {show ? (
        <div
          style={{
            width: 300,
            marginLeft: "9.2%",
            marginTop: `${down ? "20px" : "-50px"}`,
            padding: "5px  20px 20px ",
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0px",
            }}
          >
            {" "}
            <p
              style={{
                fontSize: 16,
                fontWeight: 500,
                textAlign: "left",
                padding: "10px 0 0",
                color: "#3a3b3d",
              }}
            >
              Ask A Question
            </p>
            <Button
              variant="contained"
              style={{
                background: "#e6237e",
                fontWeight: 600,
                marginTop: "10px",
                flexBasis: "22%",
                marginRight: "10px",
                fontSize: "13px",
                width: "50%",
              }}
              onClick={() => {
                setShow(false);
                props.actionProvider.showButtons();
              }}
            >
              Menu
            </Button>
          </div>

          <div
            style={{
              padding: "2px 4px 0",
              display: "flex",
              alignItems: "center",
              border: "2px solid #e6237e",
              borderRadius: "5px",
            }}
          >
            <textarea
              className="textarea"
              style={{
                borderWidth: 0,
                borderColor: "#fff",
                outline: 0,
                width: "100%",
                height: "100px",
              }}
              placeholder="Ask me anything"
              value={inputValue} // Bind the input value to state
              onChange={handleInputChange} // Handle input change
              onKeyPress={handleKeyPress} // Handle Enter key press
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "left",
            }}
          >
            <Button
              variant="contained"
              style={{
                background: "#e6237e",
                fontWeight: 600,
                marginTop: "10px",
                flexBasis: "22%",
                marginRight: "10px",
                width: "50%",
              }}
              onClick={() => handleSend(inputValue)}
            >
              Send
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
