import { FileUploader } from "react-drag-drop-files";
import React, { ReactElement, useState, FC } from "react";
import { createStyles, makeStyles } from "@mui/styles";

// constants
import { PredictDialogComponentProps } from "./predict-dialog-popup";
import { Button } from "@mui/material";

const useStyles = makeStyles((theme: any) =>
  createStyles({
    fields: {
      padding: '5px 0px'
    },
    fileName: {
      paddingTop: '13px',
      paddingBottom: '5px'
    },
    download: {
      padding: '0px 20px',
    },
    divider: {
      borderTop: '1px solid rgba(0, 0, 0, 0.12)'
    },
    explain: {
      width: '100%',
      height: '350px',
      backgroundColor: '#F2F2F2'
    }, 
    explainTitle: {
      paddingBottom: '20px'
    }
  })
);

export interface PredictResultComponentProps {
  model: PredictDialogComponentProps;
}

const PredictResult: FC<PredictResultComponentProps> = (
  props: PredictResultComponentProps
): ReactElement => {
  const classes = useStyles();
  const [openExplanation, setOpenExplanation] = useState<boolean>(false);
  const { model } = props;

  console.log("model>>>>>>>>>>>>>>>>>>>>", model)

  return (
    <>
      <div>
        <div className={classes.fields}><b>Model</b> : {"  " + model.model_name}</div>
        <div className={classes.fileName}><b>File</b> : {"  " + model?.model_inputPath?.name}</div>
        <div className={classes.fields}>
            <span><b>Output</b> : {"  " + model.model_output?.data}</span>
            <span className={classes.download}>
              <a
                href={`data:text/json;charset=utf-8,${encodeURIComponent(
                  JSON.stringify(model.model_output)
                )}`}
                download="model.json"
              >
                {`Download Json`}
              </a>
            </span>
            <span>
              <Button
              variant="contained"
              onClick={() => setOpenExplanation(true)}
              autoFocus
            >
              Explain
            </Button>
          </span>
        </div>
      </div> 
      { openExplanation &&
      <div>
        <br />
        <hr className={classes.divider}/>
        <br />
        <div>
            <div className={classes.explainTitle}><b>Explanation</b></div>
            <div className={classes.explain}></div>
        </div>
      </div>}
    </>
  );
};

export default PredictResult;
