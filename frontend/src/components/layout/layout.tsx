import React, { FC } from "react";
import Button from '@mui/material/Button';
import { createStyles, makeStyles } from '@mui/styles';


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
        width: '10px'
    }
  })
);
  
const Layout: FC<any> = () => {
    const classes = useStyles();
    return (
        <>
            <div>
                <Header />
            </div>
            <div>
                <Dashboard />
            </div>
        </>
    );
  };

  export default Layout;