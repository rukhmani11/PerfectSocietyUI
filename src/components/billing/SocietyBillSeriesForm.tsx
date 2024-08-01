import React, { useEffect, useState } from "react";
import { Box, Grid, CardHeader, CardActions, Card, CardContent, FormGroup, FormControlLabel, Checkbox, Button, Container, CssBaseline, Paper, ThemeProvider, Toolbar, Typography, createTheme, Stack, Switch } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { globalService } from "../../services/GlobalService";
import { societyBillSeriesService } from "../../services/SocietyBillSeriesService";
import dayjs, { Dayjs } from 'dayjs';
import { SelectListModel } from "../../models/ApiResponse";
import { SocietyBillSeriesModel } from "../../models/SocietyBillSeriesModel";
import useForm from "../../utility/hooks/UseForm";
import Controls from "../../utility/controls/Controls";
import { taxesService } from "../../services/TaxesService";
import { Messages, ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";
import { useSharedNavigation } from "../../utility/context/NavigationContext";


const SocietyBillSeriesForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  const { societyId, billAbbr }: any = useParams(); //here billAbbr is urlEncoded. Since value can be w/p also. So all get api calls
  let navigate = useNavigate();
  const [taxes, setTaxes] = useState<SelectListModel[]>([]);
  const billingFrequencies = globalService.getBillingFrequency();
  const osAdjustments = globalService.getOsAdjustments();
  const mode = billAbbr ? 'Edit' : 'Create';
  const { goToHome } = useSharedNavigation();
  
  const validate = (fieldValues: SocietyBillSeriesModel = values) => {
    let temp: any = { ...errors };
    if ("BillAbbreviation" in fieldValues)
      temp.BillAbbreviation = fieldValues.BillAbbreviation ? (fieldValues.BillAbbreviation.length > 5 ? "BillAbbreviation should be <= 5 characters" : "") : "Abbreviation is required.";
    if ("BillingFrequency" in fieldValues)
      temp.BillingFrequency = fieldValues.BillingFrequency ? "" : "BillingFrequency is required.";
    if ("BillDay" in fieldValues)
      temp.BillDay = fieldValues.BillDay ? (fieldValues.BillDay > 255 ? "Billday cannot be > 255" : "") : "BillDay is required.";
    if ("DueDays" in fieldValues)
      temp.DueDays = fieldValues.DueDays >= 0 ? (fieldValues.DueDays > 255 ? "DueDays cannot be > 255" : "") : "";
    if ("InterestRate" in fieldValues)
      temp.InterestRate = fieldValues.InterestRate >= 0 ? "" : "Interest Rate is required.";
    if ("MinimumInterest" in fieldValues)
      temp.MinimumInterest = fieldValues.MinimumInterest >= 0 ? "" : "Minimum Interest is required.";
    if ("Osadjustment" in fieldValues)
      temp.Osadjustment = fieldValues.Osadjustment ? "" : "Os adjustment is required";
    // if ("InterChargeFromBillDateOrDueDate" in fieldValues)
    //   temp.InterChargeFromBillDateOrDueDate = fieldValues.InterChargeFromBillDateOrDueDate ? "" : "InterChargeFromBillDateOrDueDate is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(societyBillSeriesService.initialFieldValues, validate, societyId);

  const newSocietyBillSeries = () => {
    setValues(societyBillSeriesService.initialFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: SocietyBillSeriesModel) {
    
    let newModel = {
      SocietyId: societyId,
      BillAbbreviation: model.BillAbbreviation,
      TaxId: model.TaxId || "",
      BillingFrequency: model.BillingFrequency,
      BillDay: model.BillDay,
      DueDays: model.DueDays || 0,
      Terms: model.Terms || "",
      Note: model.Note || "",
      PrintArea: model.PrintArea || false,
      InterestRate: model.InterestRate || 0,
      MinimumInterest: model.MinimumInterest || 0,
      Osadjustment: model.Osadjustment,
      NonOccupancyCharges: model.NonOccupancyCharges || 0,
      ChargeBillingCycleOrActualDate: model.ChargeBillingCycleOrActualDate || '',
      InterChargeFromBillDateOrDueDate: model.InterChargeFromBillDateOrDueDate || ""
    }
    return newModel;
  }

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (taxes.length === 0)
      getTaxes();

    if (billAbbr) {
      getSocietyBillSeries();
    }
    else {
      newSocietyBillSeries();
      setErrors({});
    }

  }, [societyId, billAbbr]);

  const getTaxes = () => {
    taxesService
      .getSelectList()
      .then((response) => {
        setTaxes(response.data);
      });
  };


  const getSocietyBillSeries = () => {
    societyBillSeriesService
      .getBySocietyIdAndAbbr(societyId, billAbbr)
      .then((response) => {
        if (response) {
          let result = response.data;
          setValues(setFormValue(result.data));
        }
      })
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      values.SocietyId = societyId;
      if (societyId && billAbbr) {
        societyBillSeriesService.put(values).then((response: any) => {
          let result = response.data;

          if (result.isSuccess) {
            resetForm();
            navigate("/societyBillSeries/" + societyId);
            globalService.success("Society Bill Series updated successfully.");
          }
        });
      } else {
        societyBillSeriesService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success("Society Bill Series added successfully.");
              resetForm();
              navigate("/societyBillSeries/" + societyId);
            } else {
              globalService.error(result.message);
            }
          }
        });
      }
    }
  };

  return (
    <>
      <Typography variant="h5" align="center">
        Society Bill Series
      </Typography>
      <form
        //autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >

        <Card>
          <CardHeader title="Billing Parameters" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Controls.Input
                  required
                  label="Bill Abbreviation"
                  name="BillAbbreviation"
                  length={5}
                  value={values.BillAbbreviation}
                  onChange={handleInputChange}
                  error={errors.BillAbbreviation}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controls.Select
                  showEmptyItem={false}
                  name="TaxId"
                  label="Tax"
                  required
                  value={taxes.length > 0 ? values.TaxId : ''}
                  onChange={handleInputChange}
                  options={taxes}
                  error={errors.TaxId}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controls.Select
                  showEmptyItem={false}
                  name="BillingFrequency"
                  label="Billing Frequency"
                  required
                  value={billingFrequencies.length > 0 ? values.BillingFrequency : ''}
                  onChange={handleInputChange}
                  options={billingFrequencies}
                  error={errors.BillingFrequency}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controls.Input
                  label="BillDay"
                  name="BillDay"
                  required
                  type="number"
                  max={255}
                  value={values.BillDay}
                  onChange={handleInputChange}
                  error={errors.BillDay}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controls.Input
                  name="DueDays"
                  label="DueDays"
                  type="number"
                  value={values.DueDays}
                  onChange={handleInputChange}
                  error={errors.DueDays}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Bill Printing Parameters" />
          <CardContent>
            <Grid container spacing={3}>

              <Grid item xs={12} sm={4}>
                <Controls.Input
                  name="Terms"
                  multiline
                  label="Terms"
                  value={values.Terms}
                  onChange={handleInputChange}
                  error={errors.Terms}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controls.Input
                  name="Note"
                  multiline
                  length={50}
                  label="Note"
                  value={values.Note}
                  onChange={handleInputChange}
                  error={errors.Note}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controls.Checkbox
                  name="PrintArea"
                  label="PrintArea"
                  value={values.PrintArea}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="OD Interest Parameters" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Controls.Input
                  required
                  label="Interest Rate"
                  name="InterestRate"
                  type="number"
                  value={values.InterestRate}
                  error={errors.InterestRate}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controls.Input
                  required
                  label="Minimum Interest"
                  name="MinimumInterest"
                  type="number"
                  value={values.MinimumInterest}
                  error={errors.MinimumInterest}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controls.Select

                  label="Os Adjustment"
                  name="Osadjustment"
                  error={errors.Osadjustment}
                  value={osAdjustments.length > 0 ? values.Osadjustment : ''}
                  onChange={handleInputChange}
                  options={osAdjustments}
                />
              </Grid>
              {/* <Grid item xs={12} sm={4}>
                <Controls.Input
                  label="Non Occupancy Charges"
                  type="number"
                  name="NonOccupancyCharges"
                  value={values.NonOccupancyCharges}
                  error={errors.NonOccupancyCharges}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controls.Input
                  label="Charge Billing Cycle / Actual Date"
                  name="ChargeBillingCycleOrActualDate"
                  value={values.ChargeBillingCycleOrActualDate}
                  length={2}
                  error={errors.ChargeBillingCycleOrActualDate}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controls.Input
                  required
                  label="Inter Charge From Bill Date / Due Date"
                  name="InterChargeFromBillDateOrDueDate"
                  length={2}
                  value={values.InterChargeFromBillDateOrDueDate}
                  error={errors.InterChargeFromBillDateOrDueDate}
                  onChange={handleInputChange}
                />
              </Grid> */}
            </Grid>
          </CardContent>
        </Card>

        <Stack spacing={2} direction="row" justifyContent={"center"}>
          <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}>Submit</Button>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/societyBillSeries/" + societyId)}>Back </Button>
        </Stack>
      </form>
    </>
  );
};

export default SocietyBillSeriesForm