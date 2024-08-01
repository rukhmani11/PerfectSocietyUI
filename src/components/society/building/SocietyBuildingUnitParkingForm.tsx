import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  CardActions,
  CardHeader,
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
import { SocietyBuildingUnitParkingsModel } from "../../../models/SocietyBuildingUnitParkingsModel";
import { SocietyBuildingUnitParkingsService } from "../../../services/SocietyBuildingUnitParkingsService";
import { societyparkingsService } from "../../../services/SocietyParkingsService";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../../services/GlobalService";

import Controls from "../../../utility/controls/Controls";
import useForm from "../../../utility/hooks/UseForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SelectListModel } from "../../../models/ApiResponse";
import { SocietyBuildingTitleModel } from "../../../models/SocietyBuildingsModel";
import { societyBuildingsService } from "../../../services/SocietyBuildingsService";
import dayjs from "dayjs";
import { ROLES,Messages } from "../../../utility/Config";
import { AuthContext } from "../../../utility/context/AuthContext";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";

const SocietyBuildingUnitParkingForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  const { SocietyBuildingUnitParkingId, societyBuildingUnitId }: any = useParams();
  const societyId: string = localStorage.getItem("societyId") || "";
  let navigate = useNavigate();
  const [SocietyParking, setSocietyParking] = useState<SelectListModel[]>([]);
  const [title, setTitle] = useState<any>({});
  const [minDate, setMinDate] = useState(null);
  const mode = SocietyBuildingUnitParkingId ? "Edit" : "Create";
  const { goToHome } = useSharedNavigation();
  
  const validate = (fieldValues: SocietyBuildingUnitParkingsModel = values) => {
    let temp: any = { ...errors };
    if ("SocietyParkingId" in fieldValues)
      temp.SocietyParkingId = fieldValues.SocietyParkingId
        ? ""
        : "Society Parking is required.";
    if ("TransferredOn" in fieldValues)
      temp.TransferredOn = fieldValues.TransferredOn
        ? ""
        : "Transferred On is required.";
    // if ("EndDate" in fieldValues)
    //   temp.EndDate = fieldValues.EndDate ? "" : "EndDate On is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

 
  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(
      SocietyBuildingUnitParkingsService.initialFieldValues,
      validate,
      props.SocietyBuildingUnitId
    );

  const newsocietyBuildingUnits = () => {
    setValues(SocietyBuildingUnitParkingsService.initialFieldValues);
  };

  function setFormValue(model: SocietyBuildingUnitParkingsModel) {
    ;
    let newModel = {
      SocietyBuildingUnitParkingId: model.SocietyBuildingUnitParkingId,
      SocietyParkingId: model.SocietyParkingId,
      SocietyBuildingUnitId: model.SocietyBuildingUnitId,
      SocietyMemberId: model.SocietyMemberId || "",
      SocietyMemberTenantId: model.SocietyMemberTenantId || "",
      TransferredOn: model.TransferredOn ? globalService.convertLocalToUTCDate(new Date(model.TransferredOn)) : null,
      EndDate: model.EndDate ? globalService.convertLocalToUTCDate(new Date(model.EndDate)) : null,
      VehicleNumber:model.VehicleNumber,
    };
    return newModel;
  }

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (SocietyParking.length === 0) getSocietyParking();
    if (SocietyBuildingUnitParkingId) {
      getSocietyBuildingUnitParking(SocietyBuildingUnitParkingId);
    } else {
      newsocietyBuildingUnits();
      setErrors({});
    }
    if (Object.keys(title).length === 0) getBuildingTitle();
  }, [SocietyBuildingUnitParkingId]);

  const getSocietyParking = () => {
    societyparkingsService.getSelectListBySocietyId(societyId).then((response) => {
      setSocietyParking(response.data);
    });
  };

  const getBuildingTitle = () => {
    let model: SocietyBuildingTitleModel = {
      SocietyBuildingUnitId: societyBuildingUnitId,
      SocietyBuildingId: "",
    };
    societyBuildingsService.getPageTitle(model).then((response) => {
      setTitle(response.data);
    });
  };
  const GetMaxTransfredONDate = (societyParkingId: any) => {
    if (societyParkingId) {
      SocietyBuildingUnitParkingsService.GetMaxTransfredONDateBySocietyParkingId(
        societyParkingId
      ).then((response) => {
        
        if (response) {
          let result = response.data;
          setMinDate(dayjs(result.data).format("MM-DD-YYYY"));
          //setValues(setFormValue(result.data));
        }
      });
    }
  };
  const getSocietyBuildingUnitParking = (SocietyBuildingUnitParkingId: any) => {
    SocietyBuildingUnitParkingsService.getById(
      SocietyBuildingUnitParkingId
    ).then((response) => {
      if (response) {
        let result = response.data;
        setValues(setFormValue(result.data));
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      values.SocietyBuildingUnitId = societyBuildingUnitId;
      if (SocietyBuildingUnitParkingId) {
        SocietyBuildingUnitParkingsService.put(values).then((response: any) => {
          let result = response.data;
          if (result.isSuccess) {
            resetForm();
            navigate("/societyBuildingUnitParkings/" + societyBuildingUnitId);
            globalService.success(result.message);
          }
        });
      } else {
        SocietyBuildingUnitParkingsService.post(values).then(
          (response: any) => {
            if (response) {
              let result = response.data;
              if (result.isSuccess) {
                globalService.success(result.message);
                resetForm();
                navigate(
                  "/societyBuildingUnitParkings/" + societyBuildingUnitId
                );
              } else {
                globalService.error(result.message);
              }
            }
          }
        );
      }
    }
  };

  return (
    <>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5" align="center">
          Society Parking Transfer
        </Typography>
        <Typography variant="body1">
          <b>Building : </b>
          {title.Building} <b>Unit :</b> {title.Unit}{" "}
        </Typography>
      </Stack>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    name="SocietyParkingId"
                    label="Parking Lot"
                    required
                    value={
                      SocietyParking.length > 0 ? values.SocietyParkingId : ""
                    }
                   onChange={(e: any) => {
                    handleInputChange(e);
                    GetMaxTransfredONDate(values.SocietyParkingId)
                }} 
                    options={SocietyParking}

                    error={errors.SocietyParkingId}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="Transferred On"
                    name="TransferredOn"
                    value={values.TransferredOn}
                    minDate={new Date()}
                    onChange={(date: Date) =>
                      handleInputChange({
                        target: { value: globalService.convertLocalToUTCDate(date), name: "TransferredOn" },
                      })
                    }
                    error={errors.TransferredOn}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="VehicleNumber"
                    label="Vehicle Number"
                    value={values.VehicleNumber}
                    error={errors.VehicleNumber}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  className={mode !== "Edit" ? "hidden" : ""}
                >
                  <Controls.ReactDatePicker
                    label="End Date"
                    name="EndDate"
                    className={mode !== "Edit" ? "hidden" : ""}
                    required
                    value={values.EndDate}
                    onChange={(date: Date) =>
                      handleInputChange({
                        target: { value: globalService.convertLocalToUTCDate(date), name: "EndDate" },
                      })
                    }
                    error={errors.EndDate}
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
                onClick={() => navigate(-1)}
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

export default SocietyBuildingUnitParkingForm;
