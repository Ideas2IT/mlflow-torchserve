import React, { FC, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { createStyles, makeStyles } from "@mui/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseSharp from "@mui/icons-material/CloseSharp";
import { DialogComponentProps } from "../dashboard/dashboard";
import PredictResult from "./predict-result";
import { PredictDialogComponentProps } from "./predict-dialog-popup";

const useStyles = makeStyles((theme: any) =>
  createStyles({
    root: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    dialogTitle: {
      padding: "3px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    clearIcon: {
      paddingTop: "8px",
      cursor: "pointer",
    },
    footerButton: {
      padding: "5px 11px",
    },
    dialogContent: {
      paddingBottom: "30px",
    },
  })
);

const PredictResultDialogComponent: FC<DialogComponentProps> = (
  props: DialogComponentProps
) => {
  const classes = useStyles();
  const {
    open,
    onCancelPressed = () => {},
    onPreditAnotherPressed = (modelName: string) => {},
    predictModel,
  } = props;

  const defaultModelData = {
    model_name: "",
    model_inputPath: null,
  };

  const [openState, setOpenState] = useState<boolean>(open);
  const [modelState, setModelState] =
    useState<PredictDialogComponentProps>(defaultModelData);

  useEffect(() => {
    setOpenState(open);
  }, [open]);

  useEffect(() => {
    setModelState(predictModel);
  }, [predictModel]);

  const handleClose = () => {
    setOpenState(false);
    setModelState(defaultModelData);
    onCancelPressed();
  };

  const handlePreditAnother = () => {
    onPreditAnotherPressed(modelState.model_name);
  };

  return (
    <Dialog
      maxWidth={"md"}
      fullWidth={true}
      open={openState}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className={classes.dialogTitle}>
        <span>Predict - Results</span>
        <div className={classes.clearIcon} onClick={handleClose}>
          <CloseSharp />
        </div>
      </DialogTitle>
      <DialogContent dividers className={classes.dialogContent}>
        <PredictResult model={modelState}/>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          className={classes.footerButton}
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          className={classes.footerButton}
          onClick={handlePreditAnother}
          autoFocus
        >
          Predict Another
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PredictResultDialogComponent;
