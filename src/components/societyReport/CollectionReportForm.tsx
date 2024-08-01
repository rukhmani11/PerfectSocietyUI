
import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Controls from '../../utility/controls/Controls';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CollectionReportModel } from '../../models/SocietyReportModel';
import { societyReportService } from '../../services/SocietyReportService';
import useForm from '../../utility/hooks/UseForm';
import { SelectListModel } from '../../models/ApiResponse';
import { globalService } from '../../services/GlobalService';
import fileDownload from 'js-file-download';
import { societyBuildingsService } from '../../services/SocietyBuildingsService';
import { societySubscriptionsService } from '../../services/SocietySubscriptionsService';
import { SocietySubscriptionsModel } from '../../models/SocietySubscriptionsModel';
import dayjs from 'dayjs';
import { Messages, ROLES } from '../../utility/Config';
import { AuthContext } from '../../utility/context/AuthContext';
import { useSharedNavigation } from '../../utility/context/NavigationContext';

const CollectionReportForm = () => {
  const { auth } = React.useContext(AuthContext);
  const { societyId, societySubscriptionId }: any = useParams();
  let navigate = useNavigate();
  const [buildings, setBuildings] = useState<SelectListModel[]>([]);
  const [societySubscription, setSocietySubscription] = useState<SocietySubscriptionsModel>(null);
  const { goToHome } = useSharedNavigation();
  
  const validate = (fieldValues: CollectionReportModel = values) => {
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
    useForm(societyReportService.initialMemberBalanceReportFieldValues, validate, societyId);

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (buildings.length === 0)
      getBuildingsForSociety();

    if (!societySubscription) {
      getSocietySubscriptionById();
    }

  }, []);

  const newReport = () => {
    setValues(setFormValue(societyReportService.initialCollectionReportFieldValues));
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: CollectionReportModel) {
    let newValue = {
      SocietyId: societyId,
      SocietySubscriptionId: societySubscriptionId,
      SocietyBuildingId: model.SocietyBuildingId,
      FromDate: model.FromDate ? new Date(model.FromDate) : globalService.convertLocalToUTCDate(new Date(societySubscription.SubscriptionStart)),
      ToDate: model.ToDate ? new Date(model.ToDate) : globalService.convertLocalToUTCDate(new Date(societySubscription.PaidTillDate))
    }
    return newValue;
  }

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
      })
  };

  const getBuildingsForSociety = () => {
    societyBuildingsService.getSelectListBySocietyId(societyId)
      .then((response) => {
        setBuildings(response.data);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      var model = setFormValue(values);
      societyReportService.collectionReportPdf(model).then((response) => {
        let result = response.data;
        let fileName = "CollectionReport.pdf";
        fileDownload(result, fileName);
      });
    }
  }

  return (
    <>
      <Typography variant="h5" align="center">
        Member Collection Report
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
                  <Controls.Select
                    //showEmptyItem={false}
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
                    max={globalService.convertLocalToUTCDate(new Date(societySubscription?.PaidTillDate))}
                    onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'FromDate' } })}
                    value={values.FromDate}
                    error={errors.FromDate}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Controls.ReactDatePicker
                    label="To Date"
                    fullWidth
                    value={values.ToDate}
                    onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'ToDate' } })}
                    min={values.FromDate}
                    max={globalService.convertLocalToUTCDate(new Date(societySubscription?.PaidTillDate))}
                    error={errors.ToDate}
                  />
                </Grid>
                <Grid item xs={12} sm={3}></Grid>
                <Grid item xs={12} sm={3}></Grid>
                <Grid item xs={12} sm={6}>
                  {societySubscription && <Typography className='small-text'>From Date & To Date must be between {dayjs(societySubscription.SubscriptionStart).format("DD-MMM-YYYY")} to {dayjs(societySubscription.PaidTillDate).format("DD-MMM-YYYY")}</Typography>}
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

export default CollectionReportForm
