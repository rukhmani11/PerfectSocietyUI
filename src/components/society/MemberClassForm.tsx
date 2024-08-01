import { useNavigate, useParams } from "react-router";
import { globalService } from "../../services/GlobalService";
import { MemberClassesModel } from "../../models/MemberClassesModel";
import useForm from "../../utility/hooks/UseForm";
import { memberClassesService } from "../../services/MemberClassesService";
import { useEffect } from "react";
import { Button, Card, CardActions, CardContent, Grid, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import Controls from "../../utility/controls/Controls";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const MemberClassForm = (...props: any) => {
    const { auth } = React.useContext(AuthContext);
    globalService.pageTitle = "MemberClasses";
    const { MemberClassId } = useParams();
    let navigate = useNavigate();

    const validate = (fieldValues: MemberClassesModel = values) => {
        let temp: any = { ...errors };
        if ("MemberClass" in fieldValues)
            temp.MemberClass = fieldValues.MemberClass ? "" : "Member class is required.";

        setErrors({
            ...temp,
        });

        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };

    const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
        useForm(memberClassesService.initialFieldValues, validate, props.setCurrentId);

    const newMemberClass = () => {
        setValues(memberClassesService.initialFieldValues);
    };

    useEffect(() => {
        if (MemberClassId) {
            getMemberClass(MemberClassId);
            setErrors({});
        } else newMemberClass();
    }, [MemberClassId]);


    const getMemberClass = (MemberClassId: any) => {
        memberClassesService
            .getById(MemberClassId)
            .then((response) => {
                if (response) {
                    let result = response.data;
                    setValues(result.data);

                }
            });
    };

    const handleSubmit = (e: React.FormEvent) => {

        e.preventDefault();
        if (validate()) {
            if (MemberClassId) {
                memberClassesService.put(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {
                            globalService.success(result.message);
                            navigate("/memberclasses");
                        } else {
                            globalService.error(result.message);
                        }
                    }
                });
            } else {
                memberClassesService.post(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {
                            globalService.success(result.message);
                            resetForm();
                            navigate("/memberclasses");
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
                Member Classes
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
                                        label="Member Class"
                                        name="MemberClass"
                                        value={values.MemberClass}
                                        onChange={handleInputChange}
                                        error={errors.MemberClass}
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
                            <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}>Submit</Button>
                            <Button variant="outlined"  startIcon={<ArrowBackIcon />} href="/memberclasses">Back To List</Button>
                        </Stack>

                    </CardActions>
                </Card>
            </form>
        </>
    );
}

export default MemberClassForm;