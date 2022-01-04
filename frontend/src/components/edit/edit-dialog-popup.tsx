import React, { FC, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { createStyles, makeStyles } from "@mui/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseSharp from "@mui/icons-material/CloseSharp";
import Edit from "./edit";
import { DialogComponentProps } from "../dashboard/dashboard";
import { editService, getService } from "../../services/api-service";
import { Backdrop, CircularProgress } from "@mui/material";
// import { createService } from "../../services/api-service";

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

export interface EditDialogComponentProps {
  modelName: string;
  target?: string;
  modelUrl: string;
  modelVersion: string;
  runtime: string;
  minWorkers: number;
  maxWorkers: number;
  batchSize: number;
  maxBatchDelay: number;
  loadedAtStartup: boolean;
  workers?: [{
    id: any;
    startTime: any;
    status: any;
    memoryUsage: any;
    pid: number;
    gpu: boolean;
    gpuUsage: string;
  }];
}

const EditDialogComponent: FC<DialogComponentProps> = (
  props: DialogComponentProps
) => {
  const classes = useStyles();
  const { open, onCancelPressed = () => {}, modelName } = props;

  const defaultModelData = {
    modelName: "",
    target: "TorchServe_1",
    modelUrl: "",
    modelVersion: "",
    runtime: "",
    minWorkers: 1,
    maxWorkers: 1,
    batchSize: 1,
    loadedAtStartup: false,
    maxBatchDelay: 1,
    workers: null,
  };
  const [openState, setOpenState] = useState<boolean>(open);
  const [modelState, setModelState] =
    useState<any>(defaultModelData);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setOpenState(open);
  }, [open]);

  useEffect(() => {
    if (modelName) {
      setLoading(true);
      getService(modelName)
        .then((res: any) => res.json())
        .then(
          (result: any) => {
            setLoading(false);
            setModelState(result);
          },
          (error: any) => {
            setLoading(false);
            setModelState({
              modelName: "news_classification_test",
              modelVersion: "1.0",
              target: "Torchserve_1",
              modelUrl:
                "/home/ubuntu/Documents/facebook/phase2/hackathon/mlflow-torchserve/app/model_store/news_classification_test.mar",
              runtime: "python",
              minWorkers: 1,
              maxWorkers: 1,
              batchSize: 1,
              maxBatchDelay: 100,
              loadedAtStartup: false,
              workers: [
                {
                  id: "9002",
                  startTime: "2022-01-03T15:32:51.575Z",
                  status: "READY",
                  memoryUsage: 1639305216,
                  pid: 12823,
                  gpu: false,
                  gpuUsage: "N/A",
                },
              ],
            });
          }
        );
    }
  }, [modelName]);

  const handleClose = () => {
    setOpenState(false);
    setModelState(defaultModelData);
    onCancelPressed();
  };

  const handleChange = (event: any) => {
    const target = event.target;
    const name = target.name;
    setModelState((prev: any) => ({
      ...prev,
      [name]: target.value,
    }));
  };

  const handleVariation = (fieldName: string, isIncreased?: boolean) => {
    setModelState((prev: any) => ({
      ...prev,
      [fieldName]: isIncreased ? prev[fieldName] + 1 : prev[fieldName] - 1,
    }));
  };

  const handleSubmit = () => {
    editService(modelState)
      .then((res) => res.json())
      .then(
        (result) => {
          handleClose();
        },
        (error) => {}
      );
  };

  return !loading ? (
    <Dialog
      maxWidth={"md"}
      fullWidth={true}
      open={openState}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className={classes.dialogTitle}>
        <span>Model Details</span>
        <div className={classes.clearIcon} onClick={handleClose}>
          <CloseSharp />
        </div>
      </DialogTitle>
      <DialogContent dividers className={classes.dialogContent}>
        <Edit
          model={modelState}
          handleChange={handleChange}
          handleVariation={handleVariation}
        />
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
          onClick={handleSubmit}
          autoFocus
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  ) : (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default EditDialogComponent;
