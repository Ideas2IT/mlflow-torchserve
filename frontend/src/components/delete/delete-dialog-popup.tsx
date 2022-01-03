import React, { FC, useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { createStyles, makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseSharp from '@mui/icons-material/CloseSharp';
import { DialogComponentProps, SnackBarComponentProps } from "../dashboard/dashboard";
import { deleteService, editService, getService } from "../../services/api-service";
import { Alert, AlertColor, Snackbar } from "@mui/material";
// import { createService } from "../../services/api-service";

const useStyles = makeStyles((theme: any) =>
  createStyles({
    root: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    dialogTitle: {
      padding: '3px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    clearIcon: {
      paddingTop: '8px',
      cursor: 'pointer'
    },
    footerButton: {
      padding: '5px 11px'
    }, 
    dialogContent: {
      paddingBottom: '30px'
    }
  })
);
     
const DeleteDialogComponent: FC<DialogComponentProps> = (props: DialogComponentProps) => {
    const classes = useStyles();  
    const {
        open,
        onCancelPressed = ()=> {},
        modelName
    } = props;

    const [openState, setOpenState] = useState<boolean>(open);
    const [snackBar, setSnackBar] = useState<SnackBarComponentProps>({showSnackbar: false});

    useEffect(() => {
        setOpenState(open);
    }, [open])
  
    const handleClose = () => {
      setOpenState(false);
      onCancelPressed();
    };

    const handleSnackBarClose = () => {
      setSnackBar({showSnackbar: false});
    };

    const handleSubmit = () => {
      deleteService(modelName)    
      .then(res => res.json())
      .then(
        (result) => {
          setSnackBar({showSnackbar: true, status: 'success', message: 'Model deleted Successfully !!'})
          handleClose();
        },
        (error) => {
          setSnackBar({showSnackbar: true, status: 'error', message: 'Model deletion Failed !!'})
        }
      )
    }

    return (
      <>  
        <Dialog
          maxWidth={'sm'}
          fullWidth={true}
          open={openState}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle className={classes.dialogTitle}>
            <span>Delete {modelName}</span>
            <div className={classes.clearIcon} onClick={handleClose}>
              <CloseSharp />
            </div> 
          </DialogTitle>
          <DialogContent dividers className={classes.dialogContent}>
              <div>Are you sure you want to delete ?</div>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" className={classes.footerButton} onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="error" className={classes.footerButton} onClick={handleSubmit} autoFocus>
                Delete
            </Button>
          </DialogActions>
        </Dialog>
        
        <Snackbar open={snackBar.showSnackbar} autoHideDuration={6000} onClose={handleSnackBarClose}>
          {snackBar.status && <Alert severity={snackBar.status}> {snackBar.message} </Alert>}
        </Snackbar>
      </>
    );
 }

 export default DeleteDialogComponent;