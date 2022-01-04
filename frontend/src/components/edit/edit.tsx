import React, { ReactElement, useState, FC } from "react";
import { createStyles, makeStyles } from '@mui/styles';

// constants
import { PAGE_TITLE_DASHBOARD } from "../../utils/constants";
import { Button, Grid, TextField } from "@mui/material";
import { ClassNames } from "@emotion/react";
import { EditDialogComponentProps } from "./edit-dialog-popup";
import { FileUpload } from "../../shared/file-upload";
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';

const useStyles = makeStyles((theme: any) =>
  createStyles({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: '5px'
    },
    firstRowPadding: {
        padding: '5px 10px 10px 0px',
        float: 'left',
        width: '60%',
        // borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    },
    firstFieldRow: {
        position: 'relative',
        width: '50%'
    },
    otherFieldRow: {
        position: 'relative',
        width: '100%',
        wordBreak: 'break-all',
        padding: '10px 0px'
    },
    editFieldRow: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    otherEditFieldRow: {
        paddingTop: '5px'
    },
    fieldName: {
        paddingBottom: '8px',
        fontWeight: '500'
    },
    fieldContent: {
        paddingBottom: '8px',
    },
    editContent: {
        float: 'right',
        width: '35%',
        marginLeft: '10px',
        paddingLeft: '20px',
        borderLeft: '1px solid rgba(0, 0, 0, 0.12)'
    },
    textField: {
        width: '35%'
    },
    editDetail: {
        width: '60%'
    },
    editTitle: {
        paddingTop: '10px'
    },
    icon: {
        padding: '11px',
        cursor: 'pointer'
    },
    batchWorker: {
        padding: '9px'
    }
  })
);

export interface EditComponentProps {
    model: EditDialogComponentProps,
    handleChange: (event: any) => void
    handleVariation: (event: any, isIncreased?: boolean) => void
}

const Edit: FC<EditComponentProps> = (props: EditComponentProps): ReactElement => {
    const classes = useStyles();
    const {
        model,
        handleChange,
        handleVariation
    } = props;
    
    return (
        <div>
            <div className={classes.firstRowPadding}>
                <div className={classes.root}>
                    <div className={classes.firstFieldRow}>
                        <div className={classes.fieldName}>Model Name</div>
                        <div className={classes.fieldContent}>{model.modelName}</div>
                    </div>

                    <div className={classes.firstFieldRow}>
                        <div className={classes.fieldName}>Target</div>
                        <div className={classes.fieldContent}>{model.target}</div>
                    </div>
                </div>

                <div>
                    <div className={classes.otherFieldRow}>
                        <div className={classes.fieldName}>Model URL</div>
                        <div className={classes.fieldContent}>{model.modelUrl}</div>
                    </div>
                </div>

                 <div>
                    <div className={classes.otherFieldRow}>
                        <div className={classes.fieldName}>Model Version</div>
                        <div className={classes.fieldContent}>{model.modelVersion}</div>
                    </div>
                </div>

                {/*<div>
                    <div className={classes.otherFieldRow}>
                        <div className={classes.fieldName}>Handler</div>
                        <div className={classes.fieldContent}>{model.handler_file}</div>
                    </div>
                </div> */}

                {/* <div>
                    <div className={classes.otherFieldRow}>
                        <div className={classes.fieldName}>Extra File</div>
                        <div className={classes.fieldContent}>{model.extra_files}</div>
                    </div>
                </div> */}

            </div>
            <div className={classes.editContent}>
                <div className={classes.editFieldRow}>
                    <div className={`${classes.fieldName} ${classes.editTitle}`}>Min Workers</div>
                    <div className={classes.editDetail}>
                        <RemoveCircleOutlinedIcon className={classes.icon} 
                            onClick={(event:any) => handleVariation("min_workers")} fontSize="small"/>
                        <TextField id="outlined-basic min_workers"
                            name="min_workers"
                            className={classes.textField}
                            value={model.minWorkers}
                            onChange={handleChange}
                            size="small"
                            variant="outlined" />
                        <AddCircleOutlinedIcon className={classes.icon} 
                            onClick={(event:any) => handleVariation("min_workers", true)} fontSize="small"/>                                
                    </div>
                </div>

                <div className={`${classes.editFieldRow} ${classes.otherEditFieldRow}`}>
                    <div className={`${classes.fieldName} ${classes.editTitle}`}>Max Workers</div>
                    <div className={classes.editDetail}>
                        <RemoveCircleOutlinedIcon className={classes.icon} 
                            onClick={(event:any) => handleVariation("max_workers")} fontSize="small"/>
                        <TextField id="outlined-basic max_workers"
                            name="max_workers"
                            className={classes.textField}
                            value={model.maxWorkers}
                            onChange={handleChange}
                            size="small"
                            variant="outlined" />
                        <AddCircleOutlinedIcon className={classes.icon} 
                            onClick={(event:any) => handleVariation("max_workers", true)} fontSize="small"/>                                
                    </div>
                </div>

                <div className={`${classes.editFieldRow} ${classes.otherEditFieldRow}`}>
                    <div className={`${classes.fieldName} ${classes.editTitle}`}>Batch Size</div>
                    <div className={classes.editDetail}>
                        <RemoveCircleOutlinedIcon className={classes.icon} 
                            onClick={(event:any) => handleVariation("batch_size")} fontSize="small"/>
                        <TextField id="outlined-basic batch_size"
                            name="batch_size"
                            className={classes.textField}
                            value={model.batchSize}
                            onChange={handleChange}
                            size="small"
                            variant="outlined" />
                        <AddCircleOutlinedIcon className={classes.icon} 
                            onClick={(event:any) => handleVariation("batch_size", true)}   fontSize="small"/>                                
                    </div>
                </div>

                <div className={`${classes.editFieldRow} ${classes.otherEditFieldRow}`}>
                    <div className={`${classes.fieldName} ${classes.editTitle}`}>Max Batch Delay</div>
                    <div className={`${classes.editFieldRow} ${classes.batchWorker}`}>
                        <TextField id="outlined-basic max_batch_delay"
                            name="max_batch_delay"
                            className={classes.textField}
                            value={model.maxBatchDelay}
                            onChange={handleChange}
                            size="small"
                            variant="outlined" />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Edit;