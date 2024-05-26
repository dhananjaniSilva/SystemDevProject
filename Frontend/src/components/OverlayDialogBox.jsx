import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { useContext } from "react";
import { PopupContext } from "../contexts/MainContexts";

export default function FormDialog({ children }) {
  const { boolValue, setBoolValue } = useContext(PopupContext);

  const handleClose = () => {
    setBoolValue(false);
  };

  return (
    <React.Fragment>
      <Dialog open={boolValue} onClose={handleClose} maxWidth={"xl"} aria-labelledby="responsive-dialog-title">
        {children}
      </Dialog>
    </React.Fragment>
  );
}
