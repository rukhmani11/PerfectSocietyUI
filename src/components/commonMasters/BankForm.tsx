import React, { useEffect } from "react";
import { Grid, TextField, CardActions, Card, CardContent, Button, Typography, Stack } from "@mui/material";
import { bankService } from "../../services/BankService";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BankModel } from "../../models/BankModel";
import Controls from "../../utility/controls/Controls";
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const BankForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  globalService.pageTitle = "Banks";
  const { bankId } = useParams();
  let navigate = useNavigate();

  const validate = (fieldValues = values) => {
    let temp: any = { ...errors };
    if ("Bank" in fieldValues)
      temp.Bank = fieldValues.Bank ? "" : "Bank name is required.";

      // if ("Abrv" in fieldValues)
      // temp.Abrv = fieldValues.Abrv ? "" : "Abbreviation is required.";
    setErrors({
      ...temp,
    });



    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(bankService.initialFieldValues, validate, props.setCurrentId);

  const newUser = () => {
    setValues(bankService.initialFieldValues);
  };
  //This is used since in get the null property is not returned
  function setFormValue(model: BankModel) {
    let newModel = {
      BankId: model.BankId,
      Bank: model.Bank,
      Active: model.Active,
      // Abrv:model.Abrv,
    }
    return newModel;
  }

  useEffect(() => {
    if (bankId) {
      getBank(bankId);
      setErrors({});
    } else newUser();
  }, [bankId]);

  const getBank = (bankId: any) => {
    bankService.getById(bankId).then((response) => {
      if (response) {

        let result = response.data;
        setValues(setFormValue(result.data));
      }
    })
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {

      if (bankId) {
        bankService.put(values).then((response: any) => {
          let result = response.data;
          if (response) {
            globalService.success(result.message);
            navigate("/banks");
          } else {
            globalService.error(result.message);
          }
        });
      } else {
        bankService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;

            if (result.isSuccess) {
              globalService.success(result.message);
              resetForm();
              navigate("/banks");
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
        Bank
      </Typography>
      <form
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    inputProps={{maxLength: 100}}
                    label="Bank name"
                    fullWidth
                    autoComplete="given-name"
                    variant="standard"
                    name="Bank"
                    value={values.Bank}
                    onChange={handleInputChange}
                    {...(errors.Bank && {
                      error: true,
                      helperText: errors.Bank,
                    })}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={4}>
                  <TextField
                    // required
                    label="Abbreviation"
                    // required
                    inputProps={{maxLength: 10}}
                    fullWidth
                    autoComplete="given-name"
                    variant="standard"
                    name="Abrv"
                    value={values.Abrv}
                    onChange={handleInputChange}
                    {...(errors.Abrv && {
                      error: true,
                      helperText: errors.Abrv,
                    })}
                  />
                </Grid> */}
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
          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Stack spacing={2} direction="row">
              <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}>Submit</Button>
              <Button variant="outlined" startIcon={<ArrowBackIcon />} href="/banks">Back </Button>
            </Stack>

          </CardActions>
        </Card>
      </form>
    </>
  );
};

export default BankForm;