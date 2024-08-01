import React, { useEffect } from "react";
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
import { StandardAcCategoriesModel } from "../../models/StandardAcCategoriesModel";
import { standardAcCategoriesService } from "../../services/StandardAcCategoriesService";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Controls from "../../utility/controls/Controls";
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const StandardAcCategoryForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  const { CategoryId } = useParams();
  let navigate = useNavigate();

  const debitCreditList = [
    { Value: "C", Text: "Credit" },
    { Value: "D", Text: "Debit" },
  ];
  const NatureList = [
    { Value: "l", Text: "Income Expenditure" },
    { Value: "B", Text: "Balance Sheet" },
  ];
  const validate = (fieldValues: StandardAcCategoriesModel = values) => {
    let temp: any = { ...errors };
    if ("Category" in fieldValues)
      temp.Category = fieldValues.Category ? "" : "Category is required.";
    if ("DrCr" in fieldValues)
      temp.DrCr = fieldValues.DrCr ? "" : "DrCr is required.";
    if ("Nature" in fieldValues)
      temp.Nature = fieldValues.Nature ? "" : "Nature is required.";
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
      standardAcCategoriesService.initialFieldValues,
      validate,
      props.setCurrentId
    );

  const newStandardAcCategories = () => {
    setValues(standardAcCategoriesService.initialFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: StandardAcCategoriesModel) {
    let newModel = {
      CategoryId: model.CategoryId,
      Category: model.Category,
      DrCr: model.DrCr,
      Nature: model.Nature || "",
      Sequence: model.Sequence,
    };
    return newModel;
  }

  useEffect(() => {
    if (CategoryId) {
      getStandardAcCategories(CategoryId);
      setErrors({});
    } else newStandardAcCategories();
  }, [CategoryId]);

  const getStandardAcCategories = (CategoryId: any) => {
    standardAcCategoriesService.getById(CategoryId).then((response) => {
      if (response) {
        let result = response.data;
        setValues(setFormValue(result.data));
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (CategoryId) {
        standardAcCategoriesService.put(values).then((response: any) => {
          let result = response.data;
          if (response) {
            if (result.isSuccess) {
              globalService.success(result.message);
              navigate("/standardAcCategories");
            } else {
              globalService.error(result.message);
            }
          }
        });
      } else {
        standardAcCategoriesService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              resetForm();
              navigate("/standardAcCategories");
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
        Account Categories
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
                    label="Category name"
                    autoComplete="given-name"
                    name="Category"
                    length={100}
                    value={values.Category}
                    onChange={handleInputChange}
                    error={errors.Category}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    name="DrCr"
                    label="DrCr"
                    value={debitCreditList.length > 0 ? values.DrCr : ""}
                    onChange={handleInputChange}
                    options={debitCreditList}
                    error={errors.DrCr}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    name="Nature"
                    label="Nature"
                    value={NatureList.length > 0 ? values.Nature : ""}
                    onChange={handleInputChange}
                    options={NatureList}
                    error={errors.Nature}
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
                href="/standardAcCategories"
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

export default StandardAcCategoryForm;