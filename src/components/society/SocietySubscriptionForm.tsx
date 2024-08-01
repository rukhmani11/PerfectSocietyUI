import React, { useEffect, useState } from "react";
import { Grid, CardActions, Card, CardContent, Button, Typography, Stack } from "@mui/material";
import { societySubscriptionsService } from "../../services/SocietySubscriptionsService";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SocietySubscriptionsModel } from "../../models/SocietySubscriptionsModel";
import Controls from '../../utility/controls/Controls'
import dayjs from "dayjs";
import { start } from "repl";
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const SocietySubscriptionForm = () => {
    const { auth } = React.useContext(AuthContext);
    const { societySubscriptionId, societyId }: any = useParams();
    let navigate = useNavigate();
    const mode = societySubscriptionId ? 'Edit' : 'Create';
    const [minStartDate, setMinStartDate] = useState(null);
    const [isNoOfFlatsExist, setIsNoOfFlatsExist] = useState<Boolean>(false);

    const validate = (fieldValues: SocietySubscriptionsModel = values) => {
        let temp: any = { ...errors };
        //if (type === 'Add') {
        if ("SubscriptionStart" in fieldValues) {
            let error = "";
            if (fieldValues.SubscriptionStart) {
                //getEndDate(fieldValues.SubscriptionStart);
                if (new Date(fieldValues.SubscriptionStart).getDate() !== 1) {
                    error = "Subscription Start should be first day of month."
                }
            }
            else
                error = "Subscription Start is required.";
            temp.SubscriptionStart = error;

            // let k3 = dayjs('2019-01-25').daysInMonth();
            // let k4 = dayjs(fieldValues.SubscriptionStart).daysInMonth();
            // let k1 = dayjs().endOf('month');
            // let k2 = dayjs().startOf('year');
        }
        if ("SubscriptionEnd" in fieldValues) {
            let error = "";
            if (fieldValues.SubscriptionEnd) {
                // let endDateYear = dayjs(values.SubscriptionStart).year();
                // let endDate = dayjs(fieldValues.SubscriptionEnd).daysInMonth();
                // if (fieldValues.SubscriptionEnd.getDate() !== endDate)
                //     error = "Subscription End should be last day of month."
            }
            else
                error = "Subscription End is required.";
            temp.SubscriptionEnd = error;
        }

        // if ("PaidTillDate" in fieldValues)
        // temp.PaidTillDate = fieldValues.PaidTillDate ?
        //      (fieldValues.PaidTillDate >= fieldValues.SubscriptionStart && fieldValues.PaidTillDate<= fieldValues.SubscriptionEnd? "" : "Paid Till Date should be greater than Subscription Start & less than Subscription End")
        //     : " Paid Till Date is required";

        if ("PaidTillDate" in fieldValues)
            temp.PaidTillDate = fieldValues.PaidTillDate ? "" : "Paid Till Date is required";

        if ("NoOfMembers" in fieldValues)
            temp.NoOfMembers = fieldValues.NoOfMembers ? "" : "No. Of Members is required.";
        // if ("SubscribedMonths" in fieldValues)
        //     temp.SubscribedMonths = fieldValues.SubscribedMonths ? "" : "Subscribed Months is required.";
        // }
        // else {
        //     if ("NoOfInvoicedMembers" in fieldValues)
        //         temp.NoOfInvoicedMembers = fieldValues.NoOfInvoicedMembers ? "" : "No Of Invoiced Members is required.";
        //     if ("NoOfAdditionalMembers" in fieldValues)
        //         temp.NoOfAdditionalMembers = fieldValues.NoOfAdditionalMembers ? "" : "No Of Additional Members is required.";
        //     if ("InvoicedMonths" in fieldValues)
        //         temp.InvoicedMonths = fieldValues.InvoicedMonths ? "" : "Invoiced Months is required.";
        // }
        setErrors({
            ...temp,
        });


        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };

    const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
        useForm(societySubscriptionsService.initialFieldValues, validate, societySubscriptionId);

    const newSocietySubscription = () => {
        setValues(societySubscriptionsService.initialFieldValues);
    };

    //This is used since in get the null property is not returned
    function setFormValue(model: SocietySubscriptionsModel) {

        let newModel = {
            SocietySubscriptionId: model.SocietySubscriptionId,
            SocietyId: model.SocietyId,
            SubscriptionStart: globalService.convertLocalToUTCDate(new Date(model.SubscriptionStart)),
            SubscriptionEnd: globalService.convertLocalToUTCDate(new Date(model.SubscriptionEnd)),
            NoOfMembers: model.NoOfMembers,
            NoOfInvoicedMembers: model.NoOfInvoicedMembers,
            NoOfAdditionalMembers: model.NoOfAdditionalMembers,
            InvoicedMonths: model.InvoicedMonths,
            SubscribedMonths: model.SubscribedMonths,
            PaidTillDate: model.PaidTillDate ? globalService.convertLocalToUTCDate(new Date(model.PaidTillDate)) : null,
            PaidMonths: model.PaidMonths,
            Closed: model.PaidMonths || false,
            LockedTillDate: model.LockedTillDate ? globalService.convertLocalToUTCDate(new Date(model.LockedTillDate)) : null
        }
        return newModel;
    }

    useEffect(() => {
        if (societySubscriptionId) {
            getSocietySubscription();
        }
        else {
            if (!minStartDate) {
                getMaxOfEndDateAndNoOfMembersBySocietyId();
            }
            newSocietySubscription();
            setErrors({});
        }

    }, [societySubscriptionId]);

    const getSocietySubscription = () => {
        societySubscriptionsService
            .getById(societySubscriptionId)
            .then((response) => {
                if (response) {
                    let result = response.data;
                    setValues(setFormValue(result.data));
                }
            })
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {

            values.SocietyId = societyId;
            if (societySubscriptionId) {
                societySubscriptionsService.put(values).then((response: any) => {
                    let result = response.data;
                    if (result.isSuccess) {
                        resetForm();
                        navigate("/societySubscriptions/" + societyId);
                        globalService.success("Society Subscription updated successfully.");
                    }
                });
            } else {

                values.SubscribedMonth = dayjs(values.SubscriptionEnd).diff(values.SubscriptionStart, 'month') + 1;
                societySubscriptionsService.post(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {

                            globalService.success("Society Subscription added successfully.");
                            resetForm();
                            navigate("/societySubscriptions/" + societyId);
                        } else {
                            globalService.error(result.message);
                        }
                    }
                });
            }
        }
    };

    function getMaxOfEndDateAndNoOfMembersBySocietyId() {
        societySubscriptionsService.getMaxOfEndDateAndNoOfMembersBySocietyId(societyId).then((response: any) => {
            let result = response.data;
            if (result) {
                let minStartDate = globalService.convertLocalToUTCDate(new Date(result.maxEndDate));
                setMinStartDate(minStartDate);
                values.SubscriptionStart = minStartDate;
                getEndDate(minStartDate);
                values.NoOfMembers = result.noOfFlats
                setIsNoOfFlatsExist(result.noOfFlats > 0 ? true : false);
            }
        });
    }

    function getEndDate(startDate: Date) {
        let endDate = new Date();
        let endDateYear = startDate.getFullYear() + 1;
        values.SubscriptionEnd = new Date(endDate.setFullYear(endDateYear, 2, 31));
        //return new Date(endDate.setFullYear(endDateYear, 2, 31));
    }

    function clearEndDate() {
        values.SubscriptionEnd = null;
    }

    return (
        <>
            <Typography variant="h5" align="center">
                Society Subscription
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
                                        label="Subscription Start"
                                        disabled={mode === "Edit"}
                                        min={minStartDate}
                                        // onChange={(date: Date) =>  handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'SubscriptionStart' } })}
                                        onChange={(date: Date) => {
                                            getEndDate(date);
                                            handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'SubscriptionStart' } })
                                        }}
                                        value={values.SubscriptionStart}
                                        error={errors.SubscriptionStart}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Controls.ReactDatePicker
                                        //disabled={mode === "Edit"}
                                        disabled={true}
                                        required
                                        label="Subscription End"
                                        fullWidth
                                        value={values.SubscriptionEnd}
                                        //value={endDate}
                                        onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'SubscriptionEnd' } })}
                                        min={values.SubscriptionStart}
                                        error={errors.SubscriptionEnd}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.ReactDatePicker
                                        label="Paid Till Date"
                                        required
                                        value={values.PaidTillDate}
                                        min={values.SubscriptionStart}
                                        max={values.SubscriptionEnd}
                                        onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'PaidTillDate' } })}
                                        error={errors.PaidTillDate}
                                    />
                                </Grid>

                                {/* <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        label="Subscribed Months"
                                        name="SubscribedMonths"
                                        type="number"
                                        readonly
                                        value={values.SubscribedMonths}
                                        onChange={handleInputChange}
                                        error={errors.SubscribedMonths}
                                    />
                                </Grid> */}
                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        required
                                        disabled={mode === "Edit" || isNoOfFlatsExist}
                                        label="No Of Flats"
                                        name="NoOfMembers"
                                        type="number"
                                        value={values.NoOfMembers}
                                        onChange={handleInputChange}
                                        error={errors.NoOfMembers}
                                    />
                                </Grid>
                                {/* {mode === 'Edit' && <> <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        label="No Of Invoiced Members"
                                        name="NoOfInvoicedMembers"
                                        type="number"
                                        value={values.NoOfInvoicedMembers}
                                        onChange={handleInputChange}
                                        error={errors.NoOfInvoicedMembers}
                                    />
                                </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Controls.Input
                                            label="No Of Additional Members"
                                            name="NoOfAdditionalMembers"
                                            type="number"
                                            value={values.NoOfAdditionalMembers}
                                            onChange={handleInputChange}
                                            error={errors.NoOfAdditionalMembers}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Controls.Input
                                            label="Invoiced Months"
                                            name="InvoicedMonths"
                                            type="number"
                                            value={values.InvoicedMonths}
                                            onChange={handleInputChange}
                                            error={errors.InvoicedMonths}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Controls.ReactDatePicker
                                            label="PaidTillDate"
                                            value={values.PaidTillDate}
                                            onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'PaidTillDate' } })}
                                            error={errors.PaidTillDate}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <Controls.ReactDatePicker
                                            label="Locked Till Date"
                                            fullWidth
                                            value={values.LockedTillDate}
                                            onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'LockedTillDate' } })}
                                            error={errors.LockedTillDate}
                                        />
                                    </Grid>
                                </>
                                } */}
                            </Grid>
                        </React.Fragment>
                    </CardContent>
                    <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                        <Stack spacing={2} direction="row">
                            <Button type="submit" variant="contained"className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}>
                                Submit
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                href={"/societySubscriptions/" + societyId}
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
export default SocietySubscriptionForm


// import React from 'react'

// const SocietySubscriptionForm = () => {
//   return (
//     <div>SocietySubscriptionForm</div>
//   )
// }

// export default SocietySubscriptionForm