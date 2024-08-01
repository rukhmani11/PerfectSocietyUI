import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Controls from '../../utility/controls/Controls';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useForm from '../../utility/hooks/UseForm';
import { globalService } from '../../services/GlobalService';
import fileDownload from 'js-file-download';
import DownloadIcon from '@mui/icons-material/Download';
import dayjs from 'dayjs';
import { AccountingReportModel } from '../../models/AccountingReportModel';
import { accountingReportService } from '../../services/AccountingReportService';
import { appInfoService } from '../../services/AppInfoService';
import { useSharedNavigation } from '../../utility/context/NavigationContext';

const TrialBalanceReportForm = () => {

    const { societyId, societySubscriptionId }: any = useParams();
    const [otherReport,setotherReport] = useState(false);
    let navigate = useNavigate();
    const { goToHome } = useSharedNavigation();
    
    const validate = (fieldValues: AccountingReportModel = values) => {
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
        useForm(accountingReportService.initialAccountingReportFieldValues, validate, societyId);

    useEffect(() => {
        if (!globalService.isSocietySelected()) {
            globalService.info('Society is not selected.');
            return goToHome();
          }
        getAppInfo();
    }, []);

    const newReport = () => {
        setValues(setFormValue(accountingReportService.initialAccountingReportFieldValues));
    };

    //This is used since in get the null property is not returned
    function setFormValue(model: AccountingReportModel) {
        let newValue = {
            SocietyId: societyId,
            SocietySubscriptionId: societySubscriptionId,
            FromDate: new Date(model.FromDate),
            ToDate: new Date(model.ToDate),
            AcHeadIds: model.AcHeadIds,//empty
            DocType: model.DocType //empty
        }
        return newValue;
    }

    const getAppInfo = () => {
        appInfoService.getAppInfo().then((response) => {
            setotherReport(response.data.row.FlagInfo?.OtherReportExcel);
        });
    }

    const downloadReport = (type : string) => {
        //e.preventDefault();
        if (validate()) {
            var model = setFormValue(values);
            if(type === 'pdf'){
            accountingReportService.trialBalanceReport(model).then((response) => {
                let result = response.data;
                let fileName = "TrialBalanceReport.pdf";
                fileDownload(result, fileName);
            });
        }else {
            accountingReportService.trialBalanceReportExcel(model).then((response) => {
                let result = response.data;
                let fileName = "TrialBalanceReportExcel.xlsx";
                fileDownload(result,fileName)
            });
        }
        }
    }

    return (
        <>
            <Typography variant="h5" align="center">
                Trial Balance Report
            </Typography>
            <form
                autoComplete="off"
                noValidate
                //className={classes.root}
                //onSubmit={downloadReport}
            >
                <Card>
                    <CardContent>
                        <React.Fragment>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={3}>
                                    <Controls.ReactDatePicker
                                        label="From Date"
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
                                        error={errors.ToDate}
                                    />
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    </CardContent>
                    <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                        <Stack spacing={2} direction="row">
                            <Button type="button" startIcon={<DownloadIcon />} variant="contained"  onClick={(e) => downloadReport('pdf')}>
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
};

export default TrialBalanceReportForm
