import React, { ReactElement, FC } from "react";
import { createStyles, makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// constants
import { PAGE_TITLE_DASHBOARD } from "../../utiils/constants";

const useStyles = makeStyles((theme: any) =>
  createStyles({
    root: {
        position: 'absolute',
        width: '100%',
        height: '70px',
        left: '0px',
        top: '0px',
        background: '#FFFFFF',
        border: '1px solid #000000',
        boxSizing: 'border-box',
        display: 'flex'
    },
    status: {
        display: 'flex',
        flexDirection: 'row-reverse'
    }
  })
);

const Header: FC<any> = (): ReactElement => {
    const classes = useStyles();

    const [age, setAge] = React.useState('');

    const handleChange = (event: any) => {
      setAge(event.target.value);
    };

    return (
        <div className={classes.root}>
            <div>
                {PAGE_TITLE_DASHBOARD}
            </div>
            <div className={classes.status}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Age"
                    onChange={handleChange}
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                </FormControl>
            </div>
        </div>
    );
};

export default Header;