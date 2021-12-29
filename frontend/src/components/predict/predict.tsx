import React, { ReactElement, useState, FC } from "react";
import { createStyles, makeStyles } from '@mui/styles';

// constants
import { PAGE_TITLE_DASHBOARD } from "../../utils/constants";
import { Button, Grid, TextField } from "@mui/material";
import { ClassNames } from "@emotion/react";
import { PredictDialogComponentProps } from "./predict-dialog-popup";
import { FileUpload } from "../../shared/file-upload";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const useStyles = makeStyles((theme: any) =>
  createStyles({
    fileUpload: {
        textAlign: 'center',
        padding: '70px'
    },
  })
);

export interface PredictComponentProps {
    model: PredictDialogComponentProps,
    handleFileChange: (fileContent: any, file: any, id: string) => void
}

const Predict: FC<PredictComponentProps> = (props: PredictComponentProps): ReactElement => {
    const classes = useStyles();
    const {
        model,
        handleFileChange
    } = props;
    
    return (
        <div>
            <div>
                <span><b>Model </b>: </span>
                <span>{model.model_name}</span>
            </div>
            <div className={classes.fileUpload}>
                <CloudUploadIcon fontSize="large"/>
                <div>Drag and drop file(s) here</div>
            </div>

        </div>
    );
};

export default Predict;