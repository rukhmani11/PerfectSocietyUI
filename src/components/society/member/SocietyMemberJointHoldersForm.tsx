import React, { useEffect, useState } from "react";
import { Grid, CardActions, Card, CardContent, Button, Typography, Stack, } from "@mui/material";
import { societyMemberJointHoldersService } from "../../../services/SocietyMemberJointHoldersService";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../../services/GlobalService";
import useForm from "../../../utility/hooks/UseForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SocietyMemberTitleModel, SocietyMembersModel } from "../../../models/SocietyMembersModel";
import Controls from "../../../utility/controls/Controls";
import { SelectListModel } from "../../../models/ApiResponse";
import { statesService } from "../../../services/StatesService";
import { memberClassesService } from "../../../services/MemberClassesService";
import { SocietyMemberJointHoldersModel } from "../../../models/SocietyMemberJointHoldersModel";
import { societyMembersService } from "../../../services/SocietyMembersService";
import { Messages, ROLES } from "../../../utility/Config";
import { AuthContext } from "../../../utility/context/AuthContext";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";

const SocietyMemberJointHoldersForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  const { societyMemberId, societyMemberJointHolderId, societyId } = useParams();
  let navigate = useNavigate();
  const [states, setStates] = useState<SelectListModel[]>([]);
  const [memberClasses, setMemberClasses] = useState<SelectListModel[]>([]);
  const [title, setTitle] = useState<any>({});
  const mode = societyMemberJointHolderId ? 'Edit' : 'Create';
  const { goToHome } = useSharedNavigation();
  
  const validate = (fieldValues: SocietyMembersModel = values) => {
    let temp: any = { ...errors };
    if ("Name" in fieldValues)
      temp.Name = fieldValues.Name ? "" : "Name is required.";
    if ("MemberClassId" in fieldValues)
      temp.MemberClassId = fieldValues.MemberClassId ? "" : "Member Class is required.";
    if ("MobileNo" in fieldValues)
      temp.MobileNo = fieldValues.MobileNo ? fieldValues.MobileNo.length < 10 ? "Mobile no should not be less then 10 characters" : "" : "";
    if ("PhoneNo" in fieldValues)
      temp.PhoneNo = fieldValues.PhoneNo ? fieldValues.PhoneNo.length < 10 ? "Phone no should not be less then 10 characters" : "" : "";
    if ("OfficePhoneNo" in fieldValues)
      temp.OfficePhoneNo = fieldValues.OfficePhoneNo ? fieldValues.OfficePhoneNo.length < 10 ? "Office phone no should not be less then 10 characters" : "" : "";
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
      societyMemberJointHoldersService.initialFieldValues,
      validate,
      societyMemberJointHolderId
    );

  const newSocietyMember = () => {
    setValues(societyMemberJointHoldersService.initialFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: SocietyMemberJointHoldersModel) {
    let newModel = {
      SocietyMemberJointHolderId: model.SocietyMemberJointHolderId,
      SocietyMemberId: model.SocietyMemberId,
      MemberClassId: model.MemberClassId,
      Name: model.Name,
      StartDate: model.StartDate ? globalService.convertLocalToUTCDate(new Date(model.StartDate)) : null,
      EndDate: model.EndDate ? globalService.convertLocalToUTCDate(new Date(model.EndDate)) : null,
      EnteranceFeePaidOn: model.EnteranceFeePaidOn ? globalService.convertLocalToUTCDate(new Date(model.EnteranceFeePaidOn)) : null,
      Address: model.Address || '',
      City: model.City || '',
      Pin: model.Pin || '',
      StateId: model.StateId || '',
      CountryCode: model.CountryCode || '',
      PhoneNo: model.PhoneNo || '',
      OfficePhoneNo: model.OfficePhoneNo || '',
      MobileNo: model.MobileNo || '',
      EmailId: model.EmailId || '',
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

    if (societyMemberJointHolderId) {
      getScietyMemberJointHolder(societyMemberJointHolderId);
    } else {
      newSocietyMember();
      setErrors({});
    } getMemberTitle();
  }, [societyMemberJointHolderId]);

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

  const getScietyMemberJointHolder = (societyMemberJointHolderId: any) => {
    societyMemberJointHoldersService
      .getById(societyMemberJointHolderId)
      .then((response) => {

        if (response) {
          let result = response.data;
          setValues(setFormValue(result.data));
        }
      })
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
      if (societyMemberJointHolderId) {
        societyMemberJointHoldersService.put(values).then((response: any) => {
          let result = response.data;
          if (result.isSuccess) {
            resetForm();
            globalService.success(result.message);
            navigate("/societyMemberJointHolders/" + societyMemberId + '/' + societyId);
          } else {
            globalService.error(result.message);
          }
        });
      } else {

        values.SocietyMemberId = societyMemberId;
        societyMemberJointHoldersService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              resetForm();
              navigate("/societyMemberJointHolders/" + societyMemberId + '/' + societyId);
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
        <Typography variant="h5">{mode} Society Member Joint Holder</Typography>
        <Typography variant="body1"><b>Member : </b>{title.Member} </Typography>
      </Stack>
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
                    label="Member Class"
                    name="MemberClassId"
                    value={memberClasses.length > 0 ? values.MemberClassId : ""}
                    onChange={handleInputChange}
                    options={memberClasses}
                    error={errors.MemberClassId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="Start Date"
                    value={values.StartDate}
                    onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'StartDate' } })}
                    error={errors.StartDate}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="End Date"
                    value={values.EndDate}
                    onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'EndDate' } })}
                    error={errors.EndDate}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="Enterance Fee Paid On"
                    value={values.EnteranceFeePaidOn}
                    onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'EnteranceFeePaidOn' } })}
                    error={errors.EnteranceFeePaidOn}
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
                    label="Mobile No"
                    name="MobileNo"
                    value={values.MobileNo}
                    onChange={handleInputChange}
                    error={errors.MobileNo}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Email Id"
                    name="EmailId"
                    value={values.EmailId}
                    onChange={handleInputChange}
                    error={errors.EmailId}
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
                    "/societyMemberJointHolders/" + societyMemberId + "/" + societyId
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

export default SocietyMemberJointHoldersForm;
