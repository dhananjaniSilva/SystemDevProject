import React, { Children, useState } from "react";
import { PopupContext } from "./MainContexts";

function PopContextProvider({ children }) {
  const [boolValue, setBoolValue] = useState(false);
  const [medicineCategoryId, setMedicineCategoryId] = useState(0);
  return (
    <PopupContext.Provider
      value={{
        boolValue,
        setBoolValue,
        medicineCategoryId,
        setMedicineCategoryId,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
}

export default PopContextProvider;
