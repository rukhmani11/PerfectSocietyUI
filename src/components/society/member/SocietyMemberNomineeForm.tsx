import React, { useEffect, useState } from "react";
import {
  Grid,
  CardActions,
  Card,
  CardContent,
  Button,
  TextareaAutosize,
  Typography,
  Stack,
} from "@mui/material";
// import { societyMembersService } from "../../../services/SocietyMembersService";
import { SocietyMemberNomineesService } from "../../../services/SocietyMemberNomineesService";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../../services/GlobalService";
import useForm from "../../../utility/hooks/UseForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  SocietyMemberTitleModel,
  SocietyMembersModel,
} from "../../../models/SocietyMembersModel";
import { SocietyMemberNomineesModel } from "../../../models/SocietyMemberNomineesModel";
import Controls from "../../../utility/controls/Controls";
import { SelectListModel } from "../../../models/ApiResponse";
import { statesService } from "../../../services/StatesService";
import { RelationshipsService } from "../../../services/RelationshipsService";
import dayjs, { Dayjs } from "dayjs";
import { societyMembersService } from "../../../services/SocietyMembersService";
import { Messages, ROLES } from "../../../utility/Config";
import { AuthContext } from "../../../utility/context/AuthContext";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";

const SocietyMembersForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  const { societyMemberId, SocietyMemberNomineeId, societyId } = useParams();
  let navigate = useNavigate();
  const [states, setStates] = useState<SelectListModel[]>([]);
  const [Relationships, setRelationship] = useState<SelectListModel[]>([]);
  const [title, setTitle] = useState<any>({});
  const mode = SocietyMemberNomineeId ? 'Edit' : 'Create';
  const [value, setValue] = React.useState<Dayjs | null>(dayjs("2022-04-17"));
  const { goToHome } = useSharedNavigation();
  
  const validate = (fieldValues: SocietyMemberNomineesModel = values) => {
    let temp: any = { ...errors };
    if ("Name" in fieldValues)
      temp.Name = fieldValues.Name ? "" : "Name is required.";
    if ("RelationshipId" in fieldValues)
      temp.RelationshipId = fieldValues.RelationshipId
        ? ""
        : "Relationship is required.";

    if ("NominationPerc" in fieldValues)
      temp.NominationPerc = fieldValues.NominationPerc
        ? ""
        : "NominationPerc is required.";
    if ("PhoneNo" in fieldValues)
      temp.PhoneNo = fieldValues.PhoneNo
        ? fieldValues.PhoneNo.length < 10
          ? "Phone no should not be less then 10 characters"
          : ""
        : "";
    if ("OfficePhoneNo" in fieldValues)
      temp.OfficePhoneNo = fieldValues.OfficePhoneNo
        ? fieldValues.OfficePhoneNo.length < 10
          ? "Office phone no should not be less then 10 characters"
          : ""
        : "";
    if ("MobileNo" in fieldValues)
      temp.MobileNo = fieldValues.MobileNo
        ? fieldValues.MobileNo.length < 10
          ? "Mobile no should not be less then 10 characters"
          : ""
        : "";
    if ("EmailId" in fieldValues)
      temp.EmailId = fieldValues.EmailId
        ? (temp.EmailId =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            fieldValues.EmailId
          )
            ? ""
            : "Please enter a valid email Id")
        : "";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(
      SocietyMemberNomineesService.initialFieldValues,
      validate,
      SocietyMemberNomineeId
    );

  const newSocietyMember = () => {
    setValues(SocietyMemberNomineesService.initialFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: SocietyMemberNomineesModel) {
    let newModel = {
      SocietyMemberNomineeId: model.SocietyMemberNomineeId,
      SocietyMemberId: model.SocietyMemberId,
      Name: model.Name,
      RelationshipId: model.RelationshipId,
      BirthDate: model.BirthDate
        ? globalService.convertLocalToUTCDate(new Date(model.BirthDate))
        : null,
      RevocationDate: model.RevocationDate
        ? globalService.convertLocalToUTCDate(new Date(model.RevocationDate))
        : null,
      Mcmdate: model.Mcmdate
        ? globalService.convertLocalToUTCDate(new Date(model.Mcmdate))
        : null,
      NominationDate: model.NominationDate
        ? globalService.convertLocalToUTCDate(new Date(model.NominationDate))
        : null,
      Relationship: model.Relationship,
      Address: model.Address,
      City: model.City,
      Pin: model.Pin,
      StateId: model.StateId,
      CountryCode: model.CountryCode,
      PhoneNo: model.PhoneNo,
      OfficePhoneNo: model.OfficePhoneNo,
      MobileNo: model.MobileNo,
      EmailId: model.EmailId,
      NominationPerc: model.NominationPerc,
    };
    return newModel;
  }

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (states.length === 0) getStates();
    if (Relationships.length === 0) getRelationship();

    if (SocietyMemberNomineeId) {
      getScietyMember(SocietyMemberNomineeId);
    } else {
      newSocietyMember();
      setErrors({});
    }
    getMemberTitle();
  }, [SocietyMemberNomineeId]);

  const getStates = () => {
    statesService.getSelectList().then((response: any) => {
      setStates(response.data);
    });
  };

  const getRelationship = () => {
    RelationshipsService.getSelectList().then((response: any) => {
      setRelationship(response.data);
    });
  };

  const getScietyMember = (SocietyMemberNomineeId: any) => {
    SocietyMemberNomineesService.getById(SocietyMemberNomineeId).then(
      (response) => {
        if (response) {
          let result = response.data;
          setValues(setFormValue(result.data));
        }
      }
    );
  };
  const getMemberTitle = () => {
    let model: SocietyMemberTitleModel = {
      SocietyMemberId: societyMemberId,
      Member: "",
    };
    societyMembersService.getPageTitle(model).then((response) => {
      setTitle(response.data);
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (SocietyMemberNomineeId) {
        SocietyMemberNomineesService.put(values).then((response: any) => {
          let result = response.data;
          if (result.isSuccess) {
            resetForm();
            globalService.success(result.message);
            navigate(
              "/SocietyMemberNominees/" + societyMemberId + "/" + societyId
            );
          } else {
            globalService.error(result.message);
          }
        });
      } else {
        values.SocietyMemberId = societyMemberId;
        SocietyMemberNomineesService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              resetForm();
              navigate(
                "/SocietyMemberNominees/" + societyMemberId + "/" + societyId
              );
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
        <Typography variant="h5">{mode} Member Nominee</Typography>
        <Typography variant="body1"><b>Member : </b>{title.Member} </Typography>
      </Stack>
      <form
        //autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    label="Name"
                    name="Name"
                    value={values.Name}
                    onChange={handleInputChange}
                    error={errors.Name}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    label="Relationship"
                    name="RelationshipId"
                    value={
                      Relationships.length > 0 ? values.RelationshipId : ""
                    }
                    onChange={handleInputChange}
                    options={Relationships}
                    error={errors.RelationshipId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Other Relationship"
                    name="Relationship"
                    value={values.Relationship}
                    onChange={handleInputChange}
                    error={errors.Relationship}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="Birth Date"
                    value={values.BirthDate}
                    onChange={(date: Date) =>
                      handleInputChange({
                        target: {
                          value: globalService.convertLocalToUTCDate(date),
                          name: "BirthDate",
                        },
                      })
                    }
                    error={errors.BirthDate}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Address"
                    name="Address"
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
                    value={values.City}
                    onChange={handleInputChange}
                    error={errors.City}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    length={6}
                    label="PIN"
                    name="Pin"
                    value={values.Pin}
                    onChange={handleInputChange}
                    error={errors.Pin}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    label="States"
                    name="StateId"
                    value={states.length > 0 ? values.StateId : ""}
                    onChange={handleInputChange}
                    options={states}
                    error={errors.StateId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    length={10}
                    label="Phone no"
                    name="PhoneNo"
                    value={values.PhoneNo}
                    onChange={handleInputChange}
                    error={errors.PhoneNo}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    length={10}
                    label="Office phone no"
                    name="OfficePhoneNo"
                    value={values.OfficePhoneNo}
                    onChange={handleInputChange}
                    error={errors.OfficePhoneNo}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    length={10}
                    label="Mobile no"
                    name="MobileNo"
                    value={values.MobileNo}
                    onChange={handleInputChange}
                    error={errors.MobileNo}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Email id"
                    name="EmailId"
                    type="Email"
                    multiline
                    value={values.EmailId}
                    onChange={handleInputChange}
                    error={errors.EmailId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Nomination Perc"
                    name="NominationPerc"
                    required
                    multiline
                    value={values.NominationPerc}
                    onChange={handleInputChange}
                    error={errors.NominationPerc}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="Nomination Date"
                    value={values.NominationDate}
                    onChange={(date: Date) =>
                      handleInputChange({
                        target: {
                          value: globalService.convertLocalToUTCDate(date),
                          name: "NominationDate",
                        },
                      })
                    }
                    error={errors.BirthDate}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="Mcmd Date"
                    value={values.Mcmdate}
                    onChange={(date: Date) =>
                      handleInputChange({
                        target: { value: date, name: "Mcmdate" },
                      })
                    }
                    error={errors.BirthDate}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="Revocation Date"
                    value={values.RevocationDate}
                    onChange={(date: Date) =>
                      handleInputChange({
                        target: { value: date, name: "RevocationDate" },
                      })
                    }
                    error={errors.BirthDate}
                  />
                </Grid>
                <Grid item xs={12} sm={4}></Grid>
                <Grid item xs={12} sm={4}></Grid>
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
                onClick={() =>
                  navigate(
                    "/SocietyMemberNominees/" +
                    societyMemberId +
                    "/" +
                    societyId
                  )
                }
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

export default SocietyMembersForm;
