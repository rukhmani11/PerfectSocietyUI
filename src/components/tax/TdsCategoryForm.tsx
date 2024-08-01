import { useNavigate, useParams } from "react-router";
import { globalService } from "../../services/GlobalService";
import { TdscategoriesModel } from "../../models/TdscategoriesModel";
import useForm from "../../utility/hooks/UseForm";
import { TdscategoriesService } from "../../services/TdscategoriesService";
import { useEffect, useState } from "react";
import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Controls from "../../utility/controls/Controls";
import { SelectListModel } from "../../models/ApiResponse";
import { standardAcHeadsService } from "../../services/StandardAcHeadsService";
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const TdsCategoryForm = (...props: any) => {
    const { auth } = React.useContext(AuthContext);
    globalService.pageTitle = "TdsCategories";
    const { tdsCategoryId } = useParams();
    let navigate = useNavigate();
    const [AcHead, setAcHead] = useState<SelectListModel[]>([]);

    const validate = (fieldValues: TdscategoriesModel = values) => {
        let temp: any = { ...errors };
        if ("AcHeadId" in fieldValues)
            temp.AcHeadId = fieldValues.AcHeadId ? "" : "Account head is required.";

        if ("Tdscategory" in fieldValues)
            temp.Tdscategory = fieldValues.Tdscategory ? "" : "TDS category is required.";

        if ("Section" in fieldValues)
            temp.Section = fieldValues.Section ? "" : "Section is required.";
        setErrors({
            ...temp,
        });

        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };

    const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
        useForm(TdscategoriesService.initialFieldValues, validate, tdsCategoryId);

    const newTdsCategory = () => {
        setValues(TdscategoriesService.initialFieldValues);
    };

    function setFormValue(model: TdscategoriesModel) {
        let newModel = {
            TdscategoryId: model.TdscategoryId,
            Tdscategory: model.Tdscategory,
            AcHeadId: model.AcHeadId,
            Section: model.Section,
        }
        return newModel;
    }

    useEffect(() => {
        if (AcHead.length === 0)
            getAcHead();

        if (tdsCategoryId) {
            getTdscategory(tdsCategoryId);
            setErrors({});
        } else newTdsCategory();
    }, [tdsCategoryId]);

    const getTdscategory = (tdsCategoryId: any) => {
        TdscategoriesService
            .getById(tdsCategoryId)
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
            if (tdsCategoryId) {
                TdscategoriesService.put(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {
                            globalService.success(result.message);
                            navigate("/tdsCategories");
                        } else {
                            globalService.error(result.message);
                        }
                    }
                });
            } else {
                TdscategoriesService.post(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {

                            globalService.success(result.message);
                            resetForm();
                            navigate("/tdsCategories");
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
                TDS Category
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
                                        label="TDS Category"
                                        name="Tdscategory"
                                        value={values.Tdscategory}
                                        onChange={handleInputChange}
                                        error={errors.Tdscategory}
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

                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        required
                                        label="Section"
                                        name="Section"
                                        value={values.Section}
                                        onChange={handleInputChange}
                                        error={errors.Section}
                                    />
                                </Grid>

                            </Grid>
                        </React.Fragment>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Stack spacing={2} direction="row">
                            <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'} >Submit</Button>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={() =>
                                    navigate(
                                        "/tdsCategories/"
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

export default TdsCategoryForm;
