
import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Controls from '../../utility/controls/Controls';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PayInSlipModel } from '../../models/SocietyReportModel';
import { societyReportService } from '../../services/SocietyReportService';
import useForm from '../../utility/hooks/UseForm';
import { SelectListModel } from '../../models/ApiResponse';
import { globalService } from '../../services/GlobalService';
import fileDownload from 'js-file-download';
import { societySubscriptionsService } from '../../services/SocietySubscriptionsService';
import { SocietySubscriptionsModel } from '../../models/SocietySubscriptionsModel';
import dayjs from 'dayjs';
import { Messages, ROLES } from '../../utility/Config';
import { AuthContext } from '../../utility/context/AuthContext';
import { useSharedNavigation } from '../../utility/context/NavigationContext';

const PayInSlipReportForm = () => {
    const { auth } = React.useContext(AuthContext);
    const { societyId, societySubscriptionId }: any = useParams();
    let navigate = useNavigate();
    //const [banks, setBanks] = useState<SelectListModel[]>([]);
    //const [pageInfo, setPageInfo] = useState<any>(null);
    const [billAbbreviations, setBillAbbreviations] = useState<SelectListModel[]>([]);
    const [societySubscription, setSocietySubscription] = useState<SocietySubscriptionsModel>(null);
    const { goToHome } = useSharedNavigation();
    
    const validate = (fieldValues: PayInSlipModel = values) => {
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
        if (!societySubscription)
            getSocietySubscriptionById();

        //if (!values)
            getPageInfo();

    }, []);

    const newReport = () => {
        setValues(setFormValue(societyReportService.initialPayInSlipFieldValues));
    };

    //This is used since in get the null property is not returned
    function setFormValue(model: PayInSlipModel) {
        let newValue = {
            SocietyId: societyId,
            SocietySubscriptionId: societySubscriptionId,
            BankId: model.BankId || '',
            BillAbbreviation: model.BillAbbreviation || '',
            FromDate: model.FromDate ? new Date(model.FromDate) : globalService.convertLocalToUTCDate(new Date(societySubscription.SubscriptionStart)),
            ToDate: model.ToDate ? new Date(model.ToDate) : globalService.convertLocalToUTCDate(new Date(societySubscription.PaidTillDate))
        }
        return newValue;
    }

    const getPageInfo = () => {
        societyReportService.getForPayInSlipForm(societySubscriptionId)
            .then((response) => {
                var result = response.data;
                if (result.isSuccess) {
                    if (result.data) {
                        
                        //setBanks(result.data.Banks);
                        setBillAbbreviations(result.data.BillAbbreviations);
                        result.data.FromDate = globalService.convertLocalToUTCDate(new Date(result.data.FromDate));
                        result.data.ToDate = globalService.convertLocalToUTCDate(new Date(result.data.ToDate));
                        setValues(setFormValue(result.data));
                    }
                }
                else
                    globalService.error(result.message);
            })
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
            });
    };

    // const getBanksForSociety = (billAbbr: string) => {
    //     societyBanksService.getSelectListBySocietyId(societyId)
    //         .then((response) => {
    //             setBanks(response.data);
    //         });
    // };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            values.BankId = null;
            var model = setFormValue(values);
            societyReportService.payInSlipPdf(model).then((response) => {
                let result = response.data;
                let fileName = "PayInSlip.pdf";
                fileDownload(result, fileName);
            });
        }
    }

    return (
        <>
            <Typography variant="h5" align="center">
                Pay In Slip
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
                                        name="BillAbbreviation"
                                        label="Bill Abbreviation"
                                        showEmptyItem={false}
                                        required
                                        value={
                                            billAbbreviations.length > 0
                                                ? values.BillAbbreviation
                                                : ""
                                        }
                                        onChange={handleInputChange}
                                        options={billAbbreviations}
                                        error={errors.BillAbbreviation}
                                    />
                                </Grid>
                                {/* <Grid item xs={12} sm={3}>
                                    <Controls.Select
                                        label="Bank"
                                        name="BankId"
                                        value={banks.length > 0 ? values.BankId : ""}
                                        onChange={handleInputChange}
                                        options={banks}
                                        error={errors.BankId}
                                    />
                                </Grid> */}
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
                            <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}
                            >
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

export default PayInSlipReportForm
