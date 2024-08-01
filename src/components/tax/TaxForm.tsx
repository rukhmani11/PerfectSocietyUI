import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import { TaxesModel } from "../../models/TaxesModel";
import useForm from "../../utility/hooks/UseForm";
import { taxesService } from "../../services/TaxesService";
import { useEffect, useState } from "react";
import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import Controls from "../../utility/controls/Controls";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SelectListModel } from "../../models/ApiResponse";
import { standardAcHeadsService } from "../../services/StandardAcHeadsService";
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const TaxForm = (...props: any) => {
    const { auth } = React.useContext(AuthContext);
    globalService.pageTitle = "Taxes";
    const { TaxId } = useParams();
    let navigate = useNavigate();
    const [AcHead, setAcHead] = useState<SelectListModel[]>([]);

    const validate = (fieldValues: TaxesModel = values) => {
        let temp: any = { ...errors };
        if ("Tax" in fieldValues)
            temp.Tax = fieldValues.Tax ? "" : "Tax is required.";

        if ("TaxRate" in fieldValues)
            temp.TaxRate = fieldValues.TaxRate ? "" : "Tax rate is required.";

        if ("Surcharge" in fieldValues)
            temp.Surcharge = fieldValues.Surcharge ? "" : "Sur charge is required.";

        if ("Cess" in fieldValues)
            temp.Cess = fieldValues.Cess ? "" : "Cess is required.";

        if ("HiEduCess" in fieldValues)
            temp.HiEduCess = fieldValues.HiEduCess ? "" : "HiEduCess is required.";

        if ("RoundToPs" in fieldValues)
            temp.RoundToPs = fieldValues.RoundToPs ? "" : "Round To Ps is required.";

        if ("AcHeadId" in fieldValues)
            temp.AcHeadId = fieldValues.AcHeadId ? "" : "Account head is required.";

        setErrors({
            ...temp,
        });

        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };

    const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
        useForm(taxesService.initialFieldValues, validate, TaxId);

    const newTax = () => {
        setValues(taxesService.initialFieldValues);
    };

    function setFormValue(model: TaxesModel) {
        let newModel = {
            TaxId: model.TaxId,
            Tax: model.Tax,
            TaxRate: model.TaxRate,
            Surcharge: model.Surcharge,
            Cess: model.Cess,
            HiEduCess: model.HiEduCess,
            TaxPerc: model.TaxPerc,
            RoundToPs: model.RoundToPs,
            AcHeadId: model.AcHeadId,
        }
        return newModel;
    }

    useEffect(() => {
        if (AcHead.length === 0)
            getAcHead();

        if (TaxId) {
            getTax(TaxId);
            setErrors({});
        } else newTax();
    }, [TaxId]);

    const getTax = (TaxId: any) => {
        taxesService
            .getById(TaxId)
            .then((response) => {
                if (response) {
                    let result = response.data;
                    setValues(setFormValue(result.data));

                }
            });
    };

    const getAcHead = () => {
        standardAcHeadsService
            .getSelectList()
            .then((response: any) => {
                setAcHead(response.data);
            });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            if (TaxId) {
                taxesService.put(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {
                            globalService.success(result.message);
                            navigate("/taxes");
                        } else {
                            globalService.error(result.message);
                        }
                    }
                });
            } else {
                taxesService.post(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {

                            globalService.success(result.message);
                            resetForm();
                            navigate("/taxes");
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
            <Typography component="h1" variant="h4" align="center">
                Tax
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
                                    <Controls.Input
                                        required
                                        label="Tax"
                                        name="Tax"
                                        value={values.Tax}
                                        onChange={handleInputChange}
                                        error={errors.Tax}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        required
                                        label="TaxRate"
                                        name="TaxRate"
                                        type="number"
                                        value={values.TaxRate}
                                        onChange={handleInputChange}
                                        error={errors.TaxRate}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        required
                                        label="Surcharge"
                                        name="Surcharge"
                                        type="number"
                                        value={values.Surcharge}
                                        onChange={handleInputChange}
                                        error={errors.Surcharge}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        required
                                        label="Cess"
                                        name="Cess"
                                        type="number"
                                        value={values.Cess}
                                        onChange={handleInputChange}
                                        error={errors.Cess}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        required
                                        label="HiEduCess"
                                        name="HiEduCess"
                                        type="number"
                                        value={values.HiEduCess}
                                        onChange={handleInputChange}
                                        error={errors.HiEduCess}
                                    />
                                </Grid>

                                {/* <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        required
                                        label="TaxPerc"
                                        name="TaxPerc"
                                        value={values.TaxPerc}
                                        onChange={handleInputChange}
                                        error={errors.TaxPerc}
                                    />
                                </Grid> */}

                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        required
                                        label="RoundToPs"
                                        fullWidth
                                        name="RoundToPs"
                                        type="number"
                                        value={values.RoundToPs}
                                        onChange={handleInputChange}
                                        error={errors.RoundToPs}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.Select
                                    showEmptyItem={false}
                                        name="AcHeadId"
                                        label="AcHead"
                                        required
                                        value={AcHead.length > 0 ? values.AcHeadId : ''}
                                        onChange={handleInputChange}
                                        options={AcHead}
                                        error={errors.AcHeadId}
                                    />
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Stack spacing={2} direction="row">
                            <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}
                            >Submit</Button>
                            <Button variant="outlined" startIcon={<ArrowBackIcon />} href="/taxes/">Back To List</Button>
                        </Stack>

                    </CardActions>
                </Card>
            </form>
        </>
    );
};

export default TaxForm;