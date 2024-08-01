import React, { useEffect, useState } from "react";
import { Grid, CardActions, Card, CardContent, Button, Typography, Stack } from "@mui/material";
import { societyChargeHeadsService } from "../../services/SocietyChargeHeadsService";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SocietyChargeHeadsModel } from "../../models/SocietyChargeHeadsModel";
import Controls from '../../utility/controls/Controls'
import { SelectListModel } from '../../models/ApiResponse'
import { societyBillSeriesService } from "../../services/SocietyBillSeriesService";
import { acHeadsService } from "../../services/AcHeadsService";
import { appInfoService } from "../../services/AppInfoService";
import { Messages, ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";
import { useSharedNavigation } from "../../utility/context/NavigationContext";

const SocietyChargeHeadForm = () => {
  const { auth } = React.useContext(AuthContext);
  const { chargeHeadId, societyId }: any = useParams();
  let navigate = useNavigate();
  const [acHeads, setAcHeads] = useState<SelectListModel[]>([]);
  const natures = globalService.getNatures();
  const [billAbbr, setBillAbbr] = useState<SelectListModel[]>([]);
  const mode = chargeHeadId ? 'Edit' : 'Create';
  // const [appInfo, setAppInfo] = useState([]);
  const [isVisible, setVisible] = useState(false);
  const { goToHome } = useSharedNavigation();

  const validate = (fieldValues: SocietyChargeHeadsModel = values) => {
    let temp: any = { ...errors };
    if ("ChargeHead" in fieldValues)
      temp.ChargeHead = fieldValues.ChargeHead ? "" : "ChargeHead is required.";
    if ("Hsncode" in fieldValues)
      temp.Hsncode = fieldValues.Hsncode.length <= 6 ? "" : "HSNCode is required.";
    if ("Sequence" in fieldValues)
      temp.Sequence = fieldValues.Sequence ? "" : "Sequence is required.";
    if ("AcHeadId" in fieldValues)
      temp.AcHeadId = fieldValues.AcHeadId ? "" : "Account Head is required.";
    if ("BillAbbreviation" in fieldValues)
      temp.BillAbbreviation = fieldValues.BillAbbreviation ? "" : "BillAbbreviation is required.";
    if ("Rate" in fieldValues)
      temp.Rate = fieldValues.Rate ? (temp.Rate = /^[0-9]*(\.[0-9]{0,3})?$/.test(fieldValues.Rate.toString()) ? "" : "Enter positive value.") : "";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(societyChargeHeadsService.initialFieldValues, validate, chargeHeadId);

  const newSocietyChargeHead = () => {
    setValues(societyChargeHeadsService.initialFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: SocietyChargeHeadsModel) {
    let newModel = {
      SocietyId: model.SocietyId,
      ChargeHeadId: model.ChargeHeadId,
      ChargeHead: model.ChargeHead,
      AcHeadId: model.AcHeadId || "",
      Nature: model.Nature || "",
      Rate: model.Rate || 0,
      Sequence: model.Sequence || 0,
      BillAbbreviation: model.BillAbbreviation || "",
      ChargeInterest: model.ChargeInterest,
      ChargeTax: model.ChargeTax,
      Hsncode: model.Hsncode || "",
      MonthlyCharge: model.MonthlyCharge,
    }
    return newModel;
  }

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (acHeads.length === 0)
      getAcHeadsForSociety();
    if (billAbbr.length === 0)
      getBillAbbreviations();

    if (chargeHeadId) {
      getSocietyChargeHead();
    }
    else {
      newSocietyChargeHead();
      setErrors({});
    }
    getAppInfo();

  }, [chargeHeadId]);

  const getAcHeadsForSociety = () => {
    acHeadsService.getSelectListBySocietyId(societyId)
      .then((response) => {
        setAcHeads(response.data);
      });
  };

  const getBillAbbreviations = () => {
    societyBillSeriesService
      .getSelectListBySocietyId(societyId)
      .then((response: any) => {
        setBillAbbr(response.data);
        if (mode === 'Create') {
          values.BillAbbreviation = response.data[0].Value;
        }
      });
  }

  const getSocietyChargeHead = () => {
    societyChargeHeadsService
      .getById(chargeHeadId, societyId)
      .then((response) => {
        if (response) {
          let result = response.data;
          setValues(setFormValue(result.data));

        }
      })
  };

  const getAppInfo = () => {
    appInfoService.getAppInfo().then((response) => {

      // let data= response.data.list[0].Flags.length
      // for(var i=0;i<data;i++)
      // {
      //   if(response.data.list[0].Flags[i]==='Y')
      //   {
      setVisible(response.data.row.FlagInfo.MonthlyCharge);
      //   }
      //   if(response.data.list[0].Flags[i]==='N')
      //   {
      //     setVisible(false);
      //   }

      // }
      // setAppInfo(result.list);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      values.SocietyId = societyId;
      if (chargeHeadId) {
        societyChargeHeadsService.put(values).then((response: any) => {
          let result = response.data;
          if (result.isSuccess) {
            resetForm();
            navigate("/societyChargeHeads/" + societyId);
            globalService.success("Society Charge Head updated successfully.");
          }
        });
      } else {
        societyChargeHeadsService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success("Society Charge Head added successfully.");
              resetForm();
              navigate("/societyChargeHeads/" + societyId);
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
        Society Charge Head
      </Typography>
      <form
        autoComplete="off"
        noValidate
        //className={classes.root}
        onSubmit={handleSubmit}
      >
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    label="Charge Head"
                    name="ChargeHead"
                    length={100}
                    value={values.ChargeHead}
                    onChange={handleInputChange}
                    error={errors.ChargeHead}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    name="ChargeInterest"
                    label="Charge Interest"
                    value={values.ChargeInterest}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    name="ChargeTax"
                    label="Charge Tax"
                    value={values.ChargeTax}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="HSNCode"
                    name="Hsncode"
                    length={6}
                    value={values.Hsncode}
                    onChange={handleInputChange}
                    error={errors.Hsncode}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    name="AcHeadId"
                    label="AC Head"
                    required
                    value={acHeads.length > 0 ? values.AcHeadId : ""}
                    onChange={handleInputChange}
                    options={acHeads}
                    error={errors.AcHeadId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select

                    name="Nature"
                    label="Nature"
                    value={natures.length > 0 ? values.Nature : ""}
                    onChange={handleInputChange}
                    options={natures}
                    error={errors.Nature}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Rate"
                    name="Rate"
                    type="number"
                    value={values.Rate}
                    onChange={handleInputChange}
                    error={errors.Rate}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    name="BillAbbreviation"
                    label="Bill Abbreviation"
                    showEmptyItem={false}
                    value={billAbbr.length > 0 ? values.BillAbbreviation : ""}
                    onChange={handleInputChange}
                    options={billAbbr}
                    error={errors.BillAbbreviation}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    label="Sequence "
                    name="Sequence"
                    value={values.Sequence}
                    onChange={handleInputChange}
                    error={errors.Sequence}
                  />
                </Grid>

                {isVisible &&
                  <Grid item xs={12} sm={4}>
                    <Controls.Checkbox
                      name="MonthlyCharge"
                      label="Monthly Charge"
                      value={values.MonthlyCharge}
                      onChange={handleInputChange}
                    />
                  </Grid>
                }

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
                href={"/societyChargeHeads/" + societyId}
              >
                Back
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </form>
    </>
  );
};
export default SocietyChargeHeadForm
