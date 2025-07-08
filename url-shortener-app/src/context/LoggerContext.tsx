import React, { createContext, useContext } from "react";

type LoggerContextType = {
  logEvent: (message: string, data?: any) => void;
};

const LoggerContext = createContext<LoggerContextType | undefined>(undefined);

export const LoggerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const logEvent = (message: string, data?: any) => {
    // Instead of console.log, logs are handled here
    const logData = {
      timestamp: new Date().toISOString(),
      message,
      data,
    };
    // Here we can store logs in session/localStorage or send to backend if needed
    // For now, store in session
    let logs = JSON.parse(sessionStorage.getItem("logs") || "[]");
    logs.push(logData);
    sessionStorage.setItem("logs", JSON.stringify(logs));
  };

  return <LoggerContext.Provider value={{ logEvent }}>{children}</LoggerContext.Provider>;
};

export const useLogger = () => {
  const context = useContext(LoggerContext);
  if (!context) throw new Error("useLogger must be used within LoggerProvider");
  return context;
};
