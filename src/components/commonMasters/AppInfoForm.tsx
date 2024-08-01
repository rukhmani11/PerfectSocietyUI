import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Card,
  Typography,
  CardActions,
  Button,
  Stack,
  CardContent,
  Divider,
  Box,
  Dialog,

  DialogTitle,
  IconButton,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { globalService } from "../../services/GlobalService";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useForm from "../../utility/hooks/UseForm";
import { useNavigate, useParams } from "react-router-dom";
import Controls from "../../utility/controls/Controls";
import { AppInfoModel, FlagsModel } from "../../models/AppInfoModel";
import { appInfoService } from "../../services/AppInfoService";
import { SelectListModel } from "../../models/ApiResponse";
import { uomsService } from "../../services/UomsService";
import { taxesService } from "../../services/TaxesService";
import { AuthContext } from "../../utility/context/AuthContext";
import { ROLES } from "../../utility/Config";

const AppInfoForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  globalService.pageTitle = "AppInfo";
  const [open, setOpen] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const { appInfoId } = useParams();

  let navigate = useNavigate();
  const [Uom, setUom] = useState<SelectListModel[]>([]);
  const [SubscriptionTax, setSubscriptionTax] = useState<SelectListModel[]>([]);

  const validate = (fieldValues: AppInfoModel = values) => {
    let temp: any = { ...errors };
    if ("SubscriptionInvoiceDueDays" in fieldValues) {
      let dueDayError = "";
      if (fieldValues.SubscriptionInvoiceDueDays > 0) {
        dueDayError =
          fieldValues.SubscriptionInvoiceDueDays > 200
            ? "SubscriptionInvoiceDueDays cannot be > 200"
            : "";
      } else if (fieldValues.SubscriptionInvoiceDueDays < 0)
        dueDayError = "SubscriptionInvoiceDueDays cannot be < 0.";
      temp.SubscriptionInvoiceDueDays = dueDayError;
    }

    if ("Password" in fieldValues)
      temp.Password = fieldValues.Password === "AdA#&*m$n" ? "" : "Password is incorrect";
    if ("Mobile" in fieldValues) {
      temp.Mobile = fieldValues.Mobile ? fieldValues.Mobile.length < 10 ? "Phone should not be less then 10 characters" : "" : "";
    }
    if ("Email" in fieldValues) {
      temp.Email = fieldValues.Email
        ? (temp.Email =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            fieldValues.Email
          )
            ? ""
            : "Please enter a valid email Id.")
        : "";
    }
    setErrors({
      ...temp,
    });
    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };
  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(appInfoService.initialFieldValues, validate, props.setCurrentId);

  const newUser = () => {
    setValues(appInfoService.initialFieldValues);
  };

  function setFormValue(model: AppInfoModel) {
    let newModel = {
      Id: model.Id,
      Password: model.Password || "",
      Abbreviation: model.Abbreviation || "",
      Currency: model.Currency || "",
      Uomid: model.Uomid,
      SubscriptionTaxId: model.SubscriptionTaxId || "",
      SubscriberTerms: model.SubscriberTerms,
      SubscriptionInvoiceDueDays: model.SubscriptionInvoiceDueDays,
      FlagInfo: {

        GstBill: model.FlagInfo?.GstBill || false,
        PreviousYear: model.FlagInfo?.PreviousYear || false,
        MonthlyCharge: model.FlagInfo?.MonthlyCharge || false,
        MultiLingual: model.FlagInfo?.MultiLingual || false,
        Dashboard: model.FlagInfo?.Dashboard || false,
        UPIPay: model.FlagInfo?.UPIPay || false,
        OtherReportExcel: model.FlagInfo?.OtherReportExcel || false,
        SSDocsIntegration: model.FlagInfo?.SSDocsIntegration || false,
      },
      Mobile: model.Mobile,
      Email: model.Email,
      SmssocietyBillDltid: model.SmssocietyBillDltid,
      SmssocietyReceiptDltid: model.SmssocietyReceiptDltid,
      SmssocietyReceiptReversalDltid: model.SmssocietyReceiptReversalDltid,
      EmailSocietyBillDltid: model.EmailSocietyBillDltid,
      EmailSocietyReceiptDltid: model.EmailSocietyReceiptDltid,
      EmailSocietyReceiptReversalDltid: model.EmailSocietyReceiptReversalDltid,
      SmsloginOtpdltid: model.SmsloginOtpdltid,
      Msg91AuthKey: model.Msg91AuthKey,
      Msg91EmailDomain: model.Msg91EmailDomain,
      Msg91FromEmail: model.Msg91FromEmail,
      EaseBuzzKey: model.EaseBuzzKey,
      EaseBuzzSalt: model.EaseBuzzSalt,
      EaseBuzzEnv: model.EaseBuzzEnv,
      HomePageHtml: model.HomePageHtml,
      TermsConditionsHtml: model.TermsConditionsHtml,
      PrivacyPolicyHtml:model.PrivacyPolicyHtml
    };
    return newModel;
  }

  useEffect(() => {
    getAppInfo();
    setErrors({});
    newUser();
    handleOpen();
    if (Uom.length === 0) getUmo();
    if (SubscriptionTax.length === 0) getSubscriptionTax();
  }, []);
  const getUmo = () => {
    uomsService.getSelectList().then((response) => {
      setUom(response.data);
    });
  };

  const getSubscriptionTax = () => {
    taxesService.getSelectList().then((response) => {
      setSubscriptionTax(response.data);
    });
  };

  const getAppInfo = () => {
    appInfoService.getAppInfo().then((response) => {
      if (response) {
        let result = response.data;
        if (result)
          setShowSubmit(true); // to prevent admin from saving empty records
        else
          setShowSubmit(false);
        //setValues(setFormValue(result.list.FlagInfo));
        setValues(setFormValue(result.row));
      }
    });
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate(values)) {
      handleClose();
    } else {
      globalService.error("Password is incorrect");
    }

  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    values.Id = 1;

    // values.FlagInfo = {
    //   GstBill: values.GstBill,
    //   PreviousYear: values.PreviousYear,
    //   MonthlyCharge: values.MonthlyCharge,
    // };
    if (validate()) {
      if (values.Id) {

        appInfoService.put(values).then((response: any) => {

          let result = response.data;
          if (response) {
            globalService.success(result.message);
            navigate("/appInfoView"); //commenting this bcoz its removing society and subscription selected
          } else {
            globalService.error(result.message);
          }
        });
      }
    }
  };

  return (
    <>
      <Typography variant="h5" align="center">
        App Info
      </Typography>
      <form autoComplete="off" noValidate onSubmit={handleSubmitPassword}>
        <Dialog
          fullWidth={true}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle id="customized-dialog-title" >
          </DialogTitle>
          <Box>
            <>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '80px', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingLeft: '10px', padding: '10px' }}
              >
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Password"
                    name="Password"
                    value={values.Password}
                    onChange={handleInputChange}
                    error={errors.Password}
                  />
                </Grid>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '20px', marginLeft: "10px" }}>
                  <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'} style={{ marginLeft: "15px" }}
                  >
                    Submit
                  </Button>
                  <Button variant="contained" style={{ marginLeft: "15px" }}
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </>
          </Box>
        </Dialog>
      </form>
      {!open && <form autoComplete="off" noValidate onSubmit={handleSubmit} >
        <Card>
          <CardContent>
            <React.Fragment>
              <Typography variant="h6" align="center" sx={{ marginTop: -1, marginBottom: 1 }}>Flag Info</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    dataId="FlagInfo"
                    dataNested=""
                    name="GstBill"
                    label="Print GST Bills"
                    value={values.FlagInfo?.GstBill}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    dataId="FlagInfo"
                    dataNested=""
                    name="PreviousYear"
                    label="Print Previous Year Values (Final Report For Audit - Schedule To Balance Sheet)"
                    value={values.FlagInfo?.PreviousYear}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    dataId="FlagInfo"
                    dataNested=""
                    name="MonthlyCharge"
                    label="Monthly Charge (Excel Upload - Charge Head Mapped with Charges and Units)"
                    value={values.FlagInfo?.MonthlyCharge}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    dataId="FlagInfo"
                    dataNested=""
                    name="MultiLingual"
                    label="MultiLingual"
                    value={values.FlagInfo?.MultiLingual}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    dataId="FlagInfo"
                    dataNested=""
                    name="Dashboard"
                    label="Dashboard"
                    value={values.FlagInfo?.Dashboard}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    dataId="FlagInfo"
                    dataNested=""
                    name="UPIPay"
                    label="Enable UPIPay Link"
                    value={values.FlagInfo?.UPIPay}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    dataId="FlagInfo"
                    dataNested=""
                    name="OtherReportExcel"
                    label="Other Report - Excel"
                    value={values.FlagInfo?.OtherReportExcel}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    dataId="FlagInfo"
                    dataNested=""
                    name="SSDocsIntegration"
                    label="Enable SSDocs Integration"
                    value={values.FlagInfo?.SSDocsIntegration}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ marginY: 2 }} />
              <Typography variant="h6" align="center" sx={{ marginTop: -1, marginBottom: 1 }}>Subscription & Others </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="Abbreviation"
                    inputProps={{ maxLength: 5 }}
                    label="Abbreviation"
                    value={values.Abbreviation}
                    onChange={handleInputChange}
                    error={errors.Abbreviation}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="Currency"
                    inputProps={{ maxLength: 1 }}
                    label="Currency"
                    value={values.Currency}
                    onChange={handleInputChange}
                    error={errors.Currency}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    name="Uomid"
                    label="Uom"
                    value={Uom.length > 0 ? values.Uomid : ""}
                    onChange={handleInputChange}
                    options={Uom}
                    error={errors.Uomid}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    name="SubscriptionTaxId"
                    label="Subscription Tax"
                    value={
                      SubscriptionTax.length > 0 ? values.SubscriptionTaxId : ""
                    }
                    onChange={handleInputChange}
                    options={SubscriptionTax}
                    error={errors.SubscriptionTaxId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Subscription Invoice Due Days "
                    autoComplete="given-name"
                    type="number"
                    name="SubscriptionInvoiceDueDays"
                    value={values.SubscriptionInvoiceDueDays}
                    onChange={handleInputChange}
                    error={errors.SubscriptionInvoiceDueDays}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    rows="4"
                    multiline
                    name="SubscriberTerms"
                    label="Subscriber Terms"
                    value={values.SubscriberTerms}
                    onChange={handleInputChange}
                    error={errors.SubscriberTerms}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Mobile"
                    name="Mobile"
                    value={values.Mobile}
                    onChange={handleInputChange}
                    error={errors.Mobile}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    name="Email"
                    label="Email"
                    value={values.Email}
                    onChange={handleInputChange}
                    error={errors.Email}
                  />
                </Grid>

              </Grid>

              <Divider sx={{ marginY: 3 }} />
              <Typography variant="h6" align="center" sx={{ marginTop: -1, marginBottom: 1 }}> MSG91 </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="Msg91AuthKey"
                    label="MSG91 Authentication Key"
                    value={values.Msg91AuthKey}
                    onChange={handleInputChange}
                    error={errors.Msg91AuthKey}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="Msg91EmailDomain"
                    label="MSG91 Email Domain"
                    value={values.Msg91EmailDomain}
                    onChange={handleInputChange}
                    error={errors.Msg91EmailDomain}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="Msg91FromEmail"
                    label="MSG91 From Email"
                    value={values.Msg91FromEmail}
                    onChange={handleInputChange}
                    error={errors.Msg91FromEmail}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ marginY: 3 }} />
              <Typography variant="h6" align="center" sx={{ marginTop: -1, marginBottom: 1 }}> SMS DLT ID's </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="SmsloginOtpdltid"
                    label="SMS Login OTP DLT ID"
                    value={values.SmsloginOtpdltid}
                    onChange={handleInputChange}
                    error={errors.SmsloginOtpdltid}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="SmssocietyBillDltid"
                    label="SMS Society Bill DLT ID"
                    value={values.SmssocietyBillDltid}
                    onChange={handleInputChange}
                    error={errors.SmssocietyBillDltid}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="SmssocietyReceiptDltid"
                    label="SMS Society Receipt DLT ID"
                    value={values.SmssocietyReceiptDltid}
                    onChange={handleInputChange}
                    error={errors.SmssocietyReceiptDltid}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="SmssocietyReceiptReversalDltid"
                    label="SMS Society Receipt Reversal DLT ID"
                    value={values.SmssocietyReceiptReversalDltid}
                    onChange={handleInputChange}
                    error={errors.SmssocietyReceiptReversalDltid}
                  />
                </Grid> */}
              </Grid>

              <Divider sx={{ marginY: 3 }} />
              <Typography variant="h6" align="center" sx={{ marginTop: -1, marginBottom: 1 }}> Email DLT ID's </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="EmailSocietyBillDltid"
                    label="Email Society Bill DLT ID"
                    value={values.EmailSocietyBillDltid}
                    onChange={handleInputChange}
                    error={errors.EmailSocietyBillDltid}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="EmailSocietyReceiptDltid"
                    label="Email Society Receipt DLT ID"
                    value={values.EmailSocietyReceiptDltid}
                    onChange={handleInputChange}
                    error={errors.EmailSocietyReceiptDltid}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="EmailSocietyReceiptReversalDltid"
                    label="Email Society Receipt Reversal DLT ID"
                    value={values.EmailSocietyReceiptReversalDltid}
                    onChange={handleInputChange}
                    error={errors.EmailSocietyReceiptReversalDltid}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ marginY: 3 }} />
              <Typography variant="h6" align="center" sx={{ marginTop: -1, marginBottom: 1 }}> Ease Buzz </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="EaseBuzzKey"
                    label="Ease Buzz Key"
                    value={values.EaseBuzzKey}
                    onChange={handleInputChange}
                    error={errors.EaseBuzzKey}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="EaseBuzzSalt"
                    label="Ease Buzz Salt"
                    value={values.EaseBuzzSalt}
                    onChange={handleInputChange}
                    error={errors.EaseBuzzSalt}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="EaseBuzzEnv"
                    label="Ease Buzz Environment"
                    value={values.EaseBuzzEnv}
                    onChange={handleInputChange}
                    error={errors.EaseBuzzEnv}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ marginY: 3 }} />
              <Typography variant="h6" align="center" sx={{ marginTop: -1, marginBottom: 1 }}> HTML To Display </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Controls.Input
                    rows="10"
                    multiline
                    name="HomePageHtml"
                    label="Home Page Html"
                    value={values.HomePageHtml}
                    onChange={handleInputChange}
                    error={errors.HomePageHtml}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Controls.Input
                    rows="10"
                    multiline
                    name="PrivacyPolicyHtml"
                    label="Privacy Policy Html"
                    value={values.PrivacyPolicyHtml}
                    onChange={handleInputChange}
                    error={errors.PrivacyPolicyHtml}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controls.Input
                    rows="10"
                    multiline
                    name="TermsConditionsHtml"
                    label="Terms And Conditions Html"
                    value={values.TermsConditionsHtml}
                    onChange={handleInputChange}
                    error={errors.TermsConditionsHtml}
                  />
                </Grid>
              </Grid>
            </React.Fragment>
          </CardContent>

          <CardActions sx={{ display: "flex", justifyContent: "center" }}>
            <Stack spacing={2} direction="row">
              {showSubmit && <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}>
                Submit
              </Button>
              }
              <Button type="button" variant="contained" color="info"   href="/appInfoView">
                View
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<ArrowBackIcon />}
                href="/"
              >
                Back{" "}
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </form>}
    </>
  );
};

export default AppInfoForm;
