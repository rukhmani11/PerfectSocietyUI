import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SelectListModel } from "../../../models/ApiResponse";
import { SocietyCollectionReversalsService } from "../../../services/SocietyCollectionReversalsService";
import { SocietyCollectionReversalsModel } from "../../../models/SocietyCollectionReversalsModel";
import useForm from "../../../utility/hooks/UseForm";
import { societyBuildingUnitsService } from "../../../services/SocietyBuildingUnitsService";
import { bankService } from "../../../services/BankService";
import { societyMembersService } from "../../../services/SocietyMembersService";
import { globalService } from "../../../services/GlobalService";
import { societyBillSeriesService } from "../../../services/SocietyBillSeriesService";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import Controls from "../../../utility/controls/Controls";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { societyPayModesService } from "../../../services/SocietyPayModesService";
import { societyReceiptsService } from "../../../services/SocietyReceiptsService";
import { SocietyReceiptsModel } from "../../../models/SocietyReceiptsModel";
import { Messages, ROLES } from "../../../utility/Config";
import { AuthContext } from "../../../utility/context/AuthContext";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";

const SocietyCollectionReversalForm = () => {
  const { auth } = React.useContext(AuthContext);
  // let societySubscriptionId = localStorage.getItem("societySubscriptionId");
  const { societyId, societyCollectionReversalId } = useParams();
  const { societySubscriptionId } = useParams();
  const [societyBuildingUnits, setSocietyBuildingUnits] = useState<
    SelectListModel[]
  >([]);

  let navigate = useNavigate();
  const [members, setMembers] = useState<SelectListModel[]>([]);
  const [banks, setBanks] = useState<SelectListModel[]>([]);
  const [payModes, setPayModes] = useState<SelectListModel[]>([]);
  const [societyReceipts, setSocietyReceipts] = useState<SelectListModel[]>([]);
  const [societyReceipt, setSocietyReceipt] = useState<SocietyReceiptsModel>(null);
  const [enableInput, setEnableInput] = useState<boolean>(true);
  const [startRange, setStartRange] = useState(null);
  const [endRange, setEndRange] = useState(null);
  const { goToHome } = useSharedNavigation();
  const [billAbbreviations, setBillAbbreviations] = useState<SelectListModel[]>(
    []
  );

  const validate = (fieldValues: SocietyCollectionReversalsModel = values) => {
    let temp: any = { ...errors };
    if ("SocietyMemberId" in fieldValues)
      temp.SocietyMemberId = fieldValues.SocietyMemberId
        ? ""
        : "Society member is required.";
    if ("SocietyBuildingUnitId" in fieldValues)
      temp.SocietyBuildingUnitId = fieldValues.SocietyBuildingUnitId
        ? ""
        : "Building Unit is required.";
    if ("ReversalDate" in fieldValues)
      temp.ReversalDate = fieldValues.ReversalDate
        ? ""
        : "Reversal Date is required.";
    if ("BillAbbreviation" in fieldValues)
      temp.BillAbbreviation = fieldValues.BillAbbreviation
        ? ""
        : "Bill Abbreviation is required.";
    if ("SocietyReceiptId" in fieldValues)
      temp.SocietyReceiptId = fieldValues.SocietyReceiptId
        ? ""
        : "Society Receipt is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(
      SocietyCollectionReversalsService.initialFieldValues,
      validate,
      societyId
    );

  const newSocietyBuildingUnitMember = () => {
    setValues(SocietyCollectionReversalsService.initialFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: SocietyCollectionReversalsModel) {
    let newModel = {
      SocietyCollectionReversalId: model.SocietyCollectionReversalId,
      SocietyReceiptId: model.SocietyReceiptId || "",
      SocietyMemberId: model.SocietyMemberId,
      SocietyId: model.SocietyId,
      SocietyBuildingUnitId: model.SocietyBuildingUnitId,
      SocietySubscriptionId: model.SocietySubscriptionId,
      ReversalDate: model.ReversalDate
        ? globalService.convertLocalToUTCDate(new Date(model.ReversalDate))
        : null,
      AcYear: model.AcYear || "",
      Serial: model.Serial || "",
      BillAbbreviation: model.BillAbbreviation,
      DocNo: model.DocNo || "",
      PrincipalAdjusted: model.PrincipalAdjusted || "",
      InterestAdjusted: model.InterestAdjusted || "",
      NonChgAdjusted: model.NonChgAdjusted || "",
      TaxAdjusted: model.TaxAdjusted || "",
      Advance: model.Advance || "",
      Particulars: model.Particulars || "",
      PayModeCode: model.PayModeCode,
      PayRefNo: model.PayRefNo || "",
      PayRefDate: model.PayRefDate
        ? globalService.convertLocalToUTCDate(new Date(model.PayRefDate))
        : null,
      BankId: model.BankId || "",
      Branch: model.Branch || "",
      AcTransactionId: model.AcTransactionId || "",
    };
    return newModel;
  }

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    // if (billAbbreviations.length === 0) getBillAbbreviation();
    // if (societyBuildingUnits.length === 0) getSocietyBuildingUnits();
    // if (banks.length === 0) getBanks();
    // if (payModes.length === 0) getSocietyPayModes();

    if (!startRange) {
      getForForm();
    }
    newSocietyBuildingUnitMember();

    if (!societyCollectionReversalId)
      setFormValue(SocietyCollectionReversalsService.initialFieldValues);

    setErrors({});
  }, [societyCollectionReversalId]);

  // const getSocietyBuildingUnits = () => {
  //   societyBuildingUnitsService
  //     .getSelectListBySocietyId(societyId)
  //     .then((response: any) => {
  //       setSocietyBuildingUnits(response.data);
  //       // if (response.data.length > 0)
  //       //   values.SocietyBuildingUnitId = response.data[0].Value;
  //     });
  // };

  // const getBanks = () => {
  //   bankService.getSelectList().then((response) => {
  //     setBanks(response.data);
  //   });
  // };
  // const getSocietyPayModes = () => {
  //   societyPayModesService
  //     .getBySocietySelectListId(societyId)
  //     .then((response) => {
  //       setPayModes(response.data);
  //     });
  // };

  const GetSelectListReceiptForMember = (SocietyMemberId: any) => {
    societyReceiptsService
      .getSelectListForMember(
        values.BillAbbreviation,
        values.SocietyBuildingUnitId,
        SocietyMemberId
      )
      .then((response) => {
        setSocietyReceipts(response.data);
      });
  };

  // const getBillAbbreviation = () => {
  //   societyBillSeriesService
  //     .getSelectListBySocietyId(societyId)
  //     .then((response) => {
  //       setBillAbbreviations(response.data);
  //       if (response.data.length > 0)
  //         values.BillAbbreviation = response.data[0].Value;
  //     });
  // };

  const onChangeSocietyReceipt = (SocietyReceiptId: any) => {
    societyReceiptsService.getById(SocietyReceiptId).then((response) => {
      if (response) {
        let result = response.data;
        if (result.isSuccess) {

          setValues((prevState: any) => ({
            ...prevState,
            Particulars: result.data.Particulars || "",
            PrincipalAdjusted: result.data.PrincipalAdjusted || "",
            InterestAdjusted: result.data.InterestAdjusted || "",
            NonChgAdjusted: result.data.NonChgAdjusted || "",
            TaxAdjusted: result.data.TaxAdjusted || "",
            Advance: result.data.Advance || "",
            //SocietyPayModes: result.data.SocietyPayModes.PayMode || "",
            PayModeCode: result.data.PayModeCode || "",
            PayRefNo: result.data.PayRefNo || "",
            PayRefDate: result.data.PayRefDate ? globalService.convertLocalToUTCDate(new Date(result.data.PayRefDate)) : null,
            BankId: result.data.BankId || "",
            Branch: result.data.Branch || "",
          }));
          setEnableInput(false);
        } else {
          setSocietyReceipt(null);
          setEnableInput(true);
        }
      }
    });
  };

  const getSocietyMembersForSocietyBuildingUnitId = (
    societyBuildingUnitId: any
  ) => {
    if (societyBuildingUnitId) {
      societyMembersService
        .getSelectListBySocietyBuildingUnitID(societyBuildingUnitId)
        .then((response) => {
          setMembers(response.data);
          // if (response.data.length > 0)
          //   values.SocietyMemberId = response.data[0].Value;
        });
    }
  };

  const getReversalDateRange = (billAbbr: string) => {
    if (societySubscriptionId && billAbbr) {
      SocietyCollectionReversalsService.getSocietySubscriptionDatesForCollectionReversal(
        societySubscriptionId, billAbbr
      ).then((response) => {
        if (response) {
          let result = response.data;
          if (result.startRange) {
            setStartRange(new Date(result.startRange));
          }
          else {
            setStartRange(null);
          }
          if (result.endRange) {
            setEndRange(new Date(result.endRange));
          }
          else {
            setEndRange(null);
          }
        }
      });
    } else {
      setStartRange(null);
      setEndRange(null);
    }
  };

  const getForForm = () => {
    if (societySubscriptionId) {
      SocietyCollectionReversalsService.getForForm(
        societySubscriptionId
      ).then((response) => {
        if (response) {
          let result = response.data;
          if (result.startRange) {
            setStartRange(new Date(result.startRange));
          }
          if (result.endRange) {
            setEndRange(new Date(result.endRange));
          }
          if (result.billAbbreviations) {
            setBillAbbreviations(result.billAbbreviations);
            getReversalDateRange(result.billAbbreviations[0].Value);
          }
          values.BillAbbreviation = result.billAbbreviation;
          if (result.societyBuildingUnits)
            setSocietyBuildingUnits(result.societyBuildingUnits);
          if (result.banks)
            setBanks(result.banks);
          if (result.payModes)
            setPayModes(result.payModes);
        }
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // values.SocietyBuildingUnitId = societyBuildingUnitId;
      values.SocietySubscriptionId = societySubscriptionId;
      values.SocietyId = societyId;
      if (societyCollectionReversalId) {
        SocietyCollectionReversalsService.put(values).then((response: any) => {
          let result = response.data;
          if (result.isSuccess) {
            resetForm();
            navigate(-1);
            globalService.success(result.message);
          }
        });
      } else {
        SocietyCollectionReversalsService.post(values).then((response: any) => {
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
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5" align="center">
          Society Collection Reversal
        </Typography>
      </Stack>
      <form noValidate onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    name="BillAbbreviation"
                    label="Bill Abbreviation"
                    showEmptyItem={false}
                    required
                    value={
                      billAbbreviations.length > 0
                        ? values.BillAbbreviation
                        : ""
                    }
                    onChange={(e: any) => {
                      getReversalDateRange(e.target.value);
                      handleInputChange(e);
                    }
                    }
                    options={billAbbreviations}
                    error={errors.BillAbbreviation}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    name="SocietyBuildingUnitId"
                    label="Building Units"
                    showEmptyItem={true}
                    required
                    value={
                      societyBuildingUnits.length > 0
                        ? values.SocietyBuildingUnitId
                        : ""
                    }
                    onChange={(e: any) => {
                      getSocietyMembersForSocietyBuildingUnitId(e.target.value);
                      handleInputChange(e);
                    }}
                    options={societyBuildingUnits}
                    error={errors.SocietyBuildingUnitId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    name="SocietyMemberId"
                    label="Member"
                    required
                    value={members.length > 0 ? values.SocietyMemberId : ""}
                    onChange={(e: any) => {
                      GetSelectListReceiptForMember(e.target.value);
                      handleInputChange(e);
                    }}
                    options={members}
                    error={errors.SocietyMemberId}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="ReversalDate"
                    name="ReversalDate"
                    value={values.ReversalDate}
                    min={startRange}
                    max={endRange}
                    disabled={!values.BillAbbreviation}
                    onChange={(date: Date) =>
                      handleInputChange({
                        target: {
                          value: globalService.convertLocalToUTCDate(date),
                          name: "ReversalDate",
                        },
                      })
                    }
                    error={errors.ReversalDate}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    name="SocietyReceiptId"
                    label="Collection Receipt"
                    required
                    value={societyReceipts.length > 0 ? values.SocietyReceiptId : ""}
                    onChange={(e: any) => {
                      handleInputChange(e);
                      onChangeSocietyReceipt(e.target.value);
                    }}
                    options={societyReceipts}
                    error={errors.SocietyReceiptId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Particulars"
                    name="Particulars"
                    //type="number"
                    value={values.Particulars}
                    onChange={handleInputChange}
                    error={errors.Particulars}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Principal Adjusted"
                    name="PrincipalAdjusted"
                    type="number"
                    disabled={!enableInput}
                    //value={ societyReceipt ? societyReceipt.PrincipalAdjusted : ""}
                    value={values.PrincipalAdjusted}
                    onChange={handleInputChange}
                    error={errors.PrincipalAdjusted}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Interest Adjusted"
                    name="InterestAdjusted"
                    type="number"
                    disabled={!enableInput}
                    // value={ societyReceipt ? societyReceipt.InterestAdjusted : ""}
                    value={values.InterestAdjusted}
                    onChange={handleInputChange}
                    error={errors.InterestAdjusted}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="NonChg Adjusted"
                    name="NonChgAdjusted"
                    disabled={!enableInput}
                    type="number"
                    // value={societyReceipt ? societyReceipt.NonChgAdjusted : ""}
                    value={values.NonChgAdjusted}
                    onChange={handleInputChange}
                    error={errors.NonChgAdjusted}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="TaxAdjusted"
                    label="Tax Adjusted"
                    disabled={!enableInput}
                    type="number"
                    //value={societyReceipt ? societyReceipt.TaxAdjusted : ""}
                    value={values.TaxAdjusted}
                    onChange={handleInputChange}
                    error={errors.TaxAdjusted}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Advance"
                    name="Advance"
                    type="number"
                    disabled={!enableInput}
                    value={values.Advance}
                    onChange={handleInputChange}
                    error={errors.Advance}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={4}>
                  <Controls.Input 
                    name="PayModeCode"
                    label="Pay Modes"
                    disabled={!enableInput}
                    required
                    value={payModes.length > 0 ? values.SocietyPayModes: ""}
                    onChange={handleInputChange}
                    options={payModes}
                    error={errors.SocietyPayModes}
                  />
                </Grid> */}
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    disabled={!enableInput}
                    showEmptyItem={false}
                    name="PayModeCode"
                    label="Pay Modes"
                    required
                    value={values.PayModeCode}
                    onChange={handleInputChange}
                    options={payModes}
                    error={errors.PayModeCode}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="PayRef No"
                    name="PayRefNo"
                    length={10}
                    disabled={!enableInput}
                    //value={societyReceipt ? societyReceipt.PayRefNo : ""}
                    value={values.PayRefNo}
                    onChange={handleInputChange}
                    error={errors.PayRefNo}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="PayRefDate"
                    value={values.PayRefDate}
                    disabled={!enableInput}
                    onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'PayRefDate' } })}
                    error={errors.PayRefDate}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={4}>
                  <Controls.Select
                  showEmptyItem={false}
                    name="BankId"
                    label="Bank"
                    disabled={!enableInput}
                    required
                    value={banks.length > 0 ? values.BankId : ""}
                    onChange={handleInputChange}
                    options={banks}
                    error={errors.BankId}
                  />
                </Grid> */}
                {/* <Grid item xs={12} sm={4}>
        <Controls.Select
          showEmptyItem={false}
          name="BankId"
          label="Banks"
          disabled={values.BankId === 'specificValue' ? true : !enableInput}
          required
          value={values.BankId}
          onChange={handleInputChange}
          options={banks}
          error={errors.BankId}
        />
      </Grid> */}
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    name="BankId"
                    label="Banks"
                    disabled={!enableInput}
                    required
                    value={values.BankId}
                    onChange={handleInputChange}
                    options={banks}
                    error={errors.BankId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Branch"
                    name="Branch"
                    disabled={!enableInput}
                    // value={societyReceipt ? societyReceipt.Branch : ""}
                    value={values.Branch}
                    onChange={handleInputChange}
                    error={errors.Branch}
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
                  navigate("/societyCollectionReversal/" + societyId)
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

export default SocietyCollectionReversalForm;
