import React, { useEffect, useState } from "react";
import { Box, Grid, TextField, CardActions, Card, CardContent, FormControlLabel, Checkbox, Button, Container, CssBaseline, Paper, ThemeProvider, Toolbar, Typography, createTheme, Stack } from "@mui/material";
import { userService } from "../../services/UserService";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { UserModel } from "../../models/UserModel";
import Controls from "../../utility/controls/Controls";
import { SelectListModel } from "../../models/ApiResponse";
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const UserForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  //globalService.pageTitle = "Users";
  const { id, societyId }: any = useParams();
  let navigate = useNavigate();
  const prevPgState = useLocation();
  const [roles, setRoles] = useState<SelectListModel[]>([]);
  let society = prevPgState?.state?.society;
  // const handleInputChange = (event: any) => {
  //   const { name, value } = event.target;
  //   setUser({ ...user, [name]: value });
  // };
  const mode = id ? 'Edit' : 'Create';
  const validate = (fieldValues: UserModel = values) => {
    let temp: any = { ...errors };

    if (!societyId) { //hide these columns when called from societyUser url
      if ("FirstName" in fieldValues)
        temp.FirstName = fieldValues.FirstName ? "" : "FirstName is required.";
      if ("LastName" in fieldValues)
        temp.LastName = fieldValues.LastName ? "" : "LastName is required.";
      if ("PhoneNumber" in fieldValues) {
        temp.PhoneNumber = fieldValues.PhoneNumber ? "" : "PhoneNumber is required.";
      }
      if ("Email" in fieldValues) {
        temp.Email = fieldValues.Email ? (temp.Email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(fieldValues.Email)
          ? ""
          : "Email is not valid.") : "Email is required";
      }
    }

    if (mode === 'Create') {
      if ("Password" in fieldValues)
        temp.Password = fieldValues.Password ? "" : "Password is required.";

      if ("ConfirmPassword" in fieldValues)
        temp.ConfirmPassword = fieldValues.ConfirmPassword ? "" : "Confirm Password is required.";

      if (("Password" in fieldValues) || ("ConfirmPassword" in fieldValues)) {
        if (fieldValues.ConfirmPassword)
          temp.Password = (values.Password !== fieldValues.ConfirmPassword) ? "Password and ConfirmPassword doesn't match." : "";
        else
          temp.Password = (values.ConfirmPassword !== fieldValues.Password) ? "Password and ConfirmPassword doesn't match." : "";
      }
    }

    if ("UserName" in fieldValues)
      temp.UserName = fieldValues.UserName ? "" : "UserName is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(userService.initialFieldValues, validate, props.setCurrentId);

  const newUser = () => {
    setValues(userService.initialFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: UserModel) {
    let newModel = {
      UserId: model.UserId,
      FirstName: model.FirstName,
      LastName: model.LastName,
      Email: model.Email,
      PhoneNumber: model.PhoneNumber,
      UserName: model.UserName,
      Roles: model.Roles || '',
      Password: model.Password || '',
      ConfirmPassword: model.ConfirmPassword || ''
    }
    return newModel;
  }

  useEffect(() => {
    if (roles.length === 0)
      getRoles();

    if (id) {
      getUser(id);
      setErrors({});
    } else newUser();
  }, [id]);

  const getUser = (id: any) => {
    userService
      .get(id)
      .then((response) => {
        if (response) {
          let result = response.data;
          setValues(setFormValue(result.data));
        }
      })
  };

  const getRoles = () => {
    userService
      .getAllRoleSelectList()
      .then((response) => {
        if (response) {

          let list: any[] = [];
          //since register api need text
          let selectedRoles: any[] = [];
          if (societyId) {
            selectedRoles = response.data.filter((x: any) => x.Text === ROLES.Society || x.Text ===  ROLES.ReadOnly);
          }
          else {
            selectedRoles = response.data.filter((x: any) => (x.Text !== ROLES.Subscriber && x.Text !== ROLES.Society && x.Text !== ROLES.ReadOnly));
          }
          selectedRoles.map((x: any) => {
            list.push({ Text: x.Text, Value: x.Text });
          });

          setRoles(list);
        }
      })
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      values.SocietyId = societyId; //value will be set only when called from Admin->Add User
      if (societyId) {
        values.FirstName = values.UserName;
        values.LastName = ".";
       // values.Roles = "";
        values.PhoneNumber = null;
      }
      if (id) {
        userService.put(values).then((response: any) => {
          if (response) {
            if (societyId)
              navigate("/societyUsers/" + societyId + "/" + localStorage.getItem('callFrom'));
            else
              navigate("/users");
          }
        });
      } else {
        userService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success("User added successfully.");
              resetForm();
              if (societyId)
                navigate("/societyUsers/" + societyId + "/" + localStorage.getItem('callFrom'));
              else
                navigate("/users");
            } else {
              globalService.error(result.message);
            }
          }
        });
      }
    }
  };

  // const newUser = () => {
  //   setUser(initialUserState);
  //   setSubmitted(false);
  // };

  return (
    <>
      {society ?
        <Stack direction="row" spacing={0} justifyContent="space-between" alignContent={"center"}>
          <Typography></Typography>
          <Typography variant="h5">Users</Typography>
          <Typography variant="body1"><b>Society : </b>{society} </Typography>
        </Stack>
        :
        <Typography variant="h5" align={"center"}>Users</Typography>
      }
      <form
        autoComplete="off"
        noValidate
        //className={classes.root}
        onSubmit={handleSubmit}
      >
        <Card>
          <CardContent>
            <React.Fragment>
              {/* <Typography variant="h6" gutterBottom>
                Shipping address
              </Typography> */}
              <Grid container spacing={3}>

                {/* hide these columns when called from societyUser url */}
                {!societyId &&
                  <>
                    <Grid item xs={12} sm={4}>
                      <Controls.Input
                        required
                        label="First Name"
                        name="FirstName"
                        value={values.FirstName}
                        onChange={handleInputChange}
                        error={errors.FirstName}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Controls.Input
                        required
                        name="LastName"
                        label="Last Name"
                        value={values.LastName}
                        onChange={handleInputChange}
                        error={errors.LastName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controls.Select
                        showEmptyItem={false}
                        name="Roles"
                        label="Role"
                        required
                        value={roles.length > 0 ? values.Roles : ''}
                        onChange={handleInputChange}
                        options={roles}
                        error={errors.Roles}
                      />
                      {/* <pre>{JSON.stringify(values.states)}</pre>
                  https://www.npmjs.com/package/react-multi-select-component */}
                      {/* <MultiSelect
                    options={roles}
                    value={roles.length > 0 ? multiRoles : []}
                    onChange={setMultiRoles}
                    labelledBy="Select Roles"
                  /> */}
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
                    <Grid item xs={12} sm={4}>
                      <Controls.Input
                        label="Phone Number"
                        type="number"
                        name="PhoneNumber"
                        value={values.PhoneNumber}
                        onChange={handleInputChange}
                        error={errors.PhoneNumber}
                      />
                    </Grid>
                  </>
                }
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="UserName"
                    required
                    label="User Name"
                    value={values.UserName}
                    onChange={handleInputChange}
                    error={errors.UserName}
                  />
                </Grid>
                <Grid item xs={12} sm={4} className={id ? "hidden" : ""}>
                  <Controls.Input
                    name="Password"
                    required
                    label="Password"
                    type="password"
                    value={values.Password}
                    onChange={handleInputChange}
                    error={errors.Password}
                  />
                </Grid>
                <Grid item xs={12} sm={4} className={id ? "hidden" : ""}>
                  <Controls.Input
                    name="ConfirmPassword"
                    required
                    label="Confirm Password"
                    className={id ? "hidden" : ""}
                    type="password"
                    value={values.ConfirmPassword}
                    onChange={handleInputChange}
                    error={errors.ConfirmPassword}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                      <Controls.Select
                        //showEmptyItem={false}
                        name="Roles"
                        label="Role"
                        required
                        value={roles.length > 0 ? values.Roles : ''}
                        onChange={handleInputChange}
                        options={roles}
                        error={errors.Roles}
                      />
                      
                    </Grid>

              </Grid>
            </React.Fragment>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Stack spacing={2} direction="row">
              <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}>Submit</Button>
              {societyId ?
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/societyUsers/" + societyId + "/" + localStorage.getItem('callFrom'))}>Back To List</Button>
                :
                <Button variant="outlined"  startIcon={<ArrowBackIcon />} href="/users">Back To List</Button>
              }
            </Stack>
          </CardActions>
        </Card>
      </form>
    </>
  );
};

export default UserForm;
