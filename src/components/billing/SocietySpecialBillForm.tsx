import React, { useEffect, useState } from "react";
import { Grid, CardActions, Card, CardContent, Button, Typography, Stack } from "@mui/material";
import { societySpecialBillsService } from "../../services/SocietySpecialBillsService";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SocietySpecialBillsModel } from "../../models/SocietySpecialBillsModel";
import Controls from '../../utility/controls/Controls'
import { SelectListModel } from '../../models/ApiResponse'
import { societyBuildingUnitsService } from "../../services/SocietyBuildingUnitsService";
import { unitTypesService } from "../../services/UnitTypesService";
import { Messages, ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";
import { useSharedNavigation } from "../../utility/context/NavigationContext";

const SocietySpecialBillForm = () => {
  const { auth } = React.useContext(AuthContext);
  const { societySpecialBillId, societyId }: any = useParams();
  let navigate = useNavigate();
  const [unitTypes, setUnitTypes] = useState<SelectListModel[]>([]);
  const [buildingUnits, setBuildingUnits] = useState<SelectListModel[]>([]);
  const mode = societySpecialBillId ? 'Edit' : 'Create';
  const { goToHome } = useSharedNavigation();

  const validate = (fieldValues: SocietySpecialBillsModel = values) => {
    let temp: any = { ...errors };
    if ("FromDate" in fieldValues)
      temp.FromDate = fieldValues.FromDate ? "" : "From date is required.";

    if ("ToDate" in fieldValues)
      temp.ToDate = fieldValues.ToDate ? "" : "To date is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(societySpecialBillsService.initialFieldValues, validate, societySpecialBillId);

  const newSocietySpecialBill = () => {
    setValues(societySpecialBillsService.initialFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: SocietySpecialBillsModel) {
    let newModel = {
      SocietySpecialBillId: model.SocietySpecialBillId,
      SocietyId: model.SocietyId,
      UnitTypeId: model.UnitTypeId || "",
      SocietyBuildingUnitId: model.SocietyBuildingUnitId || "",
      FromDate: model.FromDate ? globalService.convertLocalToUTCDate(new Date(model.FromDate)) : null,
      ToDate: model.ToDate ? globalService.convertLocalToUTCDate(new Date(model.ToDate)) : null,
      Remark: model.Remark || "",
    }
    return newModel;
  }

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (unitTypes.length === 0)
      getUnitTypes();
    if (buildingUnits.length === 0)
      getBuildingUnits();

    if (societySpecialBillId) {
      getSocietySpecialBill();
    }
    else {
      newSocietySpecialBill();
      setErrors({});
    }

  }, [societySpecialBillId]);

  const getUnitTypes = () => {
    unitTypesService.getSelectList()
      .then((response) => {
        setUnitTypes(response.data);
      });
  };

  const getBuildingUnits = () => {
    societyBuildingUnitsService
      .getSelectListBySocietyId(societyId)
      .then((response: any) => {
        setBuildingUnits(response.data);
      });
  }

  const getSocietySpecialBill = () => {
    societySpecialBillsService
      .getById(societySpecialBillId)
      .then((response) => {
        if (response) {
          let result = response.data;
          setValues(setFormValue(result.data));

        }
      })
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      values.SocietyId = societyId;
      if (societySpecialBillId) {
        societySpecialBillsService.put(values).then((response: any) => {
          let result = response.data;
          if (result.isSuccess) {
            resetForm();
            navigate("/societySpecialBills/" + societyId);
            globalService.success("Society Special Bill updated successfully.");
          }
        });
      } else {
        societySpecialBillsService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success("Society Special Bill added successfully.");
              resetForm();
              navigate("/societySpecialBills/" + societyId);
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
        Society Special Bill
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
                  <Controls.Select
                    name="UnitTypeId"
                    label="Unit Type"
                    required
                    value={unitTypes.length > 0 ? values.UnitTypeId : ""}
                    onChange={handleInputChange}
                    options={unitTypes}
                    error={errors.UnitTypeId}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    name="SocietyBuildingUnitId"
                    label="Building Units"
                    required
                    value={buildingUnits.length > 0 ? values.SocietyBuildingUnitId : ""}
                    onChange={handleInputChange}
                    options={buildingUnits}
                    error={errors.SocietyBuildingUnitId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Remark"
                    name="Remark"
                    multiline
                    value={values.Remark}
                    onChange={handleInputChange}
                    error={errors.Remark}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="From Date"
                    value={values.FromDate}
                    onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'FromDate' } })}
                    error={errors.FromDate}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="To Date"
                    fullWidth
                    value={values.ToDate}
                    onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'ToDate' } })}
                    min={values.FromDate}
                    error={errors.ToDate}
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
                href={"/societySpecialBills/" + societyId}
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
export default SocietySpecialBillForm
