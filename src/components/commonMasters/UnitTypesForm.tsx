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
} from "@mui/material";
import { UnitTypesModel } from "../../models/UnitTypesModel";
import { unitTypesService } from "../../services/UnitTypesService";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Controls from "../../utility/controls/Controls";
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const UnitTypesForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  const { UnitTypeId } = useParams();
  let navigate = useNavigate();

  const validate = (fieldValues: UnitTypesModel = values) => {
    let temp: any = { ...errors };
    if ("UnitType" in fieldValues)
      temp.UnitType = fieldValues.UnitType ? "" : "UnitType is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(unitTypesService.initialFieldValues, validate, props.setCurrentId);

  const newUnitTypes = () => {
    setValues(unitTypesService.initialFieldValues);
  };

  function setFormValue(model: UnitTypesModel) {
    let newModel = {
      UnitTypeId: model.UnitTypeId,
      UnitType: model.UnitType,
      Active: model.Active,
    }
    return newModel;
  }

  useEffect(() => {
    if (UnitTypeId) {
      getUnitType(UnitTypeId);
      setErrors({});
    } else newUnitTypes();
  }, [UnitTypeId]);

  const getUnitType = (UnitTypeId: any) => {
    unitTypesService.getById(UnitTypeId)
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
      if (UnitTypeId) {
        unitTypesService.put(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              navigate("/unitTypes");
            } else {
              globalService.error(result.message);
            }
          }
        });
      } else {
        unitTypesService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              resetForm();
              navigate("/unitTypes");
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
        Unit Types
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
                    label="Unit Type"
                    type="number"
                    name="UnitType"
                    value={values.UnitType}
                    onChange={handleInputChange}
                    error={errors.UnitType}
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
              <Button
                variant="outlined" startIcon={<ArrowBackIcon />}
                href="/unitTypes"
              >
                Back
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </form>
    </>
  );
};

export default UnitTypesForm;
