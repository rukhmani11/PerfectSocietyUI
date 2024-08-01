import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Controls from '../../utility/controls/Controls';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useForm from '../../utility/hooks/UseForm';
import { MultiSelectListModel, SelectListModel } from '../../models/ApiResponse';
import { globalService } from '../../services/GlobalService';
import fileDownload from 'js-file-download';
import { societyBuildingsService } from '../../services/SocietyBuildingsService';
import { societySubscriptionsService } from '../../services/SocietySubscriptionsService';
import { SocietySubscriptionsModel } from '../../models/SocietySubscriptionsModel';
import dayjs from 'dayjs';
import { AccountingReportModel } from '../../models/AccountingReportModel';
import { accountingReportService } from '../../services/AccountingReportService';
import { acHeadsService } from '../../services/AcHeadsService';
import { MultiSelect } from "react-multi-select-component";
import DownloadIcon from '@mui/icons-material/Download';
import { type } from 'os';
import { appInfoService } from '../../services/AppInfoService';
import { useSharedNavigation } from '../../utility/context/NavigationContext';



const GeneralLedgerReportForm = () => {

  const { societyId, societySubscriptionId }: any = useParams();
  let navigate = useNavigate();
  const { goToHome } = useSharedNavigation();
  //const [acHeads, setAcHeads] = useState<SelectListModel[]>([]);
  const [acHeads, setAcHeads] = useState<MultiSelectListModel[]>([]);
  const [selectedAcHeads, setSelectedAcHeads] = useState([]);
  const [societySubscription, setSocietySubscription] = useState<SocietySubscriptionsModel>(null);
  const [otherReport,setOtherReport] = useState(false);
  const validate = (fieldValues: AccountingReportModel = values) => {
    let temp: any = { ...errors };

    if ("FromDate" in fieldValues)
      temp.FromDate = fieldValues.FromDate ? "" : "From Date is required.";
    if ("ToDate" in fieldValues)
      temp.ToDate = fieldValues.ToDate ? "" : "To Date is required.";
    if ("AcHeadIds" in fieldValues)
      temp.AcHeadIds = fieldValues.AcHeadIds ? "" : "Account heads is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(accountingReportService.initialAccountingReportFieldValues, validate, societyId);

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info('Society is not selected.');
      return goToHome();
    }
    if (acHeads.length === 0)
      getAcHeadsForSociety();
      if (!societySubscription)
      getSocietySubscriptionById();
      getAppInfo();
  }, []);

  const newReport = () => {
    setValues(setFormValue(accountingReportService.initialAccountingReportFieldValues));
  };

  const getAcHeadsForSociety = () => {
    acHeadsService.getSelectListBySocietyId(societyId)
      .then((response) => {
        let a: MultiSelectListModel[] = [];
        response.data.forEach((x: SelectListModel) => {
          a.push({ label: x.Text, value: x.Value });
        });
        setAcHeads(a);
        //setAcHeads(response.data);
      });
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
  function setFormValue(model: AccountingReportModel) {
    let newValue = {
      SocietyId: societyId,
      SocietySubscriptionId: societySubscriptionId,
      DocType: model.DocType,
      // FromDate: new Date(model.FromDate),
      // ToDate: new Date(model.ToDate),
      FromDate: model.FromDate ? new Date(model.FromDate) : globalService.convertLocalToUTCDate(new Date(societySubscription.SubscriptionStart)),
      ToDate: model.ToDate ? new Date(model.ToDate) : globalService.convertLocalToUTCDate(new Date(societySubscription.PaidTillDate)),
      AcHeadIds: model.AcHeadIds
    }
    return newValue;
  }

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (validate()) {
  //     // values.AcHeadIds = selectedAcHeads.map(x => x.value).join(',');
  //     var model = setFormValue(values);
  //     accountingReportService.GeneralLedgerReport(model).then((response) => {
  //       let result = response.data;
  //       let fileName = "GeneralLedgerReport.pdf";
  //       fileDownload(result, fileName);
  //     });
  //   }
  // }

  const getAppInfo = () =>{
    appInfoService.getAppInfo().then((response) => {
      setOtherReport(response.data.row.FlagInfo?.OtherReportExcel);
    });
  }
  const downloadReport=(type : string) => {
    if(validate()){
      var model = setFormValue(values);
      if(type === 'pdf'){
        accountingReportService.GeneralLedgerReport(model).then((response) => {
          let result = response.data;
          let fileName = "GeneralLedgerReport.pdf";
          fileDownload(result, fileName);
        });
      }
      else{
        accountingReportService.generalLedgerReportExportToExcel(model).then((response) =>{
          let result = response.data;
          let fileName = "GeneralLedgerReport.xlsx";
          fileDownload(result, fileName);
        })
      }
    }
  }

  return (
    <>
      <Typography variant="h5" align="center">
        General Ledger Report
      </Typography>
      <form
        autoComplete="off"
        noValidate
        //className={classes.root}
        //onSubmit={handleSubmit}
      >
        <Card>
          <CardContent sx={{ height: '300px' }}>
            <React.Fragment>
              {/* <pre>{JSON.stringify(selectedAcHeads)}</pre> */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={5}>
                  <Controls.ReactMultiSelect
                    options={acHeads}
                    value={selectedAcHeads}
                    onChange={(e: any[]) => {
                      setSelectedAcHeads(e);
                      handleInputChange({ target: { value: e.map((x: any) => x.value).join(','), name: 'AcHeadIds' } });
                    }}
                    labelledBy="Select Ac Head"
                    error={errors.AcHeadIds}
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

              </Grid>
            </React.Fragment>
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "center" }}>
            <Stack spacing={2} direction="row">
              {/* <Button type="submit" variant="contained">
                PDF
              </Button> */}
              <Button type="button" startIcon={<DownloadIcon />} variant="contained" onClick={(e) => downloadReport('pdf')}>
                    PDF
                  </Button>
                  {otherReport && (
                  <Button type="button" startIcon={<DownloadIcon />} variant="contained" color='success' onClick={(e) => downloadReport('excel')}>
                    Excel
                  </Button>
                  )}
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
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

export default GeneralLedgerReportForm
