import React, { FC, useState } from "react";
import Button from "@mui/material/Button";
import { createStyles, makeStyles, StylesProvider } from "@mui/styles";

// components
import Header from "../header/header";
import Dashboard from "../dashboard/dashboard";

// constants

const useStyles = makeStyles((theme: any) =>
  createStyles({
    root: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    button: {
      backgroundColor: "red !important",
      width: "10px",
    },
  })
);

const Layout: FC<any> = () => {
  const classes = useStyles();
  const [showDashborad, setshowDashboard] = useState(false);
  const setStatus = (status: boolean) => {
    setshowDashboard(status)
  }
  return (
    <StylesProvider>
      <div>
        <Header setStatus={setStatus}/>
      </div>
      {showDashborad ? (
        <div>
          <Dashboard />
        </div>
      ) : (
        ""
      )}
      <></>
    </StylesProvider>
  );
};

export default Layout;
