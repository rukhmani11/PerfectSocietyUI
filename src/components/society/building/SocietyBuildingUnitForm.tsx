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
import { SocietyBuildingUnitsModel } from "../../../models/SocietyBuildingUnitsModel";
import { societyBuildingUnitsService } from "../../../services/SocietyBuildingUnitsService";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../../services/GlobalService";


import Controls from "../../../utility/controls/Controls";
import useForm from "../../../utility/hooks/UseForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SelectListModel } from "../../../models/ApiResponse";
import { SocietyBuildingTitleModel } from "../../../models/SocietyBuildingsModel";
import { societyBuildingsService } from "../../../services/SocietyBuildingsService";
import { unitTypesService } from "../../../services/UnitTypesService";
import { Messages, ROLES } from "../../../utility/Config";
import { AuthContext } from "../../../utility/context/AuthContext";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";

const SocietyBuildingUnitForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  globalService.pageTitle = "Unit";
  const { societyBuildingId, societyBuildingUnitId }: any = useParams();
  const [title, setTitle] = useState<any>({});
  const { goToHome } = useSharedNavigation();
  let navigate = useNavigate();
  const [UnitType, setUnitType] = useState<SelectListModel[]>([]);


  const validate = (fieldValues: SocietyBuildingUnitsModel = values) => {
    let temp: any = { ...errors };
    if ("Unit" in fieldValues)
      temp.Unit = fieldValues.Unit ? "" : "Unit is required.";
    if ("UnitTypeId" in fieldValues)
      temp.UnitTypeId = fieldValues.UnitTypeId ? "" : "UnitType is required.";
    if ("FloorNo" in fieldValues)
      temp.FloorNo = fieldValues.FloorNo >= 0 ? "" : "FloorNo is required.";
    if ("TerraceArea" in fieldValues)
      temp.TerraceArea = fieldValues.TerraceArea ? (temp.TerraceArea = /^[0-9]*(\.[0-9]{0,3})?$/.test(fieldValues.TerraceArea.toString()) ? "" : "") : ""
    // if ("CertificateNo" in fieldValues)
    // temp.CertificateNo = fieldValues.CertificateNo
    //   ? fieldValues.CertificateNo.length <=5
    //     ? ""
    //     : "Enter a certificate number between 1 to 5 characters"
    //   : "";
    // if ("Wing" in fieldValues)
    //   temp.Wing = fieldValues.Wing ? "" : "Wing is required.";
    // if ("CarpetArea" in fieldValues)
    //   temp.CarpetArea = fieldValues.CarpetArea ? "" : "CarpetArea is required.";
    // if ("ChargeableArea" in fieldValues)
    //   temp.ChargeableArea = fieldValues.ChargeableArea ? "" : "ChargeableArea is required.";
    // if ("TerraceArea" in fieldValues)
    //   temp.TerraceArea = fieldValues.TerraceArea ? "" : "UnitType is TerraceArea.";
    // if ("StartDate" in fieldValues)
    //   temp.StartDate = fieldValues.StartDate ? "" : "StartDate is required.";
    // if ("EndDate" in fieldValues)
    //   temp.EndDate = fieldValues.EndDate ? "" : "EndDate is required.";
    // if ("CertificateNo" in fieldValues)
    //   temp.CertificateNo = fieldValues.CertificateNo ? "": "CertificateNo is required.";
    // if ("IssueDate" in fieldValues)
    //    temp.IssueDate = fieldValues.IssueDate ? "" : "IssueDate is required.";
    // if ("NoOfShares" in fieldValues)
    //   temp.NoOfShares = fieldValues.NoOfShares ? "" : "NoOfShares is required.";
    // if ("DistinctiveFrom" in fieldValues)
    //   temp.DistinctiveFrom = fieldValues.DistinctiveFrom ? "": "DistinctiveFrom is required.";
    // if ("DistinctiveTo" in fieldValues)
    //   temp.DistinctiveTo = fieldValues.DistinctiveTo ? "": "DistinctiveTo is required.";
    // if ("Value" in fieldValues)
    //   temp.Value = fieldValues.Value ? "" : "Value is required.";
    //  if ("PayDate" in fieldValues)
    //   temp.PayDate = fieldValues.PayDate ? "" : "PayDate is required.";
    // if ("AmountAtAllotment" in fieldValues)
    //   temp.AmountAtAllotment = fieldValues.AmountAtAllotment ? "" : "AmountAtAllotment is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(
      societyBuildingUnitsService.initialFieldValues,
      validate,
      props.SocietyBuildingUnitId
    );

  const newsocietyBuildingUnits = () => {
    setValues(societyBuildingUnitsService.initialFieldValues);
  };

  function setFormValue(model: SocietyBuildingUnitsModel) {
    let newModel = {
      SocietyBuildingUnitId: model.SocietyBuildingUnitId,
      SocietyBuildingId: model.SocietyBuildingId,
      Unit: model.Unit,
      UnitTypeId: model.UnitTypeId,
      FloorNo: model.FloorNo || 0,
      Wing: model.Wing || "",
      CarpetArea: model.CarpetArea || "",
      ChargeableArea: model.ChargeableArea || "",
      TerraceArea: model.TerraceArea || "",
      StartDate: model.StartDate ? globalService.convertLocalToUTCDate(new Date(model.StartDate)) : null,
      EndDate: model.EndDate ? globalService.convertLocalToUTCDate(new Date(model.EndDate)) : null,
      CertificateNo: model.CertificateNo || "",
      IssueDate: model.IssueDate ? globalService.convertLocalToUTCDate(new Date(model.IssueDate)) : null,
      NoOfShares: model.NoOfShares || "",
      DistinctiveFrom: model.DistinctiveFrom || "",
      DistinctiveTo: model.DistinctiveTo || "",
      Value: model.Value || "",
      PayDate: model.PayDate ? globalService.convertLocalToUTCDate(new Date(model.PayDate)) : null,
      AmountAtAllotment: model.AmountAtAllotment || "",
    };
    return newModel;
  }
  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (UnitType.length === 0) getUnitTypes();
    if (Object.keys(title).length === 0)
      getBuildingTitle();

    if (societyBuildingUnitId) {
      getSocietyBuildingUnit(societyBuildingUnitId);
    } else {
      newsocietyBuildingUnits();
      setErrors({});
    }
  }, [societyBuildingUnitId]);

  const getBuildingTitle = () => {
    let model: SocietyBuildingTitleModel = {
      SocietyBuildingUnitId: "",
      SocietyBuildingId: societyBuildingId
    }
    societyBuildingsService
      .getPageTitle(model)
      .then((response) => {
        setTitle(response.data);
      });
  };

  const getUnitTypes = () => {
    unitTypesService.getSelectList().then((response: any) => {
      setUnitType(response.data);
    });
  };

  useEffect(() => {
    if (societyBuildingUnitId) {
      getSocietyBuildingUnit(societyBuildingUnitId);
    } else {
      newsocietyBuildingUnits();
      setErrors({});
    }
  }, [societyBuildingUnitId]);

  const getSocietyBuildingUnit = (SocietyBuildingUnitId: any) => {
    societyBuildingUnitsService
      .getById(SocietyBuildingUnitId)
      .then((response) => {
        if (response) {
          let result = response.data;
          setValues(setFormValue(result.data));
          //console.log(response.data);
        }
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (societyBuildingUnitId) {
        societyBuildingUnitsService.put(values).then((response: any) => {
          let result = response.data;

          if (result.isSuccess) {
            resetForm();
            navigate("/societyBuildingUnits/" + societyBuildingId);
            globalService.success("Society building updated successfully.");
          }
        });
      } else {
        values.SocietyBuildingId = societyBuildingId;
        societyBuildingUnitsService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(
                "Society BuildingUnit added successfully.."
              );
              resetForm();
              navigate("/societyBuildingUnits/" + societyBuildingId);
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
          Building Units
        </Typography>
        <Typography variant="body1"><b>Building : </b>{title.Building} </Typography>
      </Stack>

      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardHeader title="Building Unit" />
          <CardContent>
            <React.Fragment>
              <Grid container spacing={5}>
                <Grid item xs={1} sm={4}>
                  <Controls.Input
                    required
                    label="Unit"
                    name="Unit"
                    value={values.Unit}
                    onChange={handleInputChange}
                    error={errors.Unit}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    name="UnitTypeId"
                    label="UnitType"
                    required
                    value={UnitType.length > 0 ? values.UnitTypeId : ""}
                    onChange={handleInputChange}
                    options={UnitType}
                    error={errors.UnitTypeId}
                  />
                </Grid>

                <Grid item xs={1} sm={4}>
                  <Controls.Input
                    required
                    label="Floor No"
                    name="FloorNo"
                    type="number"
                    value={values.FloorNo}
                    onChange={handleInputChange}
                    error={errors.FloorNo}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Wing"
                    name="Wing"
                    value={values.Wing}
                    onChange={handleInputChange}
                    error={errors.Wing}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="CarpetArea"
                    name="CarpetArea"
                    type="number"
                    value={values.CarpetArea}
                    onChange={handleInputChange}
                    error={errors.CarpetArea}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="ChargeableArea"
                    name="ChargeableArea"
                    type="number"
                    value={values.ChargeableArea}
                    onChange={handleInputChange}
                    error={errors.ChargeableArea}
                  />
                </Grid>

                <Grid item xs={1} sm={4}>
                  <Controls.Input
                    label="TerraceArea"
                    name="TerraceArea"
                    type="number"
                    value={values.TerraceArea}
                    onChange={handleInputChange}
                    error={errors.TerraceArea}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="StartDate"
                    name="StartDate"
                    value={values.StartDate}
                    onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'StartDate' } })}
                    error={errors.StartDate}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="EndDate"
                    name="EndDate"
                    value={values.EndDate}
                    onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'EndDate' } })}
                    error={errors.EndDate}
                  />
                </Grid>
              </Grid>
            </React.Fragment>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Share Certificate Details" />
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="CertificateNo"
                    type="number"
                    name="CertificateNo"
                    value={values.CertificateNo}
                    onChange={handleInputChange}
                    error={errors.CertificateNo}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="NoOfShares"
                    type="number"
                    name="NoOfShares"
                    value={values.NoOfShares}
                    onChange={handleInputChange}
                    error={errors.NoOfShares}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="DistinctiveFrom"
                    name="DistinctiveFrom"
                    type="number"
                    value={values.DistinctiveFrom}
                    onChange={handleInputChange}
                    error={errors.DistinctiveFrom}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="DistinctiveTo"
                    name="DistinctiveTo"
                    type="number"
                    value={values.DistinctiveTo}
                    onChange={handleInputChange}
                    error={errors.DistinctiveTo}
                  />
                </Grid>
                {/* <text >Value</text> */}
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Value"
                    name="Value"
                    type="number"
                    value={values.Value}
                    onChange={handleInputChange}
                    error={errors.Value}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="AmountAtAllotment"
                    name="AmountAtAllotment"
                    type="number"
                    value={values.AmountAtAllotment}
                    onChange={handleInputChange}
                    error={errors.AmountAtAllotment}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="PayDate"
                    name="PayDate"
                    value={values.PayDate}
                    onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'PayDate' } })}
                    error={errors.PayDate}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    fullWidth
                    label="IssueDate"
                    name="IssueDate"
                    value={values.IssueDate}
                    onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'IssueDate' } })}
                    error={errors.IssueDate}
                  />
                </Grid>

              </Grid>
            </React.Fragment>
          </CardContent>
        </Card>

        <CardActions sx={{ display: "flex", justifyContent: "center" }}>
          <Stack spacing={2} direction="row">
            <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              // onClick={() =>
              //   navigate("/societyBuildingUnits/" + societyBuildingId) }
              onClick={() => navigate(-1)}

            >
              Back To List
            </Button>
          </Stack>
        </CardActions>
      </form>
    </>
  );
};

export default SocietyBuildingUnitForm;
