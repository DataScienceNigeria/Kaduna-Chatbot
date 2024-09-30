import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useProvider } from "../context";

const Buttons = (props) => {
  const [show, setShow] = useState(true);

  const lastButtonRef = useRef(null);

  useEffect(() => {
    if (lastButtonRef.current) {
      lastButtonRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [lastButtonRef]);

  const { step, setStep } = useProvider(); // Track the current step
  const handleSend = (name) => {
    console.log("Sending button:", name);

    props.actionProvider.enterName(name);
    const lowerName = name.toLowerCase();

    const stepOneFunction = () => {
      console.log("Step 1 function executed");
      props.actionProvider.addStateToState(lowerName);
      handleNextStep();
    };
    const stepTwoFunction = () => {
      console.log("Step 2 function executed");
      props.actionProvider.addLgaToState(lowerName);
      handleNextStep();
    };
    const stepThreeFunction = () => {
      console.log("Step 3 function executed");
      props.actionProvider.addWardToState(lowerName);
      handleNextStep();
    };
    const stepFourFunction = () => {
      console.log("Step 4 function executed");
      props.actionProvider.showSelectState(name);
      handleNextStep();
    };
    const stepFiveFunction = () => {
      console.log("Step 5 function executed");
      props.actionProvider.addCommoditesToState(name);
      // handleNextStep();
    };
    // Handler to go to the next step
    const handleNextStep = () => {
      if (step < stepFunctions.length - 1) {
        setStep(step + 1);
        // stepFunctions[step + 1](); // Call the next step function
      }
    };

    // Define different functions for each step
    const stepFunctions = [
      stepOneFunction,
      stepTwoFunction,
      stepThreeFunction,
      stepFourFunction,
      stepFiveFunction,
      // Add more steps here
    ];

    switch (lowerName) {
      case "go back":
        const firstcommands = [
          props.actionProvider.addStateToState,
          props.actionProvider.addWardToState,
          props.actionProvider.addLgaToState,
          props.actionProvider.addCommoditesToState,
        ];
        const commands = props.actionProvider.previousCommand;
        const lastIndex = commands.length - 2;
        if (firstcommands.includes(commands[lastIndex].func)) {
          console.log("Value exists in the array");
          if (step > 0) {
            setStep(step - 1);
            stepFunctions[step - 1](); // Call the previous step function
          }
        } else {
          console.log("Value does not exist in the array");
          props.actionProvider.goBack();
        }
        break;
      case "microplan":
        props.actionProvider.showSelectState(name);
        break;
      case "chat with me":
        props.actionProvider.showButtons([
          "Select an option:",
          ["Chat with microplan", "Chat with scorecard"],
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
      case "population":
        props.actionProvider.addPopulationToState(
          props.actionProvider.stateRef.selectedSettlement
        );
        break;

      case "profile":
        props.actionProvider.addProfileToState(
          props.actionProvider.stateRef.selectedSettlement
        );
        break;

      case "commodities":
        props.actionProvider.addCommoditesToState(
          props.actionProvider.stateRef.selectedSettlement
        );
        break;

      case "family planning":
        props.actionProvider.fetchFamilyPlanningForSettlement(
          props.actionProvider.stateRef.selectedSettlement
        );
        break;

      case "immunization":
        props.actionProvider.fetchImmunizationForSettlement(
          props.actionProvider.stateRef.selectedSettlement
        );
        break;

      default:
        stepFunctions[step]();
        setShow(false);
        // props.actionProvider.handleTyping(true);
        console.log("in default");

        break;
    }

    setShow(false);
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
