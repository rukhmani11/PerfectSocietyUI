import { useNavigate, useParams } from "react-router-dom";
import { ParkingTypeModel } from "../../models/ParkingTypesModel";
import useForm from "../../utility/hooks/UseForm";
import { parkingtypeService } from "../../services/ParkingTypesService";
import { useEffect } from "react";
import { globalService } from "../../services/GlobalService";
import { Button, Card, CardActions, CardContent, FormControlLabel, Grid, Stack, Switch, TextField, Typography } from "@mui/material";
import React from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Controls from '../../utility/controls/Controls'
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const ParkingTypeForm = (...props: any) => {
    const { auth } = React.useContext(AuthContext);
    globalService.pageTitle = "ParkingTypes";
    const { parkingTypeId } = useParams();
    let navigate = useNavigate();

    const validate = (fieldValues: ParkingTypeModel = values) => {
        let temp: any = { ...errors };
        if ("ParkingType" in fieldValues)
            temp.ParkingType = fieldValues.ParkingType ? "" : "Parking Type is required.";
        setErrors({
            ...temp,
        });

        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };

    const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
        useForm(parkingtypeService.initialFieldValues, validate, parkingTypeId);

    const newParkingType = () => {
        setValues(parkingtypeService.initialFieldValues);
    };

    function setFormValue(model: ParkingTypeModel) {
        let newModel = {
            ParkingTypeId: model.ParkingTypeId,
            ParkingType: model.ParkingType,
            Active: model.Active,
        }
        return newModel;
    }

    useEffect(() => {
        if (parkingTypeId) {
            getParkingType(parkingTypeId);
            setErrors({});
        } else newParkingType();
    }, [parkingTypeId]);

    const getParkingType = (parkingTypeId: any) => {
        parkingtypeService
            .getById(parkingTypeId)
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
            if (parkingTypeId) {
                parkingtypeService.put(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {
                            globalService.success(result.message);
                            navigate("/parkingTypes");
                        } else {
                            globalService.error(result.message);
                        }
                    }
                });
            } else {
                parkingtypeService.post(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {

                            globalService.success(result.message)
                            resetForm();
                            navigate("/parkingTypes");
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
                Parking Type
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
                                        label="Parking Type"
                                        name="ParkingType"
                                        value={values.ParkingType}
                                        onChange={handleInputChange}
                                        error={errors.ParkingType}
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
                            <Button variant="outlined" startIcon={<ArrowBackIcon />} href="/parkingTypes/">Back </Button>
                        </Stack>
                    </CardActions>
                </Card>
            </form>
        </>
    );
};

export default ParkingTypeForm;
