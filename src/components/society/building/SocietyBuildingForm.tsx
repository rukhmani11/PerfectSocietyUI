import React, { useEffect } from "react";
import {
  Grid,
  CardActions,
  Card,
  CardContent,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { societyBuildingsService } from "../../../services/SocietyBuildingsService";
import { SocietyBuildingsModel } from "../../../models/SocietyBuildingsModel";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../../services/GlobalService";
import useForm from "../../../utility/hooks/UseForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SocietyMembersModel } from "../../../models/SocietyMembersModel";
import Controls from "../../../utility/controls/Controls";
import { Messages, ROLES } from "../../../utility/Config";
import { AuthContext } from "../../../utility/context/AuthContext";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";

const SocietyBuildingForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  const { societyId, societyBuildingId } = useParams();
  let navigate = useNavigate();
  const { goToHome } = useSharedNavigation();

  const validate = (fieldValues: SocietyMembersModel = values) => {
    let temp: any = { ...errors };
    if ("Building" in fieldValues)
      temp.Building = fieldValues.Building ? "" : "Building is required.";
    if ("NoOfFloors" in fieldValues)
      temp.NoOfFloors = fieldValues.NoOfFloors ? (temp.NoOfFloors = /^[0-9]*(\.[0-9]{0,3})?$/.test(fieldValues.NoOfFloors.toString()) ? "" : "No Of Floors is not valid.") : "";
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(
      societyBuildingsService.initialFieldValues,
      validate,
      societyBuildingId
    );

  const newSocietyMember = () => {
    setValues(societyBuildingsService.initialFieldValues);
  };

  //This is used since in get the null property is not returned

  function setFormValue(model: SocietyBuildingsModel) {
    let newModel = {
      SocietyBuildingId: model.SocietyBuildingId,
      SocietyId: model.SocietyId,
      Building: model.Building,
      NoOfFloors: model.NoOfFloors || 0,
      Lift: model.Lift,
    };
    return newModel;
  }

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }

    if (societyBuildingId) {
      getSocietyBuilding(societyBuildingId);
    } else {
      newSocietyMember();
      setErrors({});
    }
  }, [societyBuildingId]);
  const getSocietyBuilding = (societyBuildingId: any) => {

    societyBuildingsService.getById(societyBuildingId).then((response) => {

      if (response) {

        let result = response.data;
        setValues(setFormValue(result.data));
      }
    })
      .catch((e) => {
        //console.log(e);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (societyBuildingId) {

        societyBuildingsService.put(values).then((response: any) => {
          let result = response.data;

          if (result.isSuccess) {
            resetForm();
            navigate("/societyBuildings/" + societyId);
            globalService.success("Society building updated successfully.");
          }
        });
      } else {
        values.SocietyId = societyId;
        societyBuildingsService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success("Society building added successfully.");
              resetForm();
              navigate("/societyBuildings/" + societyId);
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
        Society Building
      </Typography>
      <form noValidate onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    label="Building"
                    name="Building"
                    value={values.Building}
                    onChange={handleInputChange}
                    error={errors.Building}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    label="No of floors"
                    name="NoOfFloors"
                    type="number"
                    value={values.NoOfFloors}
                    onChange={handleInputChange}
                    error={errors.NoOfFloors}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    label="Lift"
                    name="Lift"
                    value={values.Lift}
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
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() =>
                  navigate(
                    "/societyBuildings/" + societyId
                  )
                }
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

export default SocietyBuildingForm;
