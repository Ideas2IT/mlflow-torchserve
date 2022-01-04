import React, { ReactElement, useState, FC, useEffect } from "react";
import { createStyles, makeStyles } from "@mui/styles";

// constants
import { PAGE_TITLE_DASHBOARD } from "../../utils/constants";
import { Button, Chip, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextareaAutosize, TextField } from "@mui/material";
import { ClassNames } from "@emotion/react";
import { FileUpload } from "../../shared/file-upload";
import { ServerDialogComponentProps } from "./start-torch-server-dialog-popup";

const useStyles = makeStyles((theme: any) =>
  createStyles({
    root: {

    },
    otherRoot: {
      display: "flex",
    },
    otherRowPadding: {
      // padding: "10px 0px",
    },
    fieldName: {
      paddingBottom: "8px",
    },
    textField: {
      width: "350px",
      height: '35px',
      marginTop: '5px',
      paddingLeft: '30px'
    },
    resetFileUpload: {
      paddingTop: "7px",
      paddingLeft: "50px",
    },
    choiceOrOption: {
      padding: '15px 40px 0px 50px'
    },
    fileUpload: {
      paddingTop: "7px",
    },
    row: {
      display: "flex",
      paddingTop: "16px"
    },
    firstRow: {
      display: "flex",
      paddingTop: "25px"
    },
    optionTitle: {
      width: "22%",
      paddingTop: '14px'
    }
  })
);

export interface StartTorchServerComponentProps {
  model: ServerDialogComponentProps;
  handleChange: (event: any) => void;
  handleFileChange: (file: any, id: string) => void;
}

const StartTorchServer: FC<StartTorchServerComponentProps> = (
  props: StartTorchServerComponentProps
): ReactElement => {
  const classes = useStyles();
  const { model, handleChange, handleFileChange } = props;

  return (
    <div className={classes.root}>
      <div>
        <div><b>Model Store</b></div>
        <div>
          <RadioGroup
            name="model_store_choice"
            value={model.model_store_choice}
            onChange={handleChange}
          >
            <FormControlLabel value="start_with_previous_model" control={<Radio />} label="Start with previous session models" />
            <FormControlLabel value="start_new_instance" control={<Radio />} label="Start a clean instance" />
            <FormControlLabel value="is_model_store_path" control={<Radio />} label="Config property" />
          </RadioGroup>
        </div>
        {!model.files.model_store_path ? (
          <div className={`${classes.otherRoot} ${classes.otherRowPadding}`}>
            <div>
              <TextField
                id="outlined-basic model_store_path"
                className={classes.textField}
                name="model_store_path"
                value={model.model_store_path}
                onChange={handleChange}
                size="small"
                placeholder="Enter URL path or drag and drop file here"
                variant="outlined"
              />
            </div>
            <div className={classes.choiceOrOption}>or</div>
            <div className={classes.fileUpload}>
              <FileUpload
                id="model_store_path"
                handleFileChange={handleFileChange}
                multipleFiles={false}
              />
            </div>
          </div>
        ) : (
          <div className={`${classes.otherRoot} ${classes.otherRowPadding}`}>
            <div>
              <TextField
                id="outlined-basic model_store_path"
                className={classes.textField}
                name="model_store_path"
                value={model.files.model_store_path.name}
                size="small"
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className={classes.resetFileUpload}>
              <Button
                variant="contained"
                onClick={() => {
                  handleFileChange(null, "model_store_path");
                }}
              >
                {" "}
                Reset{" "}
              </Button>
            </div>
          </div>
        )}
      </div>
      <div>
        <div className={classes.firstRow}>
          <div className={classes.optionTitle}><b>Inference Address</b></div>
          <TextField
            id="outlined-basic inference_address"
            className={classes.textField}
            name="inference_address"
            value={model.inference_address}
            onChange={handleChange}
            size="small"
            placeholder="Enter URL path or drag and drop file here"
            variant="outlined"
          />
        </div>
        <div className={classes.row}>
          <div className={classes.optionTitle}><b>Management Address</b></div>
          <TextField
            id="outlined-basic management_address"
            className={classes.textField}
            name="management_address"
            value={model.management_address}
            onChange={handleChange}
            size="small"
            placeholder="Enter URL path or drag and drop file here"
            variant="outlined"
          />
        </div>
        <div className={classes.row}>
          <div className={classes.optionTitle}><b>Metrics Address</b></div>
          <TextField
            id="outlined-basic metrics_address"
            className={classes.textField}
            name="metrics_address"
            value={model.metrics_address}
            onChange={handleChange}
            size="small"
            placeholder="Enter URL path or drag and drop file here"
            variant="outlined"
          />
        </div>
        <div className={classes.row}>
          <div className={classes.optionTitle}><b>Model Store</b></div>
          <TextField
            id="outlined-basic model_store"
            className={classes.textField}
            name="model_store"
            value={model.model_store}
            onChange={handleChange}
            size="small"
            placeholder="Enter URL path or drag and drop file here"
            variant="outlined"
          />
        </div>
      </div>
    </div>
  );
};

export default StartTorchServer;
