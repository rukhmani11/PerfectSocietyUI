import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Controls from '../../utility/controls/Controls';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BillRegisterReportModel } from '../../models/SocietyReportModel';
import { societyReportService } from '../../services/SocietyReportService';
import useForm from '../../utility/hooks/UseForm';
import { SelectListModel } from '../../models/ApiResponse';
import { globalService } from '../../services/GlobalService';
import fileDownload from 'js-file-download';
import { societyBillSeriesService } from '../../services/SocietyBillSeriesService';
import { societyBuildingsService } from '../../services/SocietyBuildingsService';
import { societySubscriptionsService } from '../../services/SocietySubscriptionsService';
import { SocietySubscriptionsModel } from '../../models/SocietySubscriptionsModel';
import { societyBillsService } from '../../services/SocietyBillsService';
import dayjs from 'dayjs';
import DownloadIcon from '@mui/icons-material/Download';
import { Messages } from '../../utility/Config';
import { useSharedNavigation } from '../../utility/context/NavigationContext';

const BillRegisterReportForm = () => {

  const { societyId, societySubscriptionId }: any = useParams();
  let navigate = useNavigate();
  const [billAbbreviations, setBillAbbreviations] = useState<SelectListModel[]>([]);
  const [buildings, setBuildings] = useState<SelectListModel[]>([]);
  const [billDates, setBillDates] = useState<SelectListModel[]>([]);
  const [societySubscription, setSocietySubscription] = useState<SocietySubscriptionsModel>(null);
  const { goToHome } = useSharedNavigation();
  
  const validate = (fieldValues: BillRegisterReportModel = values) => {
    let temp: any = { ...errors };

    // if ("SocietyBuildingId" in fieldValues)
    //   temp.SocietyBuildingId = fieldValues.SocietyBuildingId ? "" : "Society Building is required.";
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
    useForm(societyReportService.initialMemberBalanceReportFieldValues, validate, societyId);

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (billAbbreviations.length === 0)
      getBillAbbreviationsBySocietyId();
    if (buildings.length === 0)
      getBuildingsForSociety();
    if (!societySubscription)
      getSocietySubscriptionById();
  }, [societySubscription]);

  const newReport = () => {
    setValues(societyReportService.initialMemberBalanceReportFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: BillRegisterReportModel) {
    let newValue = {
      SocietyId: societyId,
      SocietySubscriptionId: societySubscriptionId,
      SocietyBuildingId: model.SocietyBuildingId,
      BillAbbreviation: model.BillAbbreviation,
      FromDate: model.FromDate ? new Date(model.FromDate) : globalService.convertLocalToUTCDate(new Date(societySubscription.SubscriptionStart)),
      ToDate: model.ToDate ? new Date(model.ToDate) : societySubscription ? globalService.convertLocalToUTCDate(new Date(societySubscription.PaidTillDate ? societySubscription.PaidTillDate : societySubscription.SubscriptionEnd)) : null,
      IsDetails: model.IsDetails || false,
      IsAllColumns: model.IsAllColumns || false
    }
    return newValue;
  }

  const getBillAbbreviationsBySocietyId = () => {
    societyBillSeriesService.getSelectListBySocietyId(societyId)
      .then((response) => {
        setBillAbbreviations(response.data);
      });
  };

  const getSocietySubscriptionById = () => {
    societySubscriptionsService.getById(societySubscriptionId)
      .then((response) => {
        var result = response.data;
        if (result.isSuccess) {
          setSocietySubscription(result.data);
          values.FromDate = globalService.convertLocalToUTCDate(new Date(result.data.SubscriptionStart));
          values.ToDate = globalService.convertLocalToUTCDate(new Date(result.data.PaidTillDate ? result.data.PaidTillDate : result.data.SubscriptionEnd));
        }
        else
          globalService.error(result.message);
      });
  };

  const getSocietyBillDates = (billAbbreviation: any) => {
    if (billAbbreviation) {
      societyBillsService
        .ListBillDatesBySubscriptionIDAndBillAbbr(societySubscriptionId, billAbbreviation)
        .then((response) => {
          setBillDates(response.data);
          if (response.data?.length <= 0)
            globalService.error("No bills to download.");
        }
        );
    }
  };

  const getBuildingsForSociety = () => {
    societyBuildingsService.getSelectListBySocietyId(societyId)
      .then((response) => {
        setBuildings(response.data);
      });
  };

  //const handleSubmit = (e: React.FormEvent) => {
  const downloadReport = (type: string) => {
    //e.preventDefault();
    if (validate()) {
      var model = setFormValue(values);
      if (type === 'pdf') {
        societyReportService.billRegisterReportPdf(model).then((response) => {
          let result = response.data;
          let fileName = "BillRegister" + (model.IsDetails ? "Details" : "Summary") + "Reportfrom " + dayjs(model.FromDate).format("DD-MMM-YYYY") + "to" + dayjs(model.ToDate).format("DD-MMM-YYYY") + ".pdf";
          fileDownload(result, fileName);
        });
      }
      else {
        societyReportService.billRegisterReportExcel(model).then((response) => {
          let result = response.data;
          let fileName = "BillRegister" + (model.IsDetails ? "Details" : "Summary") + "Reportfrom " + dayjs(model.FromDate).format("DD-MMM-YYYY") + "to" + dayjs(model.ToDate).format("DD-MMM-YYYY") + ".xlsx";
          fileDownload(result, fileName);
        });
      }
    }
  }

  return (
    <>
      <Typography variant="h5" align="center">
        Bill Register Report
      </Typography>
      <form
        autoComplete="off"
        noValidate
      //className={classes.root}
      //onSubmit={(e) => handleSubmit(e)}
      >
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <Controls.Select
                    name="BillAbbreviation"
                    label="Bill Abbreviation"
                    required
                    value={billAbbreviations.length > 0 ? values.BillAbbreviation : ""}
                    onChange={(e: any) => {
                      getSocietyBillDates(e.target.value);
                      handleInputChange(e);
                    }}
                    options={billAbbreviations}
                    error={errors.BillAbbreviation}
                  />
                </Grid>
                {billDates && billDates.length > 0 && <> <Grid item xs={12} sm={3}>
                  <Controls.Select
                    name="SocietyBuildingId"
                    label="For Building"
                    required
                    value={buildings.length > 0 ? values.SocietyBuildingId : ""}
                    onChange={(e: any) => {
                      handleInputChange(e);
                    }}
                    options={buildings}
                    error={errors.SocietyBuildingId}
                  />
                </Grid>

                  <Grid item xs={12} sm={3}>
                    <Controls.ReactDatePicker
                      label="From Date"
                      min={globalService.convertLocalToUTCDate(new Date(societySubscription?.SubscriptionStart))}
                      max={societySubscription ? globalService.convertLocalToUTCDate(new Date(societySubscription.PaidTillDate ? societySubscription.PaidTillDate : societySubscription.SubscriptionEnd)) : null}
                      onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'FromDate' } })}
                      value={values.FromDate}
                      error={errors.FromDate}
                    />
                    {societySubscription && <Typography className='small-text'>From Date & To Date must be between {dayjs(societySubscription.SubscriptionStart).format("DD-MMM-YYYY")} to {dayjs((societySubscription.PaidTillDate ? societySubscription.PaidTillDate : societySubscription.SubscriptionEnd)).format("DD-MMM-YYYY")}</Typography>}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Controls.ReactDatePicker
                      label="To Date"
                      fullWidth
                      value={values.ToDate}
                      onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'ToDate' } })}
                      min={values.FromDate}
                      max={societySubscription ? globalService.convertLocalToUTCDate(new Date(societySubscription.PaidTillDate ? societySubscription.PaidTillDate : societySubscription.SubscriptionEnd)) : null}
                      error={errors.ToDate}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Controls.Checkbox
                      name="IsDetails"
                      label="Details"
                      value={values.IsDetails}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Controls.Checkbox
                      name="IsAllColumns"
                      label="Show All Columns"
                      value={values.IsAllColumns}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </>
                }
              </Grid>
            </React.Fragment>
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "center" }}>
            <Stack spacing={2} direction="row">
              {billDates && billDates.length > 0 &&
                <>
                  <Button type="button" startIcon={<DownloadIcon />} variant="contained" onClick={(e) => downloadReport('pdf')}>
                    PDF
                  </Button>

                  <Button type="button" startIcon={<DownloadIcon />} variant="contained" color='success' onClick={(e) => downloadReport('excel')}>
                    Excel
                  </Button>
                </>
              }
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/societySubscriptions/" + societyId)}
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

export default BillRegisterReportForm