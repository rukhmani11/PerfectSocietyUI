import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SelectListModel } from "../../../models/ApiResponse";
import { societyReceiptsService } from "../../../services/SocietyReceiptsService";
import { SocietyReceiptsModel } from "../../../models/SocietyReceiptsModel";
import useForm from "../../../utility/hooks/UseForm";
import { societyBuildingUnitsService } from "../../../services/SocietyBuildingUnitsService";
import { bankService } from "../../../services/BankService";
import { societyMembersService } from "../../../services/SocietyMembersService";
import { globalService } from "../../../services/GlobalService";
import { payModesService } from "../../../services/PayModesService";
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
import { Messages, ROLES } from "../../../utility/Config";
import { AuthContext } from "../../../utility/context/AuthContext";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";

const SocietyReceiptsForm = () => {
  const { auth } = React.useContext(AuthContext);
  const { societyId, societyReceiptId, societySubscriptionId } = useParams();
  // var societySubscriptionId = localStorage.getItem("societySubscriptionId");
  const [SocietyBuildingUnits, setSocietyBuildingUnit] = useState<
    SelectListModel[]
  >([]);
  const { BillAbbreviation } = useParams();
  // var societyid = localStorage.getItem("societyid");
  // var societyBuildingUnitId = localStorage.getItem("societyBuildingUnitId");
  let navigate = useNavigate();
  const [members, setMembers] = useState<SelectListModel[]>([]);
  const [BillAbbreviations, setBillAbbreviation] = useState<SelectListModel[]>(
    []
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [Banks, setBanks] = useState<SelectListModel[]>([]);
  const [PayModes, setPayModes] = useState<SelectListModel[]>([]);
  const [startRange, setStartRange] = useState(null);
  const [endRange, setEndRange] = useState(null);
  const { goToHome } = useSharedNavigation();
  const validate = (fieldValues: SocietyReceiptsModel = values) => {
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
    if ("ReceiptDate" in fieldValues)
      temp.ReceiptDate = fieldValues.ReceiptDate
        ? ""
        : "Receipt date is required.";
    if ("Amount" in fieldValues)
      temp.Amount = fieldValues.Amount ? "" : "Amount is required.";
    if ("PayModeCode" in fieldValues)
      temp.PayModeCode = fieldValues.PayModeCode ? "" : "Pay Mode is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(societyReceiptsService.initialFieldValues, validate, societyId);

  const newSocietyReceipt = () => {
    setValues(societyReceiptsService.initialFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: SocietyReceiptsModel) {
    let newModel = {
      SocietyReceiptId: model.SocietyReceiptId,
      SocietyId: model.SocietyId,
      SocietyBuildingUnitId: model.SocietyBuildingUnitId,
      SocietySubscriptionId: model.SocietySubscriptionId,
      SocietyMemberId: model.SocietyMemberId,
      AcYear: model.AcYear || "",
      Serial: model.Serial || "",
      Amount: model.Amount,
      ReceiptNo: model.ReceiptNo || "",
      BillAbbreviation: model.BillAbbreviation,
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
        : null || "",
      ReceiptDate: model.ReceiptDate
        ? globalService.convertLocalToUTCDate(new Date(model.ReceiptDate))
        : null || "",
      BankId: model.BankId || "",
      // BankName: model.BankName || "",
      Branch: model.Branch || "",
      AcTransactionId: model.AcTransactionId || "",
      IsPrinted: model.IsPrinted || false,
    };
    return newModel;
  }

  useEffect(() => {
    
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (SocietyBuildingUnits.length === 0) getSocietyBuildingUnits();
    if (BillAbbreviations.length === 0) getBillAbbreviation();
    if (Banks.length === 0) getBanks();
    if (PayModes.length === 0) getSocietyPayModes();

    if (!startRange) {
      ValidateReceiptDate();
    }
    if (!societyReceiptId)
      newSocietyReceipt();
    setErrors({});
    //}
  }, [societyReceiptId]);

  const getSocietyBuildingUnits = () => {
    societyBuildingUnitsService
      .getSelectListBySocietyId(societyId)
      .then((response: any) => {
        setSocietyBuildingUnit(response.data);
        values.ReceiptDate = null;
        // if (response.data.length > 0)
        //   values.SocietyBuildingUnitId = response.data[0].Value;
      });
  };

  const getBillAbbreviation = () => {
    societyBillSeriesService
      .getSelectListBySocietyId(societyId)
      .then((response) => {
        setValues((prevValues: any) => ({
          ...prevValues,
          ReceiptDate: null,
        }));
        setBillAbbreviation(response.data);
        if (response.data.length > 0)
          values.BillAbbreviations = response.data[0].Value;
      });
  };

  const getBanks = () => {
    bankService.getSelectList().then((response) => {
      setBanks(response.data);
    });
  };

  const getSocietyPayModes = () => {
    societyPayModesService
      .getBySocietySelectListId(societyId)
      .then((response) => {
        setPayModes(response.data);
      });
  };

  const getSocietyReceipt = (SocietyReceiptId: any) => {
    societyReceiptsService.getById(SocietyReceiptId).then((response) => {
      if (response) {
        let result = response.data;
        setValues(setFormValue(result.data));
      }
    });
  };

  const getSocietyMembersForSocietyBuildingUnitId = (societyBuildingUnitId: any) => {
    if (societyBuildingUnitId) {
      societyMembersService
        .getSelectListBySocietyBuildingUnitID(societyBuildingUnitId)
        .then((response) => {
          setValues((prevValues: any) => ({
            ...prevValues,
            ReceiptDate: null,
            SocietyMemberId: '',
          }));
          setMembers(response.data);
        });
    }
  };

  const ValidateReceiptDate = () => {
    if (values.BillAbbreviation) {
      societyReceiptsService
        .validateReceiptDate(
          societyId,
          values.BillAbbreviation,
          societySubscriptionId)
        .then((response) => {
          if (response) {
            let result = response.data;
            values.ReceiptDate = null;
            if (result.startRange) {
              setStartRange(new Date(result.startRange));
            }
            if (result.endRange) {
              setEndRange(new Date(result.endRange));
            }
          }
        });
    }
    else {
      values.ReceiptDate = null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // values.SocietyBuildingUnitId = societyBuildingUnitId;
      values.SocietySubscriptionId = societySubscriptionId;
      values.SocietyId = societyId;
      if (societyReceiptId) {
        societyReceiptsService.put(values).then((response: any) => {
          let result = response.data;
          if (result.isSuccess) {
            resetForm();
            navigate(-1);
            globalService.success(result.message);
          }
        });
      } else {
        societyReceiptsService.post(values).then((response: any) => {
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
          Society Receipt
        </Typography>
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
                  <Controls.Select
                    name="SocietyBuildingUnitId"
                    label="Building Units"
                    showEmptyItem={true}
                    required
                    value={
                      SocietyBuildingUnits.length > 0
                        ? values.SocietyBuildingUnitId
                        : ""
                    }
                    onChange={(e: any) => {
                      getSocietyMembersForSocietyBuildingUnitId(e.target.value);
                      handleInputChange(e);
                    }}
                    options={SocietyBuildingUnits}
                    error={errors.SocietyBuildingUnitId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    name="BillAbbreviation"
                    label="Bill Abbreviation"
                    showEmptyItem={false}
                    required
                    value={
                      BillAbbreviations.length > 0
                        ? values.BillAbbreviation
                        : ""
                    }
                    onChange={(e: any) => {
                      ValidateReceiptDate();
                      handleInputChange(e);
                    }}
                    options={BillAbbreviations}
                    error={errors.BillAbbreviation}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    name="SocietyMemberId"
                    label="Society Member"
                    required
                    value={members.length > 0 ? values.SocietyMemberId : ""}
                    disabled={!values.BillAbbreviation}
                    onChange={(e: any) => {
                      ValidateReceiptDate();
                      handleInputChange(e);
                    }}
                    options={members}
                    error={errors.SocietyMemberId}
                  />
                </Grid>
                <Grid item xs={12} sm={4} key={refreshKey}>
                  <Controls.ReactDatePicker
                    label="ReceiptDate"
                    name="ReceiptDate"
                    value={values.ReceiptDate}
                    min={startRange}
                    max={endRange}
                    // readOnly={!values.SocietyMemberId || 
                    //   !values.BillAbbreviation}
                    autoComplete="false"
                    disabled={!values.SocietyMemberId ||
                      !values.BillAbbreviation}
                    onChange={(date: Date) =>
                      handleInputChange({
                        target: {
                          value: globalService.convertLocalToUTCDate(date),
                          name: "ReceiptDate",
                        },
                      })
                    }
                    error={errors.ReceiptDate}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    label="Amount"
                    name="Amount"
                    type="Amount"
                    value={values.Amount}
                    onChange={handleInputChange}
                    error={errors.Amount}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Particulars"
                    name="Particulars"
                    value={values.Particulars}
                    onChange={handleInputChange}
                    error={errors.Particulars}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    name="PayModeCode"
                    label="PayMode"
                    required
                    value={PayModes.length > 0 ? values.PayModeCode : ""}
                    onChange={handleInputChange}
                    options={PayModes}
                    error={errors.PayModeCode}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="PayRef No"
                    name="PayRefNo"
                    length={10}
                    value={values.PayRefNo}
                    onChange={handleInputChange}
                    error={errors.PayRefNo}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.ReactDatePicker
                    label="PayRef Date"
                    value={values.PayRefDate}
                    onChange={(date: Date) =>
                      handleInputChange({
                        target: {
                          value: globalService.convertLocalToUTCDate(date),
                          name: "PayRefDate",
                        },
                      })
                    }
                    error={errors.PayRefDate}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    name="BankId"
                    label="Banks"
                    required
                    value={Banks.length > 0 ? values.BankId : ""}
                    onChange={handleInputChange}
                    options={Banks}
                    error={errors.BankId}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={4}>
                  <Controls.Input
                    showEmptyItem={false}
                    name="BankName"
                    label="BankName"
                    required
                    value={values.BankName}
                    onChange={handleInputChange}
                    error={errors.BankName}
                  />
                </Grid> */}
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Branch"
                    name="Branch"
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

export default SocietyReceiptsForm;
