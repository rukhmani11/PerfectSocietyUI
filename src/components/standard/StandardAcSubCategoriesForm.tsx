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
} from "@mui/material";
import { SelectListModel } from "../../models/ApiResponse";
import { standardAcCategoriesService } from "../../services/StandardAcCategoriesService";
import { standardAcSubCategoriesService } from "../../services/StandardAcSubCategoriesService";
import { StandardAcSubCategoriesModel } from "../../models/StandardAcSubCategoriesModel";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Controls from "../../utility/controls/Controls";
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const StandardAcSubCategoriesForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  const { SubCategoryId } = useParams();
  let navigate = useNavigate();
  const [Category, setCategory] = useState<SelectListModel[]>([]);

  const validate = (fieldValues: StandardAcSubCategoriesModel = values) => {
    let temp: any = { ...errors };
    if ("CategoryId" in fieldValues)
      temp.CategoryId = fieldValues.CategoryId ? "" : "CategoryId is required.";
    if ("SubCategory" in fieldValues)
      temp.SubCategory = fieldValues.SubCategory
        ? ""
        : "SubCategory is required";
    if ("Sequence" in fieldValues)
      temp.Sequence = fieldValues.Sequence ? "" : "Sequence is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(
      standardAcSubCategoriesService.initialFieldValues,
      validate,
      props.setCurrentId
    );

  const newSubCategory = () => {
    setValues(standardAcSubCategoriesService.initialFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: StandardAcSubCategoriesModel) {
    let newModel = {
      SubCategoryId: model.SubCategoryId,
      SubCategory: model.SubCategory,
      CategoryId: model.CategoryId,
      PartDetails: model.PartDetails || "",
      Sequence: model.Sequence,
    };
    return newModel;
  }

  useEffect(() => {
    if (Category.length === 0) getCategory();

    if (SubCategoryId) {
      getSubCategory(SubCategoryId);
    } else {
      newSubCategory();
      setErrors({});
    }
  }, [SubCategoryId]);
  const getCategory = () => {
    standardAcCategoriesService.getSelectList().then((response: any) => {
      setCategory(response.data);
    });
  };

  const getSubCategory = (SubCategoryId: any) => {
    standardAcSubCategoriesService.getById(SubCategoryId).then((response) => {
      if (response) {
        let result = response.data;
        setValues(setFormValue(result.data));
        setValues(result.data);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (SubCategoryId) {
        standardAcSubCategoriesService.put(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              navigate("/standardAcSubCategories");
            } else {
              globalService.error(result.message);
            }
          }
        });
      } else {
        standardAcSubCategoriesService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              resetForm();
              navigate("/standardAcSubCategories");
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
        Account Sub Categories
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
                    label="SubCategory name"
                    autoComplete="given-name"
                    name="SubCategory"
                    length={100}
                    value={values.SubCategory}
                    onChange={handleInputChange}
                    error={errors.SubCategory}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                  showEmptyItem={false}
                    name="CategoryId"
                    label="Category"
                    value={Category.length > 0 ? values.CategoryId : ""}
                    onChange={handleInputChange}
                    options={Category}
                    error={errors.CategoryId}
                  />
                </Grid>

              

                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    label="Sequence "
                    autoComplete="given-name"
                    name="Sequence"
                    type="Number"
                    value={values.Sequence}
                    onChange={handleInputChange}
                    error={errors.Sequence}
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
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                href="/standardAcSubCategories"
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

export default StandardAcSubCategoriesForm;
