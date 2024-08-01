import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import { TdscategoryRatesModel } from "../../models/TdscategoryRatesModel";
import useForm from "../../utility/hooks/UseForm";
import { TdscategoryRatesService } from "../../services/TdscategoryRatesService";
import { useEffect, useState } from "react";
import { Box, Button, Card, CardActions, CardContent, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import Controls from "../../utility/controls/Controls";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const TdsCategoryRateForm = (...props: any) => {
    const { auth } = React.useContext(AuthContext);
    globalService.pageTitle = "TdsCategoryRate";
    const { tdsCategoryId, tdsCategoryRateId } = useParams();
    let navigate = useNavigate();

    const validate = (fieldValues: TdscategoryRatesModel = values) => {
        let temp: any = { ...errors };
        if ("FromDate" in fieldValues)
            temp.FromDate = fieldValues.FromDate ? "" : "From date is required.";

        if ("ToDate" in fieldValues)
            temp.ToDate = fieldValues.ToDate ? "" : "To date is required.";

        if ("CompanyRate" in fieldValues)
            temp.CompanyRate = fieldValues.CompanyRate ? "" : "Company rate is required.";

        if ("NonCompanyRate" in fieldValues)
            temp.NonCompanyRate = fieldValues.NonCompanyRate ? "" : "Non company rate is required.";

        setErrors({
            ...temp,
        });

        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };

    const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
        useForm(
            TdscategoryRatesService.initialFieldValues,
            validate,
            props.TdscategoryRateId
        );

    const newTdsCategoryRates = () => {
        setValues(TdscategoryRatesService.initialFieldValues);
    };

    function setFormValue(model: TdscategoryRatesModel) {
        let newModel = {
            TdscategoryRateId: model.TdscategoryRateId,
            TdscategoryId: model.TdscategoryId,
            FromDate: globalService.convertLocalToUTCDate(new Date(model.FromDate)),
            ToDate: globalService.convertLocalToUTCDate(new Date(model.ToDate)),
            CompanyRate: model.CompanyRate,
            NonCompanyRate: model.NonCompanyRate,
        };
        return newModel;
    }

    useEffect(() => {
        if (tdsCategoryRateId) {
            getTdsCategoryRate(tdsCategoryRateId);
            setErrors({});
        } else newTdsCategoryRates();
    }, [tdsCategoryRateId]);

    const getTdsCategoryRate = (TdscategoryRateId: any) => {
        TdscategoryRatesService
            .getById(TdscategoryRateId)
            .then((response) => {
                if (response) {
                    let result = response.data;
                    setValues(setFormValue(result.data));
                }
            });
    };

    const handleSubmit = (e: React.FormEvent) => {

        // values.FromDate = startDate;
        // values.ToDate = startDate;
        e.preventDefault();
        if (validate()) {
            if (tdsCategoryRateId) {
                TdscategoryRatesService.put(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {
                            globalService.success(result.message);
                            navigate("/tdsCategoryRates/" + tdsCategoryId);
                        } else {
                            globalService.error(result.message);
                        }
                    }
                });
            } else {
                values.TdscategoryId = tdsCategoryId;
                TdscategoryRatesService.post(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {
                            globalService.success(result.message);
                            resetForm();
                            navigate("/tdsCategoryRates/" + tdsCategoryId);
                        } else {
                            globalService.error(result.message);
                        }
                    }
                });
            }
        }
    };
    return (
        <>
            <Typography variant="h5" align="center">
                TDS Category Rate
            </Typography>
            <form
                autoComplete="off"
                noValidate
                //className={classes.root}
                onSubmit={handleSubmit}
            >

                <Card >
                    <CardContent sx={{ flex: 1 }} >
                        <React.Fragment>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    {/* <DatePicker title="Start Date" selected={startDate} onChange={(date: Date) => setStartDate(date)} /> */}
                                    <Controls.ReactDatePicker
                                        label="From Date"
                                        value={values.FromDate}
                                        onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'FromDate' } })}
                                        error={errors.FromDate}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.ReactDatePicker
                                        label="To Date"
                                        fullWidth
                                        value={values.ToDate}
                                        onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'ToDate' } })}
                                        min={values.FromDate}
                                        error={errors.ToDate}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        label="Company Rate"
                                        name="CompanyRate"
                                        type="number"
                                        value={values.CompanyRate}
                                        onChange={handleInputChange}
                                        error={errors.CompanyRate}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        required
                                        label="Non Company Rate"
                                        name="NonCompanyRate"
                                        type="number"
                                        value={values.NonCompanyRate}
                                        onChange={handleInputChange}
                                        error={errors.NonCompanyRate}
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
                                onClick={() =>
                                    navigate(
                                        "/tdsCategoryRates/" +
                                        tdsCategoryId
                                    )
                                }
                            >
                                Back To List
                            </Button>

                        </Stack>
                    </CardActions>
                </Card>

            </form>
        </>
    );
};

export default TdsCategoryRateForm; 