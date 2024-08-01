import React, { useEffect } from "react";
import { Box, Grid, TextField, CardActions, Card, CardContent, FormControlLabel, Checkbox, Button, Container, CssBaseline, Paper, ThemeProvider, Toolbar, Typography, createTheme, Stack, Switch } from "@mui/material";
import { RelationshipsModel } from '../../models/RelationshipsModel';
import { RelationshipsService } from '../../services/RelationshipsService';
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Controls from '../../utility/controls/Controls'
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const RelationshipForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  globalService.pageTitle = "Relationships";
  const { RelationshipId } = useParams();
  let navigate = useNavigate();

  const validate = (fieldValues: RelationshipsModel = values) => {
    let temp: any = { ...errors };
    if ("Relationship" in fieldValues)
      temp.Relationship = fieldValues.Relationship ? "" : "Relationship is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(RelationshipsService.initialFieldValues, validate, props.setCurrentId);

  const newRelationship = () => {
    setValues(RelationshipsService.initialFieldValues);
  };

  useEffect(() => {
    if (RelationshipId) {
      getRelationship(RelationshipId);
      setErrors({});
    } else newRelationship();
  }, [RelationshipId]);


  const getRelationship = (RelationshipId: any) => {
    RelationshipsService
      .getById(RelationshipId)
      .then((response) => {
        if (response) {
          let result = response.data;
          setValues(result.data);
        }
      })
  };

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();
    if (validate()) {
      if (RelationshipId) {
        RelationshipsService.put(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              navigate("/Relationships");
            } else {
              globalService.error(result.message);
            }
          }
        });
      } else {
        RelationshipsService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              resetForm();
              navigate("/Relationships");
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
        Relationships
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
                    label="Relationship"
                    name="Relationship"
                    value={values.Relationship}
                    onChange={handleInputChange}
                    error={errors.Relationship}
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
              <Button variant="outlined"  startIcon={<ArrowBackIcon />} href="/Relationships">Back To List</Button>
            </Stack>

          </CardActions>
        </Card>
      </form>
    </>
  );
}

export default RelationshipForm;