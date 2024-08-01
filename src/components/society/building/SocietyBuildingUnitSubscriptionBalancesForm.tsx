import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  CardActions,
  Card,
  CardContent,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { SocietyBuildingUnitSubscriptionBalancesModel } from "../../../models/SocietyBuildingUnitSubscriptionBalancesModel";
import { SocietyBuildingUnitSubscriptionBalancesService } from "../../../services/SocietyBuildingUnitSubscriptionBalancesService";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SelectListModel } from "../../../models/ApiResponse";
import { globalService } from "../../../services/GlobalService";
import { societyMembersService } from "../../../services/SocietyMembersService";
import { societyBillSeriesService } from "../../../services/SocietyBillSeriesService";
import Controls from "../../../utility/controls/Controls";
import useForm from "../../../utility/hooks/UseForm";
import { SocietyBuildingTitleModel } from "../../../models/SocietyBuildingsModel";
import { societyBuildingsService } from "../../../services/SocietyBuildingsService";
import { ROLES, Messages } from "../../../utility/Config";
import { AuthContext } from "../../../utility/context/AuthContext";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";

const SocietyBuildingUnitSubscriptionBalancesForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  globalService.pageTitle = "SocietyBuildingUnitSubscriptionBalances";
  const [members, setMembers] = useState<SelectListModel[]>([]);
  let societySubscriptionId = localStorage.getItem("societySubscriptionId");
  // let societyBuildingUnitID = localStorage.getItem("societyBuildingUnitID");
  const [title, setTitle] = useState<any>({});
  const [BillAbbreviation, setBillAbbreviation] = useState<SelectListModel[]>([]);
  const societyId: string = localStorage.getItem("societyId") || "";

  const { SocietyBuildingUnitSubscriptionBalanceId, societyBuildingUnitId } = useParams();
  let navigate = useNavigate();
  const { goToHome } = useSharedNavigation();

  const validate = (fieldValues = values) => {
    let temp: any = { ...errors };
    if ("SocietyMemberId" in fieldValues)
      temp.SocietyMemberId = fieldValues.SocietyMemberId
        ? ""
        : "Society Member name is required";
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(
      SocietyBuildingUnitSubscriptionBalancesService.initialFieldValues,
      validate,
      props.setCurrentId
    );

  const newUser = () => {
    setValues(
      SocietyBuildingUnitSubscriptionBalancesService.initialFieldValues
    );
  };
  //This is used since in get the null property is not returned
  function setFormValue(model: SocietyBuildingUnitSubscriptionBalancesModel) {
    let newModel = {
      SocietyBuildingUnitSubscriptionBalanceId:
        model.SocietyBuildingUnitSubscriptionBalanceId,
      SocietyBuildingUnitId: model.SocietyBuildingUnitId,
      SocietySubscriptionId: model.SocietySubscriptionId || "",
      BillAbbreviation: model.BillAbbreviation,
      PrincipalAmount: model.PrincipalAmount || "",
      InterestAmount: model.InterestAmount || "",
      PrincipalReceipt: model.PrincipalReceipt || "",
      InterestReceipt: model.InterestReceipt || "",
      SpecialBillAmount: model.SpecialBillAmount || "",
      SpecialBillReceipt: model.SpecialBillReceipt || "",
      TaxAmount: model.TaxAmount || "",
      TaxReceipt: model.TaxReceipt || "",
      Advance: model.Advance || "",
      SocietyMemberId: model.SocietyMemberId,
      AdvanceAdjusted: model.AdvanceAdjusted || "",
    };
    return newModel;
  }

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (members.length === 0)

      //let temp=localStorage.getItem("societyBuildingUnitID");
      getMembers();
    if (BillAbbreviation.length === 0) getBillAbbreviation();
    if (SocietyBuildingUnitSubscriptionBalanceId) {
      getSocietyBuildingUnitSubscriptionBalances(
        SocietyBuildingUnitSubscriptionBalanceId
      );
      setErrors({});
    } else newUser();

    if (Object.keys(title).length === 0)
      getBuildingTitle();
  }, [SocietyBuildingUnitSubscriptionBalanceId]);

  const getBuildingTitle = () => {
    let model: SocietyBuildingTitleModel = {
      SocietyBuildingUnitId: societyBuildingUnitId,
      SocietyBuildingId: ""
    }
    societyBuildingsService
      .getPageTitle(model)
      .then((response) => {
        setTitle(response.data);
      });
  };

  const getMembers = () => {
    societyMembersService
      .getSelectListBySocietyBuildingUnitID(societyBuildingUnitId)
      .then((response) => {
        setMembers(response.data);
        if (response.data.length > 0)
          values.SocietyMemberId = response.data[0].Value;
      });
  };

  const getSocietyBuildingUnitSubscriptionBalances = (
    SocietyBuildingUnitSubscriptionBalanceId: any
  ) => {
    SocietyBuildingUnitSubscriptionBalancesService.getById(
      SocietyBuildingUnitSubscriptionBalanceId
    ).then((response) => {
      if (response) {
        let result = response.data;
        setValues(setFormValue(result.data));
        if (response.data.length > 0)
          values.BillAbbreviation = response.data[0].Value;

      }
    });
  };


  const getBillAbbreviation = () => {
    societyBillSeriesService
      .getSelectListBySocietyId(societyId)
      .then((response) => {
        setBillAbbreviation(response.data);
        if (response.data.length > 0)
          values.BillAbbreviation = response.data[0].Value;
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    values.SocietyBuildingUnitId = societyBuildingUnitId;
    e.preventDefault();
    if (validate()) {
      if (SocietyBuildingUnitSubscriptionBalanceId) {
        SocietyBuildingUnitSubscriptionBalancesService.put(values).then(
          (response: any) => {
            let result = response.data;
            if (response) {
              globalService.success(result.message);
              navigate("/societyBuildingUnitSubscriptionBalance/" + societyBuildingUnitId);
            } else {
              globalService.error(result.message);
            }
          }
        );
      } else {

        SocietyBuildingUnitSubscriptionBalancesService.post(values).then(
          (response: any) => {
            if (response) {
              let result = response.data;
              if (result.isSuccess) {
                globalService.success(result.message);
                resetForm();
                navigate("/societyBuildingUnitSubscriptionBalance/" + societyBuildingUnitId);
              } else {
                globalService.error(result.message);
              }
            }
          }
        );
      }
    }
  };

  return (
    <>
      {/* <Typography variant="h5" align="center">
        Society Building Unit Subscription Balances
      </Typography> */}
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5" align="center">
          Society Building Unit Subscription Balances
        </Typography>
        <Typography variant="body1"><b>Building : </b>{title.Building}  <b>Unit :</b> {title.Unit}  </Typography>
      </Stack>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    name="SocietyMemberId"
                    label=" Society Member"
                    required
                    value={members.length > 0 ? values.SocietyMemberId : ''}
                    onChange={handleInputChange}
                    options={members}
                    error={errors.SocietyMemberId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    name="BillAbbreviation"
                    label="Bill Abbreviation"
                    showEmptyItem={false}
                    value={
                      BillAbbreviation.length > 0 ? values.BillAbbreviation : ""
                    }
                    onChange={handleInputChange}
                    options={BillAbbreviation}
                    error={errors.BillAbbreviation}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    type="number"
                    label="Principal Amount"
                    name="PrincipalAmount"
                    value={values.PrincipalAmount}
                    onChange={handleInputChange}
                    error={errors.PrincipalAmount}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    type="number"
                    label="Principal Receipt"
                    name="PrincipalReceipt"
                    value={values.PrincipalReceipt}
                    onChange={handleInputChange}
                    error={errors.PrincipalReceipt}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    type="number"
                    label="Interest Amount"
                    name="InterestAmount"
                    value={values.InterestAmount}
                    onChange={handleInputChange}
                    error={errors.InterestAmount}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    type="number"
                    label="Interest Receipt"
                    name="InterestReceipt"
                    value={values.InterestReceipt}
                    onChange={handleInputChange}
                    error={errors.InterestReceipt}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    type="number"
                    label="Special Bill Amount"
                    name="SpecialBillAmount"
                    value={values.SpecialBillAmount}
                    onChange={handleInputChange}
                    error={errors.SpecialBillAmount}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    type="number"
                    label="Special Bill Receipt"
                    name="SpecialBillReceipt"
                    value={values.SpecialBillReceipt}
                    onChange={handleInputChange}
                    error={errors.SpecialBillReceipt}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    type="number"
                    label="Tax Amount"
                    name="TaxAmount"
                    value={values.TaxAmount}
                    onChange={handleInputChange}
                    error={errors.TaxAmount}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    type="number"
                    label="Tax Receipt"
                    name="TaxReceipt"

                    value={values.TaxReceipt}
                    onChange={handleInputChange}
                    error={errors.TaxReceipt}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    type="number"
                    label="Advance"
                    name="Advance"
                    value={values.Advance}
                    onChange={handleInputChange}
                    error={errors.Advance}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    type="number"
                    label="Advance Adjusted"
                    name="AdvanceAdjusted"
                    value={values.AdvanceAdjusted}
                    onChange={handleInputChange}
                    error={errors.AdvanceAdjusted}
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
                Back
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </form>
    </>
  );
};

export default SocietyBuildingUnitSubscriptionBalancesForm;
