import React, { useEffect } from 'react'
// import { Box, Grid, Stack, TextField, CardHeader, CardActionArea, CardActions, Card, CardContent, CardMedia, FormControlLabel, Checkbox, Button, AppBar, Container, CssBaseline, Paper, ThemeProvider, Toolbar, Typography, createTheme } from "@mui/material";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {
  DataGrid,
  gridPageSelector,
  gridPageCountSelector,
  useGridApiContext,
  useGridSelector,
  useGridApiRef,
  GridInitialState,
} from '@mui/x-data-grid';
//import { useDemoData } from '@mui/x-data-grid-generator';
import Pagination from '@mui/material/Pagination';
import { Button, CircularProgress, Grid, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useForm from '../../utility/hooks/UseForm';
// var __html = require('../../../public/aboutUs.js');
// var template = { __html: __html };

//const theme = createTheme();
// function Examples() {
//   return (
//     <>
//       <Card>
//         <CardHeader title="Title Goes Here" />
//         <CardContent>
//           <Typography variant="body2" color="text.secondary">
//             Lizards are a widespread group of squamate reptiles, with over 6,000
//             species, ranging across all continents except Antarctica
//           </Typography>
//         </CardContent>
//         <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
//           <Stack spacing={2} direction="row">
//             <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}
// >Submit</Button>
//             <Button variant="outlined"  startIcon={<ArrowBackIcon />} href="/admin">Back To List</Button>
//           </Stack>
//         </CardActions>
//       </Card>

//       <Card sx={{ maxWidth: 345 }}>
//         <CardHeader
//           title="Shrimp and Chorizo Paella"
//           subheader="September 14, 2016" 
//         />
//         <CardContent>
//           <Typography gutterBottom variant="h5" component="div">
//             Lizard
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Lizards are a widespread group of squamate reptiles, with over 6,000
//             species, ranging across all continents except Antarctica
//           </Typography>
//         </CardContent>
//         <CardActions>
//           <Button size="small">Share</Button>
//           <Button size="small">Learn More</Button>
//         </CardActions>
//       </Card>

//       <ThemeProvider theme={theme}>
//         <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
//           <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
//             <Typography variant="h5" align="center">
//               User
//             </Typography>

//             <React.Fragment>
//               {/* <Typography variant="h6" gutterBottom>
//            Shipping address
//          </Typography> 
//          className='dvDataGrid'*/}
//               <Grid container spacing={3}>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     required
//                     id="firstName"
//                     name="firstName"
//                     label="First name"
//                     fullWidth
//                     autoComplete="given-name"
//                     variant="standard"
//                   />

//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     required
//                     id="lastName"
//                     name="lastName"
//                     label="Last name"
//                     fullWidth
//                     autoComplete="family-name"
//                     variant="standard"
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     required
//                     id="address1"
//                     name="address1"
//                     label="Address line 1"
//                     fullWidth
//                     autoComplete="shipping address-line1"
//                     variant="standard"
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     id="address2"
//                     name="address2"
//                     label="Address line 2"
//                     fullWidth
//                     autoComplete="shipping address-line2"
//                     variant="standard"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     required
//                     id="city"
//                     name="city"
//                     label="City"
//                     fullWidth
//                     autoComplete="shipping address-level2"
//                     variant="standard"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     id="state"
//                     name="state"
//                     label="State/Province/Region"
//                     fullWidth
//                     variant="standard"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     required
//                     id="zip"
//                     name="zip"
//                     label="Zip / Postal code"
//                     fullWidth
//                     autoComplete="shipping postal-code"
//                     variant="standard"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     required
//                     id="country"
//                     name="country"
//                     label="Country"
//                     fullWidth
//                     autoComplete="shipping country"
//                     variant="standard"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     required
//                     id="firstName"
//                     name="firstName"
//                     label="First name"
//                     fullWidth
//                     autoComplete="given-name"
//                     variant="standard"
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <FormControlLabel
//                     control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
//                     label="Use this address for payment details"
//                   />
//                 </Grid>
//               </Grid>

//               <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//                 <Button
//                   variant="contained"
//                   //onClick={handleNext}
//                   sx={{ mt: 3, ml: 1 }}
//                 >
//                   Next
//                 </Button>
//               </Box>
//             </React.Fragment>
//           </Paper>

//         </Container>
//       </ThemeProvider></>
//   )
// }

// export default Examples

///////////////////////////////////////////////////////////////////////

export default function UseGridSelector() {
  const navigate = useNavigate();
  const apiRef = useGridApiRef();

  useEffect(() => {
    try {
      const stateJSON = localStorage.getItem("ORDERS_TABLE_STATE");
      if (stateJSON) apiRef.current.restoreState(JSON.parse(stateJSON));
    } catch (e) {
      console.log(e);
    }
  }, []);

  // const saveSnapshot = React.useCallback(() => {
  //   if (apiRef?.current && localStorage) {
  //     const currentState = apiRef.current.exportState();
  //     localStorage.setItem('dataGridState', JSON.stringify(currentState));
  //   }
  // }, [apiRef]);

  // if (!initialState) {
  //   return <CircularProgress />;
  // }
  //////////////////////////////////////////
  // const { data, loading } = useDemoData({
  //   dataSet: 'Commodity',
  //   rowLength: 100,
  //   maxColumns: 10,
  // });

  // const [paginationModel, setPaginationModel] = React.useState({
  //   pageSize: 10,
  //   page: 0,
  // });

  //const apiRef = useGridApiContext();
  // const apiRef = useGridApiRef();
  // const page = useGridSelector(apiRef, gridPageSelector);
  // const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  // useEffect(() => {
  //   try {
  //     const stateJSON = localStorage.getItem("ORDERS_TABLE_STATE");
  //     if (stateJSON) apiRef.current.restoreState(JSON.parse(stateJSON));
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, []);

  // const validate = (fieldValues: any = values) => {
  //   let temp: any = { ...errors };

  //   if ("SearchText" in fieldValues)
  //     temp.SearchText = fieldValues.SearchText ? "" : "Search Text is required.";

  //   setErrors({
  //     ...temp,
  //   });

  //   if (fieldValues === values)
  //     return Object.values(temp).every((x) => x === "");
  // };

  // const { values, setValues, errors, setErrors, handleInputChange } = useForm(
  //   societyBillsService.initialSearchItemRateValues,
  //   validate,
  //   ""
  // );

  return (
    <div style={{ height: 400, width: '100%' }}>

      <Button
        variant="contained"
        onClick={() => navigate("/login")}
      >
        Add
      </Button>

      <Button sx={{ marginLeft: 2 }}
        variant="contained"
        onClick={() => navigate("/html")}
      >
        Html
      </Button>

      {/* <DataGrid
        {...data}
        apiRef={apiRef}
        onColumnVisibilityModelChange={() => {
          const state = apiRef.current.exportState();
          localStorage.setItem("ORDERS_TABLE_STATE", JSON.stringify(state));
        }}
        // onColumnWidthChange={() => {
        //   const state = apiRef.current.exportState();
        //   localStorage.setItem("ORDERS_TABLE_STATE", JSON.stringify(state));
        // }}
      /> */}
    </div>
  );
}