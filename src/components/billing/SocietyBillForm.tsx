import React, { useEffect, useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import {
  Grid,
  CardHeader,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  IconButton,
  Stack,
  Link,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogProps,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { societyBillSeriesService } from "../../services/SocietyBillSeriesService";
import { societyBillsService } from "../../services/SocietyBillsService";
import { SocietyBillsModel } from "../../models/SocietyBillsModel";
import fileDownload from "js-file-download";
import { SelectListModel } from "../../models/ApiResponse";
import useForm from "../../utility/hooks/UseForm";
import Controls from "../../utility/controls/Controls";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import SmsIcon from "@mui/icons-material/Sms";
import { appInfoService } from "../../services/AppInfoService";
import { globalService } from "../../services/GlobalService";
import { societiesService } from "../../services/SocietiesService";
import { SocietiesModel } from "../../models/SocietiesModel";
import ConfirmDialog from "../helper/ConfirmDialog";
import { Messages, ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";
import { useSharedNavigation } from "../../utility/context/NavigationContext";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    border: "0.5px solid grey",
    display: "inline-flex",
    width: "100% !important",
    margin: "0px !important",
  },
  item: {
    border: "0.5px solid grey",
    paddingTop: "2px !important",
  },
  footerCell: {
    // border: '0.5px solid grey',
    fontWeight: "bold !important",
  },
  tableHead: {
    backgroundColor: "lightgrey !important",
    fontWeight: "bold !important",
  },
}));

const SocietyBillForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  const { societyId }: any = useParams();
  let navigate = useNavigate();
  const [societyBills, setSocietyBills] = useState([]);
  const [billAbbreviations, setBillAbbreviations] = useState<SelectListModel[]>(
    []
  );
  const [billDates, setBillDates] = useState<SelectListModel[]>([]);
  let societySubscriptionId = localStorage.getItem("societySubscriptionId");
  ///////////
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const [isReversalVisible, setIsReversalVisible] = useState(false);
  const [SocietyCollectionReversals, setSocietyCollectionReversals] = useState(false);
  const [totWithGSTAmount, setTotWithGSTAmount] = useState<any>([]);
  const [totWithOutGSTAmount, setTotWithOutGSTAmount] = useState<any>();
  const [societyBill, setSocietyBill] = useState<any>(
    societyBillsService.initialFieldValues
  );
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("lg");
  const [open, setOpen] = React.useState(false);
  const [appInfo, setAppInfo] = React.useState(null);
  const [society, setSociety] = useState<SocietiesModel>(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', onConfirm: () => { } });
  const { goToHome } = useSharedNavigation();
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const validate = (fieldValues: SocietyBillsModel = values) => {
    let temp: any = { ...errors };

    if ("BillAbbreviation" in fieldValues)
      temp.BillAbbreviation = fieldValues.BillAbbreviation
        ? ""
        : "Bill Abbreviation is required.";
    // if ("BillDate" in fieldValues)
    //   temp.BillDate = fieldValues.BillDate ? "" : "Bill Date is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange } = useForm(
    societyBillsService.initialFieldAddSocietyBillValues,
    validate,
    societyId
  );

  const newSocietyBillSeries = () => {
    setValues(societyBillsService.initialFieldAddSocietyBillValues);
  };

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (!society) getSociety();
    if (billAbbreviations.length === 0) getBillAbbreviation();
    else {
      //setIsReceiptVisible(true);
      //setIsReversalVisible(true);
      newSocietyBillSeries();
      //(SocietyCollectionReversals != true ? isReversalVisible : "")
      setErrors({});
    }
    getAppInfo();

  }, [societyId]);

  const getSociety = () => {
    societiesService.getById(societyId).then((response) => {
      let result = response.data;
      setSociety(result.data);
    });
  };
  const getAppInfo = () => {
    appInfoService.getAppInfo().then((response) => {

      let result = response.data;
      setAppInfo(result.row);
      //values.res=result.list.FlagInfo.GstBill
    });
  };

  //let totLength = 0;
  //let WithGSTAmount = 0;
  let TotWithGSTAmount = 0;
  //let WithOutGSTAmount = 0;
  let TotWithOutGSTAmount = 0;

  //////////////////////////////////////

  const getBillDetailPopup = (societyBillId: any) => {
    handleOpen();
    societyBillsService
      .getViewSocietyBill(societyBillId, societySubscriptionId)
      .then((response) => {

        if (response) {
          let result = response.data;

          setSocietyBill(result.data);
          if (response.data.data.SocietyReceipts.length !== 0) {
            setIsReceiptVisible(true);
            //setIsReversalVisible(true);
          }
          else {
            setIsReceiptVisible(false);
          }
          if (response.data.data.SocietyCollectionReversals.length !== 0) {
            setIsReversalVisible(true);
          }
          else { setIsReversalVisible(false); }

          //totLength = response.data.data.spSocietyBillChargeHeads.length;
          //74, 2030
          if (response.data?.data?.spSocietyBillChargeHeads) {
            TotWithGSTAmount = response.data.data.spSocietyBillChargeHeads
              .filter((x: any) => x.ChargeTax === true)
              .map((t: any) => t.Amount)
              .reduce((prev: any, next: any) => prev + next, 0);
            TotWithOutGSTAmount = response.data.data.spSocietyBillChargeHeads
              .filter((x: any) => x.ChargeTax === false)
              .map((t: any) => t.Amount)
              .reduce((prev: any, next: any) => prev + next, 0);
            // for (var i = 0; i < totLength; i++) {
            //   if (response.data.data.spSocietyBillChargeHeads[i].ChargeTax === true) {
            //     WithGSTAmount = parseFloat(
            //       response.data.data.spSocietyBillChargeHeads[i].Amount
            //     );
            //     TotWithGSTAmount += WithGSTAmount
            //   }
            //   if (response.data.data.spSocietyBillChargeHeads[i].ChargeTax === false) {
            //     WithOutGSTAmount = parseFloat(
            //       response.data.data.spSocietyBillChargeHeads[i].Amount
            //     );
            //     TotWithOutGSTAmount += WithOutGSTAmount
            //   }
            // }
            setTotWithGSTAmount(TotWithGSTAmount);
            setTotWithOutGSTAmount(TotWithOutGSTAmount);
          }
        } else {
          setIsReceiptVisible(false);
          setIsReversalVisible(false);
        }
      });
  };

  const totalAmount =
    parseFloat(societyBill.UAmount) +
    (societyBill.Interest || 0) +
    (societyBill.TaxAmount || 0);

  const getBillAbbreviation = () => {
    societyBillSeriesService
      .getSelectListBySocietyId(societyId)
      .then((response) => {
        setBillAbbreviations(response.data);
        // if (response.data.length > 0) {
        //   values.BillAbbreviation = response.data[0].Value;
        // }
      });
  };

  // const downloadPDF = (societyBillId: any) => {
  //   societyBillsService.createPdf(societyBillId).then((response) => {
  //     let result = response.data;
  //     fileDownload(result, "SocietyBill.pdf");
  //   });
  // }
  const downloadBillsReceiptsPDF = (billId: any) => {
    values.SocietyId = societyId;
    values.SocietySubscriptionId = societySubscriptionId;
    values.SocietyBillId = billId;
    let isValidated = billId ? true : validate(); // if single bill then no validate method will be called
    if (isValidated) {
      societyBillsService.createBillsReceiptsPdf(values).then((response) => {
        let result = response.data;
        fileDownload(result, "SocietyBillsReceipts.pdf");
      });
    }
  };

  const ListBillDates = (billAbbreviation: any) => {
    var societysubscriptionId = localStorage.getItem("societySubscriptionId");
    if (billAbbreviation) {
      societyBillsService
        .ListBillDatesBySubscriptionIDAndBillAbbr(
          societysubscriptionId,
          billAbbreviation
        )
        .then((response) => {
          setBillDates(response.data);
          // if (response.data.length > 0) {
          //   values.BillAbbreviation = response.data[0].Value;
          // }
        });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    values.SocietyId = societyId;
    if (validate()) {
      societyBillsService
        .GetBySocietyIDBillDateBillAbbreviation(values)
        .then((response) => {
          let result = response.data;
          setSocietyBills(result.list);
        });
    }
  };

  const SendEmail = (billId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    values.SocietyId = societyId;
    values.SocietySubscriptionId = societySubscriptionId;
    values.SocietyBillId = billId;
    let isValidated = billId ? true : validate(); // if single bill then no validate method will be called
    if (isValidated) {
      societyBillsService
        .SendBillEmail(values)
        .then((response) => {
          let result = response.data;
          if (result.isSuccess) {
            globalService.success(result.message);
          }
        });
    }
  }

  const SendSms = (billId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    values.SocietyId = societyId;
    values.SocietySubscriptionId = societySubscriptionId;
    values.SocietyBillId = billId;
    let isValidated = billId ? true : validate(); // if single bill then no validate method will be called
    if (isValidated) {
      societyBillsService
        .SendBillSms(values)
        .then((response) => {
          let result = response.data;
          if (result.isSuccess) {
            globalService.success(result.message);
          }
        });
    }
  }

  const columns: GridColDef[] = [
    {
      field: "SocietyBuildingUnit.SocietyBuilding.Building",
      headerName: "Building",
      width: 130,
      flex: 1,
      valueGetter: (params) =>
        params.row.SocietyBuildingUnit?.SocietyBuilding?.Building,
    },
    {
      field: "Rev",
      headerName: "Rev",
      width: 130,
      flex: 1,
      valueGetter: (params) =>
        params.row.SocietyCollectionReversals?.SocietyBuilding?.Building,
    },
    {
      field: "SocietyBuildingUnit.Unit",
      headerName: "Unit",
      width: 130,
      flex: 1,
      valueGetter: (params) => params.row.SocietyBuildingUnit?.Unit,
    },
    { field: "BillNo", headerName: "Bill No", width: 130, flex: 2 },
    { field: "UAmount", headerName: "Amount", width: 130, flex: 1 },
    { field: "Arrears", headerName: "Arrears", width: 130, flex: 1 },
    {
      field: "InterestArrears",
      headerName: "Interest Arrears",
      width: 90,
    },
    { field: "Interest", headerName: "Interest", width: 130, flex: 1 },
    { field: "Payable", headerName: "Payable", width: 130, flex: 1 },
    {
      field: "Actions",
      headerName: "Actions",
      type: "number",
      flex: 2.5,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={0}>
            <Button
              className="btnGrid"
              variant="contained"
              size="small"
              onClick={() => getBillDetailPopup(params.row.SocietyBillId)

              }
            //target="_blank"
            //href={"/viewBill/" + societyId + "/" + params.row.SocietyBillId}
            // onClick={() =>
            //   navigate(
            //     "/viewBill/" + societyId + "/" + params.row.SocietyBillId
            //   )
            // }
            >
              View
            </Button>

            {society && society.EnableEmail === true && <Button
              className="btnGrid"
              variant="contained"
              size="small"
              onClick={() => SendEmail(params.row.SocietyBillId)}
            >
              Send Email
            </Button>
            }
            {society && society.EnableSms === true &&
              <Button
                className="btnGrid"
                variant="contained"
                size="small"
                onClick={() => SendSms(params.row.SocietyBillId)}
              >
                Send SMS
              </Button>
            }
          </Stack>
        );
      },
    },
  ];

  const classes = useStyles();

  return (
    <>
      <Typography variant="h5" align="center">
        Society Bills
      </Typography>
      <form noValidate onSubmit={handleSubmit}>
        <Card>
          <CardHeader title="Billing Parameters" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Controls.Select
                  name="BillAbbreviation"
                  label="Bill Abbreviation"
                  required
                  showEmptyItem={true}
                  options={billAbbreviations}
                  value={
                    billAbbreviations.length > 0 ? values.BillAbbreviation : ""
                  }
                  onChange={(e: any) => {
                    handleInputChange(e);
                    ListBillDates(e.target.value);
                  }}
                  error={errors.BillAbbreviation}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controls.Select
                  name="BillDate"
                  showEmptyItem={false}
                  label="Bill Date"
                  required
                  value={billDates.length > 0 ? values.BillDate : ""}
                  onChange={handleInputChange}
                  options={billDates}
                  error={errors.BillDate}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}>
                  Go
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Button
              style={{ marginRight: "2vh" }}
              variant="contained"
              startIcon={<DownloadIcon />}
              // size="small"
              onClick={() => downloadBillsReceiptsPDF(null)}
            >
              Download Bills/Receipts PDF
            </Button>
            {society && society.EnableEmail === true && <Button
              //disabled
              style={{ marginRight: "2vh" }}
              variant="contained"
              startIcon={<EmailIcon />}
              //onClick={() => SendEmail(null)}
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: "Are you sure you want to Send Email to all? ",
                  onConfirm: () => { SendEmail(null) }
                })
              }}
            >
              Send Email to All
            </Button>
            }
            {society && society.EnableSms === true &&
              <Button
                style={{ marginRight: "2vh" }}
                variant="contained"
                startIcon={<SmsIcon />}
                onClick={() => {
                  setConfirmDialog({
                    isOpen: true,
                    title: "Are you sure you want to Send SMS to all? ",
                    onConfirm: () => { SendSms(null) }
                  })
                }}
              >
                Send SMS to All
              </Button>
            }

            <div style={{ width: "100%" }}>
              <DataGrid
                getRowId={(row) => row.SocietyBillId}
                rows={societyBills}
                columns={columns}
                columnHeaderHeight={30}
                //rowHeight={30}
                autoHeight={true}
                getRowHeight={() => "auto"}
                getEstimatedRowHeight={() => 200}
                initialState={{
                  columns: {
                    columnVisibilityModel: {},
                  },
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                pageSizeOptions={[10, 25, 50, 100]}
              />
            </div>
          </CardContent>
        </Card>
        <Stack spacing={2} direction="row" justifyContent={"center"}>
          <Button
            variant="contained"
            color="info"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Stack>
      </form>

      <div>
        <Dialog
          fullWidth={true}
          maxWidth={maxWidth}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle id="customized-dialog-title">
            <Grid>Society Bill & Receipt</Grid>
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme: any) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <>
              <Card sx={{ width: "100%" }}>
                <CardContent>
                  <React.Fragment>
                    <Box sx={{ width: "100%" }}>
                      <Grid
                        container
                        fontSize={14}
                        border={"1px solid rgba(224, 224, 224, 1)"}
                      >
                        <Grid item xs={12} sm={12} md={12} textAlign={"center"}>
                          <div
                            style={{
                              fontSize: "15px",
                              alignContent: "center",
                              fontWeight: "bold",
                            }}
                          >
                            {societyBill.Society?.Society}
                          </div>
                          <div
                            style={{ fontSize: "11px", alignContent: "center" }}
                          >
                            Regd. No. : {societyBill.Society?.RegistrationNo}{" "}
                            Dated :{" "}
                            {societyBill.Society?.RegistrationDate
                              ? dayjs(
                                societyBill.Society?.RegistrationDate
                              ).format("DD-MMM-YYYY")
                              : ""}
                            ,
                            {societyBill.Society?.TaxRegistrationNo == null
                              ? ""
                              : `GST No. : ${societyBill.Society?.TaxRegistrationNo}`}
                          </div>
                          <div
                            style={{ fontSize: "13px", alignContent: "center" }}
                          >
                            {societyBill.Society?.Address},
                            {societyBill.Society?.City} -{" "}
                            {societyBill.Society?.Pin}
                          </div>
                          <div
                            style={{ fontSize: "15px", alignContent: "center" }}
                          >
                            --
                            <u>
                              <strong>
                                {societyBill.SocietyBillSeries?.Note} B I L L{" "}
                              </strong>
                            </u>
                          </div>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        fontSize={14}
                        border={"1px solid rgba(224, 224, 224, 1)"}
                      >
                        <Grid item xs={4} sm={4} md={4} paddingLeft={1}>
                          <strong>
                            Unit No:{" "}
                            {
                              societyBill.SocietyBuildingUnit?.SocietyBuilding
                                ?.Building
                            }
                            -{societyBill.SocietyBuildingUnit?.Unit}
                          </strong>
                          <br />
                          <strong>
                            Name: {societyBill.SocietyMember?.Member}
                          </strong>
                        </Grid>

                        <Grid
                          item
                          xs={4}
                          sm={4}
                          md={4}
                          textAlign={"center"}
                          style={{ whiteSpace: "pre-line" }}
                        >
                          <strong>
                            {societyBill.Particulars}
                            {/* {dayjs(societyBill.RegistrationDate).format( "DD-MMM-YYYY" )} */}
                          </strong>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          sm={4}
                          md={4}
                          textAlign={"right"}
                          paddingRight={1}
                        >
                          <strong>
                            Bill No.: {societyBill.BillNo}
                            <br />
                            Bill Date:{" "}
                            {dayjs(societyBill.BillDate).format("DD-MMM-YYYY")}
                            <br />
                            Bill Due Date:{" "}
                            {dayjs(societyBill.DueDate).format("DD-MMM-YYYY")}
                          </strong>
                        </Grid>
                      </Grid>

                      <Table className="tblReceipt"
                        sx={{
                          width: "100% !important", border: "0.5 solid",
                          display: { xs: 'block', md: 'table' },
                          overflowX: 'auto',
                          //whiteSpace: 'nowrap'
                        }}
                      >
                        {appInfo?.FlagInfo?.GstBill === false ? (
                          <TableBody>
                            <TableRow>
                              <TableCell
                                size="small"
                                colSpan={2}
                                className={classes.tableHead}
                              >
                                Customer GST No :{" "}
                                {societyBill.SocietyMember?.GstNo ||
                                  "Not Available"}
                                &nbsp; &nbsp; &nbsp; &nbsp; Place Of Delivery :{" "}
                                {societyBill.Society?.State?.State}
                              </TableCell>
                            </TableRow>

                            <TableRow className={classes.tableHead}>
                              <TableCell size="small">
                                <strong>Nature Of Charges</strong>
                              </TableCell>
                              <TableCell size="small" width={150}>
                                <strong>Amount (Rs.)&nbsp;</strong>
                              </TableCell>
                            </TableRow>
                            {societyBill.spSocietyBillChargeHeads?.map(
                              (item: any) => (
                                <TableRow key={item.ChargeHead}>
                                  <TableCell size="small">
                                    {item.ChargeHead} {" "}
                                    {item.ChargeTax && "(GST)"}
                                  </TableCell>
                                  <TableCell size="small">
                                    {item.Amount}&nbsp;
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                            <TableRow>
                              <TableCell size="small">&nbsp;</TableCell>
                              <TableCell size="small">&nbsp;</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                size="small"
                                className={classes.footerCell}
                              >
                                Gross Amount
                              </TableCell>
                              <TableCell
                                size="small"
                                className={classes.footerCell}
                              >
                                {societyBill.UAmount +
                                  (societyBill.Interest ?? 0) +
                                  (societyBill.TaxAmount ?? 0)}
                              </TableCell>
                            </TableRow>
                            {societyBill.Arrears !== null &&
                              societyBill.Arrears !== 0 && (
                                <TableRow>
                                  <TableCell size="small">
                                    Additional Arrears
                                  </TableCell>
                                  <TableCell size="small">
                                    <>{societyBill.Arrears}</>
                                  </TableCell>
                                </TableRow>
                              )}
                            {societyBill.InterestArrears !== null &&
                              societyBill.InterestArrears !== 0 && (
                                <TableRow>
                                  <TableCell size="small">
                                    Additional Interest Arrears
                                  </TableCell>
                                  <TableCell size="small">
                                    <>{societyBill.InterestArrears}</>
                                  </TableCell>
                                </TableRow>
                              )}
                            {societyBill.NonChgArrears !== null &&
                              societyBill.NonChgArrears !== 0 && (
                                <TableRow>
                                  <TableCell size="small">
                                    Additional Non Chargeable Arrears
                                  </TableCell>
                                  <TableCell size="small">
                                    <>{societyBill.NonChgArrears}</>
                                  </TableCell>
                                </TableRow>
                              )}
                            {societyBill.TaxArrears !== null &&
                              societyBill.TaxArrears !== 0 && (
                                <TableRow>
                                  <TableCell size="small">
                                    Additional Tax Arrears
                                  </TableCell>
                                  <TableCell size="small">
                                    <>{societyBill.TaxArrears}</>
                                  </TableCell>
                                </TableRow>
                              )}
                            {societyBill.Advance !== null &&
                              societyBill.Advance !== 0 && (
                                <TableRow>
                                  <TableCell size="small">Less Advance</TableCell>
                                  <TableCell size="small">
                                    <>{societyBill.Advance}</>
                                  </TableCell>
                                </TableRow>
                              )}
                            <TableRow>
                              <TableCell
                                size="small"
                                className={classes.footerCell}
                              >
                                Net Amount Payable
                              </TableCell>
                              <TableCell
                                size="small"
                                className={classes.footerCell}
                              >
                                <span className="WebRupee">Rs.</span>
                                {societyBill.Payable}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                          // Ends TaxApplicable == true section
                        ) : (
                          <TableBody>
                            <TableRow className={classes.tableHead}>
                              <TableCell size="small">
                                <strong>Nature Of Charges</strong>
                              </TableCell>
                              <TableCell size="small">
                                <strong>HSN Code</strong>
                              </TableCell>
                              <TableCell size="small" width={150}>
                                <strong>GST Amount (Rs.)&nbsp;</strong>
                              </TableCell>
                              <TableCell size="small" width={150}>
                                <strong>Non GST Amount (Rs.)</strong>
                              </TableCell>
                            </TableRow>
                            {societyBill.spSocietyBillChargeHeads?.map(
                              (item: any) => (
                                // {
                                //   item.Nature==="I" ||item.Nature==="T"&&(

                                //   )
                                // }
                                <TableRow key={item.ChargeHead}>
                                  <TableCell size="small">
                                    {item.ChargeHead}{" "}
                                    {item.ChargeTax && "(GST)"}
                                  </TableCell>
                                  <TableCell size="small">
                                    {item.HSNCode}&nbsp;
                                  </TableCell>
                                  {item.ChargeTax === true ? (
                                    <TableCell size="small">
                                      {item.Amount}&nbsp;
                                    </TableCell>
                                  ) : (
                                    <TableCell size="small"></TableCell>
                                  )}

                                  {item.ChargeTax === false ? (
                                    <TableCell size="small">
                                      {item.Amount}&nbsp;
                                    </TableCell>
                                  ) : (
                                    <TableCell size="small"></TableCell>
                                  )}
                                </TableRow>
                              )
                            )}
                            <TableRow>
                              <TableCell size="small">&nbsp;</TableCell>
                              <TableCell size="small">&nbsp;</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                size="small"
                                className={classes.footerCell}
                              >
                                Gross Amount
                              </TableCell>
                              <TableCell size="small"></TableCell>
                              <TableCell
                                size="small"
                                className={classes.footerCell}
                              >
                                {totWithGSTAmount}
                              </TableCell>
                              <TableCell
                                size="small"
                                className={classes.footerCell}
                              >
                                {totWithOutGSTAmount}
                              </TableCell>
                            </TableRow>
                            {societyBill.Arrears !== null &&
                              societyBill.Arrears !== 0 && (
                                <TableRow>
                                  <TableCell size="small">
                                    Additional Arrears
                                  </TableCell>
                                  <TableCell size="small"></TableCell>
                                  <TableCell size="small"></TableCell>
                                  <TableCell size="small">
                                    <>{societyBill.Arrears}</>
                                  </TableCell>
                                </TableRow>
                              )}
                            {societyBill.InterestArrears !== null &&
                              societyBill.InterestArrears !== 0 && (
                                <TableRow>
                                  <TableCell size="small">
                                    Additional Interest Arrears
                                  </TableCell>
                                  <TableCell size="small"></TableCell>
                                  <TableCell size="small"></TableCell>
                                  <TableCell size="small">
                                    <>{societyBill.InterestArrears}</>
                                  </TableCell>
                                </TableRow>
                              )}
                            {societyBill.NonChgArrears !== null &&
                              societyBill.NonChgArrears !== 0 && (
                                <TableRow>
                                  <TableCell size="small">
                                    Additional Non Chargeable Arrears
                                  </TableCell>
                                  <TableCell size="small"></TableCell>
                                  <TableCell size="small"></TableCell>
                                  <TableCell size="small">
                                    <>{societyBill.NonChgArrears}</>
                                  </TableCell>
                                </TableRow>
                              )}
                            {societyBill.TaxArrears !== null &&
                              societyBill.TaxArrears !== 0 && (
                                <TableRow>
                                  <TableCell size="small">
                                    Additional Tax Arrears
                                  </TableCell>
                                  <TableCell size="small"></TableCell>
                                  <TableCell size="small"></TableCell>
                                  <TableCell size="small">
                                    <>{societyBill.TaxArrears}</>
                                  </TableCell>
                                </TableRow>
                              )}
                            {societyBill.Advance !== null &&
                              societyBill.Advance !== 0 && (
                                <TableRow>
                                  <TableCell size="small">Less Advance</TableCell>
                                  <TableCell size="small"></TableCell>
                                  <TableCell size="small"></TableCell>
                                  <TableCell size="small">
                                    <>{societyBill.Advance}</>
                                  </TableCell>
                                </TableRow>
                              )}
                            <TableRow>
                              <TableCell
                                size="small"
                                className={classes.footerCell}
                              >
                                Net Amount Payable
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell size="small"></TableCell>
                              <TableCell
                                size="small"
                                className={classes.footerCell}
                              >
                                <span className="WebRupee">Rs.</span>
                                {societyBill.Payable}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        )}
                      </Table>

                      <Typography>
                        <strong>IN WORDS :{societyBill.PayableString}</strong>
                      </Typography>
                      <Box style={{ whiteSpace: "pre-line" }}>
                        {societyBill.SocietyBillSeries?.Terms}
                        {/* {termsArray.map((data: any, index: any) => (
                  <Box key={index}>
                    <p>{data}</p>
                  </Box>
                ))} */}
                      </Box>
                      <Typography align="right" marginTop={2} fontWeight={500}>
                        For {societyBill.Society?.Society.toUpperCase()}
                      </Typography>
                      <Typography>Checked By:</Typography>
                      <Typography align="right">
                        {societyBill.Society?.Signatory}
                      </Typography>
                    </Box>
                    {/* <Grid container spacing={2}>
              <Grid item>
                <Button
                  onClick={() => downloadPDF(societyBillId)}
                  variant="contained"
                  className="button"
                >
                  Download PDF
                </Button>
              </Grid>
            </Grid> */}
                  </React.Fragment>
                </CardContent>
              </Card>
              {(isReceiptVisible || isReversalVisible) && (
                <Card sx={{ width: "100%" }}>
                  <CardContent>
                    <React.Fragment>
                      <Box sx={{ width: "100%" }}>
                        <Typography
                          variant="h5"
                          component="legend"
                          textAlign={"center"}
                        >
                          Receipt
                        </Typography>
                        <Table sx={{ width: "100%" }}>
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ textAlign: "center" }}>
                                <div
                                  style={{
                                    fontSize: "15px",
                                    alignContent: "center",
                                  }}
                                >
                                  <strong>
                                    {societyBill.Society?.Society}
                                  </strong>
                                </div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    alignContent: "center",
                                  }}
                                >
                                  Regd. No. :{" "}
                                  {societyBill.Society?.RegistrationNo} Dated :{" "}
                                  {dayjs(
                                    societyBill.Society?.RegistrationDate
                                  ).format("DD-MMM-YYYY")}
                                  ,
                                  {societyBill.Society?.TaxRegistrationNo ==
                                    null
                                    ? ""
                                    : `GST No. : ${societyBill.Society?.TaxRegistrationNo}`}
                                </div>
                                <div
                                  style={{
                                    fontSize: "13px",
                                    alignContent: "center",
                                  }}
                                >
                                  {societyBill.Society?.Address},
                                  {societyBill.Society?.City} -{" "}
                                  {societyBill.Society?.Pin}
                                </div>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Table>
                          <TableHead className={classes.tableHead}>
                            <TableRow>
                              <TableCell size="small">Receipt No.</TableCell>
                              <TableCell size="small">Receipt Date</TableCell>
                              <TableCell size="small">Cheque No</TableCell>
                              <TableCell size="small">Dated</TableCell>
                              <TableCell size="small">Bank Name</TableCell>
                              <TableCell size="small">Amount</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {societyBill.SocietyReceipts?.map(
                              (item: any, index: any) => (
                                <TableRow key={index}>
                                  <TableCell size="small">
                                    {item.ReceiptNo}
                                  </TableCell>
                                  <TableCell size="small">
                                    {item.ReceiptDate
                                      ? dayjs(item.ReceiptDate).format(
                                        "DD-MMM-YYYY"
                                      )
                                      : ""}
                                  </TableCell>

                                  {item.SocietyPayModes ? (
                                    <>
                                      {item.SocietyPayModes.AskDetails ? (
                                        <>
                                          <TableCell size="small">
                                            {item.PayRefNo}
                                          </TableCell>
                                          <TableCell size="small">
                                            {item.PayRefDate
                                              ? dayjs(item.PayRefDate).format(
                                                "DD-MMM-YYYY"
                                              )
                                              : ""}
                                          </TableCell>
                                          <TableCell size="small">
                                            {item.Bank ? item.Bank?.Bank : ""}{" "}
                                          </TableCell>
                                          <TableCell size="small">
                                            {item.Amount}
                                          </TableCell>
                                        </>
                                      ) : (
                                        <>
                                          <TableCell
                                            colSpan={3}
                                            size="small"
                                          ></TableCell>
                                          <TableCell size="small">
                                            {item.Amount}
                                          </TableCell>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <TableCell
                                        colSpan={3}
                                        size="small"
                                      ></TableCell>
                                      <TableCell size="small">
                                        {item.Amount}
                                      </TableCell>
                                    </>
                                  )}
                                </TableRow>
                              )
                            )}
                            {isReversalVisible && societyBill.SocietyCollectionReversals?.map(
                              (item: any, index: any) => (
                                <TableRow key={index}>
                                  <TableCell size="small">
                                    {item.DocNo}
                                  </TableCell>
                                  <TableCell size="small">
                                    {item.ReversalDate
                                      ? dayjs(item.ReversalDate).format(
                                        "DD-MMM-YYYY"
                                      )
                                      : ""}
                                  </TableCell>
                                  {item.SocietyPayModes ? (
                                    <>
                                      {item.SocietyPayModes.AskDetails ? (
                                        <>
                                          <TableCell size="small">
                                            {item.PayRefNo}
                                          </TableCell>
                                          <TableCell size="small">
                                            {item.PayRefDate
                                              ? dayjs(item.PayRefDate).format(
                                                "DD-MMM-YYYY"
                                              )
                                              : ""}
                                          </TableCell>
                                          <TableCell size="small">
                                            {item.Bank ? item.Bank?.Bank : ""}{" "}
                                          </TableCell>
                                          <TableCell size="small">
                                            {item.SocietyReceipt?.Amount * -1}
                                          </TableCell>
                                        </>
                                      ) : (
                                        <>
                                          <TableCell
                                            colSpan={3}
                                            size="small"
                                          ></TableCell>
                                          <TableCell size="small">
                                            {item.SocietyReceipt?.Amount * -1}
                                          </TableCell>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <TableCell
                                        colSpan={3}
                                        size="small"
                                      ></TableCell>
                                      <TableCell size="small">
                                        {item.SocietyReceipt?.Amount * -1}
                                      </TableCell>
                                    </>
                                  )}
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                        <Typography></Typography>
                        <Box style={{ whiteSpace: "pre-line" }}>
                          {societyBill.Note}
                          {/*  {noteArray.map((data: any, index: any) => (
                    <Box key={index}>
                      <p>{data}</p>
                    </Box>
                  ))} */}
                        </Box>
                        <Typography>
                          <strong>{societyBill.TotalAmountInWords}</strong>
                        </Typography>
                        <Typography
                          align="right"
                          marginTop={2}
                          fontWeight={500}
                        >
                          For {societyBill.Society?.Society.toUpperCase()}
                        </Typography>
                        <Typography>Checked By:</Typography>
                        <Typography align="right">
                          {societyBill.Society?.Signatory}
                        </Typography>
                      </Box>
                    </React.Fragment>
                  </CardContent>
                </Card>
              )}

              <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                <Stack spacing={2} direction="row">
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DownloadIcon />}
                    onClick={() => downloadBillsReceiptsPDF(societyBill.SocietyBillId)}
                  >
                    PDF
                  </Button>
                </Stack>
              </CardActions>
            </>
          </DialogContent>
        </Dialog>
        <ConfirmDialog
          confirmDialog={confirmDialog}
          setConfirmDialog={setConfirmDialog}
        />
      </div>
    </>
  );
};

export default SocietyBillForm;
