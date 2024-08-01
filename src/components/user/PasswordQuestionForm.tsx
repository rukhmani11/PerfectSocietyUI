import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import { PasswordQuestionModel } from "../../models/PasswordQuestionsModel";
import { PasswordQuestionsService } from "../../services/PasswordQuestionsService";
import useForm from "../../utility/hooks/UseForm";
import { useEffect } from "react";
import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import Controls from "../../utility/controls/Controls";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const PasswordQuestionForm = (...props: any) => {
    const { auth } = React.useContext(AuthContext);
    globalService.pageTitle = "PasswordQuestions";
    const { PasswordQuestionId } = useParams();
    let navigate = useNavigate();

    const validate = (fieldValues: PasswordQuestionModel = values) => {
        let temp: any = { ...errors };
        if ("PasswordQuestion" in fieldValues)
            temp.PasswordQuestion = fieldValues.PasswordQuestion ? "" : "Password question is required.";
        setErrors({
            ...temp,
        });

        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };

    const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
        useForm(PasswordQuestionsService.initialFieldValues, validate, props.setCurrentId);

    const newPasswordQuestion = () => {
        setValues(PasswordQuestionsService.initialFieldValues);
    };

    function setFormValue(model: PasswordQuestionModel) {
        let newModel = {
            PasswordQuestionId: model.PasswordQuestionId,
            PasswordQuestion: model.PasswordQuestion,
            Active: model.Active,
        }
        return newModel;
    }

    useEffect(() => {
        if (PasswordQuestionId) {
            getParkingType(PasswordQuestionId);
            setErrors({});
        } else newPasswordQuestion();
    }, [PasswordQuestionId]);

    const getParkingType = (PasswordQuestionId: any) => {
        PasswordQuestionsService
            .getById(PasswordQuestionId)
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
            if (PasswordQuestionId) {
                PasswordQuestionsService.put(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {
                            globalService.success(result.message);
                            navigate("/passwordQuestions");
                        } else {
                            globalService.error(result.message);
                        }
                    }
                });
            } else {
                PasswordQuestionsService.post(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {

                            globalService.success(result.message)
                            resetForm();
                            navigate("/passwordQuestions");
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
                password Questions
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
                                        label="Password Question"
                                        name="PasswordQuestion"
                                        value={values.PasswordQuestion}
                                        onChange={handleInputChange}
                                        error={errors.PasswordQuestion}
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
                            <Button variant="contained" color="error" startIcon={<ArrowBackIcon />} href="/passwordQuestions/">Back To List</Button>
                        </Stack>

                    </CardActions>
                </Card>
            </form>
        </>
    );
};

export default PasswordQuestionForm;