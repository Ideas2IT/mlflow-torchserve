import React, { ReactElement, useState, FC } from "react";
import { createStyles, makeStyles } from '@mui/styles';

// constants
import { PAGE_TITLE_DASHBOARD } from "../../utils/constants";
import { Button, Grid, TextField } from "@mui/material";
import { ClassNames } from "@emotion/react";
import { CreateDialogComponentProps } from "./create-dialog-popup";
import { FileUpload } from "../../shared/file-upload";

const useStyles = makeStyles((theme: any) =>
  createStyles({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    otherRoot: {
        display: 'flex',
    },
    firstRowPadding: {
        padding: '5px 0px 10px 0px'
    },
    otherRowPadding: {
        padding: '10px 0px'
    },
    firstFieldRow: {
        position: 'relative',
        width: '45%'
    },
    otherFieldRow: {
        position: 'relative',
        width: '78%'
    },
    fieldName: {
        paddingBottom: '8px'
    },
    textField: {
        width: '100%'
    },
    fileUpload: {
        paddingTop: '28px'
    },
    resetFileUpload: {
        paddingTop: '28px',
        paddingLeft: '50px'
    },
    choiceOrOption: {
        paddingTop: '32px'
    }
  })
);

export interface CreateComponentProps {
    model: CreateDialogComponentProps,
    handleChange: (event: any) => void
    handleFileChange: (fileContent: any, file: any, id: string) => void
}

const Create: FC<CreateComponentProps> = (props: CreateComponentProps): ReactElement => {
    const classes = useStyles();
    const {
        model,
        handleChange,
        handleFileChange
    } = props;
    
    return (
        <div>
            <div className={`${classes.root} ${classes.firstRowPadding}`}>
                <div className={classes.firstFieldRow}>
                    <div className={classes.fieldName}>Model Name</div>
                    <TextField id="outlined-basic model_name"
                        name="model_name"
                        className={classes.textField}
                        value={model.model_name}
                        onChange={handleChange}
                        size="small"
                        variant="outlined" />
                </div>

                <div className={classes.firstFieldRow}>
                    <div className={classes.fieldName}>Target</div>
                    <TextField id="outlined-basic target" 
                        name="target"
                        size="small"
                        value={model.target}
                        onChange={handleChange}
                        className={classes.textField}
                        variant="outlined" />
                </div>
            </div>

            {!model.files.model_url ? <div className={`${classes.root} ${classes.otherRowPadding}`}>
                <div className={classes.otherFieldRow}>
                    <div className={classes.fieldName}>Model URL</div>
                    <TextField id="outlined-basic model_url" 
                        className={classes.textField}
                        name="model_url"
                        value={model.model_url}
                        onChange={handleChange}
                        size="small"
                        placeholder="Enter URL path or drag and drop file here"
                        variant="outlined" />
                </div>
                <div className={classes.choiceOrOption}>or</div>
                <div className={classes.fileUpload}>
                    <FileUpload id="model_url" handleFileChange={handleFileChange}/>
                </div>
            </div> : 
            <div className={`${classes.otherRoot} ${classes.otherRowPadding}`}>
                <div className={classes.otherFieldRow}>
                    <div className={classes.fieldName}>Model URL</div>
                    <TextField id="outlined-basic model_file_url" 
                        className={classes.textField}
                        name="model_file_url"
                        value={model.files.model_url.details.name}
                        size="small"
                        variant="outlined" 
                        InputProps={{
                            readOnly: true,
                        }}/>
                </div>
                <div className={classes.resetFileUpload}>
                    <Button variant="contained"
                        onClick={() => {
                            handleFileChange(null, null, 'model_url')
                        }}
                    > Reset </Button>
                </div>
            </div> }

            {!model.files.model_file ? <div className={`${classes.root} ${classes.otherRowPadding}`}>
                <div className={classes.otherFieldRow}>
                    <div className={classes.fieldName}>Model File</div>
                    <TextField id="outlined-basic model_file_url" 
                        className={classes.textField}
                        name="model_file"
                        value={model.model_file}
                        onChange={handleChange}
                        size="small"
                        placeholder="Enter URL path or drag and drop file here"
                        variant="outlined" />
                </div>
                <div className={classes.choiceOrOption}>or</div>
                <div className={classes.fileUpload}>
                    <FileUpload id="model_file" handleFileChange={handleFileChange}/>
                </div>
            </div> : 
            <div className={`${classes.otherRoot} ${classes.otherRowPadding}`}>
                <div className={classes.otherFieldRow}>
                    <div className={classes.fieldName}>Model URL</div>
                    <TextField id="outlined-basic model_file_name" 
                        className={classes.textField}
                        name="model_file_name"
                        value={model.files.model_file.details.name}
                        size="small"
                        variant="outlined" 
                        InputProps={{
                            readOnly: true,
                        }}/>
                </div>
                <div className={classes.resetFileUpload}>
                    <Button variant="contained"
                        onClick={() => {
                            handleFileChange(null, null, 'model_file')
                        }}
                    > Reset </Button>
                </div>
            </div> }

            {!model.files.handler_file ? <div className={`${classes.root} ${classes.otherRowPadding}`}>
                <div className={classes.otherFieldRow}>
                    <div className={classes.fieldName}>Model Handler</div>
                    <TextField id="outlined-basic handler_file" 
                        className={classes.textField}
                        name="handler_file"
                        value={model.handler_file}
                        onChange={handleChange}
                        size="small"
                        placeholder="Enter URL path or drag and drop file here"
                        variant="outlined" />
                </div>
                <div className={classes.choiceOrOption}>or</div>
                <div className={classes.fileUpload}>
                    <FileUpload id="handler_file" handleFileChange={handleFileChange}/>
                </div>
            </div> : 
            <div className={`${classes.otherRoot} ${classes.otherRowPadding}`}>
                <div className={classes.otherFieldRow}>
                    <div className={classes.fieldName}>Extra Files</div>
                    <TextField id="outlined-basic handler_file_name" 
                        className={classes.textField}
                        name="handler_file_name"
                        value={model.files.handler_file.details.name}
                        size="small"
                        variant="outlined" 
                        InputProps={{
                            readOnly: true,
                        }}/>
                </div>
                <div className={classes.resetFileUpload}>
                    <Button variant="contained"
                        onClick={() => {
                            handleFileChange(null, null, 'handler_file')
                        }}
                    > Reset </Button>
                </div>
            </div> }

            {!model.files.extra_files ? <div className={`${classes.root} ${classes.otherRowPadding}`}>
                <div className={classes.otherFieldRow}>
                    <div className={classes.fieldName}>Model URL</div>
                    <TextField id="outlined-basic extra_files" 
                        className={classes.textField}
                        name="extra_files"
                        value={model.extra_files}
                        onChange={handleChange}
                        size="small"
                        placeholder="Enter URL path or drag and drop file here"
                        variant="outlined" />
                </div>
                <div className={classes.choiceOrOption}>or</div>
                <div className={classes.fileUpload}>
                    <FileUpload id="extra_files" handleFileChange={handleFileChange}/>
                </div>
            </div> : 
            <div className={`${classes.otherRoot} ${classes.otherRowPadding}`}>
                <div className={classes.otherFieldRow}>
                    <div className={classes.fieldName}>Model URL</div>
                    <TextField id="outlined-basic extra_files_name" 
                        className={classes.textField}
                        name="extra_files_name"
                        value={model.files.extra_files.details.name}
                        size="small"
                        variant="outlined" 
                        InputProps={{
                            readOnly: true,
                        }}/>
                </div>
                <div className={classes.resetFileUpload}>
                    <Button variant="contained"
                        onClick={() => {
                            handleFileChange(null, null, 'extra_files')
                        }}
                    > Reset </Button>
                </div>
            </div> }
        </div>
    );
};

export default Create;