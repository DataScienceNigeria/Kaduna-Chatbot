import React from "react";
import { createChatBotMessage } from "react-chatbot-kit";

import BotAvatar from "../components/botAvatar";
import CustomizedInputBase from "../components/nameInput";
import Buttons from "../components/buttons";
import Textbox from "../components/textbox";
import AMAForm from "../components/AMAForm";
import SignIn from "../components/login";
import PredictionForm from "../components/WizardForm/index.js";

const config = {
  initialMessages: [
    createChatBotMessage(`Hello. What's your name?`, { widget: "inputName" }),
  ],
  state: {
    name: "",
    selectedState: "",
    selectedLga: "",
    selectedHc: "",
    selectedSettlement: "",
    buttons: [],
    previousCommand: [],
    counter: 0,
    goBack: false,
    table: "",
  },

  widgets: [
    {
      widgetName: "inputName",
      widgetFunc: (props) => <CustomizedInputBase {...props} />,
    },
    {
      widgetName: "signInForm",
      widgetFunc: (props) => <SignIn {...props} />,
    },
    {
      widgetName: "ModellingForm",
      widgetFunc: (props) => <PredictionForm {...props} />,
    },
    {
      widgetName: "AMAForm",
      widgetFunc: (props) => <AMAForm {...props} />,
    },
    {
      widgetName: "buttons",
      widgetFunc: (props) => <Buttons {...props} title="CHOOSE AN OPTION" />,
    },
    {
      widgetName: "textbox",
      widgetFunc: (props) => <Textbox {...props} />,
      mapStateToProps: ["messages"],
    },
  ],
  customComponents: {
    botAvatar: (props) => <BotAvatar {...props} />,
    userAvatar: (props) => <></>,
  },
};

export default config;
