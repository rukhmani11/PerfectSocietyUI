import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Controls from '../../utility/controls/Controls';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useForm from '../../utility/hooks/UseForm';
import { SelectListModel } from '../../models/ApiResponse';
import { globalService } from '../../services/GlobalService';
import fileDownload from 'js-file-download';
import { societyBuildingsService } from '../../services/SocietyBuildingsService';
import { societySubscriptionsService } from '../../services/SocietySubscriptionsService';
import { SocietySubscriptionsModel } from '../../models/SocietySubscriptionsModel';
import dayjs from 'dayjs';
import DownloadIcon from '@mui/icons-material/Download';
import { AccountingReportModel } from '../../models/AccountingReportModel';
import { accountingReportService } from '../../services/AccountingReportService';
import { appInfoService } from '../../services/AppInfoService';
import { useSharedNavigation } from '../../utility/context/NavigationContext';


const TransactionReportForm = () => {

    const { societyId, societySubscriptionId }: any = useParams();
    let navigate = useNavigate();
    const [docTypes, setDocTypes] = useState<SelectListModel[]>([]);
    const [societySubscription, setSocietySubscription] = useState<SocietySubscriptionsModel>(null);
    const [otherReport, setOtherReport] = useState(false);
    const { goToHome } = useSharedNavigation();
    
    const validate = (fieldValues: AccountingReportModel = values) => {
        let temp: any = { ...errors };

        if ("FromDate" in fieldValues)
            temp.FromDate = fieldValues.FromDate ? "" : "From Date is required.";
        if ("ToDate" in fieldValues)
            temp.ToDate = fieldValues.ToDate ? "" : "To Date is required.";
        if ("DocType" in fieldValues)
            temp.DocType = fieldValues.DocType ? "" : "Document Type is required.";
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
        if (docTypes.length === 0)
            setDocTypes(globalService.getDocTypeSelectList());
        if (!societySubscription)
            getSocietySubscriptionById();
        getAppInfo();
    }, []);

    const newReport = () => {
        setValues(setFormValue(accountingReportService.initialAccountingReportFieldValues));
    };
    const getSocietySubscriptionById = () => {
        societySubscriptionsService.getById(societySubscriptionId)
            .then((response) => {

                var result = response.data;
                if (result.isSuccess) {
                    setSocietySubscription(result.data);
                    values.FromDate = globalService.convertLocalToUTCDate(new Date(result.data.SubscriptionStart));
                    values.ToDate = globalService.convertLocalToUTCDate(new Date(result.data.PaidTillDate));
                    values.DocType = result.data.DocType;
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
            AcHeadIds: model.AcHeadIds,//empty
        }
        return newValue;
    }

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (validate()) {
    //         var model = setFormValue(values);
    //         accountingReportService.transactionRegisterReport(model).then((response) => {
    //             let result = response.data;
    //             let fileName = "TransactionRegisterReport.pdf";
    //             fileDownload(result, fileName);
    //         });
    //     }
    // }
    const getAppInfo = () => {
        appInfoService.getAppInfo().then((response) => {
            setOtherReport(response.data.row.FlagInfo?.OtherReportExcel);
        });
    }
    const downloadReport = (type: string) => {
        if (validate()) {
            var model = setFormValue(values);
            if (type === 'pdf') {

                accountingReportService.transactionRegisterReport(model).then((response) => {
                    let result = response.data;
                    let fileName = "TransactionRegisterReport.pdf";
                    fileDownload(result, fileName);
                });
            }
            else {
                accountingReportService.transactionExportToExcel(model).then((response) => {
                    let result = response.data;
                    fileDownload(result, "TransactionRegisterReport.xlsx");
                });
            }
        }
    }
    return (
        <>
            <Typography variant="h5" align="center">
                Transaction Register Report
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
                                <Grid item xs={12} sm={3}>
                                    <Controls.Select

                                        name="DocType"
                                        label="Document Type"
                                        required
                                        value={docTypes.length > 0 ? values.DocType : ""}
                                        onChange={(e: any) => {
                                            handleInputChange(e);
                                        }}
                                        options={docTypes}
                                        error={errors.DocType}
                                    />
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    </CardContent>
                    <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                        <Stack spacing={2} direction="row">
                            {values.DocType &&
                                <>
                                    <Button type="button" startIcon={<DownloadIcon />} variant="contained" onClick={(e) => downloadReport('pdf')}>
                                        PDF
                                    </Button>
                                    {otherReport && (
                                        <Button type="button" startIcon={<DownloadIcon />} variant="contained" color='success' onClick={(e) => downloadReport('excel')}>
                                            Excel
                                        </Button>
                                    )}
                                </>
                            }
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate("/dashboard/" + societyId)}
                            >
                                Back
                            </Button>

                        </Stack>
                    </CardActions>
                    {/* <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                        <Stack spacing={2} direction="row">
                            <Button type="submit" variant="contained">
                                Submit
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </Button>

                        </Stack>
                    </CardActions> */}

                </Card>
            </form >
        </>
    )
}

export default TransactionReportForm
