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
  Select,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { standardChargeHeadsService } from "../../services/StandardChargeHeadsService";
import { StandardChargeHeadsModel } from "../../models/StandardChargeHeadsModel";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import { SelectListModel } from "../../models/ApiResponse";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Controls from "../../utility/controls/Controls";
import { standardAcHeadsService } from "../../services/StandardAcHeadsService";
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const StandardChargeHeadForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  const { ChargeHeadId } = useParams();
  let navigate = useNavigate();
  const [AcHeads, setAcHead] = useState<SelectListModel[]>([]);
  const NatureList = globalService.getNatures();
  // const NatureList = [
  //   { Value: "A", Text: "Per Area" },
  //   { Value: "L", Text: "Late Payment Penalty" },
  //   { Value: "E", Text: "Early Payment Discount" },
  //   { Value: "I", Text: "Interest" },
  //   { Value: "T", Text: "Tax" },
  //   { Value: "N", Text: "Non-Occupancy" },
  // ];
  const validate = (fieldValues: StandardChargeHeadsModel = values) => {
    let temp: any = { ...errors };
    if ("ChargeHead" in fieldValues)
      temp.ChargeHead = fieldValues.ChargeHead ? "" : "ChargeHead is required.";
    // if ("ChargeInterest" in fieldValues)
    //   temp.ChargeInterest = fieldValues.ChargeInterest
    //     ? ""
    //     : "Charge Interest is required.";
    // if ("ChargeTax" in fieldValues)
    //   temp.ChargeTax = fieldValues.ChargeTax ? "" : "Charge Tax is required.";
    if ("AcHeadId" in fieldValues)
      temp.AcHeadId = fieldValues.AcHeadId ? "" : "AcHeadId is required.";
    // if ("Nature" in fieldValues)
    //   temp.Nature = fieldValues.Nature ? "" : "Nature is required.";
    if ("Hsncode" in fieldValues)
      temp.Hsncode = fieldValues.Hsncode.length <=6 ? "" : "HSNCode is required.";
    if ("Sequence" in fieldValues)
      temp.Sequence = fieldValues.Sequence ? "" : "Sequence is required.";
    // if ("Rate" in fieldValues)
    //   temp.Rate = fieldValues.Rate ? (temp.Rate =  /^[0-9]*(\.[0-9]{0,2})?$/.test(fieldValues.Rate.toString())? "" : "Enter positive value.") : "Rate is required";
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(
      standardChargeHeadsService.initialFieldValues,
      validate,
      props.ChargeHeadId
    );

  const newStandardChargeHeads = () => {
    setValues(standardChargeHeadsService.initialFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: StandardChargeHeadsModel) {
    let newModel = {
      ChargeHeadId: model.ChargeHeadId,
      ChargeHead: model.ChargeHead,
      AcHeadId: model.AcHeadId,
      ChargeInterest: model.ChargeInterest,
      ChargeTax: model.ChargeTax,
      Nature: model.Nature || "",
      Sequence: model.Sequence,
      Hsncode : model.Hsncode || "",
      Rate:model.Rate,
    };
    return newModel;
  }
  useEffect(() => {
    if (AcHeads.length === 0) getAcHeads();

    if (ChargeHeadId) {
      getstandardChargeHeads(ChargeHeadId);
    } else {
      newStandardChargeHeads();
      setErrors({});
    }
  }, [ChargeHeadId]);

  const getAcHeads = () => {
    standardAcHeadsService.getSelectList().then((response: any) => {
      setAcHead(response.data);
    });
  };

  const getstandardChargeHeads = (ChargeHeadId: any) => {
    standardChargeHeadsService.getById(ChargeHeadId).then((response) => {
      if (response) {
        let result = response.data;
        setValues(setFormValue(result.data));
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (ChargeHeadId) {
        standardChargeHeadsService.put(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              navigate("/standardChargeheads");
            } else {
              globalService.error(result.message);
            }
          }
        });
      } else {
        standardChargeHeadsService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              resetForm();
              navigate("/standardChargeheads");
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
        Charge heads
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
                    label="Charge Head name"
                    autoComplete="given-name"
                    name="ChargeHead"
                    length={100}
                    value={values.ChargeHead}
                    onChange={handleInputChange}
                    error={errors.ChargeHead}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    name="AcHeadId"
                    label="AC Head"
                    required
                    value={AcHeads.length > 0 ? values.AcHeadId : ""}
                    onChange={handleInputChange}
                    options={AcHeads}
                    error={errors.AcHeadId}
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
                    name="Sequence"
                    value={values.Sequence}
                    onChange={handleInputChange}
                    error={errors.Sequence}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    label="Rate "
                    autoComplete="given-name"
                    name="Rate"
                    value={values.Rate}
                    onChange={handleInputChange}
                    error={errors.Rate}
                  />
                  </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    name="ChargeInterest"
                    label="ChargeInterest"
                    value={values.ChargeInterest}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    name="ChargeTax"
                    label="Charge Tax"
                    value={values.ChargeTax}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    label="HSNCode"
                    autoComplete="Hsncode"
                    name="Hsncode"
                    length={6}
                    value={values.Hsncode}
                    onChange={handleInputChange}
                    error={errors.ChargeHead}
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
                href="/standardChargeheads"
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

export default StandardChargeHeadForm;
