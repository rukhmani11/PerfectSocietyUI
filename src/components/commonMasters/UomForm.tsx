import { useNavigate, useParams } from "react-router";
import { globalService } from "../../services/GlobalService";
import { UomsModel } from "../../models/UomsModel";
import { uomsService } from "../../services/UomsService";
import useForm from "../../utility/hooks/UseForm";
import { useEffect } from "react";
import { Button, Card, CardActions, CardContent, Grid, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import Controls from "../../utility/controls/Controls";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const UomForm = (...props: any) => {
    const { auth } = React.useContext(AuthContext);
    globalService.pageTitle = "Uoms";
    const { Uomid } = useParams();
    let navigate = useNavigate();

    const validate = (fieldValues: UomsModel = values) => {
        let temp: any = { ...errors };
        if ("Uom" in fieldValues)
            temp.Uom = fieldValues.Uom ? "" : "Uom is required.";
        setErrors({
            ...temp,
        });

        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };

    const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
        useForm(uomsService.initialFieldValues, validate, Uomid);

    const newUOM = () => {
        setValues(uomsService.initialFieldValues);
    };

    function setFormValue(model: UomsModel) {
        let newModel = {
            Uomid: model.Uomid,
            Uom: model.Uom,
            Active: model.Active,
        }
        return newModel;
    }

    useEffect(() => {
        if (Uomid) {
            getUom(Uomid);
            setErrors({});
        } else newUOM();
    }, [Uomid]);

    const getUom = (Uomid: any) => {
        uomsService
            .getById(Uomid)
            .then((response) => {
                if (response) {
                    let result = response.data;
                    setValues(setFormValue(result.data));

                }
            });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            if (Uomid) {
                uomsService.put(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {
                            globalService.success(result.message)
                            navigate("/uoms");
                        } else {
                            globalService.error(result.message);
                        }
                    }
                });
            } else {
                uomsService.post(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {

                            globalService.success(result.message)
                            resetForm();
                            navigate("/uoms");
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
                Unit of Measurement
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
                                        label="UOM"
                                        name="Uom"
                                        value={values.Uom}
                                        onChange={handleInputChange}
                                        error={errors.Uom}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Controls.Checkbox
                                        name="Active"
                                        label="Active"
                                        value={values.Active}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Stack spacing={2} direction="row">
                            <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'} >Submit</Button>
                            <Button variant="outlined" startIcon={<ArrowBackIcon />} href="/uoms/">Back </Button>
                        </Stack>

                    </CardActions>
                </Card>
            </form>
        </>
    );
};

export default UomForm;