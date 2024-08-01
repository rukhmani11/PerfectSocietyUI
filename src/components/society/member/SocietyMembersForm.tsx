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
import { societyMembersService } from "../../../services/SocietyMembersService";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../../services/GlobalService";
import useForm from "../../../utility/hooks/UseForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SocietyMembersModel } from "../../../models/SocietyMembersModel";
import Controls from "../../../utility/controls/Controls";
import { SelectListModel } from "../../../models/ApiResponse";
import { statesService } from "../../../services/StatesService";
import { memberClassesService } from "../../../services/MemberClassesService";
import { occupationsService } from "../../../services/OccupationsService";
import dayjs, { Dayjs } from "dayjs";
import { Messages, ROLES } from "../../../utility/Config";
import { AuthContext } from "../../../utility/context/AuthContext";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";

const SocietyMembersForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  const { societyId, societyMemberId } = useParams();
  let navigate = useNavigate();
  const [states, setStates] = useState<SelectListModel[]>([]);
  const [memberClasses, setMemberClasses] = useState<SelectListModel[]>([]);
  const [occupations, setOccupations] = useState<SelectListModel[]>([]);
  const { goToHome } = useSharedNavigation();
  const [value, setValue] = React.useState<Dayjs | null>(dayjs("2022-04-17"));

  const validate = (fieldValues: SocietyMembersModel = values) => {
    let temp: any = { ...errors };
    if ("FolioNo" in fieldValues)
      temp.FolioNo = fieldValues.FolioNo ? "" : "Folio No is required.";
    if ("Member" in fieldValues)
      temp.Member = fieldValues.Member ? "" : "Member is required.";
    if ("MemberClassId" in fieldValues)
      temp.MemberClassId = fieldValues.MemberClassId ? "" : "Member class is required.";
    if ("PhoneNo" in fieldValues)
      temp.PhoneNo = fieldValues.PhoneNo ? fieldValues.PhoneNo.length < 10 ? "Phone no should not be less then 10 characters" : "" : "";
    if ("HomePhoneNo" in fieldValues)
      temp.HomePhoneNo = fieldValues.HomePhoneNo ? fieldValues.HomePhoneNo.length < 10 ? "Home phone no should not be less then 10 characters" : "" : "";
    if ("OfficePhoneNo" in fieldValues)
      temp.OfficePhoneNo = fieldValues.OfficePhoneNo ? fieldValues.OfficePhoneNo.length < 10 ? "Office phone no should not be less then 10 characters" : "" : "";
    if ("MobileNo" in fieldValues)
      temp.MobileNo = fieldValues.MobileNo ? fieldValues.MobileNo.length < 10 ? "Mobile no should not be less then 10 characters" : "" : "";
    if ("EmailId" in fieldValues)
      temp.EmailId = fieldValues.EmailId ? (temp.EmailId = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(fieldValues.EmailId) ? "" : "Please enter a valid email Id") : "";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(
      societyMembersService.initialFieldValues,
      validate,
      societyMemberId
    );

  const newSocietyMember = () => {
    setValues(societyMembersService.initialFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: SocietyMembersModel) {
    let newModel = {
      SocietyMemberId: model.SocietyMemberId,
      SocietyId: model.SocietyId,
      FolioNo: model.FolioNo,
      Member: model.Member,
      MemberClassId: model.MemberClassId,
      ContactPerson: model.ContactPerson,
      Address: model.Address,
      City: model.City,
      Pin: model.Pin,
      StateId: model.StateId,
      CountryCode: model.CountryCode,
      PhoneNo: model.PhoneNo,
      HomePhoneNo: model.HomePhoneNo,
      OfficePhoneNo: model.OfficePhoneNo,
      MobileNo: model.MobileNo,
      OccupationId: model.OccupationId,
      Occupation: model.Occupation,
      LoanFrom: model.LoanFrom,
      LoanClearedOn: model.LoanClearedOn,
      FourWheelers: model.FourWheelers,
      TwoWheelers: model.TwoWheelers,
      EmailId: model.EmailId,
      GstNo: model.GstNo,
      IsCommitteeMember: model.IsCommitteeMember,
    };
    return newModel;
  }

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (states.length === 0) getStates();
    if (states.length === 0) getMemberClasses();
    if (states.length === 0) getOccupations();

    if (societyMemberId) {
      getScietyMember(societyMemberId);
    } else {
      newSocietyMember();
      setErrors({});
    }
  }, [societyMemberId]);

  const getStates = () => {
    statesService.getSelectList().then((response: any) => {
      setStates(response.data);
    });
  };
  const getMemberClasses = () => {
    memberClassesService.getSelectList().then((response: any) => {
      setMemberClasses(response.data);
    });
  };
  const getOccupations = () => {
    occupationsService.getSelectList().then((response: any) => {
      setOccupations(response.data);
    });
  };

  const getScietyMember = (societyMemberId: any) => {
    societyMembersService
      .getById(societyMemberId)
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
      if (societyMemberId) {

        societyMembersService.put(values).then((response: any) => {
          let result = response.data;
          if (result.isSuccess) {
            resetForm();
            globalService.success(result.message);
            navigate("/societyMembers/" + societyId);
          } else {
            globalService.error(result.message);
          }

        });
      } else {
        values.SocietyId = societyId;
        societyMembersService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              resetForm();
              navigate("/societyMembers/" + societyId);
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
        Member Detail
      </Typography>
      <form
        autoComplete="off"
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
                    label="Folio no"
                    name="FolioNo"
                    value={values.FolioNo}
                    onChange={handleInputChange}
                    error={errors.FolioNo}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Member name"
                    name="Member"
                    value={values.Member}
                    onChange={handleInputChange}
                    error={errors.Member}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    label="Member Class"
                    name="MemberClassId"
                    value={memberClasses.length > 0 ? values.MemberClassId : ""}
                    onChange={handleInputChange}
                    options={memberClasses}
                    error={errors.MemberClassId}
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
                    label="Gst no"
                    name="GstNo"
                    value={values.GstNo}
                    onChange={handleInputChange}
                    error={errors.GstNo}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Contact person"
                    name="ContactPerson"
                    value={values.ContactPerson}
                    onChange={handleInputChange}
                    error={errors.ContactPerson}
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
                    type="number"
                    value={values.Pin}
                    onChange={handleInputChange}
                    error={errors.Pin}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    label="States"
                    showEmptyItem={false}
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
                    label="Home phone no"
                    name="HomePhoneNo"
                    value={values.HomePhoneNo}
                    onChange={handleInputChange}
                    error={errors.HomePhoneNo}
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
                  <Controls.Select
                    showEmptyItem={false}
                    label="Occupations"
                    name="OccupationId"
                    value={occupations.length > 0 ? values.OccupationId : ""}
                    onChange={handleInputChange}
                    options={occupations}
                    error={errors.StateId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Other occupation"
                    name="Occupation"
                    value={values.Occupation}
                    onChange={handleInputChange}
                    error={errors.Occupation}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Loan from"
                    name="LoanFrom"
                    value={values.LoanFrom}
                    onChange={handleInputChange}
                    error={errors.LoanFrom}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        label="Loan cleared on"
                        //value={values.LoanClearedOn}
                        onChange={(newValue: any) => setValue(newValue)}
                      />
                    </DemoContainer>
                  </LocalizationProvider> */}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Four wheelers"
                    name="FourWheelers"
                    type="number"
                    value={values.FourWheelers}
                    onChange={handleInputChange}
                    error={errors.FourWheelers}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Two wheelers"
                    name="TwoWheelers"
                    type="number"
                    value={values.TwoWheelers}
                    onChange={handleInputChange}
                    error={errors.TwoWheelers}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    name="IsCommitteeMember"
                    label="Is Committee Member"
                    value={values.IsCommitteeMember}
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
                onClick={() =>
                  navigate(
                    "/societyMembers/" + societyId
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
