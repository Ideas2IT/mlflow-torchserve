import React, { FC, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { createStyles, makeStyles } from "@mui/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseSharp from "@mui/icons-material/CloseSharp";
import Create from "./start-torch-server";
import { DialogComponentProps, SnackBarComponentProps } from "../dashboard/dashboard";
import { createService, getDefaultConfigService, saveDefaultConfigService } from "../../services/api-service";
import StartTorchServer from "./start-torch-server";
import { Alert, CircularProgress, Snackbar } from "@mui/material";

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
    footer: {
      justifyContent: "center" 
    },
    footerSpace: {
      marginRight: '530px'
    },
    footerButton: {
      // marginRight: '500px',
      padding: "5px 11px",
    },
    dialogContent: {
      paddingBottom: "30px",
    },
    circle: {
      color: 'white',
      '&:hover': {
        color: 'blue',
      }
    },
  })
);

export interface ServerDialogComponentProps {
  // start_with_previous_model: boolean
  // start_new_instance: boolean
  // model_store_path: string
  model_store_choice: string,
  model_store_path: string
  inference_address: string
  management_address: string
  metrics_address: string
  model_store: string
  files: {
    model_store_path: any
  }
}

const StartTorchServerDialogComponent: FC<DialogComponentProps> = (
  props: DialogComponentProps
) => {
  const classes = useStyles();
  const { 
    open, 
    loading,
    onCancelPressed = () => {}, 
    onSubmitPressed = (model: any) => {}
  } = props;

  const defaultModelData = {
    // start_with_previous_model: true,
    // start_new_instance: false,
    // is_model_store_path: false,
    model_store_choice: "start_new_instance",
    model_store_path: "",
    inference_address: "http://0.0.0.0:8080",
    management_address: "http://0.0.0.0:8081",
    metrics_address: "http://0.0.0.0:8082",
    model_store: "/home/ubuntu/model-store",
    files: {
      model_store_path: null
    }
  };
  const [openState, setOpenState] = useState<boolean>(open);
  const [defaultLoader, setDefaultLoader] = useState<boolean>(false);
  const [modelState, setModelState] =
    useState<ServerDialogComponentProps>(defaultModelData);
  const [snackBar, setSnackBar] = useState<SnackBarComponentProps>({showSnackbar: false});

  useEffect(() => {
    if(open) {
      getDefaultConfigService()
      .then((res: any) => res.data)
      .then(
        (result) => {
          if(result.data && result.data?.model_store_choice) {
            setModelState(result.data);
          } else {
            setModelState(defaultModelData);
          }
        },
        (error) => {
          setModelState(defaultModelData);
        }
      );
    }
  }, [open]);

  useEffect(() => {
    setOpenState(open);
  }, [open]);

  const handleClose = () => {
    setOpenState(false);
    setModelState(defaultModelData);
    onCancelPressed();
  };

  const handleFiles = (file: any, id: string) => {
    setModelState((prev: any) => {
      let files = prev.files;
      files[id] = file;
      return { ...prev, files };
    });
  };

  const handleChange = (event: any) => {
    const target = event.target;
    const name = target.name;
    setModelState((prev: any) => ({
      ...prev,
      [name]: target.value,
    }));
  };

  useEffect(() => {
    if(!loading) {
      onCancelPressed();
    }
  }, [loading]);

  const handleSubmit = (model: any) => {
    onSubmitPressed(model)
  };

  const handleSnackBarClose = () => {
    setSnackBar({showSnackbar: false});
  };

  const saveDefaultConfig = (model: any) => {
    setDefaultLoader(true)
    saveDefaultConfigService(model)
      .then((res: any) => res.data)
      .then(
        (result) => {
          setDefaultLoader(false)
          setSnackBar({showSnackbar: true, status: 'success', message: 'Default Config Saved Successfully !!'})
        },
        (error) => {
          setDefaultLoader(false)
          setSnackBar({showSnackbar: true, status: 'error', message: 'Default Config Failed to Save !!'})
        }
      );
  }

  return (
    <>
      <Dialog
        maxWidth={"md"}
        fullWidth={true}
        open={openState}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className={classes.dialogTitle}>
          <span>Torchserve Configuration</span>
          <div className={classes.clearIcon} onClick={handleClose}>
            <CloseSharp />
          </div>
        </DialogTitle>
        <DialogContent dividers className={classes.dialogContent}>
          <StartTorchServer
            model={modelState}
            handleChange={handleChange}
            handleFileChange={handleFiles}
          />
        </DialogContent>
        <DialogActions className={classes.footer}>
          <Button
            variant="contained"
            className={`${classes.footerButton} ${classes.footerSpace}`}
            onClick={() => saveDefaultConfig(modelState)}
          >
            {defaultLoader && <CircularProgress className={classes.circle} size={20} />}
            {!defaultLoader && 'Save As Default'}  
          </Button>
          {/* <Button variant="contained" onClick={onClick} disabled={loading}>
            {loading && <CircularProgress size={14} />}
            {!loading && 'Click Me'}
          </Button>         */}
          <Button
            variant="contained"
            className={classes.footerButton}
            onClick={() => handleSubmit(modelState)}
            autoFocus
          >
            {loading && <CircularProgress className={classes.circle} size={20} />}
            {!loading && 'Start Torchserve'}  
          </Button>
        </DialogActions>
      </Dialog>
    
      <Snackbar open={snackBar.showSnackbar} autoHideDuration={6000} onClose={handleSnackBarClose}>
        {snackBar.status && <Alert severity={snackBar.status}> {snackBar.message} </Alert>}
      </Snackbar> 
    </>
  );
};

export default StartTorchServerDialogComponent;
