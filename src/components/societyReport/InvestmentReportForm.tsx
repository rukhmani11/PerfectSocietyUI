import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Controls from '../../utility/controls/Controls';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { MemberLedgerReportModel, SocietyInvestmentReportModel } from '../../models/SocietyReportModel';
import { societyReportService } from '../../services/SocietyReportService';
import useForm from '../../utility/hooks/UseForm';
import { SelectListModel } from '../../models/ApiResponse';
import { societyBuildingsService } from '../../services/SocietyBuildingsService';
import { societyBuildingUnitsService } from '../../services/SocietyBuildingUnitsService';
import { SocietySubscriptionsModel } from '../../models/SocietySubscriptionsModel';
import { societySubscriptionsService } from '../../services/SocietySubscriptionsService';
import { globalService } from '../../services/GlobalService';
import fileDownload from 'js-file-download';
import { Messages, ROLES } from '../../utility/Config';
import { AuthContext } from '../../utility/context/AuthContext';
import { useSharedNavigation } from '../../utility/context/NavigationContext';

const InvestmentReportForm = () => {
    const { auth } = React.useContext(AuthContext);
    const { societyId, societySubscriptionId }: any = useParams();
    let navigate = useNavigate();
    const { goToHome } = useSharedNavigation();
    
    const validate = (fieldValues: MemberLedgerReportModel = values) => {
        let temp: any = { ...errors };
        if (fieldValues.FromDate || fieldValues.ToDate) {
            if ("FromDate" in fieldValues)
                temp.FromDate = fieldValues.FromDate ? "" : "From Date is required.";
            if ("ToDate" in fieldValues)
                temp.ToDate = fieldValues.ToDate ? "" : "To Date is required.";
        }
        setErrors({
            ...temp,
        });

        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };

    const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
        useForm(societyReportService.initialSocietyInvestmentReportFieldValues, validate, societyId);

    useEffect(() => {
        if (!globalService.isSocietySelected()) {
            globalService.info(Messages.SocietyUnSelected);
            return goToHome();
          }
    }, [societyId]);

    //This is used since in get the null property is not returned
    function setFormValue(model: SocietyInvestmentReportModel) {
        let newValue = {
            SocietySubscriptionId: societySubscriptionId,
            FromDate: model.FromDate ? new Date(model.FromDate) : null,
            ToDate: model.ToDate ? new Date(model.ToDate) : null,
            IsPending: model.IsPending || false,
        }
        return newValue;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            var model = setFormValue(values);
            societyReportService.societyInvestmentReport(model).then((response) => {
                let result = response.data;
               fileDownload(result, values.IsPending ? "SocietyInvestmentPendingReport.pdf" : "SocietyInvestmentReport.pdf");
            });
        }
    }

    return (
        <>
            <Typography variant="h5" align="center">
                Society Investment Report
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
                                <Grid item xs={12} sm={4}>
                                    <Controls.ReactDatePicker
                                        label="From Date"
                                        value={values.FromDate}
                                        onChange={(date: Date) =>
                                            handleInputChange({
                                                target: {
                                                    value: globalService.convertLocalToUTCDate(date),
                                                    name: "FromDate",
                                                },
                                            })
                                        }
                                        error={errors.FromDate}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.ReactDatePicker
                                        label="To Date"
                                        fullWidth
                                        value={values.ToDate}
                                        onChange={(date: Date) =>
                                            handleInputChange({
                                                target: {
                                                    value: globalService.convertLocalToUTCDate(date),
                                                    name: "ToDate",
                                                },
                                            })
                                        }
                                        min={values.FromDate}
                                        error={errors.ToDate}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.Checkbox
                                        name="IsPending"
                                        label="Pending"
                                        value={values.IsPending}
                                        onChange={handleInputChange}
                                    />
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
            </form>
        </>
    )
}

export default InvestmentReportForm