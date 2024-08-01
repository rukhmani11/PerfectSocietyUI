import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  CardActions,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  Button,
  Container,
  CssBaseline,
  Paper,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  Stack,
  Switch,
  Select,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Controls from "../../utility/controls/Controls";
import { AcSubCategoriesModel } from "../../models/AcSubCategoriesModel";
import { acSubcategorieService } from "../../services/AcSubCategoriesService";
import { acCategorieService } from "../../services/AcCategoriesService";
import { SelectListModel } from "../../models/ApiResponse";
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const AcCategoriesForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  const {SubCategoryId } = useParams();
  const societyId: string = localStorage.getItem("societyId") || "";
  const [AcCategorie, setAcCategorie] = useState<SelectListModel[]>([]);
  let navigate = useNavigate();
  const validate = (fieldValues: AcSubCategoriesModel = values) => {
    let temp: any = { ...errors };
    if ("SubCategory" in fieldValues)
      temp.SubCategory = fieldValues.SubCategory ? "" : "SubCategory is required.";
    if ("CategoryId" in fieldValues)
      temp.CategoryId = fieldValues.CategoryId ? "" : "CategoryId is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm( acSubcategorieService.initialFieldValues,validate, props.setCurrentId );

  const newAcSubCategories = () => {
    setValues(acSubcategorieService.initialFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: AcSubCategoriesModel) {
    let newModel = {
      SocietyId: model.SocietyId,
      SubCategoryId: model.SubCategoryId,
      CategoryId: model.CategoryId,
      SubCategory: model.SubCategory,
      PartDetails: model.PartDetails,
      Sequence: model.Sequence ,
      Active: model.Active,
    };
    return newModel;
  }

  useEffect(() => {
    if (AcCategorie.length === 0) getAcCategorie();
    if (SubCategoryId) {
      getAcsubCategories(SubCategoryId);
      setErrors({});
    } else newAcSubCategories();
  }, [SubCategoryId]);

  const getAcsubCategories = (SubCategoryId: any) => {
    
    acSubcategorieService.getById(SubCategoryId,societyId).then((response) => {
      if (response) {
        let result = response.data;
        setValues(setFormValue(result.data));
      }
    });
  };

  const getAcCategorie = () => {
    acCategorieService.getSelectListBySocietyId(societyId).then((response: any) => {
      setAcCategorie(response.data);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    values.SocietyId = societyId;
    if (validate()) {
      if (SubCategoryId) {
        acSubcategorieService.put(values).then((response: any) => {
          let result = response.data;
          if (response) {
            if (result.isSuccess) {
              globalService.success(result.message);
              navigate("/acSubCategorie/" + societyId);
            } else {
              globalService.error(result.message);
            }
          }
        });
      } else {
        acSubcategorieService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              resetForm();
              navigate("/acSubCategorie/" + societyId);
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
      Account Sub Category
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
                    label="SubCategory"
                    autoComplete="given-name"
                    name="SubCategory"
                    value={values.SubCategory}
                    onChange={handleInputChange}
                    error={errors.SubCategory}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    label="AcCategorie"
                    name="CategoryId"
                    value={AcCategorie.length > 0 ? values.CategoryId : ""}
                    onChange={handleInputChange}
                    options={AcCategorie}
                    error={errors.CategoryId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    label="Sequence "
                    autoComplete="given-name"
                    type="Number"
                    name="Sequence"
                    value={values.Sequence}
                    onChange={handleInputChange}
                    error={errors.Category}
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
          <CardActions sx={{ display: "flex", justifyContent: "center" }}>
            <Stack spacing={2} direction="row">
              <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}>
                Submit
              </Button>
              <Stack spacing={2} direction="row">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/acSubCategorie/" + societyId)}
          >
            Back To List
          </Button>
        </Stack>
            </Stack>
          </CardActions>
        </Card>
      </form>
    </>
  );
};

export default AcCategoriesForm;
