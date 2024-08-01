import React, { useEffect, useState } from "react";
import {
  Grid,
  CardActions,
  Card,
  CardContent,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { societyparkingsService } from "../../../services/SocietyParkingsService";
import { SocietyParkingsModel } from "../../../models/SocietyParkingsModel";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../../services/GlobalService";
import { parkingtypeService } from "../../../services/ParkingTypesService";
import useForm from "../../../utility/hooks/UseForm";
import { SelectListModel } from "../../../models/ApiResponse";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SocietyMembersModel } from "../../../models/SocietyMembersModel";
import Controls from "../../../utility/controls/Controls";
import { ROLES } from "../../../utility/Config";
import { AuthContext } from "../../../utility/context/AuthContext";

const SocietyParkingForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  const { societyId, SocietyParkingId } = useParams();
  const [parkingtype, setparkingtypes] = useState<SelectListModel[]>([]);
  let navigate = useNavigate();

  const validate = (fieldValues: SocietyMembersModel = values) => {
    let temp: any = { ...errors };
    if ("ParkingNo" in fieldValues)
      temp.ParkingNo = fieldValues.ParkingNo ? "" : "ParkingNo is required.";
      if ("ParkingTypeId" in fieldValues)
      temp.ParkingTypeId = fieldValues.ParkingTypeId ? "" : "Parking Type is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(
      societyparkingsService.initialFieldValues,
      validate,
      SocietyParkingId
    );

  const newSocietyParking = () => {
    setValues(societyparkingsService.initialFieldValues);
  };

  function setFormValue(model: SocietyParkingsModel) {
    let newModel = {
      SocietyParkingId: model.SocietyParkingId,
      SocietyId: model.SocietyId,
      ParkingNo: model.ParkingNo,
      ParkingTypeId: model.ParkingTypeId,
    };
    return newModel;
  }

  useEffect(() => {
    if (parkingtype.length === 0) getparkingtypes();
    if (SocietyParkingId) {
      getSocietyParking(SocietyParkingId);
    } else {
      newSocietyParking();
      setErrors({});
    }
  }, [SocietyParkingId]);

  const getparkingtypes = () => {
    parkingtypeService.getSelectList().then((response: any) => {
      setparkingtypes(response.data);
    });
  };

  const getSocietyParking = (SocietyParkingId: any) => {
    societyparkingsService
      .getById(SocietyParkingId)
      .then((response) => {
        if (response) {
          let result = response.data;
          setValues(setFormValue(result.data));
        }
      })
      .catch((e) => {});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (SocietyParkingId) {
        societyparkingsService.put(values).then((response: any) => {
          let result = response.data;
          if (result.isSuccess) {
            resetForm();
            navigate("/societyParkings/" + societyId);
            globalService.success(result.message);
          }
        });
      } else {
        values.SocietyId = societyId;
        societyparkingsService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              resetForm();
              navigate("/societyParkings/" + societyId);
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
        Society Parkings
      </Typography>
      <form noValidate onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    label="Parking No"
                    name="ParkingNo"
                    value={values.ParkingNo}
                    onChange={handleInputChange}
                    error={errors.ParkingNo}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                  showEmptyItem={false}
                    label="Parking Type"
                    name="ParkingTypeId"
                    required
                    value={parkingtype.length > 0 ? values.ParkingTypeId : ""}
                    onChange={handleInputChange}
                    options={parkingtype}
                    error={errors.ParkingTypeId}
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
                onClick={() => navigate("/societyParkings/" + societyId)}
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

export default SocietyParkingForm;
