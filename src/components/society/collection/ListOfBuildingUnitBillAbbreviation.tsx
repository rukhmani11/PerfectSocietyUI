import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SelectListModel } from "../../../models/ApiResponse";
import { SocietyReceiptsModel } from "../../../models/SocietyReceiptsModel";
import { societyReceiptsService } from "../../../services/SocietyReceiptsService";
import useForm from "../../../utility/hooks/UseForm";
import { societyBuildingUnitsService } from "../../../services/SocietyBuildingUnitsService";
import { bankService } from "../../../services/BankService";
import { societyBillSeriesService } from "../../../services/SocietyBillSeriesService";
import { globalService } from "../../../services/GlobalService";
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
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";

const ListOfBuildingUnitBillAbbreviation = () => {
  const { SocietyReceiptId, societyBuildingUnitId, billAbbreviation } = useParams();
  const [SocietyBuildingUnits, setSocietyBuildingUnit] = useState<SelectListModel[]>([]);
  const [BillAbbreviation, setBillAbbreviation] = useState<SelectListModel[]>([]);
  const societyId: string = localStorage.getItem("societyId") || "";
  let navigate = useNavigate();
  const { goToHome } = useSharedNavigation();
  const validate = (fieldValues: SocietyReceiptsModel = values) => {
    let temp: any = { ...errors };
    if ("SocietyBuildingUnitId" in fieldValues)
      temp.SocietyBuildingUnitId = fieldValues.SocietyBuildingUnitId ? "" : "Building Unit is required.";
    if ("BillAbbreviation" in fieldValues)
      temp.BillAbbreviation = fieldValues.BillAbbreviation ? "" : "Bill Abbreviation is required.";


    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(
      societyReceiptsService.initialFieldValues,
      validate,
      SocietyReceiptId
    );

  const newListOfBuildingUnitBillAbbreviation = () => {
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
      PayRefDate: model.PayRefDate ? globalService.convertLocalToUTCDate(new Date(model.PayRefDate)) : null || "",
      ReceiptDate: model.ReceiptDate ? globalService.convertLocalToUTCDate(new Date(model.ReceiptDate)) : null,
      BankId: model.BankId || "",
      // BankName: model.BankName || "",
      Branch: model.Branch || "",
      AcTransactionId: model.AcTransactionId || "",
      IsPrinted: model.IsPrinted,
    };
    return newModel;
  }

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (SocietyBuildingUnits.length === 0) getSocietyBuildingUnits();
    if (BillAbbreviation.length === 0) getBillAbbreviation();
    if (SocietyReceiptId) {
      getListOfBuildingUnitBillAbbreviation(SocietyReceiptId);
    } else {
      newListOfBuildingUnitBillAbbreviation();
      setErrors({});
    }
  }, [SocietyReceiptId]);

  const getSocietyBuildingUnits = () => {
    societyBuildingUnitsService
      .getSelectListBySocietyId(societyId)
      .then((response) => {
        setSocietyBuildingUnit(response.data);
        values.SocietyBuildingUnitId = response.data[0].Value;
      });
  };
  const getBillAbbreviation = () => {
    societyBillSeriesService
      .getSelectListBySocietyId(societyId)
      .then((response) => {
        setBillAbbreviation(response.data);
        values.BillAbbreviation = response.data[2].Value;

      });
  };


  const getListOfBuildingUnitBillAbbreviation = (SocietyReceiptId: any) => {
    societyReceiptsService.getById(SocietyReceiptId).then(
      (response) => {
        if (response) {
          let result = response.data;
          setValues(setFormValue(result.data));
        }
      }
    );
  };

  // const  handleSubmit = (e: React.FormEvent) => {
  //   values.SocietyBuildingUnitId = societyBuildingUnitId;
  //   societyReceiptsService.post(values).then((response: any) => {
  //             let result = response.data;
  //             if (result.isSuccess) {
  //               resetForm();
  //               navigate("/createSocietyReceipts/" + societyBuildingUnitId);
  //             }
  //           });
  //         }
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
      // onSubmit={handleSubmit}
      >
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
                    value={BillAbbreviation.length > 0 ? values.BillAbbreviation : ""}
                    onChange={handleInputChange}
                    options={BillAbbreviation}
                    error={errors.BillAbbreviation}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    name="SocietyBuildingUnitId"
                    label="Building Units"
                    showEmptyItem={false}
                    required
                    value={SocietyBuildingUnits.length > 0 ? values.SocietyBuildingUnitId : ""}
                    onChange={handleInputChange}
                    options={SocietyBuildingUnits}
                    error={errors.SocietyBuildingUnitId}
                  />
                </Grid>

                <Grid item xs={12} sm={4}></Grid>
                <Grid item xs={12} sm={4}></Grid>
              </Grid>
            </React.Fragment>
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "center" }}>
            <Stack spacing={2} direction="row">
              <Button type="submit" variant="contained"
                // //  onClick={() => navigate("/createSocietyReceipts/" + societyId+ "/"+ societyBuildingUnitId +"/"+ billAbbreviation)}>
                onClick={() => navigate("/createSocietyReceipts/" + societyId)}>
                Go
              </Button>
              <Button
                variant="outlined"

                startIcon={<ArrowBackIcon />}
                onClick={() =>
                  navigate(
                    "/societyBuildingUnitMembers/" + societyBuildingUnitId
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

export default ListOfBuildingUnitBillAbbreviation;
