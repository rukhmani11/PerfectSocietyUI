import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Controls from '../../utility/controls/Controls';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useForm from '../../utility/hooks/UseForm';
import { SelectListModel } from '../../models/ApiResponse';
import { globalService } from '../../services/GlobalService';
import fileDownload from 'js-file-download';
import dayjs from 'dayjs';
import { BalanceSheetModel } from '../../models/AccountingReportModel';
import DownloadIcon from '@mui/icons-material/Download';
import { accountingReportService } from '../../services/AccountingReportService';
import { SocietySubscriptionsModel } from '../../models/SocietySubscriptionsModel';
import { societySubscriptionsService } from '../../services/SocietySubscriptionsService';
import { appInfoService } from '../../services/AppInfoService';
import { useSharedNavigation } from '../../utility/context/NavigationContext';

const BalanceSheetForm = () => {
    const location = useLocation();

    const { societyId, societySubscriptionId, type }: any = useParams();
    const [societySubscription, setSocietySubscription] = useState<SocietySubscriptionsModel>(null);
    const [isBalanceSheetCall, setIsBalanceSheetCall] = useState<boolean>(true);
    const [otherReportExcel, setOtherReportExcel] = useState<boolean>(true);
    // const [isVisible, setVisible] = useState(false);

    let navigate = useNavigate();
    const { goToHome } = useSharedNavigation();
    
    const validate = (fieldValues: BalanceSheetModel = values) => {
        let temp: any = { ...errors };

        if ("AsOnDate" in fieldValues)
            temp.AsOnDate = fieldValues.AsOnDate ? "" : "As On Date is required.";

        setErrors({
            ...temp,
        });

        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };

    const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
        useForm(accountingReportService.initialBalanceSheetFieldValues, validate, societyId);
    var path = location.pathname.split("/")[1];
    useEffect(() => {
        if (!globalService.isSocietySelected()) {
            globalService.info('Society is not selected.');
            return goToHome();
          }
        if (!societySubscription)
            getSocietySubscriptionById();
        var path = location.pathname.split("/")[1];
        setIsBalanceSheetCall(path === 'balanceSheet' ? true : false);
        getAppinfo();
    }, [societySubscription]);

    const newReport = () => {
        setValues(setFormValue(accountingReportService.initialBalanceSheetFieldValues));
    };

    const getSocietySubscriptionById = () => {
        societySubscriptionsService.getById(societySubscriptionId)
            .then((response) => {
                var result = response.data;
                if (result.isSuccess) {
                    setSocietySubscription(result.data);
                    //values.FromDate = globalService.convertLocalToUTCDate(new Date(result.data.SubscriptionStart));
                    values.AsOnDate = globalService.convertLocalToUTCDate(new Date(result.data.PaidTillDate));
                }
                else
                    globalService.error(result.message);
            });
    };

    //This is used since in get the null property is not returned
    function setFormValue(model: BalanceSheetModel) {
        let newValue = {
            SocietyId: societyId,
            SocietySubscriptionId: societySubscriptionId,
            AsOnDate: new Date(model.AsOnDate)
        }
        return newValue;
    }

    const getAppinfo = () => {
       
        appInfoService.getAppInfo().then((response)=> {
            
            let result = response.data;
            setOtherReportExcel(result.row.FlagInfo?.OtherReportExcel);
        });
    }

    const downloadBalanceSheetReport = (type:string) => {
        //e.preventDefault();
        if (validate()) {
            var model = setFormValue(values);
            if (isBalanceSheetCall) {
                if(type === 'pdf'){
                accountingReportService.balanceSheet(model).then((response) => {
                    let result = response.data;
                    let fileName = "BalanceSheetAsOn" + dayjs(values.AsOnDate).format("DD-MMM-YYYY") + ".pdf";
                    fileDownload(result, fileName);
                    // setVisible(true);
                });
            }else{
                accountingReportService.balanceSheetExcel(model).then((response) => {
                    let result = response.data;
                    let fileName = "BalanceSheetAsOn" + dayjs(values.AsOnDate).format("DD-MMM-YYYY") + ".xlsx";
                    fileDownload(result,fileName);
                })
            }
            }
        }
    }

    const downloadReport = (type: string) => {
        if (validate()) {
            var model = setFormValue(values);
            if (type === 'pdf') {
                accountingReportService.balanceSheetSchedule(model).then((response) => {
                    let result = response.data;
                    let fileName = "ScheduleToBalanceSheet" + dayjs(values.AsOnDate).format("DD-MMM-YYYY") + ".pdf";
                    fileDownload(result, fileName);
                })
            }
            else {
                accountingReportService.ScheduleToBalanceSheetExportToExcel(model).then((response) => {
                    let result = response.data;
                    let fileName = "BalanceSheetScheduleAsOn" + dayjs(values.AsOnDate).format("DD-MMM-YYYY") + ".xlsx";
                    fileDownload(result, fileName);

                });
            }
        }
    }
    return (
        <>
            <Typography variant="h5" align="center">
                {isBalanceSheetCall ? 'Balance Sheet' : 'Balance Sheet Schedule Report'}
            </Typography>
            <form
                autoComplete="off"
                noValidate
                //className={classes.root}
                //onSubmit={handleSubmit}
            >
                <Card>
                    <CardContent>
                        <React.Fragment>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={3}>
                                    <Controls.ReactDatePicker
                                        label="As On Date"
                                        min={globalService.convertLocalToUTCDate(new Date(societySubscription?.SubscriptionStart))}
                                        max={societySubscription ? globalService.convertLocalToUTCDate(new Date(societySubscription.PaidTillDate)) : null}
                                        onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'FromDate' } })}
                                        value={values.AsOnDate}
                                        error={errors.AsOnDate}
                                    />
                                    {societySubscription && <Typography className='small-text'>As On Date must be between {dayjs(societySubscription.SubscriptionStart).format("DD-MMM-YYYY")} to {dayjs((societySubscription.PaidTillDate)).format("DD-MMM-YYYY")}</Typography>}
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    </CardContent>
                    <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                        <Stack spacing={2} direction="row">

                            {path === 'balanceSheet' ? <> 
                            <Button type="button" startIcon={<DownloadIcon />} variant="contained" onClick={(e) => downloadBalanceSheetReport('pdf')}>
                                Pdf
                            </Button>
                            {otherReportExcel && (
                            <Button type="button" color='success' startIcon={<DownloadIcon />} variant="contained" onClick={(e) => downloadBalanceSheetReport('excel')}>
                                Excel
                            </Button>
                            )}
                            </> : <>
                            
                            <Button type="button" startIcon={<DownloadIcon />} variant="contained" onClick={(e) => downloadReport('pdf')}>
                                PDF
                            </Button>
                            {otherReportExcel && (
                                <Button type="button" startIcon={<DownloadIcon />} variant="contained" color='success' onClick={(e) => downloadReport('excel')}>
                                    Excel
                                </Button>
                                )}</>}
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

export default BalanceSheetForm
