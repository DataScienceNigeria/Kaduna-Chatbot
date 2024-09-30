import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Create the context
const AuthContext = createContext();

export const Provider = ({ children }) => {
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    // Get the element by class name
    const chatInputContainer = document.querySelector(
      ".react-chatbot-kit-chat-input-container"
    );
    console.log("typing = ", typing);
    if (chatInputContainer) {
      // Toggle the display based on the `isVisible` state
      chatInputContainer.style.display = typing ? "block" : "none";
    }
  }, [typing]);

  const value = {
    typing,
    setTyping,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useProvider = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
