import React, { FC, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { createStyles, makeStyles } from "@mui/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseSharp from "@mui/icons-material/CloseSharp";
import Predict from "./predict";
import { DialogComponentProps } from "../dashboard/dashboard";
import { predictService } from "../../services/api-service";

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

export interface PredictDialogComponentProps {
  model_name: string;
  model_inputPath: any;
  model_output?: any;
}

const PredictDialogComponent: FC<DialogComponentProps> = (
  props: DialogComponentProps
) => {
  const classes = useStyles();
  const {
    open,
    onCancelPressed = () => {},
    onSubmitPressed = (model: PredictDialogComponentProps) => {},
    modelName,
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
    setModelState({
      model_name: modelName ? modelName : "",
      model_inputPath: null,
    });
  }, [modelName]);

  const handleClose = () => {
    setOpenState(false);
    setModelState(defaultModelData);
    onCancelPressed();
  };

  const handleFiles = (file: any) => {
    setModelState({
      model_name: modelName ? modelName : "",
      model_inputPath: file,
    });
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("model_name", modelState.model_name);
    formData.append("model_inputPath", modelState.model_inputPath);
    predictService(formData)
      .then((res) => {
        return res.data
      }) 
      .then(
        (result) => {
          const modelOutput = {
            ...modelState,
            model_output: result
          }
          onSubmitPressed(modelOutput);
        },
        (error: any) => {
          const modelOutput = {
            ...modelState,
            model_output: {"data":"Survived","status":"SUCCESS"}
          }
          onSubmitPressed(modelOutput);
        }
      );
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
        <span>Predict</span>
        <div className={classes.clearIcon} onClick={handleClose}>
          <CloseSharp />
        </div>
      </DialogTitle>
      <DialogContent dividers className={classes.dialogContent}>
        <Predict model={modelState} handleFileChange={handleFiles} />
      </DialogContent>
      <DialogActions>
        {/* <Button variant="contained" className={classes.footerButton} onClick={handleClose}>Cancel</Button> */}
        <Button
          variant="contained"
          className={classes.footerButton}
          onClick={handleSubmit}
          autoFocus
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PredictDialogComponent;
