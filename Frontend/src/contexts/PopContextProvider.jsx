import React, { Children, useState } from "react";
import { PopupContext } from "./MainContexts";

function PopContextProvider({ children }) {
  const [boolValue, setBoolValue] = useState(false);
  return (
    <PopupContext.Provider value={{boolValue, setBoolValue }}>
      {children}
    </PopupContext.Provider>
  );
}

export default PopContextProvider;
