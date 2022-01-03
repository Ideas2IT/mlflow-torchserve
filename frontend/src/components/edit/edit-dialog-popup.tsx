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
  model_name: string;
  target: string;
  model_url: string;
  model_file: string;
  handler_file: string;
  extra_files: string;
  export_files: string;
  min_workers: number;
  max_workers: number;
  batch_size: number;
  max_batch_delay: number;
  files?: {
    model_url: any;
    model_file: any;
    handler_file: any;
    extra_files: any;
  };
}

const EditDialogComponent: FC<DialogComponentProps> = (
  props: DialogComponentProps
) => {
  const classes = useStyles();
  const { open, onCancelPressed = () => {}, modelName } = props;

  const defaultModelData = {
    model_name: "",
    target: "Torchserve 1",
    model_url: "",
    model_file: "",
    handler_file: "",
    extra_files: "",
    export_files: "",
    min_workers: 1,
    max_workers: 1,
    batch_size: 1,
    max_batch_delay: 1,
    files: {
      model_url: null,
      model_file: null,
      handler_file: null,
      extra_files: null,
    },
    extra_files_list: [],
  };
  const [openState, setOpenState] = useState<boolean>(open);
  const [modelState, setModelState] =
    useState<EditDialogComponentProps>(defaultModelData);
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
            setModelState(result.items);
          },
          (error: any) => {
            setLoading(false);
            setModelState({
              model_name: "Titanic",
              target: "Torchserve",
              model_url:
                "https://cceyda.github.io/blog/torchserve/streamlit/dashboard/2020/10/15/torchserve.html",
              model_file:
                "https://cceyda.github.io/blog/torchserve/streamlit/dashboard/2020/10/15/torchserve.html",
              handler_file:
                "https://cceyda.github.io/blog/torchserve/streamlit/dashboard/2020/10/15/torchserve.html",
              extra_files:
                "https://cceyda.github.io/blog/torchserve/streamlit/dashboard/2020/10/15/torchserve.html",
              export_files:
                "https://cceyda.github.io/blog/torchserve/streamlit/dashboard/2020/10/15/torchserve.html",
              min_workers: 1,
              max_workers: 1,
              batch_size: 1,
              max_batch_delay: 100,
              files: {
                model_url: null,
                model_file: null,
                handler_file: null,
                extra_files: null,
              },
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

  return (
    !loading ? (
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
      </Backdrop>)
    
  );
};

export default EditDialogComponent;
