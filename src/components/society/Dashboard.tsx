import { Title } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
  Box,
  IconButton,
  TableBody,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { societiesService } from "../../services/SocietiesService";
import { GridColDef } from "@mui/x-data-grid";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import PeopleIcon from "@mui/icons-material/People";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import { dashboardService } from "../../services/DashboardService";
import { appInfoService } from "../../services/AppInfoService";
import { globalService } from "../../services/GlobalService";

const Dashboard = () => {
  const { societySubscriptionId }: any = useParams();
  const [summary, setSummary] = useState([]);
  const [showDashboard, setShowDashboard] = React.useState({});
  const [summaryPartB, setSummaryPartB] = useState([]);
  const [acBalancesForSociety, setAcBalancesForSociety] = useState([])
  //const [billGeneratedTill, setBillGeneratedTill] = useState([]);
  const SocietyId: any = localStorage.getItem("societyId");
  const navigate = useNavigate();

  // const getSocieties = (SocietyId: any) => {
  //     societiesService.getById(SocietyId).then((response) => {
  //       if (response) {

  //         let result = response.data;
  //         setValues(setFormValue(result.data));
  //       }
  //     });
  //   };
  useEffect(() => {
    //call GetAppInfo and set value for setShowDashboard
    getAppInfo();
  }, []);

  const getForDashboard = (SocietyId: any) => {
    dashboardService.getForDashboardPartA(SocietyId).then((response) => {
      let result = response.data;
      setSummary(result.summary);
      if (result.error) {
        globalService.error(result.error);
      }
      //setBillGeneratedTill(result.billGeneratedTill);
    });
  };

  const getForDashboardPartB = (SocietyId: any) => {
    dashboardService.getForDashboardPartB(SocietyId).then((response) => {
      let result = response.data;
      setSummaryPartB(result.summaryPartB);
      if (result.error) {
        globalService.error(result.error);
      }
    });
  };

  const getAppInfo = () => {
    appInfoService.getAppInfo().then((response) => {
      let result = response.data;
      var ShowDashboard = result.row.FlagInfo.Dashboard
      setShowDashboard(ShowDashboard)
      if (ShowDashboard === true) {
        getForDashboard(SocietyId);
        getForDashboardPartB(SocietyId);
        getAcBalancesForSociety(SocietyId);
      }
    })
  }

  const getAcBalancesForSociety = (SocietyId: any) => {
    dashboardService.getAcBalancesForSociety(SocietyId).then((response) => {
      let result = response.data;
      
      setAcBalancesForSociety(result.list);
    });
  };

  return (
    <>
      {showDashboard === true ? (
        <>
        <Typography variant="h5" align="center">
        Dashboard
        </Typography>
          <Grid container spacing={2} >
            {/* First Card */}
            {summary.map((item, index) => (
              <Grid item xs={12} sm={3} key={"1_" + index}>
                <Paper elevation={1} className="ds-paper">
                  <Box>
                    <Box className="db-box1">
                      <Grid container className="db-grid1">
                        <Grid item xs={8} key={"2_" + index}>
                          <Box className="db-box2">
                            <Typography
                              variant="button"
                              className="db-textHeader"
                            >
                              {item.Info}
                            </Typography>
                            <Typography variant="h5" className="db-textTotal">
                              {item.Tot}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4} className="css-1pdvnt5">
                          <Box className="css-19ioz2v">
                            <IconButton>
                              {item.Info.toUpperCase() === "TOTAL BUILDINGS" && (
                                <ApartmentIcon />
                              )}
                              {item.Info.toUpperCase() ===
                                "TOTAL UNITS" && <ViewModuleIcon />}
                              {item.Info.toUpperCase() === "TOTAL MEMBERS" && (
                                <PeopleIcon />
                              )}
                              {item.Info.toUpperCase() ===
                                "TOTAL PARKING LOTS" && (
                                  <EmojiTransportationIcon />
                                )}
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
            {/* Repeat the structure for other cards */}
          </Grid>

          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={12} sm={12}>
              <Paper sx={{ p: 1, display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" marginTop={-1} align="center">
                  Bills Information
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow key={"tb1"}>
                      <TableCell>Bill Abbreviation</TableCell>
                      <TableCell align="right">Bills Generated Till</TableCell>
                      <TableCell align="right">
                        Monthly Maintenance
                      </TableCell>
                      <TableCell align="right">Outstanding Amount</TableCell>
                      <TableCell align="right">Advance Amount</TableCell>
                      <TableCell align="right">Balance Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summaryPartB.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.BillAbbreviation}</TableCell>
                        <TableCell>{row.BillGeneratedTill}</TableCell>
                        <TableCell>{row.TotMonthlyMaintenance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{row.OutStandingBal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{row.AdvanceBal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{row.Balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                        {/* <TableCell align="right">{`$${row.Tot}`}</TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
            {/* Repeat the structure for other cards */}
          </Grid>
          {/* Cash And Bank Balances */}
          <Grid marginTop={1}>
            <Typography variant="h6" align="center" >
              Cash And Bank Balances
            </Typography>
            <Grid container spacing={2}>
              {acBalancesForSociety.map((item, index) => (
                <Grid item xs={12} sm={3} key={"1_" + index}>
                  <Paper elevation={1} className="db-color-box css-qipk4m">
                    <Box>
                      <Box className="db-box1">
                        <Grid container className="db-grid1">
                          <Grid item xs={12} key={"2_" + index}>
                            <Box className="db-box2" color="red">
                              <Typography
                                variant="button"
                                className="db-textHeader"
                              >
                                {item.AcHead}
                              </Typography>
                              <Typography variant="h5" className="db-textTotal" color={item.Balance < 0 ? "red" : "text-grey"}>
                                {item.Balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Stack
            spacing={2}
            direction="row"
            justifyContent={"center"}
            sx={{ marginTop: 2 }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/societySubscriptions/" + SocietyId)}
            >
              Back To Subscriptions
            </Button>
          </Stack>
        </>
      ) : <></>
      }
    </>
  );
};

export default Dashboard;
