import React, { FC, createRef } from "react";
import Button from '@mui/material/Button';
import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) =>
  createStyles({
    root: {
        display: "flex", 
        alignItems: "center"
    }
  })
);

export interface FileUploadComponentProps {
    id: string,
    handleFileChange: (fileContent: any, file: any, id: string) => void
}

export const FileUpload: FC<FileUploadComponentProps> = (props: FileUploadComponentProps) => {
    const classes = useStyles();
    const uploadInputRef = createRef<HTMLInputElement>();
    const {
        id,
        handleFileChange
    } = props;

    return (
        <div className={classes.root}>
          <Button
            variant="contained"
            onClick={() => {
                uploadInputRef?.current?.click();
            }}
          >
            Upload
          </Button>
          <input
            type="file"
            ref={uploadInputRef}
            id={id}
            onChange={(event: any) => {
              const file = event?.target?.files[0];
              const reader = new FileReader();
              reader.onload = () => {
                handleFileChange(reader.result, event.target.files[0], id);
              };
              reader.readAsText(file);
            }}
            style={{ display: "none" }}
          />
        </div>
      );
}