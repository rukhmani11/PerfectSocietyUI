import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  CardActions,
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
  Stack,
  TextareaAutosize,
  IconButton,
} from "@mui/material";
import ConfirmDialog from "../helper/ConfirmDialog";
import { societiesService } from "../../services/SocietiesService";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Controls from "../../utility/controls/Controls";
import { statesService } from "../../services/StatesService";
import { uomsService } from "../../services/UomsService";
import { SelectListModel } from "../../models/ApiResponse";
import { SocietiesModel } from "../../models/SocietiesModel";
import dayjs, { Dayjs } from "dayjs";
import { AuthContext } from "../../utility/context/AuthContext";
import { ROLES } from "../../utility/Config";
import { countriesService } from "../../services/CountriesService";
import DeleteIcon from "@mui/icons-material/Delete";
import { FolderPath, config } from "../../utility/Config";
import { appInfoService } from "../../services/AppInfoService";


const SocietiesForm = (...props: any) => {
  const { auth } = useContext(AuthContext);
  let isSubscriber = auth.Roles?.some((x) => x === ROLES.Subscriber)
    ? true
    : false;
  let isAdmin = auth.Roles?.some(x => x === ROLES.Admin) ? true : false;
  globalService.pageTitle = "Societies";
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => { },
  });
  const { societyId } = useParams();
  const [states, setStates] = useState<SelectListModel[]>([]);
  const [countries, setCountries] = useState<SelectListModel[]>([]);
  const [QrcodeImage, setQrcodeImage] = useState<File | null>(null);
  //const [QrcodeAppInfo,setQrcodeAppInfo]=useState(false);
  const [UPIpayAppInfo, setUPIpayAppInfo] = useState(false);
  const [QrcodeIsVisible, setQrcodeIsVisible] = useState(false);
  const [ssDocsIntegrationInAppInfo, setSSDocsIntegrationInAppInfo] = useState(false);
  const [multiLingualInAppInfo, setMultiLingualInAppInfo] = useState(false);
  //const [uoms, setUoms] = useState<SelectListModel[]>([]);

  // const AccountPosting = [
  //   { Value: 'S', Text: 'Summary' },
  //   { Value: 'N', Text: 'Details' },
  // ];
  // {Value:'D',Text:'Details'},
  let navigate = useNavigate();

  const validate = (fieldValues = values) => {
    let temp: any = { ...errors };
    if ("Society" in fieldValues)
      temp.Society = fieldValues.Society ? "" : "Society name is required.";

    // if ("Uomid" in fieldValues)
    //   temp.Uomid = fieldValues.Uomid ? "" : "Uoms is required.";
    // if ("AccountPosting" in fieldValues)
    //   temp.AccountPosting = fieldValues.AccountPosting ? "" : "Account Posting is required.";
    // if ("UNoOfMembers" in fieldValues)
    //   temp.UNoOfMembers = fieldValues.UNoOfMembers ? "" : "No of members is required.";
    if ("Abbreviation" in fieldValues)
      temp.Abbreviation = fieldValues.Abbreviation ? (fieldValues.Abbreviation.length > 5 ? "Abbreviation should be <= 5 characters" : "") : "";
    // if ("RegistrationNo" in fieldValues)
    //   temp.RegistrationNo = fieldValues.RegistrationNo ? "" : "Registration no is required.";
    // if ("CountryCode" in fieldValues)
    //   temp.CountryCode = fieldValues.CountryCode ? "" : "Country Code is required.";
    // if ("Address" in fieldValues)
    //   temp.Address = fieldValues.Address ? "" : "Address is required.";
    //  if ("Pin" in fieldValues)
    //    temp.Pin = fieldValues.Pin ? (fieldValues.Pin.length > 6 ? "Pin should not be more than 6 characters" : ""):"";
    if ("Mobile" in fieldValues)
      temp.Mobile = fieldValues.Mobile
        ? fieldValues.Mobile.length < 10
          ? "Mobile should not be less then 10 characters"
          : ""
        : "";
    if ("Phone" in fieldValues)
      temp.Phone = fieldValues.Phone
        ? fieldValues.Phone.length < 10
          ? "Phone should not be less then 10 characters"
          : ""
        : "";
    // if ("StateId" in fieldValues) check github
    //   temp.StateId = fieldValues.StateId ? "" : "State is required.";
    if ("EmailId" in fieldValues) {
      // temp.EmailId = fieldValues.EmailId ? (temp.EmailId = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(fieldValues.EmailId)
      temp.EmailId = fieldValues.EmailId
        ? (temp.EmailId =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            fieldValues.EmailId
          )
            ? ""
            : "Please enter a valid email Id")
        : "";
    }

    if ("ShortName" in fieldValues) {
      temp.ShortName = fieldValues.ShortName ? fieldValues.ShortName.length > 15 ? " ShortName should be less then equal to 15 characters" : "" : "";
    }
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(societiesService.initialFieldValues, validate, societyId);

  const newUser = () => {
    setValues(societiesService.initialFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: SocietiesModel) {
    let newModel = {
      SocietyId: model.SocietyId,
      Society: model.Society || "",
      Abbreviation: model.Abbreviation || "",
      ShortName: model.ShortName || "",
      RegistrationNo: model.RegistrationNo || "",
      RegistrationDate: model.RegistrationDate
        ? globalService.convertLocalToUTCDate(new Date(model.RegistrationDate))
        : "",
      Address: model.Address || "",
      City: model.City || "",
      Pin: model.Pin || "",
      StateId: model.StateId || "",
      CountryCode: model.CountryCode || "",
      ContactPerson: model.ContactPerson || "",
      Phone: model.Phone || "",
      Mobile: model.Mobile || "",
      Builder: model.Builder || "",
      Architect: model.Architect || "",
      Signatory: model.Signatory || "",
      Pan: model.Pan || "",
      Tan: model.Tan || "",
      TaxRegistrationNo: model.TaxRegistrationNo || "",
      Capital: model.Capital || "",
      // UNoOfMembers: model.UNoOfMembers,
      Uomid: model.Uomid,
      // AccountPosting: model.AccountPosting ,
      MemberAcHeadId: model.MemberAcHeadId || "",
      TransferFeeAcHeadId: model.TransferFeeAcHeadId || "",
      UMinDate: model.UMinDate
        ? globalService.convertLocalToUTCDate(new Date(model.UMinDate))
        : "",
      UMaxDate: model.UMaxDate
        ? globalService.convertLocalToUTCDate(new Date(model.UMaxDate))
        : "",
      SubscriberId: model.SubscriberId || "",
      Active: model.Active || false,
      //Sms: model.Sms || "",
      EnableSms: model.EnableSms || false,
      EnableEmail: model.EnableEmail || false,
      EnablePaymentGateway: model.EnablePaymentGateway || false,
      EmailId: model.EmailId || "",
      EnableSsdocsIntegration: model.EnableSsdocsIntegration || false,
      EnableMultilingual: model.EnableMultilingual || false,
      //TaxApplicable: model.TaxApplicable,
      ShowParticularsInReceipt: model.ShowParticularsInReceipt || false,
      RazorPayMerchantId: model.RazorPayMerchantId || "",
      RazorPayTestApikeyId: model.RazorPayTestApikeyId || "",
      RazorPayTestKeySecret: model.RazorPayTestKeySecret || "",
      RazorPayLiveapikeyId: model.RazorPayLiveapikeyId || "",
      RazorPayLivekeySecret: model.RazorPayLivekeySecret || "",
      QrcodeImageName: model.QrcodeImageName || "",
      Upipay: model.Upipay || "",
      EaseBuzzSubMerchantId: model.EaseBuzzSubMerchantId || "",
    };
    return newModel;
  }
  useEffect(() => {
    if (states.length === 0) getStates();
    if (countries.length === 0) getCountries();
    getAllAppinfo();
    getAppInfo();
    //if (uoms.length === 0) getUoms();
    if (societyId) {
      getSocieties(societyId);
      setErrors({});
    } else newUser();
  }, [societyId]);

  const getCountries = () => {
    countriesService.getSelectList().then((response) => {
      setCountries(response.data);
      if (response.data.length > 0) values.CountryCode = response.data[0].Value;
    });
  };

  const getStates = () => {
    statesService.getSelectList().then((response: any) => {
      setStates(response.data);
    });
  };

  const getAllAppinfo = () => {
    appInfoService.getAppInfo().then((response) => {
      let result = response.data;
      setUPIpayAppInfo(result.row.FlagInfo.UPIPay)
    })
  }
  // const getUoms = () => {
  //   uomsService.getSelectList().then((response: any) => {
  //     setUoms(response.data);
  //   });
  // };
  const getSocieties = (SocietyId: any) => {
    societiesService.getById(SocietyId).then((response) => {
      if (response) {
        let result = response.data;
        setValues(setFormValue(result.data));
      }
    });
  };

  const onFilechange = (fileInput: any) => {
    const selectFile = fileInput.target.files[0];
    if (selectFile.size <= 200 * 1024) {
      setQrcodeImage(selectFile);
    } else {
      globalService.error("File size must be 200kb or less")
    }
  }

  const deleteQRCode = () => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    values.QrcodeImageName = null;
    setQrcodeIsVisible(true)
    setQrcodeImage(null);
    societiesService.deleteQRImage(societyId).then((response) => {
      if (response) {
        let result = response.data;
        if (result.isSuccess)
          globalService.success(result.message);
        else
          globalService.error(result.message);
      }
    });
  }

  const getAppInfo = () => {
    appInfoService.getAppInfo().then((response) => {
      setSSDocsIntegrationInAppInfo(response.data.row.FlagInfo?.SSDocsIntegration);
      setMultiLingualInAppInfo(response.data.row.FlagInfo?.MultiLingual)
    });
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {

      if (societyId) {

        societiesService.put(values, QrcodeImage).then((response: any) => {
          let result = response.data;
          //result.RegistrationNo.length > 0 ? result.RegistrationNo : null;
          if (response) {
            globalService.success(result.message);
            navigate(-1);
          } else {
            globalService.error(result.message);
          }
        });
      } else {
        societiesService.post(values, QrcodeImage).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              resetForm();
              navigate(-1);
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
        Society
      </Typography>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Society"
                    required
                    name="Society"
                    value={values.Society}
                    onChange={handleInputChange}
                    error={errors.Society}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="Abbreviation"
                    label="Abbreviation"
                    value={values.Abbreviation}
                    onChange={handleInputChange}
                    error={errors.Abbreviation}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="ShortName"
                    label="Short Name"
                    value={values.ShortName}
                    onChange={handleInputChange}
                    error={errors.ShortName}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Registration no"
                    name="RegistrationNo"
                    value={values.RegistrationNo}
                    onChange={handleInputChange}
                    error={errors.RegistrationNo}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="Registration date"
                    value={values.RegistrationDate}
                    onChange={(date: Date) =>
                      handleInputChange({
                        target: {
                          value: globalService.convertLocalToUTCDate(date),
                          name: "RegistrationDate",
                        },
                      })
                    }
                    error={errors.RegistrationDate}
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
                  <Controls.Select
                    showEmptyItem={false}
                    label="State"
                    name="StateId"
                    value={states.length > 0 ? values.StateId : ""}
                    onChange={handleInputChange}
                    options={states}
                    error={errors.StateId}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="City"
                    name="City"
                    value={values.City}
                    onChange={handleInputChange}
                    error={errors.City}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="Pin"
                    label="Pin"
                    length={6}
                    value={values.Pin}
                    onChange={handleInputChange}
                    error={errors.Pin}
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
                    label="Phone"
                    length={10}
                    name="Phone"
                    value={values.Phone}
                    onChange={handleInputChange}
                    error={errors.Phone}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Mobile"
                    name="Mobile"
                    length={10}
                    value={values.Mobile}
                    onChange={handleInputChange}
                    error={errors.Mobile}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    floatinglabeltext="email"
                    type="email"
                    label="Email Id"
                    name="EmailId"
                    value={values.EmailId}
                    onChange={handleInputChange}
                    error={errors.EmailId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Builder"
                    name="Builder"
                    value={values.Builder}
                    onChange={handleInputChange}
                    error={errors.Builder}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Architect"
                    name="Architect"
                    value={values.Architect}
                    onChange={handleInputChange}
                    error={errors.Architect}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Signatory"
                    name="Signatory"
                    value={values.Signatory}
                    onChange={handleInputChange}
                    error={errors.Signatory}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Pan"
                    name="Pan"
                    value={values.Pan}
                    onChange={handleInputChange}
                    error={errors.Pan}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Tan"
                    name="Tan"
                    value={values.Tan}
                    onChange={handleInputChange}
                    error={errors.Tan}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="GST"
                    name="TaxRegistrationNo"
                    value={values.TaxRegistrationNo}
                    onChange={handleInputChange}
                    error={errors.TaxRegistrationNo}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="Capital"
                    label="Capital"
                    value={values.Capital}
                    onChange={handleInputChange}
                    error={errors.Capital}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={4}>
                  <Controls.Input
                    defaultValue=''
                    name="uNoOfMembers"
                    label="uNoOfMembers"
                    value={values.uNoOfMembers}
                    onChange={handleInputChange}
                    error={errors.uNoOfMembers}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                  showEmptyItem={false}
                    required
                    label="Uom"
                    name="Uomid"
                    value={uoms.length > 0 ? values.Uomid : ""}
                    onChange={handleInputChange}
                    options={uoms}
                    error={errors.Uomid}
                  />
                </Grid>
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
                </Grid> */}

                {/* 
                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="Uman date"
                    value={values.UManDate}
                    onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'UManDate' } })}
                    error={errors.UManDate}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="Umin date"
                    value={values.UMinDate}
                    onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'UMinDate' } })}
                    error={errors.UMinDate}
                  />
                </Grid> */}

                {/* <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    name="Active"
                    label="Active"
                    disabled={isSubscriber ? true : false}
                    value={values.Active}
                    onChange={handleInputChange}
                  />
                </Grid> */}

                {/* <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    name="Sms"
                    label="Sms"
                    value={values.Sms}
                    onChange={handleInputChange}
                  />
                </Grid> */}
                <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    label="Show particulars in receipt"
                    name="ShowParticularsInReceipt"
                    value={values.ShowParticularsInReceipt}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </React.Fragment>
          </CardContent>
        </Card>
        {isAdmin &&
          <Grid>
            {/* <Typography align="center" marginTop={3}> Additional Services</Typography> */}
            <Card sx={{ marginTop: '3px' }}>
              <CardHeader title="Additional Services" sx={{ textAlign: "center" }} />
              <CardContent>
                <React.Fragment>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Controls.Checkbox
                        label="Enable SMS"
                        name="EnableSms"
                        value={values.EnableSms}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controls.Checkbox
                        label="Enable Email"
                        name="EnableEmail"
                        value={values.EnableEmail}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controls.Checkbox
                        label="Enable Payment Gateway"
                        name="EnablePaymentGateway"
                        value={values.EnablePaymentGateway}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    {ssDocsIntegrationInAppInfo && (
                      <Grid item xs={12} sm={4}>
                        <Controls.Checkbox
                          label="Enable SSDocs Integration"
                          name="EnableSsdocsIntegration"
                          value={values.EnableSsdocsIntegration}
                          onChange={handleInputChange}
                        />
                      </Grid>
                    )}
                    {multiLingualInAppInfo && (
                      <Grid item xs={12} sm={4}>
                        <Controls.Checkbox
                          label="Enable MultiLingual"
                          name="EnableMultilingual"
                          value={values.EnableMultilingual}
                          onChange={handleInputChange}
                        />
                      </Grid>
                    )}
                    {UPIpayAppInfo &&
                      <>
                        <Grid item xs={12} sm={4}>
                          <Controls.Input
                            name="Upipay"
                            label="UPI Pay"
                            value={values.Upipay}
                            onChange={handleInputChange}
                            error={errors.Upipay}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography style={{ color: 'red', fontSize: '0.75rem' }}> File should be less then equal to 200kb</Typography>
                          <Button variant="contained" component="label">
                            Upload QR code Image
                            <input type="file" accept="image/*" onChange={(event: any) => { onFilechange(event); }} hidden />
                          </Button>
                          {values.QrcodeImageName && <>
                            <IconButton aria-label="delete" size="medium" color="error"
                              onClick={() => {

                                setConfirmDialog({
                                  isOpen: true,
                                  title:
                                    "Are you sure to delete QR Image " +
                                    " ?",
                                  subTitle: "You can't undo this operation",
                                  onConfirm: () => {
                                    deleteQRCode()
                                  },
                                });
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                            <div className="zoom">
                              <img
                                alt=""
                                className="dvImg"
                                src={`${process.env.REACT_APP_BASE_URL}/${FolderPath.QrcodeImage}/${values.QrcodeImageName}`}
                                style={{ width: '150px', height: '200px' }}
                              />
                            </div>
                            <ConfirmDialog
                              confirmDialog={confirmDialog}
                              setConfirmDialog={setConfirmDialog}
                            />
                          </>
                          }

                          <br />
                          {QrcodeImage?.name}
                        </Grid>
                      </>
                    }
                  </Grid>
                </React.Fragment>
              </CardContent>
            </Card>
            {/* <Typography align="center" marginTop={3}> Payment Gateway (RazorPay)</Typography> */}
            <Card sx={{ marginTop: '3px' }}>
              <CardHeader sx={{ textAlign: "center" }} title="Payment Gateway (RazorPay)" />
              <CardContent>
                <React.Fragment>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Controls.Input
                        label="RazorPay Merchant"
                        name="RazorPayMerchantId"
                        value={values.RazorPayMerchantId}
                        onChange={handleInputChange}
                        error={errors.RazorPayMerchantId}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controls.Input
                        label="RazorPay Test API"
                        name="RazorPayTestApikeyId"
                        value={values.RazorPayTestApikeyId}
                        onChange={handleInputChange}
                        error={errors.RazorPayTestApikeyId}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controls.Input
                        label="RazorPay Test Key"
                        name="RazorPayTestKeySecret"
                        value={values.RazorPayTestKeySecret}
                        onChange={handleInputChange}
                        error={errors.RazorPayTestKeySecret}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controls.Input
                        label="RazorPay LIVE API"
                        name="RazorPayLiveapikeyId"
                        value={values.RazorPayLiveapikeyId}
                        onChange={handleInputChange}
                        error={errors.RazorPayLiveapikeyId}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controls.Input
                        label="RazorPay LIVE Key"
                        name="RazorPayLivekeySecret"
                        value={values.RazorPayLivekeySecret}
                        onChange={handleInputChange}
                        error={errors.RazorPayLivekeySecret}
                      />
                    </Grid>
                  </Grid>
                </React.Fragment>
              </CardContent>
            </Card>

            <Card sx={{ marginTop: '3px' }}>
              <CardHeader sx={{ textAlign: "center" }} title="Payment Gateway (Ease Buzz)" />
              <CardContent>
                <React.Fragment>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Controls.Input
                        label="Ease BuzzSub MerchantId"
                        name="EaseBuzzSubMerchantId"
                        value={values.EaseBuzzSubMerchantId}
                        onChange={handleInputChange}
                        error={errors.EaseBuzzSubMerchantId}
                      />
                    </Grid>
                  </Grid>
                </React.Fragment>
              </CardContent>
            </Card>
          </Grid>
        }
        {/* <CardActions sx={{ display: "flex", justifyContent: "center" }}>
           
          </CardActions> */}


        <Stack spacing={2} direction="row" sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
          <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}          >
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
      </form>
    </>
  );
};

export default SocietiesForm;
