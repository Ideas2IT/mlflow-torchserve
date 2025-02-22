import React, { FC, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { createStyles, makeStyles } from "@mui/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseSharp from "@mui/icons-material/CloseSharp";
import Create from "./create";
import { DialogComponentProps, SnackBarComponentProps } from "../dashboard/dashboard";
import { createService } from "../../services/api-service";
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
    footerButton: {
      padding: "5px 11px",
    },
    dialogContent: {
      paddingBottom: "30px",
    },
    circle: {
      color: 'blue',
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
  };
  extra_files_list: any;
}

const CreateDialogComponent: FC<DialogComponentProps> = (
  props: DialogComponentProps
) => {
  const classes = useStyles();
  const { open, onCancelPressed = () => {} } = props;
  // const [newModal, setNewModal] = useState({
  //   name: "",
  //   version: "",
  // });
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
    },
    extra_files_list: [],
  };
  const [openState, setOpenState] = useState<boolean>(open);
  const [loading, setLoading] = useState<boolean>(false);
  const [modelState, setModelState] =
    useState<CreateDialogComponentProps>(defaultModelData);
  const [snackBar, setSnackBar] = useState<SnackBarComponentProps>({showSnackbar: false});

  useEffect(() => {
    setOpenState(open);
  }, [open]);

  const handleClose = () => {
    setOpenState(false);
    setModelState(defaultModelData);
    onCancelPressed();
  };

  const handleSnackBarClose = () => {
    setSnackBar({showSnackbar: false});
  };

  const handleFiles = (file: any, id: string) => {
    if (id === "extra_files") {
      setModelState((prev: any) => {
        let files = [];
        for (let i = 0; i < file.length; i++) {
          files.push(file[i]);
        }
        return { ...prev, extra_files_list: files };
      });
    } else {
      setModelState((prev: any) => {
        let files = prev.files;
        files[id] = file;
        return { ...prev, files };
      });
    }
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
    setLoading(true);
    createService(constructCreatePayload(modelState))
      .then((res) => res.data)
      .then(
        (result) => {
          setLoading(false);
          if (result.data && result.data.name) {
            let [name, version] = result.data.name.split("/");
            // setNewModal({
            //   name,
            //   version,
            // });
            props.newModal({ name, version });
          }
          setSnackBar({showSnackbar: true, status: 'success', message: 'Model created Successfully !!'})
          handleClose();
        },
        (error) => {
          setLoading(false);
          setSnackBar({showSnackbar: true, status: 'error', message: 'Model creation Failed !!'})
          let result = { name: "titanic/8.0" };
          if (result && result.name) {
            let [name, version] = result.name.split("/");
            props.newModal({ name, version });
          }
          // handleClose();
        }
      );
  };

  const constructCreatePayload = (createObj: CreateDialogComponentProps) => {
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
    createObj.extra_files_list.length === 0
      ? formData.append("extra_file", createObj.extra_files)
      : createObj.extra_files_list.forEach((file: any, index: number) => {
          formData.append("extra_file_" + (index + 1), file);
        });
    return formData;
  };

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
          {/* <Button
            variant="contained"
            className={classes.footerButton}
            onClick={handleSubmit}
            autoFocus
          >
            Create
          </Button> */}
          <Button
            variant="contained"
            className={classes.footerButton}
            disabled={loading}
            onClick={handleSubmit}
            autoFocus
          >
            {loading && <CircularProgress className={classes.circle} size={20} />}
            {!loading && 'Create'}
          </Button>
        </DialogActions>
      </Dialog> 

      <Snackbar open={snackBar.showSnackbar} autoHideDuration={6000} onClose={handleSnackBarClose}>
        {snackBar.status && <Alert severity={snackBar.status}> {snackBar.message} </Alert>}
      </Snackbar>   
    </>
  );
};

export default CreateDialogComponent;