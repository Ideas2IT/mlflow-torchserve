import React, { ReactElement, FC, useEffect } from "react";
import { createStyles, makeStyles, StylesProvider } from "@mui/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button } from "@mui/material";

// constants
import { PAGE_TITLE_DASHBOARD } from "../../utils/constants";

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
    },
    headerOptions: {
      display: "flex",
    },
    headerOptionsText: {
      padding: "10px 40px",
      width: "80px",
      textAlign: "center",
    },
  })
);

const Header: FC<any> = ({ setStatus }): ReactElement => {
  const [serverStarted, setServerStatus] = React.useState(false);
  const [server, setServer] = React.useState("TorchServe_1");
  const classes = useStyles();
  useEffect(() => {
    setStatus(serverStarted);
  }, [serverStarted]);
  return (
    <StylesProvider injectFirst>
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
            {serverStarted ? "Running" : "Ideal"}
          </div>
          <Button
            variant="contained"
            id="headerOptionsBtn"
            onClick={() => {
              const endpoint = !serverStarted ? 'start_torchserve' : 'stop_torchserve'
                fetch("http://localhost:5021/" + endpoint, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  }
                })
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
            }}
          >
            {serverStarted ? "Stop" : "Start"}
          </Button>
        </div>
      </div>
    </StylesProvider>
  );
};

export default Header;
