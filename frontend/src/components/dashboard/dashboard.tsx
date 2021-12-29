import React, { FC, useState, useEffect } from "react";
import { createStyles, makeStyles } from '@mui/styles';
import CreateDialogComponent from "../create/create-dialog-popup";
import { Backdrop, Button, Chip, CircularProgress } from "@mui/material";
import { getListService } from "../../services/api-service";
import EditDialogComponent from "../edit/edit-dialog-popup";
import PredictDialogComponent from "../predict/predict-dialog-popup";
import PredictResultDialogComponent from "../predict/predict-result-dialog-popup";

// constants


const useStyles = makeStyles((theme: any) =>
  createStyles({
    dashboardCntr: {
      width: "100%",
      margin: "0 auto",
    },
    dashboardTable: {
      margin: "0 auto",
      padding: "80px",
    },
    tableHeader: {
      border: "2px solid black",
      display: "flex",
      padding: "15px",
      marginTop: "20px"
    },
    tableBody: {
      border: "1px solid grey",
      borderBottom: 0,
      height: "288px",
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
      textDecoration: "underline",
      width: "15%",
    },
    tableBodyContent__scripts: {
      width: "30%",
    },
    tableBodyContent__status: {
      width: "10%",
    }
  })
);

export interface DialogComponentProps {
  open: boolean,
  modelName?: string,
  onCancelPressed?: () => void,
  onSubmitPressed?: () => void,
  onPreditAnotherPressed?: (modelName: string) => void
}

const Dashboard: FC<any> = () => {
    const classes = useStyles();

    const createDefaultDlgProps: DialogComponentProps = {
      open: false,
      onCancelPressed: () => {
        setCreateDlgProps(createDefaultDlgProps);
      },
    }
    const [createDlgProps, setCreateDlgProps] = useState<DialogComponentProps>(createDefaultDlgProps);
    const handleCreateClick = () => {
      setCreateDlgProps((prev: any) => ({
        ...prev,
        open: true
      }))
    };

    const editDefaultDlgProps: DialogComponentProps = {
      open: false,
      modelName: '',
      onCancelPressed: () => {
        setEditDlgProps(editDefaultDlgProps);
      },
    }
    const [editDlgProps, setEditDlgProps] = useState<DialogComponentProps>(editDefaultDlgProps);
    const handleEditClick = (modelName: string) => {
      setEditDlgProps((prev: any) => ({
        ...prev,
        open: true,
        modelName
      }))
    };

    const preditResultDefaultDlgProps: DialogComponentProps = {
      open: false,
      modelName: '',
      onCancelPressed: () => {
        setPredictResultDlgProps(preditResultDefaultDlgProps);
      }
    }
    const [predictResultDlgProps, setPredictResultDlgProps] = useState<DialogComponentProps>(preditResultDefaultDlgProps);

    const preditDefaultDlgProps: DialogComponentProps = {
      open: false,
      modelName: '',
      onCancelPressed: () => {
        setPredictDlgProps(preditDefaultDlgProps);
      }
    }
    const [predictDlgProps, setPredictDlgProps] = useState<DialogComponentProps>(preditDefaultDlgProps);
    const handlePreditClick = (modelName: string) => {
      setPredictDlgProps((prev: any) => ({
        ...prev,
        open: true,
        modelName,
        onSubmitPressed: () => {
          setPredictDlgProps(preditDefaultDlgProps);
          setPredictResultDlgProps((prev: any) => ({
            ...prev,
            open: true,
            modelName,
            onPreditAnotherPressed: (modelName: string) => {
              setPredictResultDlgProps(predictResultDlgProps)
              handlePreditClick(modelName)
            }
          }))
        }
      }))
    };

    const [loading, setloader] = useState(true);
    const [models, setModels] = useState<any>([]);
    useEffect(() => {
      getListService()
        .then((res) => res.json())
        .then(
          (result) => {
            setModels(result.items);
            setloader(false);
          },
          (error) => {
            setModels([
              { modelName: "squeezenet1_1", modelUrl: "squeezenet1_1.mar" },
              { modelName: "squeezenet2_1", modelUrl: "squeezenet2_1.mar" },
              { modelName: "squeezenet3_1", modelUrl: "squeezenet3_1.mar" },
              { modelName: "squeezenet3_1", modelUrl: "squeezenet3_1.mar" },
              { modelName: "squeezenet3_1", modelUrl: "squeezenet3_1.mar" },
              { modelName: "squeezenet3_1", modelUrl: "squeezenet3_1.mar" },
            ]);
            setloader(false);
          }
        );
    }, []);

    return (
        <>
          <CreateDialogComponent {...createDlgProps} />
          <EditDialogComponent {...editDlgProps} />
          <PredictDialogComponent {...predictDlgProps} />
          <PredictResultDialogComponent {...predictResultDlgProps} />
          <div className={classes.dashboardCntr}>
            <div className={classes.dashboardTable}>
            <div style={{textAlign: "right"}}>
              <Button variant="contained" onClick={handleCreateClick}>New</Button>
            </div>
              {!loading ? (
                <>
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
                    {models.map((model: any, index: number) => (
                      <div key={index} className={classes.tableBodyRow}>
                        <div
                          className={[
                            classes.tableBodyContent,
                            classes.tableBodyContent__name,
                          ].join(" ")}
                        >
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
                          <Button variant="contained" onClick={() => handlePreditClick(model.modelName)}>Predict</Button>
                          <Button variant="contained">Explain</Button>
                          <Button variant="contained" onClick={() => handleEditClick(model.modelName)}>Edit</Button>
                          <Button variant="contained">Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <Backdrop
                  sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={loading}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              )}
            </div>
          </div>
        </>
    );
  };

  export default Dashboard;