import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  CardActions,
  Card,
  CardContent,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { payModesService } from "../../services/PayModesService";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { PayModesModel } from "../../models/PayModesModel";
import Controls from "../../utility/controls/Controls";
import { SelectListModel } from "../../models/ApiResponse";
import { standardAcHeadsService } from "../../services/StandardAcHeadsService";
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const PayModeForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  globalService.pageTitle = "payModes";
  const { PayModeCode } = useParams();
  let navigate = useNavigate();
  const [AcHeads, setAcHead] = useState<SelectListModel[]>([]);

  const validate = (fieldValues = values) => {
    let temp: any = { ...errors };
    if ("PayModeCode" in fieldValues)temp.PayModeCode = fieldValues.PayModeCode ? "": "PayModeCode name is required.";
    if ("PayModeCode" in fieldValues)
      temp.PayModeCode = fieldValues.PayModeCode? fieldValues.PayModeCode.length > 2? "PayModeCode should be <= 2  UpperCase characters" : "" : "PayModeCode is required.";
    if ("PayMode" in fieldValues)
      temp.PayMode = fieldValues.PayMode ? "" : "PayMode is required.";
    if ("AcHeadId" in fieldValues)
      temp.AcHeadId = fieldValues.AcHeadId ? "" : "AcHeadId is required.";
      
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(payModesService.initialFieldValues, validate, props.setCurrentId);

  const newUser = () => {
    setValues(payModesService.initialFieldValues);
  };
  //This is used since in get the null property is not returned
  function setFormValue(model: PayModesModel) {
    let newModel = {
      PayModeCode: model.PayModeCode,
      PayMode: model.PayMode,
      AskDetails: model.AskDetails,
      Active: model.Active,
      AcHeadId: model.AcHeadId,
    };
    return newModel;
  }
  useEffect(() => {
    if (AcHeads.length === 0) getAcHeads();

    if (PayModeCode) {
      getpayMode(PayModeCode);
    } else {
      newUser();
      setErrors({});
    }
  }, [PayModeCode]);

  const getAcHeads = () => {
    standardAcHeadsService.getSelectList().then((response: any) => {
      setAcHead(response.data);
    });
  };

  useEffect(() => {
    if (PayModeCode) {
      getpayMode(PayModeCode);
      setErrors({});
    } else newUser();
  }, [PayModeCode]);

  const getpayMode = (PayModeCode: any) => {
    payModesService.getById(PayModeCode).then((response) => {
      if (response) {
        let result = response.data;
        setValues(setFormValue(result.data));
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (PayModeCode) {
        payModesService.put(values).then((response: any) => {
          let result = response.data;
          if (response) {
            globalService.success(result.message);
            navigate("/payModes");
          } else {
            globalService.error(result.message);
          }
        });
      } else {
        payModesService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              resetForm();
              navigate("/payModes");
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
      <Typography component="h1" variant="h5" align="center">
        Pay Mode
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
                    label="Pay Mode name"
                    autoComplete="given-name"
                    name="PayMode"
                    value={values.PayMode}
                    onChange={handleInputChange}
                    error={errors.PayMode}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    label="Pay Mode Code "
                    autoComplete="given-name"
                    name="PayModeCode"
                    value={values.PayModeCode}
                    onChange={handleInputChange}
                    error={errors.PayModeCode}
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
                  <Controls.Checkbox
                    name="AskDetails"
                    label="Ask Details"
                    value={values.AskDetails}
                    onChange={handleInputChange}
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
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                href="/payModes"
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

export default PayModeForm;
