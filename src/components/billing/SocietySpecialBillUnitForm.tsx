import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  CardActions,
  Card,
  CardContent,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import Controls from "../../utility/controls/Controls";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SelectListModel } from "../../models/ApiResponse";
import { SocietySpecialBillUnitsModel } from "../../models/SocietySpecialBillUnitsModel";
import { societySpecialBillUnitsService } from "../../services/SocietySpecialBillUnitsService";
import { societyBuildingUnitsService } from "../../services/SocietyBuildingUnitsService";
import { Messages, ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";
import { useSharedNavigation } from "../../utility/context/NavigationContext";

const SocietySpecialBillUnitForm = () => {
  const { auth } = React.useContext(AuthContext);
  const { societySpecialBillId, societySpecialBillUnitId }: any = useParams();
  const societyId: string = localStorage.getItem("societyId") || "";
  let navigate = useNavigate();
  //const mode = societySpecialBillUnitId ? 'Edit' : 'Create';
  const [title, setTitle] = useState<any>({});
  const [buildingUnits, setBuildingUnits] = useState<SelectListModel[]>([]);
  const { goToHome } = useSharedNavigation();
  const validate = (fieldValues: SocietySpecialBillUnitsModel = values) => {
    let temp: any = { ...errors };
    if ("UnitId" in fieldValues)
      temp.UnitId = fieldValues.UnitId ? "" : "Unit is required.";
    if ("Rate" in fieldValues)
      temp.Rate = fieldValues.Rate ? "" : "Rate is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(
      societySpecialBillUnitsService.initialFieldValues,
      validate,
      societySpecialBillUnitId
    );

  const newSocietySpecialBillUnit = () => {
    setValues(societySpecialBillUnitsService.initialFieldValues);
  };

  // //This is used since in get the null property is not returned
  // function setFormValue(model: SocietySpecialBillUnitsModel) {
  //     let newModel = {
  //         SocietyBuildingUnitId: model.SocietyBuildingUnitId,
  //         SocietySpecialBillId: model.SocietySpecialBillId || ''
  //     }
  //     return newModel;
  // }

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (buildingUnits.length === 0) getBuildingUnits();

    if (!societySpecialBillUnitId) {
      newSocietySpecialBillUnit();
      setErrors({});
    }

    // if (Object.keys(title).length === 0)
    //   getBuildingTitle();
  }, [societySpecialBillUnitId]);

  //   const getBuildingTitle = () => {
  //     let model: SocietyBuildingTitleModel = {
  //       SocietySpecialBillId: societySpecialBillId,
  //       SocietyBuildingId: ""
  //     }
  //     societyBuildingsService
  //       .getPageTitle(model)
  //       .then((response) => {
  //         setTitle(response.data);
  //       });
  //   };

  const getBuildingUnits = () => {
    societyBuildingUnitsService
      .getSocietyBuildingUnitNotInSocietySpecialBillsBySocietyId(
        societySpecialBillId,
        societyId
      )
      .then((response: any) => {
        setBuildingUnits(response.data);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      values.SocietySpecialBillId = societySpecialBillId;
      if (!societySpecialBillUnitId) {
        societySpecialBillUnitsService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(
                "Society SpecialBill Charge Head added successfully."
              );
              resetForm();
              navigate("/societySpecialBillUnits/" + societySpecialBillId);
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
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5" align="center">
          Society Special Bill Unit
        </Typography>
        {/* <Typography variant="body1"><b>Building : </b>{title.Building}  <b>Unit :</b> {title.Unit}  </Typography> */}
      </Stack>
      <form
        //autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    name="SocietyBuildingUnitId"
                    label="Building Units"
                    showEmptyItem={false}
                    required
                    value={
                      buildingUnits.length > 0
                        ? values.SocietyBuildingUnitId
                        : ""
                    }
                    onChange={handleInputChange}
                    options={buildingUnits}
                    error={errors.SocietyBuildingUnitId}
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
                  navigate("/societySpecialBillUnits/" + societySpecialBillId)
                }
              >
                Back{" "}
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </form>
    </>
  );
};

export default SocietySpecialBillUnitForm;
