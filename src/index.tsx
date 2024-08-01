import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
//import reportWebVitals from './reportWebVitals';
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./utility/context/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = createTheme({
  palette: {
    primary: {
      //main: '#063970'
      main: '#101058'
    },
    secondary: {
      main: '#E33E7F'
    },
    error: {
      main: '#cb0e00'
    },
    info: {
      main: '#5211ea'
    }
  },
  typography: {
    // subtitle1: {
    //   fontSize: 12,
    // },
    // body1: {
    //   fontWeight: 500,
    // },
    // button: {
    //   fontStyle: 'italic',
    // },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          textAlign: "center",
          border: "1px solid rgba(224, 224, 224, 1)"
        }
      }
    },
    MuiGrid: {
      styleOverrides: {
        root: {

          //width: "100%",
          // margin: 0
        }
      }
    }
  }
});
// theme.typography.h3 = {
//   fontSize: '1.2rem',
//   '@media (min-width:600px)': {
//     fontSize: '1.5rem',
//   },
//   [theme.breakpoints.up('md')]: {
//     fontSize: '2.4rem',
//   },
// };
//use useContext(AuthContext) for fetching currentUser. Don't use this pattern
// let loggedInUser = localStorage.getItem("currentUser");
// let isLoggedIn = false;

// useEffect(() => {
//   
//   loggedInUser = localStorage.getItem("currentUser");
//   isLoggedIn = (loggedInUser === '' || loggedInUser === undefined || loggedInUser === null||loggedInUser==="{}") ? false : true;
// }, [isLoggedIn])

root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <Container maxWidth="xl"> */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
        {/* </Container> */}
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);

{
  /* <Footer
        title=""
        description="Something here to give the footer a purpose!"
      /> */
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(//console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
