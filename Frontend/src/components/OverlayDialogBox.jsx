import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useContext } from "react";
import { PopupContext } from "../contexts/MainContexts";

export default function FormDialog({ children }) {
  const {boolValue, setBoolValue } = useContext(PopupContext);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setBoolValue(true);
  };

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
