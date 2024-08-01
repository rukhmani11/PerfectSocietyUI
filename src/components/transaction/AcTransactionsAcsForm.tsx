import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  CardActions,
  CardHeader,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  Button,
  Container,
  CssBaseline,
  Paper,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  Stack,
  Switch,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import Controls from "../../utility/controls/Controls";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SelectListModel } from "../../models/ApiResponse";
import { unitTypesService } from "../../services/UnitTypesService";
import { acTransactionAcsService } from "../../services/AcTransactionAcsService";
import { AcTransactionAcsModel } from "../../models/AcTransactionAcsModel";
import { actransactionsService } from "../../services/AcTransactionsService";
import dayjs from "dayjs";
import { standardAcHeadsService } from "../../services/StandardAcHeadsService";
import { AuthContext } from "../../utility/context/AuthContext";
import { Messages, ROLES } from "../../utility/Config";
import { useSharedNavigation } from "../../utility/context/NavigationContext";

const AcTransactionsAcsForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  const {
    acTransactionId,
    acTransactionAcId,
    societySubscriptionId,
    docType,
  }: any = useParams();
  let navigate = useNavigate();
  const [acHeads, setAcHeads] = useState<SelectListModel[]>([]);
  const [pageInfo, setPageInfo] = useState<any>(null);
  let societyId = localStorage.getItem("societyId");
  const [actransaction, setAcTransaction] = useState<any>(null);
  const [drCrList, setDrCrList] = useState<SelectListModel[]>([]);
  let isFirstSocietySubscription = globalService.isFirstSocietySubscription();
  const mode = acTransactionAcId ? "Edit" : "Create";
  const { goToHome } = useSharedNavigation();
  const validate = (fieldValues: AcTransactionAcsModel = values) => {
    let temp: any = { ...errors };
    if ("AcHeadId" in fieldValues)
      temp.AcHeadId = fieldValues.AcHeadId ? "" : "AcHeadId is required.";
    // if ("Amount" in fieldValues)
    // temp.Amount = fieldValues.Amount ? "" : "Amount is required.";

    if (docType === "JV" || docType === "OP") {
      if ("DrCr" in fieldValues)
        temp.DrCr = fieldValues.DrCr ? "" : "DrCr is required.";
    }

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(
      acTransactionAcsService.initialFieldValues,
      validate,
      props.acTransactionAcId
    );

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if ((docType.toUpperCase() === "OP" && !isFirstSocietySubscription)) {
      navigate('/unauthorized');
    }

    if (drCrList.length === 0)
      setDrCrList(globalService.getDrCr());
    if (!pageInfo) getAcTransactionFormSocietyIDNature();
    if (acTransactionAcId) {
      getAcTransactionAcs(acTransactionAcId);
    }
    if (!acTransactionAcId)
      setFormValue(acTransactionAcsService.initialFieldValues);
    else {
      newAcTransactionAc();
      setErrors({});
    }
  }, [acTransactionAcId]);

  const newAcTransactionAc = () => {
    setValues(setFormValue(acTransactionAcsService.initialFieldValues));
  };

  function setFormValue(model: AcTransactionAcsModel) {
    let newModel = {
      AcTransactionAcId: model.AcTransactionAcId || "",
      AcTransactionId: model.AcTransactionId || "",
      SocietyId: model.SocietyId || "",
      Nature: model.Nature || "",
      AcHeadId: model.AcHeadId || "",
      DrCr: model.DrCr || "",
      Amount: model.Amount || 0,
      Particulars: model.Particulars || "",
      Reconciled: model.Reconciled
        ? globalService.convertLocalToUTCDate(new Date(model.Reconciled))
        : null,
      DocType: model.DocType || "",
    };
    return newModel;
  }

  const getAcTransactionAcs = (acTransactionAcId: any) => {
    acTransactionAcsService.getById(acTransactionAcId).then((response) => {
      let result = response.data;
      if (result && result.isSuccess) {
        setValues(setFormValue(result.data));
      } else {
        globalService.error(result.message);
      }
    });
  };

  const getAcTransactionFormSocietyIDNature = () => {
    acTransactionAcsService

      .getAcTransactionFormSocietyIDNature(
        societySubscriptionId,
        docType,
        acTransactionId
      )
      .then((result) => {
        var response = result.data;

        setAcHeads(response.data.AcHeadList);
        if (response.data.AcTransaction) {
          setAcTransaction(response.data.AcTransaction);
          values.Particulars = response.data.AcTransaction.Particulars;
          values.DocType = response.data.AcTransaction.DocType;
          //values.DrCr = response.data.AcTransaction.DrCr;
          getdiffTotal(response.data.AcTransaction);
        }
      });
  };
  //   const getAcHeads = () => {
  //   standardAcHeadsService.getSelectList().then((response) => {
  //     setAcHeads(response.data);
  //   });
  // };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    values.SocietyId = societyId;
    values.AcTransactionId = acTransactionId;
    values.SocietySubscriptionId = societySubscriptionId;
    values.DocType = docType;
    if (validate()) {
      if (acTransactionAcId) {
        acTransactionAcsService.put(values).then((response: any) => {
          let result = response.data;
          if (result.isSuccess) {
            resetForm();
            globalService.success(result.message);
            navigate(
              "/acTransactionsac/" +
              societySubscriptionId +
              "/" +
              docType +
              "/" +
              acTransactionId
            );
          } else {
            globalService.error(result.message);
          }
        });
      } else {
        acTransactionAcsService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              resetForm();
              navigate(
                "/acTransactionsac/" +
                societySubscriptionId +
                "/" +
                docType +
                "/" +
                acTransactionId
              );
            } else {
              globalService.error(result.message);
            }
          }
        });
      }
    }
  };
  // const getAcHeadLabel = () => {
  //   if (values.DocType == "CP" || values.DocType == "CR") {
  //     return "Cash Account";
  //   } else if (values.DocType === "BP" || values.DocType === "BR") {
  //     return "Bank Account";
  //   } else {
  //     return "Account Head";
  //   }
  // };

  const getdiffTotal = (acTransaction: any) => {
    let diffTotal = 0;
    if (acTransaction) {
      let drTotal = acTransaction.DrAmount;
      const crTotal = acTransaction.CrAmount;

      let isDr = false;
      let isCr = false;
      if (drTotal > crTotal) {
        diffTotal = drTotal - crTotal;
        isCr = true;
      } else if (drTotal < crTotal) {
        diffTotal = crTotal - drTotal;
        isDr = true;
      } else {
        diffTotal = crTotal - drTotal;
      }
      //setDiffTotal(diffTotal);
    }
    values.Amount = diffTotal;
    //values.acTransaction.Particulars = setAcTransaction;
  };

  return (
    <>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5" align="center">
          {mode} Account
        </Typography>
        {actransaction && (
          <Typography variant="body1">
            <b>Document Type : </b> {actransaction.DocType}
          </Typography>
        )}
      </Stack>

      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    //label={getAcHeadLabel()}
                    label="Achead"
                    name="AcHeadId"
                    value={acHeads.length > 0 ? values.AcHeadId : ""}
                    onChange={handleInputChange}
                    options={acHeads}
                    error={errors.AcHeadId}
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
                  <Controls.Input
                    label="Amount"
                    name="Amount"
                    type="number"
                    value={values.Amount}
                    onChange={handleInputChange}
                    onBlur={(e: any) =>
                      handleInputChange({
                        target: {
                          value: Number(values.Amount).toFixed(2),
                          name: "Amount",
                        },
                      })
                    }
                    error={errors.Amount}
                  />
                </Grid>

                {actransaction &&
                  (actransaction.DocType == "OP" ||
                    actransaction.DocType == "YC" ||
                    actransaction.DocType == "JV") && (
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      className={
                        actransaction &&
                          (
                            actransaction.DocType == "YC") &&
                          mode === "Edit"
                          ? "hidden"
                          : ""
                      }
                    >
                      <Controls.Select
                        name="DrCr"
                        label="DrCr"
                        value={drCrList.length > 0 ? values.DrCr : ""}
                        onChange={handleInputChange}
                        options={drCrList}
                        error={errors.DrCr}
                      />
                    </Grid>
                  )}
              </Grid>
            </React.Fragment>
          </CardContent>
        </Card>
        <CardActions sx={{ display: "flex", justifyContent: "center" }}>
          <Stack spacing={2} direction="row">
            <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}
            >
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
      </form>
    </>
  );
};

export default AcTransactionsAcsForm;
