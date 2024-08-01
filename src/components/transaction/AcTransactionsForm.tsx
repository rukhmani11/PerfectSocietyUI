import React, { useEffect, useState } from "react";
import { Box, Grid, TextField, CardActions, Card, CardContent, FormControlLabel, Checkbox, Button, Container, CssBaseline, Paper, ThemeProvider, Toolbar, Typography, createTheme, Stack, Switch } from "@mui/material";
import { AcTransactionsModel } from "../../models/AcTransactionsModel";
import { actransactionsService } from "../../services/AcTransactionsService";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Controls from '../../utility/controls/Controls';
import { SelectListModel } from "../../models/ApiResponse";
import { acHeadsService } from "../../services/AcHeadsService";
import { acTransactionAcsService } from "../../services/AcTransactionAcsService";

import dayjs from "dayjs";
import { Messages, ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";
import { useSharedNavigation } from "../../utility/context/NavigationContext";

const AcTransactionsForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  let isFirstSocietySubscription = globalService.isFirstSocietySubscription();
  const { acTransactionId, societySubscriptionId, docType } = useParams();
  const [acHeads, setAcHeads] = useState<SelectListModel[]>([]);
  const [banks, setBanks] = useState<SelectListModel[]>([]);
  const [payModes, setPayModes] = useState<SelectListModel[]>([]);
  const [startRange, setStartRange] = useState<Date>(null);
  const [endRange, setEndRange] = useState<Date>(null);
  const [pageInfo, setPageInfo] = useState<any>(null);

  let navigate = useNavigate();
  let mode = acTransactionId ? "Edit" : "Create"
  let societyId = localStorage.getItem("societyId");
  const { goToHome } = useSharedNavigation();
  const validate = (fieldValues: AcTransactionsModel = values) => {
    let temp: any = { ...errors };
    if ("DocDate" in fieldValues)
      temp.DocDate = fieldValues.DocDate ? "" : "Document Date is required.";
    if (docType !== 'JV') {
      if ("AcHeadId" in fieldValues)
        temp.AcHeadId = fieldValues.AcHeadId ? "" : "Cash Account is required.";
    }
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(
      actransactionsService.initialFieldValues,
      validate,
      acTransactionId
    );

  const newAcTransaction = () => {
    setValues(actransactionsService.initialFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: AcTransactionsModel) {
    let newModel = {
      AcTransactionId: model.AcTransactionId,
      SocietyId: model.SocietyId,
      SocietySubscriptionId: model.SocietySubscriptionId,
      DocType: model.DocType,
      Serial: model.Serial || '0',
      AcYear: model.AcYear || '',
      DocNo: model.DocNo || '',
      DocDate: model.DocDate ? globalService.convertLocalToUTCDate(new Date(model.DocDate)) : null,
      Particulars: model.Particulars || '',
      AcHeadId: model.AcHeadId || '',
      DrAmount: model.DrAmount || '',
      CrAmount: model.CrAmount || '',
      PayModeCode: model.PayModeCode || '',
      PayRefNo: model.PayRefNo || '',
      PayRefDate: model.PayRefDate ? globalService.convertLocalToUTCDate(new Date(model.PayRefDate)) : null,
      BankId: model.BankId || '',
      Branch: model.Branch || '',
      BillNo: model.BillNo || '',
      BillDate: model.BillDate ? globalService.convertLocalToUTCDate(new Date(model.BillDate)) : null,
      DelDocNo: model.DelDocNo || '',
      DelDocDate: model.DelDocDate ? globalService.convertLocalToUTCDate(new Date(model.DelDocDate)) : null,
    };
    return newModel;
  }

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    
    if ((docType.toUpperCase() === "OP" && !isFirstSocietySubscription)) {
      navigate('/unauthorized');
    }

    if (!pageInfo)
      getPageInfo();
    if (acTransactionId) {
      getAcTransaction(acTransactionId);
    } else {
      newAcTransaction();
    }
    setErrors({});

  }, [acTransactionId]);

  const getPageInfo = () => {
    actransactionsService.getForAcTransactionFormPage(societySubscriptionId, docType).then(
      (response) => {
        if (response) {
          let result = response.data;
          if (result.isSuccess) {
            setBanks(result.data.Banks);
            setPayModes(result.data.PayModes);
            setStartRange(globalService.convertLocalToUTCDate(new Date(result.data.StartRange)));
            setEndRange(globalService.convertLocalToUTCDate(new Date(result.data.EndRange)));
            setAcHeads(result.data.AcHeads);
          }
        }
      }
    );
  }

  // const getAcHeads = () => {
  //   standardAcHeadsService.getSelectList().then((response) => {
  //     setAcHeads(response.data);
  //   });
  // };

  const getAcTransaction = (acTransactionId: any) => {
    actransactionsService.getById(acTransactionId).then(
      (response) => {
        let result = response.data;
        if (result && result.isSuccess) {
          setValues(setFormValue(result.data));
        }
        else {
          globalService.error(result.message);
        }
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    values.SocietySubscriptionId = societySubscriptionId;
    values.SocietyId = societyId;
    values.DocType = docType;
    if (validate()) {
      if (acTransactionId) {
        actransactionsService.put(values).then((response: any) => {
          let result = response.data;
          if (result.isSuccess) {
            resetForm();
            globalService.success(result.message);
            navigate("/acTransactions/" + societySubscriptionId + "/" + docType);
          } else {
            globalService.error(result.message);
          }

        });
      } else {
        actransactionsService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              resetForm();
              navigate("/acTransactions/" + societySubscriptionId + "/" + docType);
            } else {
              globalService.error(result.message);
            }
          }
        });
      }
    }
  };

  const getAcHeadLabel = () => {
    if (docType == "CP" || docType == "CR") {
      return "Cash Account";
    }
    else if (docType === "BP" || docType === "BR") {
      return "Bank Account";
    }
    else if (docType === "PB" || docType === "EB") {
      return "Creditor Account";
    }
    else {
      return "Account Head";
    }
  }

  return (
    <>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5" align="center">
          {mode} Account Transactions
        </Typography>
        <Typography variant="body1"><b>Document Type : </b>{globalService.getDocTypeMenuText(docType)}  </Typography>
      </Stack>
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
                  <Controls.ReactDatePicker
                    label="Document Date"
                    min={startRange}
                    max={endRange}
                    value={values.DocDate}
                    onChange={(date: Date) =>
                      handleInputChange({
                        target: { value: globalService.convertLocalToUTCDate(date), name: "DocDate" },
                      })
                    }
                    error={errors.DocDate}
                  />
                  {startRange && endRange && <Typography className="small-text">From Date & To Date must be between {dayjs(startRange).format("DD-MMM-YYYY")} to {dayjs(endRange).format("DD-MMM-YYYY")}</Typography>}
                </Grid>
                {docType !== 'JV' && <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    label={getAcHeadLabel()}
                    name="AcHeadId"
                    value={acHeads.length > 0 ? values.AcHeadId : ""}
                    onChange={handleInputChange}
                    options={acHeads}
                    error={errors.AcHeadId}
                  />
                </Grid>
                }
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Particulars"
                    name="Particulars"
                    multiline
                    value={values.Particulars}
                    onChange={handleInputChange}
                    error={errors.Particulars}
                  />
                </Grid>
                {docType === 'BR' && <Grid item xs={12} sm={4}>
                  <Controls.Select

                    label="Pay Mode"
                    name="PayModeCode"
                    value={payModes.length > 0 ? values.PayModeCode : ""}
                    onChange={handleInputChange}
                    options={payModes}
                    error={errors.PayModeCode}
                  />
                </Grid>
                }
                {(docType === 'BP' || docType === 'BR') && <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label={docType === 'BP' ? 'Cheque No.' : docType === 'BR' ? 'Pay Ref No.' : ''}
                    name="PayRefNo"
                    value={values.PayRefNo}
                    length={10}
                    onChange={handleInputChange}
                    error={errors.PayRefNo}
                  />
                </Grid>
                }
                {docType === 'BR' &&
                  <>
                    <Grid item xs={12} sm={4}>
                      <Controls.ReactDatePicker
                        label="Pay Ref date"
                        value={values.PayRefDate}
                        onChange={(date: Date) =>
                          handleInputChange({
                            target: { value: globalService.convertLocalToUTCDate(date), name: "PayRefDate" },
                          })
                        }
                        error={errors.PayRefDate}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controls.Select

                        label="Bank"
                        name="BankId"
                        value={banks.length > 0 ? values.BankId : ""}
                        onChange={handleInputChange}
                        options={banks}
                        error={errors.BankId}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controls.Input
                        label="Branch"
                        name="Branch"
                        value={values.Branch}
                        onChange={handleInputChange}
                        error={errors.Branch}
                      />
                    </Grid>
                  </>
                }
                {(docType === 'SB' || docType === 'EB' || docType === 'PB') &&
                  <>
                    <Grid item xs={12} sm={4}>
                      <Controls.Input
                        label="Bill No"
                        name="BillNo"
                        value={values.BillNo}
                        onChange={handleInputChange}
                        error={errors.BillNo}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controls.ReactDatePicker
                        label="Bill Date"
                        value={values.BillDate}
                        onChange={(date: Date) =>
                          handleInputChange({
                            target: { value: globalService.convertLocalToUTCDate(date), name: "BillDate" },
                          })
                        }
                        error={errors.BillDate}
                      />
                    </Grid>
                  </>
                }
                {docType === 'PB' && <>
                  <Grid item xs={12} sm={4}>
                    <Controls.Input
                      label="Delivery Document No"
                      name="DelDocNo"
                      value={values.DelDocNo}
                      onChange={handleInputChange}
                      error={errors.DelDocNo}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controls.ReactDatePicker
                      label="Delivery Document Date"
                      value={values.DelDocDate}
                      onChange={(date: Date) =>
                        handleInputChange({
                          target: { value: globalService.convertLocalToUTCDate(date), name: "DelDocDate" },
                        })
                      }
                      error={errors.DelDocDate}
                    />
                  </Grid>
                </>
                }
              </Grid>
            </React.Fragment>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Stack spacing={2} direction="row">
              <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}>Submit</Button>
              <Button variant="outlined" startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/acTransactions/" + societySubscriptionId + "/" + docType)}
              >Back To List</Button>
            </Stack>

          </CardActions>
        </Card>
      </form>
    </>
  );
}

export default AcTransactionsForm;