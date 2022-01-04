import React, { ReactElement, useState, FC, useEffect } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { Button, Chip, TextField } from "@mui/material";
import { CreateDialogComponentProps } from "./create-dialog-popup";
import { FileUpload } from "../../shared/file-upload";

const useStyles = makeStyles((theme: any) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "space-between",
    },
    otherRoot: {
      display: "flex",
    },
    firstRowPadding: {
      padding: "5px 0px 10px 0px",
    },
    otherRowPadding: {
      padding: "10px 0px",
    },
    firstFieldRow: {
      paddingRight: '50px'
    },
    fieldName: {
      paddingBottom: "8px",
    },
    textField: {
      width: "100%",
      height: '35px',
      marginTop: '5px'
    },
    fileUpload: {
      paddingTop: "28px",
    },
    addFileUpload: {
      paddingTop: '28px',
      paddingLeft: '283px'
    },
    resetFileUpload: {
      paddingTop: "28px",
      paddingLeft: "105px",
    },
    choiceOrOption: {
      padding: '32px 40px 0px 50px'
    },
    main: {
      '& .MuiFormControl-root': {
        width: '350px'
      },
      '& .MuiInputLabel-root': {
        marginTop: '5px'
      }
    }
  })
);

export interface CreateComponentProps {
  model: CreateDialogComponentProps;
  handleChange: (event: any) => void;
  handleFileChange: (file: any, id: string) => void;
}

const Create: FC<CreateComponentProps> = (
  props: CreateComponentProps
): ReactElement => {
  const classes = useStyles();
  const { model, handleChange, handleFileChange } = props;
  const [extra_files, setExtraFiles] = useState(model.extra_files_list);
  useEffect(() => {
    setExtraFiles(model.extra_files_list);
  }, [model.extra_files_list]);
  return (
    <div className={classes.main}>
      <div className={`${classes.root} ${classes.firstRowPadding}`}>
        <div className={classes.firstFieldRow}>
          <div className={classes.fieldName}>Model Name</div>
          <TextField
            id="outlined-basic model_name"
            name="model_name"
            className={classes.textField}
            value={model.model_name}
            onChange={handleChange}
            placeholder="Model Name"
            size="small"
            variant="outlined"
          />
        </div>

        <div className={classes.firstFieldRow}>
          <div className={classes.fieldName}>Target</div>
          <TextField
            id="outlined-basic target"
            name="target"
            size="small"
            value={model.target}
            onChange={handleChange}
            disabled
            className={classes.textField}
            variant="outlined"
          />
        </div>
      </div>

      {!model.files.model_url ? (
        <div className={`${classes.otherRoot} ${classes.otherRowPadding}`}>
          <div>
            <div className={classes.fieldName}>Model URL</div>
            <TextField
              id="outlined-basic model_url"
              className={classes.textField}
              name="model_url"
              value={model.model_url}
              onChange={handleChange}
              size="small"
              placeholder="Enter URL path or drag and drop file here"
              variant="outlined"
            />
          </div>
          <div className={classes.choiceOrOption}>or</div>
          <div className={classes.fileUpload}>
            <FileUpload
              id="model_url"
              handleFileChange={handleFileChange}
              multipleFiles={false}
            />
          </div>
        </div>
      ) : (
        <div className={`${classes.otherRoot} ${classes.otherRowPadding}`}>
          <div>
            <div className={classes.fieldName}>Model URL</div>
            <TextField
              id="outlined-basic model_file_url"
              className={classes.textField}
              name="model_file_url"
              value={model.files.model_url.name}
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
                handleFileChange(null, "model_url");
              }}
            >
              {" "}
              Reset{" "}
            </Button>
          </div>
        </div>
      )}

      {!model.files.model_file ? (
        <div className={`${classes.otherRoot} ${classes.otherRowPadding}`}>
          <div>
            <div className={classes.fieldName}>Model File</div>
            <TextField
              id="outlined-basic model_file_url"
              className={classes.textField}
              name="model_file"
              value={model.model_file}
              onChange={handleChange}
              size="small"
              placeholder="Enter URL path or drag and drop file here"
              variant="outlined"
            />
          </div>
          <div className={classes.choiceOrOption}>or</div>
          <div className={classes.fileUpload}>
            <FileUpload
              id="model_file"
              handleFileChange={handleFileChange}
              multipleFiles={false}
            />
          </div>
        </div>
      ) : (
        <div className={`${classes.otherRoot} ${classes.otherRowPadding}`}>
          <div>
            <div className={classes.fieldName}>Model URL</div>
            <TextField
              id="outlined-basic model_file_name"
              className={classes.textField}
              name="model_file_name"
              value={model.files.model_file.name}
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
                handleFileChange(null, "model_file");
              }}
            >
              {" "}
              Reset{" "}
            </Button>
          </div>
        </div>
      )}

      {!model.files.handler_file ? (
        <div className={`${classes.otherRoot} ${classes.otherRowPadding}`}>
          <div>
            <div className={classes.fieldName}>Model Handler</div>
            <TextField
              id="outlined-basic handler_file"
              className={classes.textField}
              name="handler_file"
              value={model.handler_file}
              onChange={handleChange}
              size="small"
              placeholder="Enter URL path or drag and drop file here"
              variant="outlined"
            />
          </div>
          <div className={classes.choiceOrOption}>or</div>
          <div className={classes.fileUpload}>
            <FileUpload
              id="handler_file"
              handleFileChange={handleFileChange}
              multipleFiles={false}
            />
          </div>
        </div>
      ) : (
        <div className={`${classes.otherRoot} ${classes.otherRowPadding}`}>
          <div>
            <div className={classes.fieldName}>Model Handler</div>
            <TextField
              id="outlined-basic handler_file_name"
              className={classes.textField}
              name="handler_file_name"
              value={model.files.handler_file.name}
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
                handleFileChange(null, "handler_file");
              }}
            >
              {" "}
              Reset{" "}
            </Button>
          </div>
        </div>
      )}

      {extra_files.length === 0 ? (
        <div className={`${classes.otherRoot} ${classes.otherRowPadding}`}>
          <div>
            <div className={classes.fieldName}>Extra Files</div>
            {/* <TextField
              id="outlined-basic extra_files"
              className={classes.textField}
              name="extra_files"
              value={model.extra_files}
              onChange={handleChange}
              size="small"
              placeholder="Enter URL path or drag and drop file here"
              variant="outlined"
            /> */}
            <TextField
              id="outlined-basic extra_files"
              name="extra_files"
              multiline
              rows={4}
              value={model.extra_files}
              onChange={handleChange}
              placeholder="Enter URL path or drag and drop file here"
              variant="outlined"
            />
            {/* <TextareaAutosize
              id="outlined-basic extra_files"
              className={classes.textField}
              name="extra_files"
              value={model.extra_files}
              onChange={handleChange}
              maxRows={4}
              minRows={4}
              placeholder="Enter URL path or drag and drop file here"
              style={{ width: 345 }}
            /> */}
          </div>
          <div className={classes.choiceOrOption}>or</div>
          <div className={classes.fileUpload}>
            <FileUpload
              id="extra_files"
              handleFileChange={handleFileChange}
              multipleFiles={true}
            />
          </div>
        </div>
      ) : (
        <div className={`${classes.otherRoot} ${classes.otherRowPadding}`}>
          <div>
            <div className={classes.fieldName}>Extra Files</div>
            {extra_files.map((file: any, index: number) => (
              <Chip
                label={file.name}
                key={index}
                onDelete={() => {
                  let files = extra_files;
                  files = files.filter((file: any, i: number) => index !== i);
                  setExtraFiles(files);
                  handleFileChange(files, 'extra_files');
                }}
              />
            ))}
            {/* <TextField id="outlined-basic extra_files_name" 
                        className={classes.textField}
                        name="extra_files_name"
                        value={model.files.extra_files.name}
                        size="small"
                        variant="outlined" 
                        InputProps={{
                            readOnly: true,
                        }}/> */}
          </div>
          {/*<div className={classes.resetFileUpload}>
             <Button variant="contained"
                        onClick={() => {
                            handleFileChange(null, 'extra_files')
                        }}
                    > Reset </Button> 
          </div>*/}
          <div className={classes.addFileUpload}>
            <FileUpload
              id="extra_files"
              handleFileChange={handleFileChange}
              multipleFiles={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Create;
