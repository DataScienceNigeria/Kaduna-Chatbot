import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const Buttons = (props) => {
  const [show, setShow] = useState(true);
  const [counter, setCounter] = useState(props.actionProvider.stateRef.counter);

  const lastButtonRef = useRef(null);

  useEffect(() => {
    if (lastButtonRef.current) {
      lastButtonRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setCounter(props.actionProvider.stateRef.counter);
    console.log("counter on load = ", counter);
  }, [props, counter]);

  const handleSend = (name) => {
    console.log("Sending button:", name);

    props.actionProvider.enterName(name);
    const lowerName = name.toLowerCase();

    switch (lowerName) {
      case "microplan":
        props.actionProvider.showSelectState(name);
        break;
      case "chat with me":
        props.actionProvider.showButtons([
          "Chat with microplan",
          "Chat with scorecard",
        ]);
        break;
      case "settlement list":
        props.actionProvider.fetchSettlementList(
          props.actionProvider.stateRef.selectedHc
        );
        break;
      case "home birth":
        props.actionProvider.handleModelling();
        break;
      default:
        props.actionProvider.handleTyping(true);
        console.log("in default");
        // const chatInputContainer = document.querySelector(
        //   ".react-chatbot-kit-chat-input-container"
        // );
        // console.log("typing = ", props.actionProvider.stateRef.typing);
        // if (chatInputContainer) {
        //   chatInputContainer.style.display = "block";
        // }
        // props.actionProvider.AMAForm(name);

        break;
    }

    setShow(false);
    console.log("counter =", counter, " name = ", name);
  };

  return (
    <>
      {show ? (
        <div style={{ marginLeft: "10%" }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              textAlign: "left",
              padding: "10px 0 ",
              color: "#3a3b3d",
            }}
          >
            {props.title}
          </p>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {props.actionProvider.stateRef.buttons.map((name, index) => {
              const isLastButton =
                index === props.actionProvider.stateRef.buttons.length - 1;

              return (
                <Button
                  key={name}
                  variant="contained"
                  style={{
                    background: "#e6237e",
                    fontWeight: 600,
                    marginTop: "10px",
                    flexBasis: "22%",
                    marginRight: "10px",
                  }}
                  onClick={() => handleSend(name)}
                  ref={isLastButton ? lastButtonRef : null}
                >
                  {name}
                </Button>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Buttons;
