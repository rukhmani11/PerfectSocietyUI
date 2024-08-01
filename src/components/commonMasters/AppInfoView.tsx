import { Card, CardContent, Grid, Stack, Typography, Divider, CardActions, Button, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { appInfoService } from "../../services/AppInfoService";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

function AppInfoView() {
    const [appInfo, setAppInfo] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        getSms();
    }, []);

    const getSms = () => {
        appInfoService.getAppInfo()
            .then((response: { data: any; }) => {
                let result = response.data;
                setAppInfo(result.row);
            });
    };

    return (
        <>
            <Stack direction="row" spacing={0} justifyContent="space-between">
                <Typography variant="h5">
                    App Info
                </Typography>
                <Button variant="contained" style={{ marginLeft: "15px", marginBottom:"5px"}}
                    onClick={() => navigate("/appInfo")}>
                    Edit
                </Button>
            </Stack>
            {appInfo && <Card>
                <CardContent>
                    <React.Fragment>
                        <Typography variant="h6" align="center" sx={{ marginTop: -1, marginBottom: 1 }}>Flag Info</Typography>
                        <Divider sx={{ marginY: 2 }} />
                        <Grid container spacing={3}>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Print GST Bills</Typography>
                                <Stack>
                                    {appInfo.FlagInfo?.GstBill && <DoneIcon color="success" />}
                                    {!appInfo.FlagInfo?.GstBill && <CloseIcon color="error" />}
                                </Stack>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Print Previous Year Values (Final Report For Audit - Schedule To Balance Sheet)</Typography>
                                <Stack>
                                    {appInfo.FlagInfo?.PreviousYear && <DoneIcon color="success" />}
                                    {!appInfo.FlagInfo?.PreviousYear && <CloseIcon color="error" />}
                                </Stack>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Monthly Charge (Excel Upload - Charge Head Mapped with Charges and Units)</Typography>
                                <Stack>
                                    {appInfo.FlagInfo?.MonthlyCharge && <DoneIcon color="success" />}
                                    {!appInfo.FlagInfo?.MonthlyCharge && <CloseIcon color="error" />}
                                </Stack>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Multi Lingual</Typography>
                                <Stack>
                                    {appInfo.FlagInfo?.MultiLingual && <DoneIcon color="success" />}
                                    {!appInfo.FlagInfo?.MultiLingual && <CloseIcon color="error" />}
                                </Stack>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Dashboard</Typography>
                                <Stack>
                                    {appInfo.FlagInfo?.Dashboard && <DoneIcon color="success" />}
                                    {!appInfo.FlagInfo?.Dashboard && <CloseIcon color="error" />}
                                </Stack>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Enable UPIPay Link</Typography>
                                <Stack>
                                    {appInfo.FlagInfo?.UPIPay && <DoneIcon color="success" />}
                                    {!appInfo.FlagInfo?.UPIPay && <CloseIcon color="error" />}
                                </Stack>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Other Report - Excel</Typography>
                                <Stack>
                                    {appInfo.FlagInfo?.OtherReportExcel && <DoneIcon color="success" />}
                                    {!appInfo.FlagInfo?.OtherReportExcel && <CloseIcon color="error" />}
                                </Stack>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Enable SSDocs Integration</Typography>
                                <Stack>
                                    {appInfo.FlagInfo?.SSDocsIntegration && <DoneIcon color="success" />}
                                    {!appInfo.FlagInfo?.SSDocsIntegration && <CloseIcon color="error" />}
                                </Stack>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label"></Typography><Typography variant="body2"></Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ marginY: 2 }} />
                        <Typography variant="h6" align="center" sx={{ marginTop: -1, marginBottom: 1 }}>Subscription & Others </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Abbreviation</Typography>
                                <Typography variant="body2">{appInfo.Abbreviation}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Currency</Typography>
                                <Typography variant="body2">{appInfo.Currency}</Typography>
                            </Grid>

                            <Grid item xs={6} sm={3}>
                                <Typography className="label">UOM</Typography>
                                <Typography variant="body2">{appInfo.Currency}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Subscription Tax</Typography>
                                <Typography variant="body2">{appInfo.Currency}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Subscription Invoice Due Days</Typography>
                                <Typography variant="body2">{appInfo.SubscriptionInvoiceDueDays}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Subscriber Terms</Typography>
                                <Typography variant="body2">{appInfo.SubscriberTerms}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Mobile</Typography>
                                <Typography variant="body2">{appInfo.Mobile}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Email</Typography>
                                <Typography variant="body2">{appInfo.Email}</Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ marginY: 3 }} />
                        <Typography variant="h6" align="center" sx={{ marginTop: -1, marginBottom: 1 }}> MSG91 </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">MSG91 Authentication Key</Typography>
                                <Typography variant="body2">{appInfo.Msg91AuthKey}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Msg91 Email Domain</Typography>
                                <Typography variant="body2">{appInfo.Msg91EmailDomain}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">MSG91 From Email</Typography>
                                <Typography variant="body2">{appInfo.Msg91FromEmail}</Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ marginY: 3 }} />
                        <Typography variant="h6" align="center" sx={{ marginTop: -1, marginBottom: 1 }}> SMS DLT ID's </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">SMS Login OTP DLT ID</Typography>
                                <Typography variant="body2">{appInfo.SmsloginOtpdltid}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">SMS Society Bill DLT ID</Typography>
                                <Typography variant="body2">{appInfo.SmssocietyBillDltid}</Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ marginY: 3 }} />
                        <Typography variant="h6" align="center" sx={{ marginTop: -1, marginBottom: 1 }}> Email DLT ID's </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Email Society Bill DLT ID</Typography>
                                <Typography variant="body2">{appInfo.EmailSocietyBillDltid}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Email Society Receipt DLT ID</Typography>
                                <Typography variant="body2">{appInfo.EmailSocietyReceiptDltid}</Typography>
                            </Grid>

                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Email Society Receipt Reversal DLT ID</Typography>
                                <Typography variant="body2">{appInfo.EmailSocietyReceiptReversalDltid}</Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ marginY: 3 }} />
                        <Typography variant="h6" align="center" sx={{ marginTop: -1, marginBottom: 1 }}> Ease Buzz </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Ease Buzz Key</Typography>
                                <Typography variant="body2">{appInfo.EaseBuzzKey}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Ease Buzz Salt</Typography>
                                <Typography variant="body2">{appInfo.EaseBuzzSalt}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Ease Buzz Environment</Typography>
                                <Typography variant="body2">{appInfo.EaseBuzzEnv}</Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ marginY: 3 }} />
                        <Typography variant="h6" align="center" sx={{ marginTop: -1, marginBottom: 1 }}> HTML To Display </Typography>
                        <Grid container spacing={3}>

                            <Grid item xs={12} sm={12}>
                                <Typography className="label">Home Page Html</Typography>
                                <Box className="htmlDisplay">
                                    <div dangerouslySetInnerHTML={{ __html: appInfo.HomePageHtml }} />
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={12}>
                                <Typography className="label">Privacy Policy Html</Typography>
                                <Box className="htmlDisplay">
                                    <div dangerouslySetInnerHTML={{ __html: appInfo.PrivacyPolicyHtml }} />
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={12}>
                                <Typography className="label">Terms And Conditions Html</Typography>
                                <Box className="htmlDisplay">
                                    <div dangerouslySetInnerHTML={{ __html: appInfo.TermsConditionsHtml }} />
                                </Box>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                </CardContent>
                <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" style={{ marginLeft: "15px" }}
                        onClick={() => navigate("/appInfo")}>
                        Edit
                    </Button>
                </CardActions>
            </Card>
            }
        </>
    );
}

export default AppInfoView
