import { FileUploader } from "react-drag-drop-files";
import React, { ReactElement, useState, FC } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import parse from 'html-react-parser';

// constants
import { PredictDialogComponentProps } from "./predict-dialog-popup";
import { Button } from "@mui/material";
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
  const { model } = props;

  const explainCall = () => {
    const explain = {
      model: model?.model_inputPath
    }
    explainService(explain)
      .then((res: any) => res.data)
      .then(
        (result) => {
          if (result.type === 'html') {
            setOpenExplainHtml(result.data)
          } else if (result.type === 'image') {
            setOpenExplainImg(result.data)
          }
         
        },
        (error) => {
        //   // setOpenExplainImg()
        //   setOpenExplainHtml(`<table width: 100%>
        //   <div style="border-top: 1px solid; margin-top: 5px;             padding-top: 5px; display: inline-block">
        //     <b>Legend: </b><span style="display: inline-block; width: 10px; height: 10px;                 border: 1px solid; background-color:                 hsl(0, 75%, 60%)"></span>
        //     Negative
        //     <span style="display: inline-block; width: 10px; height: 10px;                 border: 1px solid; background-color:                 hsl(0, 75%, 100%)"></span>
        //     Neutral
        //     <span style="display: inline-block; width: 10px; height: 10px;                 border: 1px solid; background-color:                 hsl(120, 75%, 50%)"></span>
        //     Positive </div>
        //   <tr>
        //     <th>True Label</th>
        //     <th>Predicted Label</th>
        //     <th>Attribution Label</th>
        //     <th>Attribution Score</th>
        //     <th>Word Importance</th>
        //   <tr>
        //     <td><text style="padding-right:2em"><b>Business</b></text></td>
        //     <td><text style="padding-right:2em"><b>Business (0.75)</b></text></td>
        //     <td><text style="padding-right:2em"><b>world</b></text></td>
        //     <td><text style="padding-right:2em"><b>-0.12</b></text></td>
        //     <td><mark style="background-color: hsl(0, 75%, 65%); opacity:1.0;                     line-height:1.75">
        //         <font color="black"> this </font>
        //       </mark><mark
        //         style="background-color: hsl(120, 75%, 84%); opacity:1.0;                     line-height:1.75">
        //         <font color="black"> year </font>
        //       </mark><mark
        //         style="background-color: hsl(120, 75%, 99%); opacity:1.0;                     line-height:1.75">
        //         <font color="black"> business </font>
        //       </mark><mark
        //         style="background-color: hsl(120, 75%, 92%); opacity:1.0;                     line-height:1.75">
        //         <font color="black"> is </font>
        //       </mark><mark
        //         style="background-color: hsl(120, 75%, 88%); opacity:1.0;                     line-height:1.75">
        //         <font color="black"> good </font>
        //       </mark></td>
        //   <tr>
        // </table>`)
        }
      );
  }

  // console.log("model>>>>>>>>>>>>>>>>>>>>", model)

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
            {openExplainImg && <img className={classes.explain} src={`data:image/jpeg;base64,${openExplainImg}`} />}
            { openExplainHtml && parse(openExplainHtml) }
          </div>
        </div>
      </div>
      
      }
    </>
  );
};

export default PredictResult;
