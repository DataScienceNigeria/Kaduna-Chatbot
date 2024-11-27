// import { useProvider } from "../components/context";

class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    // const { setTyping } = useProvider();

    // console.log(message);
    // console.log("states", this.actionProvider.stateRef);
    if (this.actionProvider.stateRef.name) {
      this.actionProvider.handleAMA(message);
    } else {
      this.actionProvider.addNameToState(message);
      this.actionProvider.handleTyping(false);
      this.actionProvider.loginForm();
    }
  }
}

export default MessageParser;
