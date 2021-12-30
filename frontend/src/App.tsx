import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { StyledEngineProvider } from '@mui/material/styles';
import Layout from './components/layout/layout';


function App() {
  return (
    <>
      <StyledEngineProvider injectFirst>
        <Layout />
      </StyledEngineProvider>
    </>
  );
}

export default App;
