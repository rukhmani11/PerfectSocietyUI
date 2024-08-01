import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  CardActions,
  Card,
  CardContent,
  FormGroup,
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
import { subscriberService } from "../../services/SubscribersService";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import { countriesService } from "../../services/CountriesService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SubscribersModel } from "../../models/SubscribersModel";
import Controls from "../../utility/controls/Controls";
import { SelectListModel } from "../../models/ApiResponse";
import { statesService } from "../../services/StatesService";
import dayjs, { Dayjs } from "dayjs";
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const SubscriberForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  const { subscriberId } = useParams();
  let navigate = useNavigate();
  const [countries, setCountries] = useState<SelectListModel[]>([]);
  const [states, setStates] = useState<SelectListModel[]>([]);
  const mode = subscriberId ? "Edit" : "Create";

  const validate = (fieldValues: SubscribersModel = values) => {

    let temp: any = { ...errors };
    if ("Subscriber" in fieldValues)
      temp.Subscriber = fieldValues.Subscriber ? "" : "Subscriber is required.";
    if ("Abbreviation" in fieldValues)
      temp.Abbreviation = fieldValues.Abbreviation
        ? fieldValues.Abbreviation.length > 5
          ? "Abbreviation should be <= 5 characters"
          : ""
        : "Abbreviation is required.";
    if ("Address" in fieldValues)
      temp.Address = fieldValues.Address ? "" : "Address is required.";
    if ("City" in fieldValues)
      temp.City = fieldValues.City ? "" : "City is required.";
    if ("Pin" in fieldValues)
      temp.Pin = fieldValues.Pin ? "" : "Pin is required.";
    if ("StateId" in fieldValues)
      temp.StateId = fieldValues.StateId ? "" : "State is required.";
    if ("CountryCode" in fieldValues)
      temp.CountryCode = fieldValues.CountryCode
        ? ""
        : "CountryCode is required";

    if ("Phone" in fieldValues)
      temp.Phone = fieldValues.Phone
        ? fieldValues.Phone.length < 10
          ? "Phone should not be less then 10 characters"
          : ""
        : "";
    if ("Email" in fieldValues) {
      temp.Email = fieldValues.Email
        ? (temp.Email =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            fieldValues.Email
          )
            ? ""
            : "Please enter a valid email Id.")
        : "";
    }
    if (mode === "Create") {
      if ("UserName" in fieldValues)
        temp.UserName = fieldValues.UserName ? "" : "UserName is required.";
      if ("Password" in fieldValues)
        temp.Password = fieldValues.Password ? "" : "Password is required.";
      if ("ConfirmPassword" in fieldValues) {
        temp.ConfirmPassword = fieldValues.ConfirmPassword
          ? values.Password !== fieldValues.ConfirmPassword
            ? "Password and ConfirmPassword doesn't match."
            : ""
          : "ConfirmPassword is required.";
      }
    }

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(subscriberService.initialFieldValues, validate, subscriberId);

  const newSubscriber = () => {
    setValues(subscriberService.initialFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: SubscribersModel) {
    let newModel = {
      SubscriberId: model.SubscriberId || "",
      Subscriber: model.Subscriber || "",
      Abbreviation: model.Abbreviation || "",
      Address: model.Address || "",
      City: model.City || "",
      Pin: model.Pin || "",
      StateId: model.StateId || "",
      CountryCode: model.CountryCode || "",
      ContactPerson: model.ContactPerson || "",
      Phone: model.Phone || "",
      Mobile: model.Mobile || "", //model.Mobile ? model.Mobile : '',
      Active: model.Active || "",
      Email: model.Email || "",
      UserName: model.UserName || "",
      Password: model.Password || "",
      ConfirmPassword: model.ConfirmPassword || "",
    };
    return newModel;
  }

  useEffect(() => {
    if (countries.length === 0) getCountries();
    if (states.length === 0) getStates();

    if (subscriberId) {
      getSubscriber(subscriberId);
    } else {
      newSubscriber();
      setErrors({});
    }
  }, [subscriberId]);

  const getCountries = () => {
    countriesService.getSelectList().then((response) => {
      setCountries(response.data);
    });
  };

  const getStates = () => {
    statesService.getSelectList().then((response: any) => {
      setStates(response.data);
    });
  };

  const getSubscriber = (subscriberId: any) => {
    subscriberService.getById(subscriberId).then((response) => {
      if (response) {
        let result = response.data;
        setValues(setFormValue(result.data));
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (subscriberId) {
        subscriberService.put(values).then((response: any) => {
          let result = response.data;

          if (result.isSuccess) {
            resetForm();
            navigate("/admin");
            globalService.success("Business Associate updated successfully.");
          }
        });
      } else {
        subscriberService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success("Business Associate added successfully.");
              resetForm();
              navigate("/admin");
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
        Business Associate
      </Typography>
      <form
        //autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >
        <Card>
          <CardContent>
            <React.Fragment>
              {/* <Typography variant="h6" gutterBottom>
                  Shipping address
                </Typography> */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    label="Subscriber name"
                    name="Subscriber"
                    value={values.Subscriber}
                    onChange={handleInputChange}
                    error={errors.Subscriber}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    name="Abbreviation"
                    label="Abbreviation"
                    value={values.Abbreviation}
                    onChange={handleInputChange}
                    error={errors.Abbreviation}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Address"
                    name="Address"
                    required
                    multiline
                    value={values.Address}
                    onChange={handleInputChange}
                    error={errors.Address}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="City"
                    label="City"
                    required
                    value={values.City}
                    onChange={handleInputChange}
                    error={errors.City}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    length={6}
                    name="Pin"
                    label="Pin"
                    value={values.Pin}
                    onChange={handleInputChange}
                    error={errors.Pin}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    name="StateId"
                    label="State"
                    required
                    value={states.length > 0 ? values.StateId : ""}
                    onChange={handleInputChange}
                    options={states}
                    error={errors.StateId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    name="CountryCode"
                    label="Country"
                    required
                    value={countries.length > 0 ? values.CountryCode : ""}
                    onChange={handleInputChange}
                    options={countries}
                    error={errors.CountryCode}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="ContactPerson"
                    name="ContactPerson"
                    value={values.ContactPerson}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Phone"
                    type="tel"
                    name="Phone"
                    inputProps={{ maxLength: 10 }}
                    value={values.Phone}
                    error={errors.Phone}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Mobile"
                    type="tel"
                    name="Mobile"
                    inputProps={{ maxLength: 10 }}
                    value={values.Mobile || ""}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    name="Email"
                    label="Email"
                    value={values.Email}
                    onChange={handleInputChange}
                    error={errors.Email}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}
                // className={mode === "Edit" ? "hidden" : ""}
                >
                  <Controls.Input
                    required
                    name="UserName"
                    label="User Name"
                    readOnly={mode === 'Edit' ? true : false}
                    value={values.UserName}
                    onChange={handleInputChange}
                    error={errors.UserName}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={4} className={mode === "Edit" ? "hidden" : ""}> */}
                <Grid
                  item
                  xs={12}
                  sm={4}
                  className={mode === "Edit" ? "hidden" : ""}
                >
                  <Controls.Input
                    required
                    name="Password"
                    label="Password"
                    type="password"
                    value={values.Password}
                    onChange={handleInputChange}
                    error={errors.Password}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  className={mode === "Edit" ? "hidden" : ""}
                >
                  <Controls.Input
                    required
                    name="ConfirmPassword"
                    label="Confirm Password"
                    className={mode === "Edit" ? "hidden" : ""}
                    type="password"
                    value={values.ConfirmPassword}
                    onChange={handleInputChange}
                    error={errors.ConfirmPassword}
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
                {/* <Grid item xs={12} sm={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label="Controlled picker"
                        value={value}
                        onChange={(newValue) => setValue(newValue)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid> */}
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
                href="/admin"
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

export default SubscriberForm;
