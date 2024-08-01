import React, { useContext, useEffect, useState } from "react";
import { Grid, CardActions, Card, CardContent, Button, Typography, Stack } from "@mui/material";
import { societiesService } from "../../services/SocietiesService";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Controls from "../../utility/controls/Controls";
import { AuthContext } from "../../utility/context/AuthContext";
import { SocietiesModel, SocietyParameterModel } from "../../models/SocietiesModel";
import { SelectListModel } from "../../models/ApiResponse";
import { acHeadsService } from "../../services/AcHeadsService";
import { ROLES } from "../../utility/Config";

const ParametersForm = (...props: any) => {
  const { auth } = useContext(AuthContext);
  const { societyId } = useParams();
  const AccountPosting = globalService.getAccountPostings();
  const [acHeads, setAcHeads] = useState<SelectListModel[]>([]);

  let navigate = useNavigate();

  const validate = (fieldValues = values) => {
    let temp: any = { ...errors };

    // if ("Uomid" in fieldValues)
    //   temp.Uomid = fieldValues.Uomid ? "" : "Uoms is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(societiesService.initialParameterFieldValues, validate, societyId);

  const newUser = () => {
    setValues(societiesService.initialParameterFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: SocietyParameterModel) {
    let newModel = {
      SocietyId: model.SocietyId,
      AccountPosting: model.AccountPosting,
      MemberAcHeadId: model.MemberAcHeadId || "",
      TaxApplicable: model.TaxApplicable,
      // Society: model.Society,
      // Abbreviation: model.Abbreviation || "",
      // RegistrationNo: model.RegistrationNo || "",
      // RegistrationDate:model.RegistrationDate? globalService.convertLocalToUTCDate(new Date(model.RegistrationDate)):null,
      // Address: model.Address || "",
      // City: model.City || "",
      // Pin: model.Pin || "",
      // StateId: model.StateId || "",
      // CountryCode: model.CountryCode || "",
      // ContactPerson: model.ContactPerson || "",
      // Phone: model.Phone || "",
      // Mobile: model.Mobile || "",
      // Builder: model.Builder || "",
      // Architect: model.Architect || "",
      // Signatory: model.Signatory || "",
      // Pan: model.Pan || "",
      // Tan: model.Tan || "",
      // TaxRegistrationNo: model.TaxRegistrationNo || "",
      // Capital: model.Capital || "",
      // //UNoOfMembers: model.UNoOfMembers,
      // Uomid: model.Uomid,
      // TransferFeeAcHeadId: model.TransferFeeAcHeadId || "",
      // UMinDate: model.UMinDate?globalService.convertLocalToUTCDate(new Date(model.UMinDate)):null,
      // UMaxDate: model.UMaxDate?globalService.convertLocalToUTCDate(new Date(model.UMaxDate)):null,
      // SubscriberId: model.SubscriberId || "",
      // Active: model.Active || false,
      // Sms: model.Sms||'',
      // EmailId: model.EmailId || "",
      //ShowParticularsInReceipt: model.ShowParticularsInReceipt,
    };
    return newModel;
  }

  useEffect(() => {
    if (acHeads.length === 0)
      getAcHeadsForSociety();
    if (societyId) {
      getSocieties(societyId);
      setErrors({});
    }
    else newUser();
  }, [societyId]);

  const getSocieties = (SocietyId: any) => {
    societiesService.getById(SocietyId).then((response) => {
      if (response) {
        let result = response.data;
        setValues(setFormValue(result.data));
        values.AcHeadId = response.data[0].Value;
      }
    })
  };

  const getAcHeadsForSociety = () => {
    acHeadsService
      .getSelectListBySocietyIDNature(societyId, 'D')
      .then((response) => {
        setAcHeads(response.data);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (societyId) {
        societiesService.EditParametersDetails(values).then((response: any) => {
          let result = response.data;
          if (response) {
            globalService.success(result.message)

          } else {
            globalService.error(result.message)
          }
        });
      }
    }
  };

  return (
    <>
      <Typography variant="h5" align="center">
        Parameters Details
      </Typography>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    label="Account posting"
                    name="Accountposting"
                    value={AccountPosting.length > 0 ? values.Accountposting : ''}
                    onChange={handleInputChange}
                    options={AccountPosting}
                    error={errors.Accountposting}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    name="AcHeadId"
                    label=" Member AcHead"
                    required
                    value={acHeads.length > 0 ? values.AcHeadId : ''}
                    onChange={handleInputChange}
                    options={acHeads}
                    error={errors.AcHeadId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    name="TaxApplicable"
                    label="GST Applicable ?"
                    value={values.TaxApplicable}
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
                onClick={() => navigate(-1)}
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

export default ParametersForm;