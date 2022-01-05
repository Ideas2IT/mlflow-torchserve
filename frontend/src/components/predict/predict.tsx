import { FileUploader } from "react-drag-drop-files";
import React, { ReactElement, FC } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { PredictDialogComponentProps } from "./predict-dialog-popup";
import { Button } from "@mui/material";

const useStyles = makeStyles((theme: any) =>
  createStyles({
    fileUpload: {
      textAlign: "center",
      padding: "70px",
    },
    resetUpload: {
      paddingLeft: '40px'
    }
  })
);

export interface PredictComponentProps {
  model: PredictDialogComponentProps;
  handleFileChange: (fileContent: any, isReset: boolean) => void;
}

const Predict: FC<PredictComponentProps> = (
  props: PredictComponentProps
): ReactElement => {
  const classes = useStyles();
  const { model, handleFileChange } = props;

  return (
    <div>
      <div>
        <span>
          <b>Model </b>:{" "}
        </span>
        <span>{model.model_name}</span>
      </div>
      <div className={classes.fileUpload}>
        {!!!model.model_inputPath ? (
          <FileUploader handleChange={handleFileChange} name="file" />
        ) : (
            <div> 
              <span> {model.model_inputPath.name} </span> 
              <span className={classes.resetUpload}>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleFileChange(null, true);
                  }}
                >
                  {" "}
                  Reset{" "}
              </Button>
            </span>
            </div>
        )}
        {/* <CloudUploadIcon fontSize="large" /> */}
        {/* <div>Drag and drop file(s) here</div> */}
      </div>
    </div>
  );
};
// function DragDrop() {
//   //   const fileTypes = [];
//   const handleChange = (file: any) => {
//     setFile(file);
//     console.log(file);
//   };
//   return (
//     <>
//       {!!!file ? (
//         <FileUploader handleChange={handleFileChange} name="file" />
//       ) : (
//         file.name
//       )}
//     </>
//   );
// }

export default Predict;
