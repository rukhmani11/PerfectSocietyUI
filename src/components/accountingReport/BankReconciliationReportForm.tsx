import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Controls from "../../utility/controls/Controls";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useForm from "../../utility/hooks/UseForm";
import { SelectListModel } from "../../models/ApiResponse";
import { globalService } from "../../services/GlobalService";
import fileDownload from "js-file-download";
import dayjs from "dayjs";
import { BankReconciliationReportModel } from "../../models/AccountingReportModel";
import { accountingReportService } from "../../services/AccountingReportService";
import { acHeadsService } from "../../services/AcHeadsService";
import DownloadIcon from "@mui/icons-material/Download";
import { appInfoService } from "../../services/AppInfoService";
import { useSharedNavigation } from "../../utility/context/NavigationContext";

const BankReconciliationReportForm = () => {
  const location = useLocation();
  const { societyId, societySubscriptionId, type }: any = useParams();
  const [acHeads, setAcHeads] = useState<SelectListModel[]>([]);
  const [otherReport, setotherReport] = useState(false);
  let navigate = useNavigate();
  const { goToHome } = useSharedNavigation();

  const validate = (fieldValues: BankReconciliationReportModel = values) => {
    let temp: any = { ...errors };

    if ("AsOnDate" in fieldValues)
      temp.AsOnDate = fieldValues.AsOnDate ? "" : "As On Date is required.";
    if ("AcHeadId" in fieldValues)
      temp.AcHeadId = fieldValues.AcHeadId ? "" : "Bank Account is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(
      accountingReportService.initialBankReconciliationReportFieldValues,
      validate,
      societyId
    );

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info('Society is not selected.');
      return goToHome();
    }
    if (acHeads.length === 0) getAcHeadsForSocietyByNature();
    getAppinfo();
  }, []);

  const newReport = () => {
    setValues(
      setFormValue(
        accountingReportService.initialBankReconciliationReportFieldValues
      )
    );
  };

  const getAcHeadsForSocietyByNature = () => {
    acHeadsService
      .getSelectListBySocietyIDNature(societyId, "B")
      .then((response) => {
        setAcHeads(response.data);
      });
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: BankReconciliationReportModel) {
    let newValue = {
      SocietyId: societyId,
      SocietySubscriptionId: societySubscriptionId,
      AsOnDate: new Date(model.AsOnDate),
      AcHeadId: model.AcHeadId,
    };
    return newValue;
  }

  const getAppinfo = () => {
    appInfoService.getAppInfo().then((response) => {
      setotherReport(response.data.row.FlagInfo?.OtherReportExcel);
    });
  };
  // const handleSubmit = (e: React.FormEvent) => {
  const downloadReport = (type: string) => {
    // e.preventDefault();
    if (validate()) {
      var model = setFormValue(values);
      if (type === "pdf") {
        accountingReportService
          .bankReconciliationReport(model)
          .then((response) => {
            let result = response.data;
            let fileName =
              "BankReconciliationReportAsOn" +
              dayjs(values.AsOnDate).format("DD-MMM-YYYY") +
              ".pdf";
            fileDownload(result, fileName);
          });
      } else {
        accountingReportService
          .bankReconciliationExportToExcel(model)
          .then((response) => {
            let result = response.data;
            let fileName =
              "BankReconciliationReportAsOn" +
              dayjs(values.AsOnDate).format("DD-MMM-YYYY") +
              ".xlsx";
            fileDownload(result, fileName);
          });
      }
    }
  };
  return (
    <>
      <Typography variant="h5" align="center">
        Bank Reconciliation Report
      </Typography>
      <form
        autoComplete="off"
        noValidate
        //className={classes.root}
        // onSubmit={handleSubmit}
      >
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <Controls.ReactDatePicker
                    label="As On Date"
                    onChange={(date: Date) =>
                      handleInputChange({
                        target: {
                          value: globalService.convertLocalToUTCDate(date),
                          name: "AsOnDate",
                        },
                      })
                    }
                    value={values.AsOnDate}
                    error={errors.AsOnDate}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Controls.Select
                    showEmptyItem={false}
                    name="AcHeadId"
                    label="Bank Account"
                    required
                    value={acHeads.length > 0 ? values.AcHeadId : ""}
                    onChange={(e: any) => {
                      handleInputChange(e);
                    }}
                    options={acHeads}
                    error={errors.AcHeadId}
                  />
                </Grid>
              </Grid>
            </React.Fragment>
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "center" }}>
            <Stack spacing={2} direction="row">
              <Button
                type="button"
                startIcon={<DownloadIcon />}
                variant="contained"
                onClick={(e) => downloadReport("pdf")}
              >
                PDF
              </Button>
              {otherReport && (
                <Button
                  type="button"
                  startIcon={<DownloadIcon />}
                  variant="contained"
                  color="success"
                  onClick={(e) => downloadReport("excel")}
                >
                  Excel
                </Button>
              )}
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

export default BankReconciliationReportForm;
