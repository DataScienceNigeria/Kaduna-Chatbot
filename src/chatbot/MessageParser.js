// import { useProvider } from "../components/context";

class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    if (this.actionProvider.stateRef.state === "computePopulation") {
      // Handle compute population logic here
      this.actionProvider.handleComputePopulation(message);
    } else if (this.actionProvider.stateRef.name) {
      this.actionProvider.handleAMA(message);
    } else {
      this.actionProvider.addNameToState(message);
      this.actionProvider.handleTyping(false);
      this.actionProvider.loginForm();
    }
  }
}

export default MessageParser;
