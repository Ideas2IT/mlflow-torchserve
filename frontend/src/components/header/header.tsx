import React, { ReactElement, FC, useEffect, useState } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button } from "@mui/material";
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';

// constants
import { PAGE_TITLE_DASHBOARD } from "../../utils/constants";
import { DialogComponentProps } from "../dashboard/dashboard";
import StartTorchServerDialogComponent from "./start-torch-server-dialog-popup";
import { serverStatus } from "../../services/api-service";

const useStyles = makeStyles((theme: any) =>
  createStyles({
    headerCntr: {
      border: "2px solid black",
      padding: "10px 30px",
      display: "flex",
      justifyContent: "space-between",
    },
    headerTitle: {
      fontWeight: "bold",
      lineHeight: "36px",
      paddingTop: "10px",
      fontSize: "20px"
    },
    headerOptions: {
      display: "flex",
    },
    headerOptionsText: {
      padding: "20px 40px 10px",
      width: "80px",
      textAlign: "center",
      display: "flex"
    },
    headerOptionsBtn: {
      width: '125px'
    },
    serverStatus: {
      paddingLeft: '12px'
    }
  })
);

const Header: FC<any> = ({ setStatus }): ReactElement => {
  const [serverStarted, setServerStatus] = React.useState(false);
  const [server, setServer] = React.useState("TorchServe_1");
  const classes = useStyles();

  useEffect(() => {
    setStatus(serverStarted);
  }, [serverStarted]);

  const serverStatusChange = (model: any, endpoint: string = 'start_torchserve') => {
    console.log("model>>>>>>>>>>>>>>>>>>>>>>>>", model)
    console.log("endpoint>>>>>>>>>>>>>>>>", endpoint)
    serverStatus(model, endpoint)
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status.toUpperCase() === "SUCCESS") {
            setServerStatus(!serverStarted);
          }
        },
        (error) => {
          setServerStatus(!serverStarted);
        }
      );
  }

  const torchServerDefaultDlgProps: DialogComponentProps = {
    open: false,
    onCancelPressed: () => {
      setTorchServerDlgProps(torchServerDefaultDlgProps);
    },
    onSubmitPressed: (model: any, setAsDefault: boolean) => {
      if(!setAsDefault) {
        serverStatusChange(model);
      }
    }
  };

  const [torchServerDlgProps, setTorchServerDlgProps] =
    useState<DialogComponentProps>(torchServerDefaultDlgProps);

  const handleStartTorchServerClick = () => {
    setTorchServerDlgProps((prev: any) => ({
      ...prev,
      open: true,
    }));
  };

  return (
    <>
      <StartTorchServerDialogComponent {...torchServerDlgProps} />
      
      <div className={classes.headerCntr}>
        <div className={classes.headerTitle}>{PAGE_TITLE_DASHBOARD}</div>
        <div className={classes.headerOptions}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Server</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={server}
              label="server"
              onChange={(event) => {
                setServer(event.target.value);
              }}
            >
              <MenuItem value={"TorchServe_1"}>TorchServe 1</MenuItem>
            </Select>
          </FormControl>
          <div className={classes.headerOptionsText}>
            {serverStarted && <span><CircleRoundedIcon color="success" fontSize="small"/></span>}
            <span className={serverStarted? classes.serverStatus: ''}>
              {serverStarted ? "Running" : "Ideal"}
            </span>
          </div>
          <Button
            variant="contained"
            className={classes.headerOptionsBtn}
            onClick={() => !serverStarted? handleStartTorchServerClick(): serverStatusChange(null, 'stop_torchserve')}
          >
            {serverStarted ? "Stop" : "Start"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Header;
