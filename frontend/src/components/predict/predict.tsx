import { FileUploader } from "react-drag-drop-files";
import React, { ReactElement, FC } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { PredictDialogComponentProps } from "./predict-dialog-popup";

const useStyles = makeStyles((theme: any) =>
  createStyles({
    fileUpload: {
      textAlign: "center",
      padding: "70px",
    },
  })
);

export interface PredictComponentProps {
  model: PredictDialogComponentProps;
  handleFileChange: (fileContent: any, file: any, id: string) => void;
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
            model.model_inputPath.name
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
