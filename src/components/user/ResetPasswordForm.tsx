import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Controls from "../../utility/controls/Controls";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { userService } from "../../services/UserService";
import useForm from "../../utility/hooks/UseForm";
import { globalService } from "../../services/GlobalService";
import { ResetPasswordModel, UserModel } from "../../models/UserModel";
import { AuthContext } from "../../utility/context/AuthContext";
import { ROLES } from "../../utility/Config";

const ResetPasswordForm = () => {
  const { id }: any = useParams();
  let navigate = useNavigate();
  // const prevPgState = useLocation();
  const { auth } = React.useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (id) {
      getUser(id);
      setErrors({});
    } else {
      newUser();
      setErrors({});
    }
  }, [id]);

  const validate = (fieldValues: ResetPasswordModel = values) => {
    let temp: any = { ...errors };
    if ("Password" in fieldValues)
      temp.Password = fieldValues.Password ? "" : "Password is required.";

    if ("ConfirmPassword" in fieldValues)
      temp.ConfirmPassword = fieldValues.ConfirmPassword
        ? ""
        : "Confirm Password is required.";

    if ("Password" in fieldValues || "ConfirmPassword" in fieldValues) {
      if (fieldValues.ConfirmPassword)
        temp.Password =
          values.Password !== fieldValues.ConfirmPassword
            ? "Password and ConfirmPassword doesn't match."
            : "";
      else
        temp.Password =
          values.ConfirmPassword !== fieldValues.Password
            ? "Password and ConfirmPassword doesn't match."
            : "";
    }
    // if ("Password" in fieldValues)
    //   temp.Password = fieldValues.Password
    //     ? values.ConfirmPassword !== fieldValues.Password
    //       ? "New Password and Confirm Password doesn't match."
    //       : ""
    //     : "Password is required.";
    // if ("Confirm Password" in fieldValues) {
    //   temp.ConfirmPassword = fieldValues.ConfirmPassword
    //     ? values.Password !== fieldValues.ConfirmPassword
    //       ? "Password and Confirm Password doesn't match."
    //       : ""
    //     : "Confirm Password is required.";
    // }
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(userService.initialResetPasswordFieldValues, validate, id);

  const newUser = () => {
    setValues(userService.initialResetPasswordFieldValues);
  };

  function setFormValue(model: ResetPasswordModel) {
    let newModel = {
      UserId: model.UserId,
      Password: model.Password,
      ConfirmPassword: model.ConfirmPassword || "",

    };
    return newModel;
  }

  const getUser = (id: any) => {
    userService.get(id).then((response) => {
      if (response) {
        let result = response.data;
        setValues(setFormValue(result.data));
        setUserName(result.data?.UserName);
        setFullName(result.data?.FirstName + " " + result.data?.LastName);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    values.UserId = id;
    if (validate()) {
      if (id) {
        userService.ResetPassword(values).then((response: any) => {
          let result = response.data;
          if (response) {
            globalService.success(result.message);
            resetForm();
            navigate(-1);
          } else {
            globalService.error(result.message);
          }
        });
      }
    }
  };

  return (
    <div>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5" align="center">
          {" "}
          Password Reset Form{" "}
        </Typography>
        <Typography variant="body1"><b>User Name : </b>{userName} </Typography>

      </Stack>
      <>
        <form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Card>
            <CardContent>
              <React.Fragment>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Controls.Input
                      name="Password"
                      required
                      label="New Password"
                      type="password"
                      value={values.Password}
                      onChange={handleInputChange}
                      error={errors.Password}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controls.Input
                      name="ConfirmPassword"
                      required
                      label="Confirm Password"
                      type="password"
                      value={values.ConfirmPassword}
                      onChange={handleInputChange}
                      error={errors.ConfirmPassword}
                    />
                  </Grid>
                </Grid>
              </React.Fragment>
            </CardContent>

            <CardActions sx={{ display: "flex", justifyContent: "center" }}>
              <Stack spacing={2} direction="row">
                <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}
                >
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(-1)
                    // navigate("/users")
                  }
                >
                  Back To List
                </Button>
              </Stack>
            </CardActions>
          </Card>
        </form>
      </>
    </div>
  );
};

export default ResetPasswordForm;
