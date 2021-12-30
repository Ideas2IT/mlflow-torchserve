import React, { FC, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { createStyles, makeStyles } from "@mui/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseSharp from "@mui/icons-material/CloseSharp";
import Create from "./create";
import { DialogComponentProps } from "../dashboard/dashboard";
import { createService } from "../../services/api-service";

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

export interface CreateDialogComponentProps {
  model_name: string;
  target: string;
  model_url: string;
  model_file: string;
  handler_file: string;
  extra_files: string;
  files: {
    model_url: any;
    model_file: any;
    handler_file: any;
    extra_files: any;
  };
}

const CreateDialogComponent: FC<DialogComponentProps> = (
  props: DialogComponentProps
) => {
  const classes = useStyles();
  const { open, onCancelPressed = () => {} } = props;

  const defaultModelData = {
    model_name: "",
    target: "Torchserve 1",
    model_url: "",
    model_file: "",
    handler_file: "",
    extra_files: "",
    files: {
      model_url: null,
      model_file: null,
      handler_file: null,
      extra_files: [],
    },
  };
  const [openState, setOpenState] = useState<boolean>(open);
  const [modelState, setModelState] =
    useState<CreateDialogComponentProps>(defaultModelData);

  useEffect(() => {
    setOpenState(open);
  }, [open]);

  const handleClose = () => {
    setOpenState(false);
    setModelState(defaultModelData);
    onCancelPressed();
  };

  const handleFiles = (file: any, id: string) => {
    // if (id === "extra_files") {
    //   setModelState((prev: any) => {
    //     let files = prev.files;
    //     files[id] = [...files[id], file];
    //     return { ...prev, files };
    //   });
    // } else {
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

  const handleSubmit = () => {
    createService(constructCreatePayload(modelState))
      .then((res) => res.data.json())
      .then(
        (result) => {
          console.log(result);
          handleClose();
        },
        (error) => {}
      );
  };

  const constructCreatePayload = (createObj: CreateDialogComponentProps) => {
    console.log(createObj)
    const formData = new FormData();
    formData.append("model_name", createObj.model_name);
    formData.append("target", createObj.target);
    formData.append(
      "model_url",
      createObj.files.model_url
        ? createObj.files.model_url
        : createObj.model_url
    );
    formData.append(
      "model_file",
      createObj.files.model_file
        ? createObj.files.model_file
        : createObj.model_file
    );
    formData.append(
      "handler_file",
      createObj.files.handler_file
        ? createObj.files.handler_file
        : createObj.handler_file
    );
    formData.append(
      "extra_files",
      createObj.files.extra_files
        ? createObj.files.extra_files
        : createObj.extra_files
    );
    return formData;
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
        <span>Create Model</span>
        <div className={classes.clearIcon} onClick={handleClose}>
          <CloseSharp />
        </div>
      </DialogTitle>
      <DialogContent dividers className={classes.dialogContent}>
        <Create
          model={modelState}
          handleChange={handleChange}
          handleFileChange={handleFiles}
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
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDialogComponent;
