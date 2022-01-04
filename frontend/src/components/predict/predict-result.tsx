import React, { ReactElement, useState, useEffect, FC } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import parse from 'html-react-parser';
import { PredictDialogComponentProps } from "./predict-dialog-popup";
import { Button, CircularProgress } from "@mui/material";
import { explainService } from "../../services/api-service";

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
      height: '250px',
      backgroundColor: '#F2F2F2'
    }, 
    explainTitle: {
      paddingBottom: '20px'
    },
    explainLoader: {
      textAlign: 'center',
      paddingTop: '125px'
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
  const [openExplainImg, setOpenExplainImg] = useState<any>();
  const [openExplainHtml, setOpenExplainHtml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const defaultModelData = {
    model_name: "",
    model_inputPath: null,
  };
  const [modelState, setModelState] = useState<PredictDialogComponentProps>(defaultModelData);
  const { model } = props;

  useEffect(() => {
    setModelState(model);
  }, [model]);

  const explainCall = () => {
    const formData = new FormData();
    formData.append("model_name", modelState.model_name);
    formData.append("model_inputPath", modelState.model_inputPath);
    setLoading(true)
    explainService(formData)
      .then((res: any) => res.data)
      .then(
        (result) => {
          setLoading(false)
          if (result.type === 'html') {
            setOpenExplainHtml(result.data)
          } else if (result.type === 'image') {
            setOpenExplainImg(result.data)
          }
         
        },
        (error) => {
          setLoading(false)
        }
      );
  }

  return (
    <>
      <div>
        <div className={classes.fields}><b>Model</b> : {"  " + modelState.model_name}</div>
        <div className={classes.fileName}><b>File</b> : {"  " + modelState?.model_inputPath?.name}</div>
        <div className={classes.fields}>
            <span><b>Output</b> : {"  " + modelState.model_output?.data}</span>
            <span className={classes.download}>
              <a
                href={`data:text/json;charset=utf-8,${encodeURIComponent(
                  JSON.stringify(modelState.model_output)
                )}`}
                download="model.json"
              >
                {`Download Json`}
              </a>
            </span>
            <span>
              <Button
              variant="contained"
              disabled={loading}
              onClick={() => {
                setOpenExplanation(true)
                explainCall()
              }}
              autoFocus
            >
              Explain
            </Button>
          </span>
        </div>
      </div> 
      { openExplanation &&
      // <div>
      //   <br />
      //   <hr className={classes.divider}/>
      //   <br />
      //   <div>
      //       <div className={classes.explainTitle}><b>Explanation</b></div>
      //       <div className={classes.explain}></div>
      //   </div>
      // </div>
      <div>
        <br />
        <hr className={classes.divider}/>
        <br />
        <div>
          <div className={classes.explainTitle}><b>Explanation</b></div>
          <div className={classes.explain}>
            { openExplainImg && <img className={classes.explain} src={`data:image/jpeg;base64,${openExplainImg}`} />}
            { openExplainHtml && parse(openExplainHtml) }
            { loading && 
              <div className={classes.explainLoader}>
                <CircularProgress /> 
              </div>
            }
          </div>
        </div>
      </div>
      
      }
    </>
  );
};

export default PredictResult;
