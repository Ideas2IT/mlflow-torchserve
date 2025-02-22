import React, { FC, useState, useEffect } from "react";
import CreateDialogComponent from "../create/create-dialog-popup";
import { getListService } from "../../services/api-service";
import EditDialogComponent from "../edit/edit-dialog-popup";
import PredictDialogComponent, {
  PredictDialogComponentProps,
} from "../predict/predict-dialog-popup";
import PredictResultDialogComponent from "../predict/predict-result-dialog-popup";
import { createStyles, makeStyles } from "@mui/styles";
import { AlertColor, Backdrop, Button, Chip, CircularProgress } from "@mui/material";
import DeleteDialogComponent from "../delete/delete-dialog-popup";

const useStyles = makeStyles((theme: any) =>
  createStyles({
    dashboardCntr: {
      width: "100%",
      margin: "0 auto",
    },
    dashboardTable: {
      margin: "0 auto",
      padding: "40px 80px",
    },
    tableHeader: {
      border: "2px solid black",
      display: "flex",
      padding: "15px",
      marginTop: "20px",
    },
    tableBody: {
      border: "1px solid grey",
      borderBottom: 0,
      maxHeight: "288px",
      overflowY: "scroll",
    },
    tableBodyRow: {
      display: "flex",
      padding: "10px 15px",
      borderBottom: "1px solid",
    },
    tableHeaderContent: {
      fontWeight: "bold",
      marginRight: "30px",
    },
    tableBodyContent: {
      marginRight: "30px",
    },
    tableHeaderContent__name: {
      width: "15%",
    },
    tableHeaderContent__scripts: {
      width: "30%",
    },
    tableHeaderContent__status: {
      width: "10%",
    },
    tableBodyContent__name: {
      fontWeight: "bold",
      width: "15%",
      paddingTop: "5px",
    },
    tableBodyContent__scripts: {
      width: "30%",
    },
    tableBodyContent__status: {
      paddingTop: "7px",
      width: "10%",
    },
    controlButton: {
      marginRight: "10px",
      backgroundColor: "rgb(35, 116, 187)",
      borderColor: "rgb(35, 116, 187)",
    },
    "controlButton:hover": {
      color: "rgb(35, 116, 187)",
      backgroundColor: "white",
    },
  })
);

export interface DialogComponentProps {
  open: boolean;
  modelName?: string;
  newModal?: any;
  predictModel?: any;
  loading?: any
  onCancelPressed?: () => void;
  onSubmitPressed?: (model?: any) => void;
  onPreditAnotherPressed?: (modelName: string) => void;
  listModel?: () => void;
}

export interface SnackBarComponentProps {
  showSnackbar: boolean,
  status?: AlertColor,
  message?: string
}

const Dashboard: FC<any> = () => {
  const classes = useStyles();

  const getListServiceApiCall = () => {
    setloader(true);
    getListService()
      .then((res) => res.json())
      .then(
        (result) => {
          setModels(result);
          setloader(false);
        },
        (error) => {
          setloader(false);
        }
      );
  };

  const createDefaultDlgProps: DialogComponentProps = {
    open: false,
    onCancelPressed: () => {
      setCreateDlgProps(createDefaultDlgProps);
    },
  };
  const [createDlgProps, setCreateDlgProps] = useState<DialogComponentProps>(
    createDefaultDlgProps
  );
  const handleCreateClick = () => {
    setCreateDlgProps((prev: any) => ({
      ...prev,
      open: true,
    }));
  };

  const deleteDefaultDlgProps: DialogComponentProps = {
    open: false,
    modelName: "",
    listModel: getListServiceApiCall,
    onCancelPressed: () => {
      setDeleteDlgProps(editDefaultDlgProps);
    },
  };
  const [deleteDlgProps, setDeleteDlgProps] =
    useState<DialogComponentProps>(deleteDefaultDlgProps);
  const handleDeleteClick = (modelName: string) => {
    setDeleteDlgProps((prev: any) => ({
      ...prev,
      open: true,
      modelName,
      listModel: getListServiceApiCall,
      onCancelPressed: () => {
        setDeleteDlgProps(editDefaultDlgProps);
      },
    }));
  };

  const editDefaultDlgProps: DialogComponentProps = {
    open: false,
    modelName: "",
    onCancelPressed: () => {
      setEditDlgProps(editDefaultDlgProps);
    },
  };
  const [editDlgProps, setEditDlgProps] =
    useState<DialogComponentProps>(editDefaultDlgProps);
  const handleEditClick = (modelName: string) => {
    setEditDlgProps((prev: any) => ({
      ...prev,
      open: true,
      modelName,
    }));
  };

  const populateModal = (modal: any) => {
    getListServiceApiCall();
    // models.push({ modelName: modal.name, version: modal.verion });
  };

  const preditResultDefaultDlgProps: DialogComponentProps = {
    open: false,
    predictModel: {},
    onCancelPressed: () => {
      setPredictResultDlgProps(preditResultDefaultDlgProps);
    },
  };
  const [predictResultDlgProps, setPredictResultDlgProps] =
    useState<DialogComponentProps>(preditResultDefaultDlgProps);

  const preditDefaultDlgProps: DialogComponentProps = {
    open: false,
    modelName: "",
    onCancelPressed: () => {
      setPredictDlgProps(preditDefaultDlgProps);
    },
  };
  const [predictDlgProps, setPredictDlgProps] = useState<DialogComponentProps>(
    preditDefaultDlgProps
  );
  const handlePreditClick = (modelName: string) => {
    setPredictDlgProps((prev: any) => ({
      ...prev,
      open: true,
      modelName,
      onSubmitPressed: (model: PredictDialogComponentProps) => {
        setPredictDlgProps(preditDefaultDlgProps);
        setPredictResultDlgProps((prev: any) => ({
          ...prev,
          open: true,
          predictModel: model,
          onPreditAnotherPressed: (modelName: string) => {
            setPredictResultDlgProps(predictResultDlgProps);
            handlePreditClick(modelName);
          },
        }));
      },
    }));
  };

  const [loading, setloader] = useState(true);
  const [models, setModels] = useState<any>([]);
  useEffect(() => {
    getListServiceApiCall();
  }, []);

  return (
    <>
      <CreateDialogComponent {...createDlgProps} newModal={populateModal} />
      <EditDialogComponent {...editDlgProps} />
      <PredictDialogComponent {...predictDlgProps} />
      <PredictResultDialogComponent {...predictResultDlgProps} />
      <DeleteDialogComponent {...deleteDlgProps} />

      <div className={classes.dashboardCntr}>
        <div className={classes.dashboardTable}>
          <div style={{ textAlign: "right" }}>
            <Button variant="contained" onClick={handleCreateClick}>
              New
            </Button>
          </div>
              <div className={classes.tableHeader}>
                <div
                  className={[
                    classes.tableHeaderContent,
                    classes.tableHeaderContent__name,
                  ].join(" ")}
                >
                  Model Name
                </div>
                <div
                  className={[
                    classes.tableHeaderContent,
                    classes.tableHeaderContent__scripts,
                  ].join(" ")}
                >
                  Scripts
                </div>
                <div
                  className={[
                    classes.tableHeaderContent,
                    classes.tableHeaderContent__status,
                  ].join(" ")}
                >
                  Status
                </div>
              </div>
              <div className={classes.tableBody}>
                {models.length !== 0 ? models.map((model: any, index: number) => (
                  <div key={index} className={classes.tableBodyRow}>
                    <div
                      className={[
                        classes.tableBodyContent,
                        classes.tableBodyContent__name,
                      ].join(" ")}
                    >
                      {/* {console.log(model)} */}
                      {model.modelName}
                    </div>
                    <div
                      className={[
                        classes.tableBodyContent,
                        classes.tableBodyContent__scripts,
                      ].join(" ")}
                    >
                      <Chip label="Chip Filled" />
                    </div>
                    <div
                      className={[
                        classes.tableBodyContent,
                        classes.tableBodyContent__status,
                      ].join(" ")}
                    >
                      Running
                    </div>
                    <div>
                      <Button
                        className={classes.controlButton}
                        variant="contained"
                        onClick={() => handlePreditClick(model.modelName)}
                      >
                        Predict
                      </Button>
                      {/* <Button
                        variant="contained"
                        className={classes.controlButton}
                      >
                        Explain
                      </Button> */}
                      <Button
                        className={classes.controlButton}
                        variant="contained"
                        onClick={() => handleEditClick(model.modelName)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        className={classes.controlButton}
                        onClick={() => handleDeleteClick(model.modelName)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )) : <div className={classes.tableBodyRow}>
                  <span style={{margin: '0 auto'}}> No data found </span></div>}
              </div>
          {loading ? (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* <Snackbar open={true} autoHideDuration={6000} onClose={() => {}}>
        <Alert onClose={() => {}} severity="success" sx={{ width: '100%' }}>
          This is a success message!
        </Alert>
      </Snackbar> */}
    </>
  );
};

export default Dashboard;
