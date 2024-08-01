import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Controls from '../../utility/controls/Controls';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useForm from '../../utility/hooks/UseForm';
import { SelectListModel } from '../../models/ApiResponse';
import { globalService } from '../../services/GlobalService';
import fileDownload from 'js-file-download';
import dayjs from 'dayjs';
import { IncomeExpenditureReportModel } from '../../models/AccountingReportModel';
import { accountingReportService } from '../../services/AccountingReportService';
import { SocietySubscriptionsModel } from '../../models/SocietySubscriptionsModel';
import { societySubscriptionsService } from '../../services/SocietySubscriptionsService';
import { ROLES } from '../../utility/Config';
import { AuthContext } from '../../utility/context/AuthContext';
import { useSharedNavigation } from '../../utility/context/NavigationContext';

const IncomeExpenditureScheduleReport = () => {
  const { auth } = React.useContext(AuthContext);
  const { societyId, societySubscriptionId, type }: any = useParams();
  const [societySubscription, setSocietySubscription] = useState<SocietySubscriptionsModel>(null);
  let navigate = useNavigate();
  const { goToHome } = useSharedNavigation();
  
  const validate = (fieldValues: IncomeExpenditureReportModel = values) => {
    let temp: any = { ...errors };

    if ("FromDate" in fieldValues)
      temp.FromDate = fieldValues.FromDate ? "" : "From Date is required.";
    if ("ToDate" in fieldValues)
      temp.ToDate = fieldValues.ToDate ? "" : "To Date is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(accountingReportService.initialIncomeExpenditureStatementFieldValues, validate, societyId);

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info('Society is not selected.');
      return goToHome();
    }
    if (!societySubscription)
      getSocietySubscriptionById();
  }, [societySubscription]);

  const newReport = () => {
    setValues(setFormValue(accountingReportService.initialIncomeExpenditureStatementFieldValues));
  };

  const getSocietySubscriptionById = () => {
    societySubscriptionsService.getById(societySubscriptionId)
      .then((response) => {
        var result = response.data;
        if (result.isSuccess) {
          setSocietySubscription(result.data);
          values.FromDate = globalService.convertLocalToUTCDate(new Date(result.data.SubscriptionStart));
          values.ToDate = globalService.convertLocalToUTCDate(new Date(result.data.PaidTillDate));
        }
        else
          globalService.error(result.message);
      });
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: IncomeExpenditureReportModel) {
    let newValue = {
      SocietyId: societyId,
      SocietySubscriptionId: societySubscriptionId,
      FromDate: new Date(model.FromDate),
      ToDate: new Date(model.ToDate)
    }
    return newValue;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      var model = setFormValue(values);
      accountingReportService.incomeExpenditureSchedule(model).then((response) => {
        let result = response.data;
        let fileName = "IncomeExpenditureScheduleReport.pdf";
        fileDownload(result, fileName);
      });
    }
  }

  return (
    <>
      <Typography variant="h5" align="center">
        Income & Expenditure Schedule Report
      </Typography>
      <form
        autoComplete="off"
        noValidate
        //className={classes.root}
        onSubmit={handleSubmit}
      >
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <Controls.ReactDatePicker
                    label="From Date"
                    min={globalService.convertLocalToUTCDate(new Date(societySubscription?.SubscriptionStart))}
                    max={societySubscription ? globalService.convertLocalToUTCDate(new Date(societySubscription.PaidTillDate)) : null}
                    onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'FromDate' } })}
                    value={values.FromDate}
                    error={errors.FromDate}
                  />
                  {societySubscription && <Typography className='small-text'>From Date & To Date must be between {dayjs(societySubscription.SubscriptionStart).format("DD-MMM-YYYY")} to {dayjs((societySubscription.PaidTillDate)).format("DD-MMM-YYYY")}</Typography>}
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Controls.ReactDatePicker
                    label="To Date"
                    fullWidth
                    value={values.ToDate}
                    onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'ToDate' } })}
                    min={values.FromDate}
                    max={societySubscription ? globalService.convertLocalToUTCDate(new Date(societySubscription.PaidTillDate)) : null}
                    error={errors.ToDate}
                  />
                </Grid>
              </Grid>
            </React.Fragment>
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "center" }}>
            <Stack spacing={2} direction="row">
              <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}>
                Submit
              </Button>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/dashboard/" + societyId)}
              >
                Back 
              </Button>

            </Stack>
          </CardActions>
        </Card>
      </form >
    </>
  )
}

export default IncomeExpenditureScheduleReport
