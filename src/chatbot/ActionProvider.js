import Loader from "../components/loader";
import Textbox from "../components/textbox";
import {
  fetchLgas,
  fetchWards,
  fetchHc,
  fetchStatus,
  fetchHumanResources,
  fetchSettlement,
  fetchPopulation,
  fetchProfile,
  fetchFamilyPlanning,
  fetchHfTools,
  fetchMalaria,
  fetchImmunization,
  fetchConsumables,
  fectchCatchmentMap,
  fetchComputePopulation,
  fetchComputeImmunization,
  fetchComputeMalaria,
  answerQuestion,
  fectchWeatherInfo,
  fetchComputeFamilyPlanning,
  fetchComputeConsumables,
  fetchComputeHFTool,
} from "./api";
import React from "react";

class ActionProvider {
  constructor(
    createChatBotMessage,
    setStateFunc,
    createClientMessage,
    stateRef,
    createCustomMessage,
    ...rest
  ) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.stateRef = stateRef;
    this.createCustomMessage = createCustomMessage;
  }

  addPreviousCommandToState = (func, parameter) => {
    const prevCommands = this.stateRef.previousCommand || [];
    prevCommands.push({ func, parameter });
    this.setState((prevState) => ({
      ...prevState,
      previousCommand: prevCommands,
    }));
  };

  goBack = () => {
    const commands = this.stateRef.previousCommand || [];
    const counter = this.stateRef.counter;
    const lastIndex = commands.length - 2;
    console.log("current counter strictly before = ", this.stateRef.counter);
    // if (counter < 5) {
    //   this.setState((prevState) => ({
    //     ...prevState,
    //     counter: prevState.counter - 1,
    //     goBack: true,
    //   }));

    //   console.log("inside if current counter before = ", this.stateRef.counter);
    //   console.log("inside if current counter before = ", this.stateRef.goBack);
    // }
    console.log("current counter before = ", this.stateRef.counter);

    if (lastIndex >= 0) {
      const { func, parameter } = commands[lastIndex];
      if (func && typeof func === "function") {
        func(parameter); // Re-run the previous command with the parameter
      }

      // Remove the last command from the history
      this.setState((prevState) => {
        // const updatedCommands = prevState.previousCommand.slice(0, lastIndex);
        return {
          ...prevState,
          // previousCommand: updatedCommands,
          goBack: false,
          // counter: prevState.counter > 0 ? prevState.counter - 1 : 0,
        };
      });
      console.log("current go back = ", this.stateRef.goBack);
      console.log("current counter = ", this.stateRef.counter);
    }
  };

  showSelectState = (name) => {
    const states = ["Lagos", "Kaduna", "Kano", "Gombe"];
    const AMAdata = [
      "Microplan",
      "Ask me Anything",
      "Weather Information",
      "Go back",
    ];
    const MPdata = [
      "Status",
      "Human Resources",
      "Catchment Area Map",
      "Settlement List",
      "Go back",
    ];

    if (name === "Microplan") {
      const message = this.createChatBotMessage(
        "What will you like to know about this health facility?",
        {
          widget: "buttons",
          options: MPdata.map((item) => ({ text: item, id: item })),
        }
      );
      this.addMessageToState(message);
      this.setState((prevState) => ({
        ...prevState,
        buttons: MPdata,
      }));
      this.addPreviousCommandToState(this.showSelectState, "Microplan");
      return;
    }

    const message = this.createChatBotMessage(
      name ? "Select an option to proceed" : "Please select your state",
      {
        widget: "buttons",
        options: states.map((state) => ({ text: state, id: state })),
      }
    );
    this.addMessageToState(message);
    this.setState((prevState) => ({
      ...prevState,
      buttons: name ? AMAdata : states,
      selectedHc: name,
      counter:
        name && name.toLowerCase() !== "go back"
          ? prevState.counter + 1
          : prevState.counter,
    }));
    this.addPreviousCommandToState(this.showSelectState, name ? name : null);
  };

  loader = () => {
    console.log("in loader");
    const loadingMessage = this.createChatBotMessage(<Loader />, {
      option: { delay: 0 },
    });

    this.addMessageToState(loadingMessage);
  };

  RemoveLoader = () => {
    console.log("removing loader");
    this.setState((prevState) => {
      const updatedMessages = prevState.messages.filter(
        (msg) => typeof msg.message === "string" || msg.widget === "unknown"
      );

      return {
        ...prevState,
        messages: [...updatedMessages],
      };
    });
  };

  // showSelectState = (name) => {
  //   const states = ["Lagos", "Kaduna", "Kano", "Gombe"];
  //   const AMAdata = [
  //     "Microplan",
  //     "Ask me Anything",
  //     "Weather Information",
  //     "Go back",
  //   ];
  //   const MPdata = [
  //     "Status",
  //     "Human Resources",
  //     "Catchment Area Map",
  //     "Settlement List",
  //     "Go back",
  //   ];

  //   // If "Microplan" is selected from AMAdata, display the MPdata options
  //   if (name === "Microplan") {
  //     const message = this.createChatBotMessage(
  //       "What will you like to know about this health facility?",
  //       {
  //         widget: "buttons",
  //         options: MPdata.map((item) => ({ text: item, id: item })),
  //       }
  //     );
  //     this.addMessageToState(message);
  //     this.setState((prevState) => ({
  //       ...prevState,
  //       buttons: MPdata,
  //     }));
  //     this.addPreviousCommandToState(this.showSelectState, "Microplan");
  //     return;
  //   } else if (name === "Settlement List") {
  //     // If "Settlement List" is selected, fetch the settlement data
  //     const hcName = this.stateRef.selectedHc;
  //     if (hcName) {
  //       this.fetchSettlementList(hcName);
  //       this.addPreviousCommandToState(this.showSelectState, "Settlement List");
  //     } else {
  //       const errorMessage = this.createChatBotMessage(
  //         "Please select a health center first."
  //       );
  //       this.addMessageToState(errorMessage);
  //     }
  //   } else {
  //     const message = this.createChatBotMessage(
  //       name ? "Select an option to proceed" : "Please select your state",
  //       {
  //         widget: "buttons",
  //         options: states.map((state) => ({ text: state, id: state })),
  //       }
  //     );
  //     this.addMessageToState(message);
  //     this.setState((prevState) => ({
  //       ...prevState,
  //       buttons: name ? AMAdata : states,
  //       selectedHc: name,
  //       counter:
  //         name && name.toLowerCase() !== "go back"
  //           ? prevState.counter + 1
  //           : prevState.counter,
  //     }));
  //     this.addPreviousCommandToState(this.showSelectState, name ? name : null);
  //   }
  // };

  fetchLgasForState = async (stateName) => {
    const checkBack = this.stateRef.goBack;

    try {
      this.loader();
      const data = await fetchLgas(stateName);
      this.RemoveLoader();
      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching LGAs: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const lgaOptions = data.map((lga) => ({ text: lga, id: lga }));
        const message = this.createChatBotMessage("Please select an LGA:", {
          widget: "buttons",
          options: lgaOptions,
        });
        this.addMessageToState(message);
        this.setState((prevState) => ({
          ...prevState,
          buttons: lgaOptions.map((option) => option.text),
          counter: checkBack ? prevState.counter : prevState.counter + 1,
        }));
      }
    } catch (error) {
      console.error("Error fetching LGAs:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error fetching the LGAs. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    console.log("counter in func = ", this.stateRef.counter);
  };

  enterName = (name) => {
    const message = this.createClientMessage(name);
    this.addMessageToState(message);
  };
  
  enterChatText = (name) => {
    const message = this.createChatBotMessage(name);
    this.addMessageToState(message);
  };

  promptLogin = () => {
    const message = this.createChatBotMessage(
      "Hello Ralph, welcome to GeoST4R chatbot. \nGet all the information you need while you deliver health services in this region.\n\nPlease provide your credentials to continue."
    );
    this.addMessageToState(message);
  };

  fetchWardsForLga = async (lga_name) => {
    const checkBack = this.stateRef.goBack;

    try {
      this.loader();
      const data = await fetchWards(lga_name);
      this.RemoveLoader();
      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching wards: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const wardOptions = data.map((ward) => ({ text: ward, id: ward }));
        const message = this.createChatBotMessage("Please select a ward:", {
          widget: "buttons",
          options: wardOptions,
        });
        this.addMessageToState(message);
        this.setState((prevState) => ({
          ...prevState,
          buttons: wardOptions.map((option) => option.text),
          counter: checkBack ? prevState.counter : prevState.counter + 1,
        }));
      }
    } catch (error) {
      console.error("Error fetching wards:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error fetching the wards. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    console.log("counter in func = ", this.stateRef.counter);
  };

  fetchHcForWards = async (ward_name) => {
    const checkBack = this.stateRef.goBack;

    try {
      this.loader();
      const data = await fetchHc(ward_name);
      this.RemoveLoader();
      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching health centers: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const hcOptions = data.map((hc) => ({ text: hc, id: hc }));
        const message = this.createChatBotMessage(
          "Please select a health center:",
          {
            widget: "buttons",
            options: hcOptions,
          }
        );
        this.addMessageToState(message);
        this.setState((prevState) => ({
          ...prevState,
          buttons: hcOptions.map((option) => option.text),
          counter: checkBack ? prevState.counter : prevState.counter + 1,
        }));
      }
    } catch (error) {
      console.error("Error fetching health centers:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error fetching the health centers. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
  };

  fetchStatusForHc = async (hc_name) => {
    // const checkBack = this.stateRef.goBack;

    try {
      this.loader();
      const data = await fetchStatus(hc_name);
      console.log(data);
      this.RemoveLoader();
      
      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching health facility status: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const message = this.createChatBotMessage(
          <Textbox {...data} type={"status"} />,
          { widget: "unknown" }
        );
        this.addMessageToState(message);

        this.setState((prevState) => ({
          ...prevState,
          buttons: ["Yes, go back", "No, end this chat"],
        }));

        const message1 = this.createChatBotMessage(
          "Do you want to go back to previous menu?",
          { widget: "buttons" }
        );
        this.addMessageToState(message1);
      }
    } catch (error) {
      console.error("Error fetching health centers:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error fetching the health centers. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    this.addPreviousCommandToState(
      this.fetchStatus,
      hc_name
    );
  };

  fetchHRForHc = async (hc_name) => {
    // const checkBack = this.stateRef.goBack;

    try {
      this.loader();
      const data = await fetchHumanResources(hc_name);
      console.log(data);
      this.RemoveLoader();
      
      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching health facility status: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const message = this.createChatBotMessage(
          <Textbox {...data} type={"human resources"} />,
          { widget: "unknown" }
        );
        this.addMessageToState(message);

        this.setState((prevState) => ({
          ...prevState,
          buttons: ["Yes, go back", "No, end this chat"],
        }));

        const message1 = this.createChatBotMessage(
          "Do you want to go back to previous menu?",
          { widget: "buttons" }
        );
        this.addMessageToState(message1);
      }
    } catch (error) {
      console.error("Error fetching health centers:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error fetching the health centers. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    this.addPreviousCommandToState(
      this.fetchHumanResources,
      hc_name
    );
  };

  fetchSettlementList = async (hc) => {
    const checkBack = this.stateRef.goBack;

    try {
      this.loader();
      const data = await fetchSettlement(hc);
      this.RemoveLoader();
      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching settlements: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const settlementOptions = data.map((settlement) => ({
          text: settlement,
          id: settlement,
        }));
        const message = this.createChatBotMessage(
          "Please select a settlement:",
          {
            widget: "buttons",
            options: settlementOptions,
          }
        );
        this.addMessageToState(message);
        this.setState((prevState) => ({
          ...prevState,
          buttons: settlementOptions.map((option) => option.text),
          counter: checkBack ? prevState.counter : prevState.counter + 1,
          // selectedHc: hc, // Ensure the selected HC is set in the state
        }));
      }
    } catch (error) {
      console.error("Error fetching settlements:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error fetching the settlements. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    this.addPreviousCommandToState(this.fetchSettlementList, hc);
  };

  fetchPopulationForSettlement = async (settlement_name) => {
    try {
      this.loader();
      const hcName = this.stateRef.selectedHc;
      const data = await fetchPopulation(hcName, settlement_name);
      console.log(data);

      this.RemoveLoader();

      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching settlement population: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const message = this.createChatBotMessage(
          <Textbox {...data} type={"population"} />,
          { widget: "unknown" }
        );
        this.addMessageToState(message);

        this.setState((prevState) => ({
          ...prevState,
          buttons: ["Yes, go back", "No, end this chat"],
        }));

        const message1 = this.createChatBotMessage(
          "Do you want to go back to previous menu?",
          { widget: "buttons" }
        );
        this.addMessageToState(message1);
      }
    } catch (error) {
      console.error("Error fetching settlement population:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error fetching the settlement population. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
  };

  fetchProfileForSettlement = async (settlement_name) => {
    try {
      this.loader();
      const hcName = this.stateRef.selectedHc;
      const data = await fetchProfile(hcName, settlement_name);
      console.log(data);

      this.RemoveLoader();

      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching settlement profile: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const message = this.createChatBotMessage(
          <Textbox {...data} type={"profile"} />,
          { widget: "unknown" }
        );
        this.addMessageToState(message);

        this.setState((prevState) => ({
          ...prevState,
          buttons: ["Yes, go back", "No, end this chat"],
        }));

        const message1 = this.createChatBotMessage(
          "Do you want to go back to previous menu?",
          { widget: "buttons" }
        );
        this.addMessageToState(message1);
      }
    } catch (error) {
      console.error("Error fetching settlement profile:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error fetching the settlement profile. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
  };
  // addMessageToState = (message) => {
  //   this.setState((prevState) => ({
  //     ...prevState,
  //     messages: [...prevState.messages, message],
  //   }));
  // };
  getMessageInState = () => this.stateRef.messages;

  fetchFamilyPlanningForSettlement = async (settlement_name) => {
    try {
      this.loader();
      const hcName = this.stateRef.selectedHc;
      const data = await fetchFamilyPlanning(hcName, settlement_name);
      console.log(data);

      this.RemoveLoader();

      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching settlement family planning: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const message = this.createChatBotMessage(
          <Textbox {...data} type={"family"} />,
          { widget: "unknown" }
        );
        this.addMessageToState(message);

        this.setState((prevState) => ({
          ...prevState,
          buttons: ["Yes, go back", "No, end this chat"],
        }));

        const message1 = this.createChatBotMessage(
          "Do you want to go back to previous menu?",
          { widget: "buttons" }
        );
        this.addMessageToState(message1);
      }
    } catch (error) {
      console.error("Error fetching settlement family planinig:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error fetching the settlement family planning. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    this.addPreviousCommandToState(
      this.fetchFamilyPlanningForSettlement,
      settlement_name
    );
  };

  fetchImmunizationForSettlement = async (settlement_name) => {
    try {
      this.loader();
      const hcName = this.stateRef.selectedHc;
      const data = await fetchImmunization(hcName, settlement_name);
      console.log(data);

      this.RemoveLoader();

      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching settlement Immunization details: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const message = this.createChatBotMessage(
          <Textbox {...data} type={"immunization"} />,
          { widget: "unknown" }
        );
        this.addMessageToState(message);

        this.setState((prevState) => ({
          ...prevState,
          buttons: ["Yes, go back", "No, end this chat"],
        }));

        const message1 = this.createChatBotMessage(
          "Do you want to go back to previous menu?",
          { widget: "buttons" }
        );
        this.addMessageToState(message1);
      }
    } catch (error) {
      console.error("Error fetching settlement family planinig:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error fetching the settlement Immunization Details. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    this.addPreviousCommandToState(
      this.fetchImmunizationForSettlement,
      settlement_name
    );
  };

  fetchMalariaForSettlement = async (settlement_name) => {
    try {
      this.loader();
      const hcName = this.stateRef.selectedHc;
      const data = await fetchMalaria(hcName, settlement_name);
      console.log(data);

      this.RemoveLoader();

      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching settlement Malaria details: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const message = this.createChatBotMessage(
          <Textbox {...data} type={"malaria"} />,
          { widget: "unknown" }
        );
        this.addMessageToState(message);

        this.setState((prevState) => ({
          ...prevState,
          buttons: ["Yes, go back", "No, end this chat"],
        }));

        const message1 = this.createChatBotMessage(
          "Do you want to go back to previous menu?",
          { widget: "buttons" }
        );
        this.addMessageToState(message1);
      }
    } catch (error) {
      console.error("Error fetching settlement family planinig:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error fetching the settlement Malaria Details. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    this.addPreviousCommandToState(
      this.fetchMalariaForSettlement,
      settlement_name
    );
  };

  fetchConsumablesForSettlement = async (settlement_name) => {
    try {
      this.loader();
      const hcName = this.stateRef.selectedHc;
      const data = await fetchConsumables(hcName, settlement_name);
      console.log(data);

      this.RemoveLoader();

      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching settlement Malaria details: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const message = this.createChatBotMessage(
          <Textbox {...data} type={"consumables"} />,
          { widget: "unknown" }
        );
        this.addMessageToState(message);

        this.setState((prevState) => ({
          ...prevState,
          buttons: ["Yes, go back", "No, end this chat"],
        }));

        const message1 = this.createChatBotMessage(
          "Do you want to go back to previous menu?",
          { widget: "buttons" }
        );
        this.addMessageToState(message1);
      }
    } catch (error) {
      console.error("Error fetching settlement consumables:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error fetching the settlement Consumables Details. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    this.addPreviousCommandToState(
      this.fetchConsumablesForSettlement,
      settlement_name
    );
  };

  fetchFacilityToolsForSettlement = async (settlement_name) => {
    try {
      this.loader();
      const hcName = this.stateRef.selectedHc;
      const data = await fetchHfTools(hcName, settlement_name);
      console.log(data);

      this.RemoveLoader();

      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching settlement Facility Tools details: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const message = this.createChatBotMessage(
          <Textbox {...data} type={"hftools"} />,
          { widget: "unknown" }
        );
        this.addMessageToState(message);

        this.setState((prevState) => ({
          ...prevState,
          buttons: ["Yes, go back", "No, end this chat"],
        }));

        const message1 = this.createChatBotMessage(
          "Do you want to go back to previous menu?",
          { widget: "buttons" }
        );
        this.addMessageToState(message1);
      }
    } catch (error) {
      console.error("Error fetching settlement Facility Tools:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error fetching the settlement Facility Tools Details. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    this.addPreviousCommandToState(
      this.fetchFacilityToolsForSettlement,
      settlement_name
    );
  };

  fetchCatchmentForHc = async () => {
    try {
      this.loader();
      // const hcName = this.stateRef.selectedHc;
      const catchmentMapUrl = await fectchCatchmentMap();
      console.log(catchmentMapUrl)

      this.RemoveLoader();

      if (catchmentMapUrl.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching catchment area map: ${catchmentMapUrl.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const message = this.createChatBotMessage(
          "",
          { widget: "image",
            payload: { // Pass additional props if needed
              type: "catchment area map",
              src: catchmentMapUrl,
              alt: "Catchment Map",
            },
          }
        );
        this.addMessageToState(message);

        this.setState((prevState) => ({
          ...prevState,
          buttons: ["Yes, go back", "No, end this chat"],
        }));

        const message1 = this.createChatBotMessage(
          "Do you want to go back to previous menu?",
          { widget: "buttons" }
        );
        this.addMessageToState(message1);
      }
    } catch (error) {
      console.error("Error fetching settlement Facility Tools:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error fetching the settlement Facility Tools Details. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    this.addPreviousCommandToState(
      this.fetchCatchmentForHc
    );
  };

  fetchWeatherInfoForHc = async () => {
    try {
      this.loader();
      // const hcName = this.stateRef.selectedHc;
      const data = await fectchWeatherInfo();
      console.log(data)

      this.RemoveLoader();

      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching catchment area map: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const message = this.createChatBotMessage(
          <Textbox {...data} type={"weather"} />,
          { widget: "unknown" }
        );
        this.addMessageToState(message);

        this.setState((prevState) => ({
          ...prevState,
          buttons: ["Yes, go back", "No, end this chat"],
        }));

        const message1 = this.createChatBotMessage(
          "Do you want to go back to previous menu?",
          { widget: "buttons" }
        );
        this.addMessageToState(message1);
      }
    } catch (error) {
      console.error("Error fetching settlement Facility Tools:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error fetching the settlement Facility Tools Details. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    this.addPreviousCommandToState(
      this.fetchWeatherInfoForHc
    );
  };

  fetchComputeFamilyPlanningForSettlement = async (popValue) => {
    try {
      this.loader();
      const settlement = this.stateRef.selectedSettlement;
      const hcName = this.stateRef.selectedHc;
      const data = await fetchComputeFamilyPlanning(hcName, settlement, popValue);
      console.log(data);

      this.RemoveLoader();

      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching settlement Facility Tools details: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const message = this.createChatBotMessage(
          <Textbox {...data} type={"family"} />,
          { widget: "unknown" }
        );
        this.addMessageToState(message);

        this.setState((prevState) => ({
          ...prevState,
          buttons: ["Yes, go back", "No, end this chat"],
        }));

        const message1 = this.createChatBotMessage(
          "Do you want to go back to previous menu?",
          { widget: "buttons" }
        );
        this.addMessageToState(message1);
      }
    } catch (error) {
      console.error("Error fetching settlement Facility Tools:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error computing Tools Details. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    this.addPreviousCommandToState(
      this.fetchComputeFamilyPlanning,
      popValue
    );
  };

  fetchComputeImmunizationForSettlement = async (popValue) => {
    try {
      this.loader();
      const settlement = this.stateRef.selectedSettlement;
      const hcName = this.stateRef.selectedHc;
      const data = await fetchComputeImmunization(hcName, settlement, popValue);
      console.log(data);

      this.RemoveLoader();

      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching settlement Facility Tools details: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const message = this.createChatBotMessage(
          <Textbox {...data} type={"immunization"} />,
          { widget: "unknown" }
        );
        this.addMessageToState(message);

        this.setState((prevState) => ({
          ...prevState,
          buttons: ["Yes, go back", "No, end this chat"],
        }));

        const message1 = this.createChatBotMessage(
          "Do you want to go back to previous menu?",
          { widget: "buttons" }
        );
        this.addMessageToState(message1);
      }
    } catch (error) {
      console.error("Error fetching settlement Facility Tools:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error computing Tools Details. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    this.addPreviousCommandToState(
      this.fetchComputeImmunization,
      popValue
    );
  };

  fetchComputeMalariaForSettlement = async (popValue) => {
    try {
      this.loader();
      const settlement = this.stateRef.selectedSettlement;
      const hcName = this.stateRef.selectedHc;
      const data = await fetchComputeMalaria(hcName, settlement, popValue);
      console.log(data);

      this.RemoveLoader();

      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching settlement Facility Tools details: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const message = this.createChatBotMessage(
          <Textbox {...data} type={"malaria"} />,
          { widget: "unknown" }
        );
        this.addMessageToState(message);

        this.setState((prevState) => ({
          ...prevState,
          buttons: ["Yes, go back", "No, end this chat"],
        }));

        const message1 = this.createChatBotMessage(
          "Do you want to go back to previous menu?",
          { widget: "buttons" }
        );
        this.addMessageToState(message1);
      }
    } catch (error) {
      console.error("Error fetching settlement Facility Tools:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error computing Tools Details. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    this.addPreviousCommandToState(
      this.fetchComputeMalaria,
      popValue
    );
  };

  fetchComputeConsumablesForSettlement = async (popValue) => {
    try {
      this.loader();
      const settlement = this.stateRef.selectedSettlement;
      const hcName = this.stateRef.selectedHc;
      const data = await fetchComputeConsumables(hcName, settlement, popValue);
      console.log(data);

      this.RemoveLoader();

      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching settlement Facility Tools details: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const message = this.createChatBotMessage(
          <Textbox {...data} type={"consumables"} />,
          { widget: "unknown" }
        );
        this.addMessageToState(message);

        this.setState((prevState) => ({
          ...prevState,
          buttons: ["Yes, go back", "No, end this chat"],
        }));

        const message1 = this.createChatBotMessage(
          "Do you want to go back to previous menu?",
          { widget: "buttons" }
        );
        this.addMessageToState(message1);
      }
    } catch (error) {
      console.error("Error fetching settlement Facility Tools:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error computing Tools Details. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    this.addPreviousCommandToState(
      this.fetchComputeConsumables,
      popValue
    );
  };

  fetchComputeHFToolForSettlement = async (popValue) => {
    try {
      this.loader();
      const settlement = this.stateRef.selectedSettlement;
      const hcName = this.stateRef.selectedHc;
      const data = await fetchComputeHFTool(hcName, settlement, popValue);
      console.log(data);

      this.RemoveLoader();

      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error fetching settlement Facility Tools details: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const message = this.createChatBotMessage(
          <Textbox {...data} type={"hftool"} />,
          { widget: "unknown" }
        );
        this.addMessageToState(message);

        this.setState((prevState) => ({
          ...prevState,
          buttons: ["Yes, go back", "No, end this chat"],
        }));

        const message1 = this.createChatBotMessage(
          "Do you want to go back to previous menu?",
          { widget: "buttons" }
        );
        this.addMessageToState(message1);
      }
    } catch (error) {
      console.error("Error fetching settlement Facility Tools:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error computing Tools Details. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    this.addPreviousCommandToState(
      this.fetchComputeHFTool,
      popValue
    );
  };

  addMessageToState = (message) => {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };
  // addPreviousCommandToState = (func, parameter) => {
  //   this.setState((prevState) => ({
  //     ...prevState,
  //     previousCommand: [...prevState.previousCommand, { func, parameter }],
  //   }));
  // };

  addNameToState = (name) => {
    const message = this.createClientMessage(name);
    this.addMessageToState(message);
    this.setState((prevState) => ({ ...prevState, name }));
  };

  addStateToState = (stateName) => {
    this.setState((prevState) => ({ ...prevState, selectedState: stateName }));
    this.fetchLgasForState(stateName);
    this.addPreviousCommandToState(this.addStateToState, stateName);
  };

  addLgaToState = (lgaName) => {
    this.setState((prevState) => ({ ...prevState, selectedLga: lgaName }));
    this.fetchWardsForLga(lgaName);
    this.addPreviousCommandToState(this.addLgaToState, lgaName);
  };

  addWardToState = (wardName) => {
    this.setState((prevState) => ({ ...prevState, selectedWard: wardName }));
    this.fetchHcForWards(wardName);
    this.addPreviousCommandToState(this.addWardToState, wardName);
  };

  addHcToState = (hc) => {
    this.setState((prevState) => ({ ...prevState, selectedHc: hc }));
    this.fetchSettlementList(hc);
    this.addPreviousCommandToState(this.addHcToState, hc);
  };
  addSettlementToState = (settlement) => {
    const checkBack = this.stateRef.goBack;

    this.setState((prevState) => ({
      ...prevState,
      selectedSettlement: settlement,
    }));

    // Add the bot message and options after a settlement is selected
    const options = [
      "Profile",
      "Population",
      "Commodities",
      "Compute Population",
      "Go back",
    ];
    const message = this.createChatBotMessage("Select an option:", {
      widget: "buttons",
      options: options.map((option) => ({ text: option, id: option })),
    });
    this.addMessageToState(message);
    this.setState((prevState) => ({
      ...prevState,
      buttons: options,
      counter: checkBack ? prevState.counter : prevState.counter + 1,
    }));
    this.addPreviousCommandToState(this.addSettlementToState, settlement);
  };
  addComputeCommoditiesToState = (popValue) => {
    const checkBack = this.stateRef.goBack;

    // this.setState((prevState) => ({
    //   ...prevState,
    //   popValue: popValue,
    // }));

    // Add the bot message and options after a settlement is selected
    const computeOptions = [
      "Compute Family Planning",
      "Compute Immunization",
      "Compute Malaria ICM and More",
      "Compute Consumables",
      "Compute Facility Tools",
      "Compute Go back",
    ];
    const message = this.createChatBotMessage("Select an option:", {
      widget: "buttons",
      options: computeOptions.map((option) => ({ text: option, id: option })),
    });
    this.addMessageToState(message);
    this.setState((prevState) => ({
      ...prevState,
      buttons: computeOptions,
      counter: checkBack ? prevState.counter : prevState.counter + 1,
      popValue: popValue
    }));
    this.addPreviousCommandToState(this.addComputeCommoditiesToState, popValue);
  };
  addPopulationToState = (settlement) => {
    this.setState((prevState) => ({ ...prevState, population: settlement }));
    this.fetchPopulationForSettlement(settlement);
    this.addPreviousCommandToState(this.addPopulationToState, settlement);
  };
  addComputePopulationToState = (popValue) => {
    this.setState((prevState) => ({ ...prevState, popValue: popValue }));
    this.fetchComputePopulation(popValue);
    this.addPreviousCommandToState(this.addComputePopulationToState, popValue);
  };
  addStatusToState = (hc) => {
    this.setState((prevState) => ({ ...prevState, selectedHc: hc }));
    this.fetchStatusForHc(hc);
    this.addPreviousCommandToState(this.addStatusToState, hc);
  };
  addProfileToState = (settlement) => {
    this.setState((prevState) => ({ ...prevState, profile: settlement }));
    this.fetchProfileForSettlement(settlement);
    this.addPreviousCommandToState(this.addProfileToState, settlement);
  };
  addCommoditesToState = (settlement) => {
    const checkBack = this.stateRef.goBack;

    const commodityOptions = [
      "Family Planning",
      "Immunization",
      "Malaria ICM and More",
      "Consumables",
      "Facility Tools",
      "Go back",
    ];

    const message = this.createChatBotMessage("Select a commodity category:", {
      widget: "buttons",
      options: commodityOptions.map((option) => ({ text: option, id: option })),
    });

    this.addMessageToState(message);

    this.setState((prevState) => ({
      ...prevState,
      buttons: commodityOptions,
      selectedSettlement: settlement,
      counter: checkBack ? prevState.counter : prevState.counter + 1,
    }));
    this.addPreviousCommandToState(this.addCommoditesToState, settlement);
  };

  decrementCounter = () =>
    this.setState((prevState) => ({
      ...prevState,
      counter: prevState.counter - 1,
      goBack: true,
    }));

  loginForm = async () => {
    const message = this.createChatBotMessage(
      `Hello hi ${this.stateRef.name}, welcome to GeoST4R chatbot.\n Get all the information you need while you deliver health services in this region.\n\n\n Please provide your credentials to continue.\n\n`,
      { widget: "signInForm" }
    );
    this.addMessageToState(message);
  };

  AMAForm = async (question) => {
    // this.setState((prevState) => ({
    //   ...prevState,
    //   table: table,
    // }));
    const message = this.createChatBotMessage(question ? question : "", {
      widget: "AMAForm",
    });
    this.addMessageToState(message);
  };

  handleTyping = async (type) => {
    console.log("type change to = ", type);

    // this.setState((prevState) => ({
    //   ...prevState,
    //   typing: type, // Ensure correct state update
    // }));
    console.log("Typing state changed to:", type);

    // Add a lifecycle method to handle side effects when typing changes
    const chatInputContainer = document.querySelector(
      ".react-chatbot-kit-chat-input-container"
    );

    if (chatInputContainer) {
      chatInputContainer.style.display = type ? "block" : "none";
    }
  };

  handleTypingC = async (type) => {
    console.log("type change to = ", type);

    this.setState((prevState) => ({
      ...prevState,
      typing: type,
      state: type ? "computePopulation" : prevState.state,
    }));

    console.log("Typing state changed to:", type);

    // Add a lifecycle method to handle side effects when typing changes
    const chatInputContainer = document.querySelector(
      ".react-chatbot-kit-chat-input-container"
    );

    if (chatInputContainer) {
      chatInputContainer.style.display = type ? "block" : "none";
    }
  };

  handleAMA = async (question) => {
    // const message = this.createClientMessage(question);
    // this.addMessageToState(message);
    try {
      this.loader();

      // Retrieve the sessionId (or conversationId) from the state or localStorage
      const sessionId = localStorage.getItem("conversationId") || this.state.conversationId;

      // If sessionId is undefined, handle the case appropriately
      if (!sessionId) {
        console.error("Session ID (conversationId) is missing");
        this.RemoveLoader();
        return;
      }
      const data = await answerQuestion(question, sessionId);
      this.RemoveLoader();
      console.log("question data = ", data);

      if (data.error) {
      // Handle API error
      const errorMessage = `Error fetching answer to the question: ${data.error}`;
      this.enterChatText(errorMessage); // Display error on the frontend
    } else {
      // Handle successful response
      const responseMessage = data.response; // Extract response from API
      this.enterChatText(responseMessage); // Display response on the frontend
    }

      // this.AMAForm(data.response);
      const message = this.createChatBotMessage(data.response);
      this.addMessageToState(message);
    } catch (error) {
      console.error(" Error fetching Answer to the question :", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error fetching Answer to the question. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    this.setState((prevState) => ({
      ...prevState,
      messages: prevState.messages.slice(0, -1), // Removes the last item
    }));
  };

  handleComputePopulation = async (popValue) => {
    const isValidNumber = !isNaN(parseFloat(popValue)) && isFinite(popValue);
  
    if (!isValidNumber) {
      const errorMessage = this.createChatBotMessage(
        "Invalid number. Please enter a valid number."
      );
      this.addMessageToState(errorMessage);
      return;
    }
  
    try {
      this.loader();
  
      const selectedSettlement = this.stateRef.selectedSettlement;
      const hcName = this.stateRef.hcName;
      const data = await fetchComputePopulation(hcName, selectedSettlement, popValue);
      console.log(data)
      this.RemoveLoader();
  
      if (data.error) {
        const errorMessage = this.createChatBotMessage(
          `Error computing population: ${data.error}`
        );
        this.addMessageToState(errorMessage);
      } else {
        const message = this.createChatBotMessage(
          <Textbox {...data} type={"compute population"} />,
          { widget: "unknown" }
        );
        this.addMessageToState(message);
  
        this.setState((prevState) => ({
          ...prevState,
          buttons: ["Compute commodities", "No, end this chat"],
          popValue: popValue,
        }));
  
        const message1 = this.createChatBotMessage(
          `Do you want to compute commodities for ${selectedSettlement} settlement?`,
          { widget: "buttons" }
        );
        this.addMessageToState(message1);
      }
    } catch (error) {
      console.error("Error computing population:", error);
      this.RemoveLoader();
      const errorMessage = this.createChatBotMessage(
        "Sorry, there was an error computing the population. Please try again later."
      );
      this.addMessageToState(errorMessage);
    }
    this.addPreviousCommandToState(
      this.handleComputePopulation,
      popValue
    );
  };

  showButtons = (params) => {
    this.setState((prevState) => ({
      ...prevState,
      buttons: params[1],
    }));
    const message = this.createChatBotMessage(params[0], {
      widget: "buttons",
    });
    this.addMessageToState(message);
    this.addPreviousCommandToState(this.showButtons, params);
  };
  
  handleModelling = () => {
    const message = this.createChatBotMessage("Home Birth Prediction", {
      widget: "ModellingForm",
    });
    this.addMessageToState(message);
  };
}

export default ActionProvider;
