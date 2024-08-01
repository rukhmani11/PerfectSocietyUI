import { useNavigate, useParams } from "react-router-dom";
import { SocietyPayModesModel } from "../../../models/SocietyPayModesModel";
import useForm from "../../../utility/hooks/UseForm";
import { societyPayModesService } from "../../../services/SocietyPayModesService";
import { useEffect, useState } from "react";
import { globalService } from "../../../services/GlobalService";
import { Button, Card, CardContent, CardHeader, Grid, Stack, Typography } from "@mui/material";
import Controls from "../../../utility/controls/Controls";
import { SelectListModel } from "../../../models/ApiResponse";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { standardAcHeadsService } from "../../../services/StandardAcHeadsService";
import { bankService } from "../../../services/BankService";
import { acHeadsService } from "../../../services/AcHeadsService";
import { Messages, ROLES } from "../../../utility/Config";
import { AuthContext } from "../../../utility/context/AuthContext";
import React from "react";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";

const SocietyPayModeForm = (...props: any) => {
    const { auth } = React.useContext(AuthContext);
    const { societyId, payModeCode }: any = useParams();
    let navigate = useNavigate();
    const [AcHeads, setAcHeads] = useState<SelectListModel[]>([]);
    const [Banks, setBanks] = useState<SelectListModel[]>([]);

    const mode = payModeCode ? 'Edit' : 'Create';
    const { goToHome } = useSharedNavigation();

    const validate = (fieldValues: SocietyPayModesModel = values) => {
        let temp: any = { ...errors };

        if ("PayModeCode" in fieldValues)
            temp.PayModeCode = fieldValues.PayModeCode ? "" : "Pay mode code is required.";

        if ("PayMode" in fieldValues)
            temp.PayMode = fieldValues.PayMode ? "" : "Pay mode is required.";

        if ("AcHeadId" in fieldValues)
            temp.AcHeadId = fieldValues.AcHeadId ? "" : "AcHead is required.";

        setErrors({
            ...temp,
        });

        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };

    const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
        useForm(societyPayModesService.initialFieldValues, validate, societyId);

    const newSocietyPayMode = () => {
        setValues(societyPayModesService.initialFieldValues);
    };

    //This is used since in get the null property is not returned
    function setFormValue(model: SocietyPayModesModel) {
        
        let newModel = {
            SocietyId: model.SocietyId,
            PayModeCode: model.PayModeCode,
            PayMode: model.PayMode || "",
            AskDetails: model.AskDetails || false,
            Active: model.Active || false,
            AcHeadId: model.AcHeadId,
            BankId: model.BankId || "",
            BranchName: model.BranchName || "",
            Ifsc: model.Ifsc || "",
            BankAccountNo: model.BankAccountNo || 0,
            BankAddress: model.BankAddress || "",
            IsForPayInSlip: model.IsForPayInSlip || false,
        }
        return newModel;
    }

    useEffect(() => {
        if (!globalService.isSocietySelected()) {
            globalService.info(Messages.SocietyUnSelected);
            return goToHome();
          }
        if (AcHeads.length === 0)
            getAcHeads();

        if (Banks.length === 0)
            getBanks();

        if (payModeCode) {
            getSocietyPayMode();
        }
        else {
            newSocietyPayMode();
            setErrors({});
        }

    }, [societyId, payModeCode]);

    // const getAcHeads = () => {
    //     standardAcHeadsService
    //         .getSelectList()
    //         .then((response: any) => {
    //             
    //             setAcHeads(response.data);
    //         });
    // };
    const getAcHeads = () => {
        acHeadsService
            .getSelectListBySocietyId(societyId)
            .then((response: any) => {
                
                setAcHeads(response.data);
            });
    };

    const getBanks = () => {
        bankService
            .getSelectList()
            .then((response) => {
                setBanks(response.data);
            });
    };

    const getSocietyPayMode = () => {
        societyPayModesService
            .getBySocietyIdAndPMCode(societyId, payModeCode)
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
            if (societyId && payModeCode) {
               
                societyPayModesService.put(values).then((response: any) => {
                    let result = response.data;

                    if (result.isSuccess) {
                        resetForm();
                        navigate("/societyPayModes/" + societyId);
                        globalService.success(result.message);
                    }
                });
            } else {
                societyPayModesService.post(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {
                            globalService.success(result.message);
                            resetForm();
                            navigate("/societyPayModes/" + societyId);
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
                Society Pay Mode
            </Typography>
            <form
                //autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
            >
                <Card>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <Controls.Input
                                    required
                                    label="Pay Mode Code"
                                    name="PayModeCode"
                                    readOnly={mode === 'Edit' ? true : false}
                                    // length={5}
                                    value={values.PayModeCode}
                                    onChange={handleInputChange}
                                    error={errors.PayModeCode}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Controls.Input
                                    required
                                    name="PayMode"
                                    label="Pay Mode"
                                    value={values.PayMode}
                                    onChange={handleInputChange}
                                    error={errors.PayMode}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Controls.Select
                                showEmptyItem={false}
                                    name="AcHeadId"
                                    label="AcHead"
                                    required
                                    value={AcHeads.length > 0 ? values.AcHeadId : ''}
                                    onChange={handleInputChange}
                                    options={AcHeads}
                                    error={errors.AcHeadId}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Controls.Checkbox
                                    label="Ask Details"
                                    name="AskDetails"
                                    value={values.AskDetails}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Controls.Checkbox
                                    label="Active"
                                    name="Active"
                                    value={values.Active}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Controls.Checkbox
                                    label="For Pay In Slip"
                                    name="IsForPayInSlip"
                                    value={values.IsForPayInSlip}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Controls.Select
                                showEmptyItem={false}
                                    name="BankId"
                                    label="Bank"
                                    value={Banks.length > 0 ? values.BankId : ''}
                                    onChange={handleInputChange}
                                    options={Banks}
                                    error={errors.BankId}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Controls.Input
                                    name="BranchName"
                                    label="Branch Name"
                                    value={values.BranchName}
                                    onChange={handleInputChange}
                                    error={errors.BranchName}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Controls.Input
                                    name="BankAddress"
                                    label="Bank Address"
                                    value={values.BankAddress}
                                    onChange={handleInputChange}
                                    error={errors.BankAddress}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Controls.Input
                                    name="Ifsc"
                                    label="Ifsc"
                                    value={values.Ifsc}
                                    onChange={handleInputChange}
                                    error={errors.Ifsc}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Controls.Input
                                    name="BankAccountNo"
                                    label="Account No"
                                    value={values.BankAccountNo}
                                    onChange={handleInputChange}
                                    error={errors.BankAccountNo}
                                />
                            </Grid>

                        </Grid>
                    </CardContent>
                </Card>

                <Stack spacing={2} direction="row" justifyContent={"center"}>
                    <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}>Submit</Button>
                    <Button variant="outlined"  startIcon={<ArrowBackIcon />} onClick={() => navigate("/societyPayModes/" + societyId)}>Back To List</Button>
                </Stack>
            </form>
        </>
    );
};

export default SocietyPayModeForm