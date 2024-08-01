import { useNavigate, useParams } from "react-router-dom";
import { SelectListModel } from "../../../models/ApiResponse";
import { useEffect, useState } from "react";
import { SocietyInvestmentsModel } from "../../../models/SocietyInvestmentsModel";
import useForm from "../../../utility/hooks/UseForm";
import { SocietyInvestmentsService } from "../../../services/SocietyInvestmentsService";
import { bankService } from "../../../services/BankService";
import { globalService } from "../../../services/GlobalService";
import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import Controls from "../../../utility/controls/Controls";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { debug } from "util";
import { Messages, ROLES } from "../../../utility/Config";
import { AuthContext } from "../../../utility/context/AuthContext";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";

const SocietyInvestmentForm = () => {
    const { auth } = React.useContext(AuthContext);
    const { societyId, societyInvestmentId }: any = useParams();
    let navigate = useNavigate();
    const [banks, setBanks] = useState<SelectListModel[]>([]);
    // const mode = societyInvestmentId ? 'Edit' : 'Create';
    const { goToHome } = useSharedNavigation();
    
    const validate = (fieldValues = values) => {
        let temp: any = { ...errors };
        if ("BankId" in fieldValues)
            temp.BankId = fieldValues.BankId ? "" : "Bank is required.";

        if ("DocumentNo" in fieldValues)
            temp.DocumentNo = fieldValues.DocumentNo ? "" : "Document No is required.";

        if ("DocumentDate" in fieldValues)
            temp.DocumentDate = fieldValues.DocumentDate ? "" : "Document Date is required.";

        if ("MaturityDate" in fieldValues) {
            temp.MaturityDate = fieldValues.MaturityDate ? "" : "Maturity Date is required.";
            // temp.MaturityDate = fieldValues.MaturityDate ?
            //     (fieldValues.MaturityDate >= values.DocumentDate ? "" : "Maturity date should be greater than or equals to document date")
            //     : "Maturity Date is required.";
        }

        if ("Amount" in fieldValues) {
            temp.Amount = fieldValues.Amount ?
                (fieldValues.Amount > 0 ? "" : "Amount should be greater than zero")
                : "Amount is required.";
            if (values.MaturityAmount) {
                temp.MaturityAmount = values.MaturityAmount > fieldValues.Amount ? "" : "Maturity amount should be greater than Amount";
            }
        }

        if ("MaturityAmount" in fieldValues) {
            temp.MaturityAmount = fieldValues.MaturityAmount ?
                (fieldValues.MaturityAmount > values.Amount ? "" : "Maturity amount should be greater than Amount")
                : "Maturity Amount is required.";
        }

        if ("InterestRate" in fieldValues)
            temp.InterestRate = fieldValues.InterestRate ? "" : "Interest Rate is required.";

        if ("ClosureAmount" in fieldValues)
            temp.ClosureAmount = fieldValues.ClosureAmount ?
                (fieldValues.ClosureAmount > 0 ? "" : "Closure amount should be greater than zero")
                : "Closure Amount is required.";

        //  if ("ClosureDate" in fieldValues)
        //  temp.ClosureDate = fieldValues.ClosureDate ?
        //        (fieldValues.ClosureDate = null || fieldValues.ClosureDate >= fieldValues.DocumentDate   ? "" : "Closure date should be null or  greater than document date");

        setErrors({
            ...temp,
        });

        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };

    const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
        useForm(
            SocietyInvestmentsService.initialFieldValues,
            validate,
            societyInvestmentId
        );

    const newSocietyInvestment = () => {
        setValues(SocietyInvestmentsService.initialFieldValues);
    };

    //This is used since in get the null property is not returned
    function setFormValue(model: SocietyInvestmentsModel) {
        let newModel = {
            societyInvestmentId: model.SocietyInvestmentId,
            SocietyId: model.SocietyId,
            BankId: model.BankId || '',
            Bank: model.Bank || '',
            DocumentNo: model.DocumentNo || '',
            DocumentDate: model.DocumentDate ? globalService.convertLocalToUTCDate(new Date(model.DocumentDate)) : null,
            MaturityDate: model.MaturityDate ? globalService.convertLocalToUTCDate(new Date(model.MaturityDate)) : null,
            Amount: model.Amount || 0,
            InterestRate: model.InterestRate || 0,
            ChequeNo: model.ChequeNo || "",
            ChequeDate: model.ChequeDate ? globalService.convertLocalToUTCDate(new Date(model.ChequeDate)) : null,
            MaturityAmount: model.MaturityAmount || 0,
            ClosureDate: model.ClosureDate ? globalService.convertLocalToUTCDate(new Date(model.ClosureDate)) : null,
            ClosureAmount: model.ClosureAmount || 0,
            RealizationDate: model.RealizationDate ? globalService.convertLocalToUTCDate(new Date(model.RealizationDate)) : null,
        };
        return newModel;
    }

    useEffect(() => {
        if (!globalService.isSocietySelected()) {
            globalService.info(Messages.SocietyUnSelected);
            return goToHome();
          }
        if (banks.length === 0) getBanks();

        if (societyInvestmentId) {
            getSocietyInvestment();
        } else {
            newSocietyInvestment();
            setErrors({});
        }
    }, [societyInvestmentId]);

    const getBanks = () => {
        bankService
            .getSelectList()
            .then((response) => {
                setBanks(response.data);
            });
    };

    const getSocietyInvestment = () => {
        SocietyInvestmentsService
            .getById(societyInvestmentId)
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
            //values.SocietyId = societyId;
            if (societyInvestmentId) {
               
                
                SocietyInvestmentsService.put(values).then((response: any) => {
                    let result = response.data;
                    if (result.isSuccess) {
                        resetForm();
                        globalService.success(result.message);
                        navigate("/societyInvestments/" + societyId);
                    } else {
                        globalService.error(result.message);
                    }
                });
            } else {
                values.SocietyId = societyId;
                SocietyInvestmentsService.post(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {
                            globalService.success(result.message);
                            resetForm();
                            navigate("/societyInvestments/" + societyId);
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
                Society Investment
            </Typography>
            <form
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
            >
                <Card>
                    <CardContent>
                        <React.Fragment>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <Controls.Select
                                        showEmptyItem={false}
                                        name="BankId"
                                        label="Bank"
                                        required
                                        value={banks.length > 0 ? values.BankId : ""}
                                        onChange={handleInputChange}
                                        options={banks}
                                        error={errors.BankId}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        label="Other Bank"
                                        name="Bank"
                                        value={values.Bank}
                                        onChange={handleInputChange}
                                        error={errors.Bank}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        label="Document No"
                                        name="DocumentNo"
                                        value={values.DocumentNo}
                                        onChange={handleInputChange}
                                        error={errors.DocumentNo}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.ReactDatePicker
                                        label="Document Date"
                                        value={values.DocumentDate}
                                        max={values.MaturityDate}
                                        onChange={(date: Date) =>
                                            handleInputChange({
                                                target: {
                                                    value: globalService.convertLocalToUTCDate(date),
                                                    name: "DocumentDate",
                                                },
                                            })
                                        }
                                        error={errors.DocumentDate}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.ReactDatePicker
                                        label="Maturity Date"
                                        min={values.DocumentDate}
                                        value={values.MaturityDate}
                                        onChange={(date: Date) =>
                                            handleInputChange({
                                                target: {
                                                    value: globalService.convertLocalToUTCDate(date),
                                                    name: "MaturityDate",
                                                },
                                            })
                                        }
                                        error={errors.MaturityDate}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        label="Amount"
                                        name="Amount"
                                        type="number"
                                        max={values.MaturityAmount}
                                        value={values.Amount}
                                        onChange={handleInputChange}
                                        error={errors.Amount}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        label="Interest Rate"
                                        name="InterestRate"
                                        type="number"
                                        value={values.InterestRate}
                                        onChange={handleInputChange}
                                        error={errors.InterestRate}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        label="ChequeNo"
                                        name="ChequeNo"
                                        multiline
                                        value={values.ChequeNo}
                                        onChange={handleInputChange}
                                        error={errors.ChequeNo}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.ReactDatePicker
                                        label="Cheque Date"
                                        value={values.ChequeDate}
                                        onChange={(date: Date) =>
                                            handleInputChange({
                                                target: {
                                                    value: globalService.convertLocalToUTCDate(date),
                                                    name: "ChequeDate",
                                                },
                                            })
                                        }
                                        error={errors.ChequeDate}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        label="Maturity Amount"
                                        name="MaturityAmount"
                                        type="number"
                                        min={values.Amount}
                                        value={values.MaturityAmount}
                                        onChange={handleInputChange}
                                        error={errors.MaturityAmount}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.ReactDatePicker
                                        label="Closure Date"
                                        value={values.ClosureDate}
                                        onChange={(date: Date) =>
                                            handleInputChange({
                                                target: {
                                                    value: globalService.convertLocalToUTCDate(date),
                                                    name: "ClosureDate",
                                                },
                                            })
                                        }
                                        error={errors.ClosureDate}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        label="Closure Amount"
                                        name="ClosureAmount"
                                        type="number"
                                        value={values.ClosureAmount}
                                        onChange={handleInputChange}
                                        error={errors.ClosureAmount}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.ReactDatePicker
                                        label="Realization Date"
                                        value={values.RealizationDate}
                                        onChange={(date: Date) =>
                                            handleInputChange({
                                                target: {
                                                    value: globalService.convertLocalToUTCDate(date),
                                                    name: "RealizationDate",
                                                },
                                            })
                                        }
                                        error={errors.RealizationDate}
                                    />
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    </CardContent>
                    <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                        <Stack spacing={2} direction="row">
                            <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}                            >
                                Submit
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={() =>
                                    navigate(
                                        "/societyInvestments/" + societyId
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

export default SocietyInvestmentForm;
