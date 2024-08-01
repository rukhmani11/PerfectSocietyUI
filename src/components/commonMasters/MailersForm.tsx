import React, { useEffect } from "react";
import { Grid, TextField, CardActions, Card, CardContent, Button, Typography, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BankModel } from "../../models/BankModel";
import Controls from "../../utility/controls/Controls";
import { mailerService } from "../../services/MailersService";
import { MailerModel } from "../../models/MailersModel";
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const MailersForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  globalService.pageTitle = "Mailers";
  const { mailerId } = useParams();
  let navigate = useNavigate();

  const validate = (fieldValues = values) => {
    let temp: any = { ...errors };
    if ("MailType" in fieldValues)
      temp.MailType = fieldValues.MailType ? "" : "Mail type is required.";
    if ("Subject" in fieldValues)
      temp.Subject = fieldValues.Subject ? "" : "Subject is required.";
    if ("Message" in fieldValues)
      temp.Message = fieldValues.Message ? "" : "Message is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(mailerService.initialFieldValues, validate, props.setCurrentId);

  const newUser = () => {
    setValues(mailerService.initialFieldValues);
  };
  //This is used since in get the null property is not returned
  function setFormValue(model: MailerModel) {
    let newModel = {
        MailerId:model.MailerId,
        MailType:model.MailType,
        Subject:model.Subject,
        MailTo:model.MailTo,
        MailCc:model.MailCc,
        Message:model.Message,
        Attachment:model.Attachment,
    }
    return newModel;
  }

  useEffect(() => {
    if (mailerId) {
      getMailer(mailerId);
      setErrors({});
    } else newUser();
  }, [mailerId]);

  const getMailer = (mailerId: any) => {
    mailerService.getById(mailerId).then((response) => {
      if (response) {
        let result = response.data;
        setValues(setFormValue(result.data));
      }
    })
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (mailerId) {
        mailerService.put(values).then((response: any) => {
          let result = response.data;
          if (response) {
            globalService.success(result.message);
            navigate("/mailers");
          } else {
            globalService.error(result.message);
          }
        });
      } else {
        mailerService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              resetForm();
              navigate("/mailers");
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
        Mailer
      </Typography>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    label="Mail Type"
                    name="MailType"
                    value={values.MailType}
                    onChange={handleInputChange}
                    error={errors.MailType}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Controls.Input
                    required
                    label="Subject"
                    name="Subject"
                    value={values.Subject}
                    onChange={handleInputChange}
                    error={errors.Subject}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Mail To"
                    name="MailTo"
                    value={values.MailTo}
                    onChange={handleInputChange}
                    error={errors.MailTo}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="MailCc"
                    name="MailCc"
                    value={values.MailCc}
                    onChange={handleInputChange}
                    error={errors.MailCc}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controls.Input
                    required
                    multiline
                    rows="10"
                    label="Message"
                    name="Message"
                    value={values.Message}
                    onChange={handleInputChange}
                    error={errors.Message}
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
                href="/mailers"
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

export default MailersForm;