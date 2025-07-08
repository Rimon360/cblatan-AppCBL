import {createContext, useContext, useState} from "react";

const GlobalContenxt = createContext();

export const GlobalProvider = ({children}) => {
  const [current_user, setCurrentUser] = useState("initial");
  return <GlobalContenxt.Provider value={{current_user, setCurrentUser}}>{children}</GlobalContenxt.Provider>;
};

export const useGlobal = () => useContext(GlobalContenxt);
