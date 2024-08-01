import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Controls from '../../utility/controls/Controls';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { MemberBalanceReportModel } from '../../models/SocietyReportModel';
import { societyReportService } from '../../services/SocietyReportService';
import useForm from '../../utility/hooks/UseForm';
import { SelectListModel } from '../../models/ApiResponse';
import { societyBuildingsService } from '../../services/SocietyBuildingsService';
import DownloadIcon from '@mui/icons-material/Download';
import { globalService } from '../../services/GlobalService';
import fileDownload from 'js-file-download';
import { societyBillSeriesService } from '../../services/SocietyBillSeriesService';
import { Messages } from '../../utility/Config';
import { useSharedNavigation } from '../../utility/context/NavigationContext';

const MemberBalanceReportForm = () => {
  const { societyId, societySubscriptionId }: any = useParams();
  let navigate = useNavigate();
  let balanceFilters = globalService.getBalanceFilterForReport();
  const { goToHome } = useSharedNavigation();
  const [buildings, setBuildings] = useState<SelectListModel[]>([]);
  const [billAbbreviations, setBillAbbreviations] = useState<SelectListModel[]>([]);
  //const [societySubscription, setSocietySubscription] = useState<SocietySubscriptionsModel>(null);

  const validate = (fieldValues: MemberBalanceReportModel = values) => {
    let temp: any = { ...errors };
    if ("BillAbbreviation" in fieldValues) {
      if (fieldValues.BillAbbreviation === "") {
        // The user selected "All"
        temp.BillAbbreviation = "";  // Set to empty string or handle as needed
      } else {
        // The user selected a specific value
        temp.BillAbbreviation = fieldValues.BillAbbreviation
          ? ""
          : "Bill Abbreviation is required.";
      }
    }
    

    if ("BalanceFilter" in fieldValues)
      temp.BalanceFilter = fieldValues.BalanceFilter ? "" : "Balance Filter is required.";
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
    if (billAbbreviations.length === 0)
      getBillAbbreviationsBySocietyId();
  }, []);

  const newReport = () => {
    setValues(societyReportService.initialMemberBalanceReportFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: MemberBalanceReportModel) {
    let newValue = {
      SocietyId: societyId,
      SocietySubscriptionId: societySubscriptionId,
      SocietyBuildingId: model.SocietyBuildingId,
      Amount: model.Amount,
      BalanceFilter: model.BalanceFilter,
      BillAbbreviation: model.BillAbbreviation,
      IsDetails: model.IsDetails || false,
    }
    return newValue;
  }

  const getBuildingsForSociety = () => {
    societyBuildingsService.getSelectListBySocietyId(societyId)
      .then((response) => {
        setBuildings(response.data);
      });
  };

  const getBillAbbreviationsBySocietyId = () => {
    societyBillSeriesService.getSelectListBySocietyId(societyId)
      .then((response) => {
        // setBillAbbreviations(response.data);
        const BillAbbreviationsWithAll = [{ Value: " ", Text: "All" }, ...response.data];
        
        setBillAbbreviations(BillAbbreviationsWithAll);
        if (response.data.length > 0)
            values.BillAbbreviation = " ";
      });
  };


  //const handleSubmit = (e: React.FormEvent) => {
  const downloadReport = (type: string) => {
    //e.preventDefault();
    if (validate()) {
      var model = setFormValue(values);
      if (type === 'pdf') {
        societyReportService.memberBalanceReportPdf(model).then((response) => {
          let result = response.data;
          fileDownload(result, values.IsDetails ? "MemberBalanceDetailsReport.pdf" : "MemberBalanceReport.pdf");
        });
      }
      else {
        societyReportService.memberBalanceReportExcel(model).then((response) => {
          let result = response.data;
          fileDownload(result, "MemberBalanceReport.xlsx");
        });
      }
    }
  }

  return (
    <>
      <Typography variant="h5" align="center">
        Member Balance Report
      </Typography>
      <form
        autoComplete="off"
        noValidate
      //className={classes.root}
      // onSubmit={handleSubmit}
      >
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <Controls.Select
                    showEmptyItem={false}
                    name="BalanceFilter"
                    label="Balance"
                    required
                    value={balanceFilters.length > 0 ? values.BalanceFilter : ""}
                    onChange={handleInputChange}
                    options={balanceFilters}
                    error={errors.BalanceFilter}
                  />
                </Grid>
                {values.BalanceFilter === "All" && <Grid item xs={12} sm={3}>
                  <Controls.Input
                    name="Amount"
                    label="Balance Above"
                    type="number"
                    value={values.Amount}
                    onChange={handleInputChange}
                    error={errors.Amount}
                  />
                </Grid>
                }
                <Grid item xs={12} sm={3}>
                  <Controls.Select
                    showEmptyItem={true}
                    name="SocietyBuildingId"
                    label="For Building"
                    required
                    value={buildings.length > 0 ? values.SocietyBuildingId : ""}
                    onChange={(e: any) => {
                      //getSocietyBuildingUnitbySocietyBuildingId(e.target.value);
                      handleInputChange(e);
                    }}
                    options={buildings}
                    error={errors.SocietyBuildingId}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Controls.Select
                    showEmptyItem={false}
                    name="BillAbbreviation"
                    label="Bill Abbreviation"
                    required
                    value={billAbbreviations.length > 0 ? values.BillAbbreviation : ""}
                    onChange={(e: any) => {
                      handleInputChange(e);
                    }}
                    options={billAbbreviations}
                    error={errors.BillAbbreviation}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Controls.Checkbox
                    name="IsDetails"
                    label="Show Balances In Details"
                    value={values.IsDetails}
                    onChange={handleInputChange}
                  />
                </Grid>

              </Grid>
            </React.Fragment>
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "center" }}>
            <Stack spacing={2} direction="row">
              <Button type="button" startIcon={<DownloadIcon />} variant="contained" onClick={(e) => downloadReport('pdf')}>
                PDF
              </Button>

              <Button type="button" startIcon={<DownloadIcon />} variant="contained" color='success' onClick={(e) => downloadReport('excel')}>
                Excel
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
      </form>
    </>
  )
}

export default MemberBalanceReportForm