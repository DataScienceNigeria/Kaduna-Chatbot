import "./App.css";
import config from "./chatbot/config";
import ActionProvider from "./chatbot/ActionProvider";
import MessageParser from "./chatbot/MessageParser";
import Chatbot from "react-chatbot-kit";
import React from "react";
import { Provider } from "./components/context";

function App() {
  return (
    <Provider>
      <div className="header">
        <h1 className="mh_space">GeoST4R Chatbot</h1>
        <span style={{ color: "rgb(149, 150, 147)", fontSize: "15px" }}>
          RMNCHN on-the-go field assistant
        </span>
      </div>

      <div className="App">
        <Chatbot
          config={config}
          actionProvider={ActionProvider}
          messageParser={MessageParser}
        />
      </div>
    </Provider>
  );
}

export default App;
