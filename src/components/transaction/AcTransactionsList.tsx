import React, { useState, useEffect } from "react";
import { actransactionsService } from "../../services/AcTransactionsService";
import {
  Stack,
  IconButton,
  Card,
  CardContent,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  Box,
  DialogProps,
} from "@mui/material";
import Controls from "../../utility/controls/Controls";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConfirmDialog from "../helper/ConfirmDialog";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { globalService } from "../../services/GlobalService";
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";
import DownloadIcon from "@mui/icons-material/Download";
import { societyReportService } from "../../services/SocietyReportService";
import { AcTransactionVoucherModel } from "../../models/SocietyReportModel";
import fileDownload from "js-file-download";
import CloseIcon from "@mui/icons-material/Close";
import { initialFieldValues } from "../../utility/context/AuthContext";
import AcTransactionView from "./AcTransactionView";
import { Messages } from "../../utility/Config";
import { useSharedNavigation } from "../../utility/context/NavigationContext";

const AcTransactionsList: React.FC = () => {
  let isFirstSocietySubscription = globalService.isFirstSocietySubscription();
  const [pageInfo, setPageInfo] = useState(null);
  const { goToHome } = useSharedNavigation();
  const [acTransactions, setAcTransactions] = useState([]);
  const { societySubscriptionId, docType }: any = useParams();
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("lg");
  const [acTransactionId, setAcTransactionId] = useState(null);
  const [selectedBtnId, setSelectedBtnId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => { },
  });

  const [fromDate, setFromDate] = useState(
    globalService.addMonths(new Date(), -3)
  );
  const [toDate, setToDate] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if ((docType.toUpperCase() === "OP" && !isFirstSocietySubscription)) {
      navigate('/unauthorized');
    }
    else {
      getForAcTransactionListPage();
      //searchAcTransactions(); 
    }
  }, []);
  const [open, setOpen] = React.useState(false);
  const handleOpen = (row: any) => {
    setAcTransactionId(row)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    //getclientEmployeeMultiple();
  };

  const getForAcTransactionListPage = () => {
    actransactionsService
      .getForAcTransactionListPage(societySubscriptionId, docType)
      .then((response) => {
        let result = response.data;
        setPageInfo(result.data);
        if (docType == "OP") {
          if (result.acTransactionId) {
            navigate(
              "/acTransactionsac/" +
              societySubscriptionId +
              "/OP/" +
              result.acTransactionId
            );
          }
        }
        else {
          if (localStorage.getItem("selectedAcTrans")) {
            searchAcTransactions();
          }
        }
        // else {
        //   if (result) {
        //     let fDate = globalService.convertLocalToUTCDate(new Date(result.data.ReceiptDate ? result.data.ReceiptDate : result.data.Subscription.SubscriptionStart));
        //     let tDate = globalService.convertLocalToUTCDate(new Date(result.data.Subscription.SubscriptionEnd));
        //     setFromDate(fDate);
        //     setToDate(tDate);
        //     searchAcTransactions(fDate, tDate);
        //   }
        // }
      });
  };

  //this wont work since fromDate and ToDate value changes are not updating on immediate function call  --if (!fromDate || !toDate) {
  const validate = (fDate: any, tDate: any) => {
    if (!fDate || !tDate) {
      globalService.error("Please select FromDate and ToDate.");
      return false;
    } else return true;
  };

  const searchAcTransactions = (item: any = null) => {
    
    let fDate = null, tDate = null;
    if (item) {
      localStorage.setItem('selectedAcTrans', JSON.stringify(item));
      setSelectedBtnId(item.btnId);
      fDate = item.fromDate;
      tDate = item.toDate;
    }
    else {
      if (localStorage.getItem("selectedAcTrans")) {
        let lastSelItem = JSON.parse(localStorage.getItem("selectedAcTrans"));
        setSelectedBtnId(lastSelItem.btnId);
        fDate = lastSelItem.fromDate;
        tDate = lastSelItem.toDate;
      }
    }

    setFromDate(fDate);
    setToDate(tDate);
    let model: AcTransactionVoucherModel = {
      SocietySubscriptionId: societySubscriptionId,
      DocType: docType,
      AcTransactionId: null,
      FromDate: fDate,
      ToDate: tDate,
      SocietyId: localStorage.getItem("societyId"),
    };
    if (validate(model.FromDate, model.ToDate)) {
      actransactionsService
        .getBySocietySubscriptionIdAndDocTypeForRange(model)
        .then((response) => {
          let result = response.data;
          setAcTransactions(result.list);
          if (result.list.length < 1) {
            globalService.error("No records found.");
          }
        });
    }
  };

  const downloadVoucher = (row: any) => {
    let model: AcTransactionVoucherModel = {
      SocietySubscriptionId: societySubscriptionId,
      DocType: row.DocType,
      AcTransactionId: row.AcTransactionId,
      FromDate: null,
      ToDate: null,
      SocietyId: localStorage.getItem("societyId"),
    };


    societyReportService.acTransactionVoucher(model).then((response) => {

      let result = response.data;
      let fileName = "AcTransVoucher.pdf";
      fileDownload(result, fileName);
    });
  };

  const downloadVoucherForRange = () => {
    let model: AcTransactionVoucherModel = {
      SocietySubscriptionId: societySubscriptionId,
      DocType: docType,
      AcTransactionId: null,
      FromDate: fromDate,
      ToDate: toDate,
      SocietyId: localStorage.getItem("societyId"),
    };

    societyReportService
      .acTransactionVoucherForRange(model)
      .then((response) => {
        let result = response.data;
        let fileName =
          "AcTransVoucherFrom" +
          dayjs(fromDate).format("DD-MMM-YYYY") +
          "To" +
          dayjs(toDate).format("DD-MMM-YYYY") +
          ".pdf";
        fileDownload(result, fileName);
      });
  };


  const columns: GridColDef[] = [
    { field: "DocNo", headerName: "Doc No", width: 140 },
    {
      field: "DocDate",
      headerName: "Doc Date",
      width: 110,
      valueGetter: (params) =>
        params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    { field: "Particulars", headerName: "Particulars", width: 130, flex: 1 },
    {
      field: "AcHead",
      headerName: "Account head",
      width: 130,
      valueGetter: (params) => params.row.AcHeads?.AcHead,
    },
    {
      field: "DrAmount",
      headerName: "Dr Amount",
      valueGetter: (params) =>
        params.row.DrAmount ? params.row.DrAmount?.toFixed(2) : 0.00,
    },
    {
      field: "CrAmount",
      headerName: "Cr Amount",
      width: 100,
      valueGetter: (params) => params.row.CrAmount ? params.row.CrAmount?.toFixed(2) : 0.00,
    },
    {
      field: "ChequeNo",
      headerName: "Cheque No.",

      valueGetter: (params) => params.row.PayRefNo,
    },
    {
      field: "PayMode",
      headerName: "Pay Mode",
      flex: 1,
      valueGetter: (params) =>
        params.row.SocietyPayMode ? params.row.SocietyPayMode?.PayMode : "",
    },
    { field: "PayRefNo", headerName: "Pay Ref No", flex: 1, width: 130 },
    {
      field: "PayRefDate",
      headerName: "PayRef Date",
      flex: 1,
      valueGetter: (params) =>
        params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    {
      field: "BankName",
      headerName: "Bank",
      flex: 1,
      width: 130,
      valueGetter: (params) =>
        params.row.Bank ? params.row.SocietyPayMode?.PayMode : "",
    },
    { field: "Branch", headerName: "Branch", flex: 1, width: 130 },
    { field: "BillNo", headerName: "Bill No", flex: 1, width: 130 },
    {
      field: "BillDate",
      headerName: "Bill Date",
      flex: 1,
      width: 130,
      valueGetter: (params) =>
        params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    { field: "DelDocNo", headerName: "Delivery Doc No", flex: 1, width: 130 },
    {
      field: "DelDocDate",
      headerName: "Delivery Doc Date",
      width: 130,
      valueGetter: (params) =>
        params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    {
      field: "Actions",
      headerName: "Actions",
      //flex: 1,
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Stack direction="row" spacing={0}>
              {pageInfo &&
                (docType === "MC" ||
                  docType === "YC" ||
                  (pageInfo.ShowBillingMenu && docType === "SB") ||
                  docType === "CV" ||
                  docType === "SB" ||
                  pageInfo.YearClosed) ? (
                <></>
              ) : (
                <>
                  {" "}
                  {pageInfo &&
                    (pageInfo.LockedTillDate == null ||
                      globalService.convertLocalToUTCDate(
                        new Date(params.row.DocDate)
                      ) >
                      globalService.convertLocalToUTCDate(
                        new Date(pageInfo.LockedTillDate)
                      )) && (
                      <>
                        <IconButton
                          size="small"
                          color="primary"
                          aria-label="add an alarm"
                          onClick={() =>
                            navigate(
                              "/editAcTransaction/" +
                              societySubscriptionId +
                              "/" +
                              docType +
                              "/" +
                              params.row.AcTransactionId
                            )
                          }
                        >
                          <EditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                          size="small"
                          aria-label="delete"
                          color="error"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title:
                                "Are you sure to delete Ac Transaction: " +
                                globalService.getDocTypeMenuText(docType) +
                                " Doc No: " +
                                params.row.DocNo +
                                "?",
                              subTitle: "You can't undo this operation",
                              onConfirm: () => {
                                removeAcTransaction(params.row.AcTransactionId);
                              },
                            });
                          }}
                        >
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </>
                    )}
                </>
              )}
              {/* <IconButton
                size="small"
                color="info"
                key={params.row.AcTransactionId}
                aria-label="add an alarm"
               
                onClick={handleOpen}
                // onClick={() =>
                //   navigate(
                //     "/viewAcTransaction/" +
                //     societySubscriptionId +
                //     "/" +
                //     docType +
                //     "/" +
                //     params.row.AcTransactionId
                //   )
                // }
              >
                <VisibilityIcon fontSize="inherit" />
              </IconButton> */}

              <IconButton
                size="small"
                color="info"
                //  onClick={handleOpen}
                onClick={() => handleOpen(params.row.AcTransactionId)}
              >
                <VisibilityIcon fontSize="inherit" />
              </IconButton>


              <Tooltip
                key={params.row.AcTransactionId}
                title="Download Voucher"
                placement="right"
              >
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => downloadVoucher(params.row)}
                >
                  <DownloadIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>

              <Button
                className="btnGrid"
                variant="contained"
                onClick={() =>
                  navigate(
                    "/acTransactionsac/" +
                    societySubscriptionId +
                    "/" +
                    docType +
                    "/" +
                    params.row.AcTransactionId
                  )
                }
              >
                Account
              </Button>
            </Stack>
          </>
        );
      },
    },
  ];

  const removeAcTransaction = (AcTransactionId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    actransactionsService.remove(AcTransactionId).then((response) => {
      let result = response.data;
      if (result.isSuccess) {
        globalService.success(result.message);
        searchAcTransactions();
      } else globalService.error(result.message);
    });
  };

  return (
    <div>


      <>
        <Stack direction="row" spacing={0} justifyContent="space-between">
          <Typography variant="h5">Account Transactions</Typography>
          <Typography variant="h5">{selectedBtnId}</Typography>
          <Typography variant="body1" align="center">
            <b>Document Type : </b>
            {globalService.getDocTypeMenuText(docType)}{" "}
          </Typography>
        </Stack>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Months
            </Typography>
            {pageInfo &&
              pageInfo.Months &&
              pageInfo.Months.map((item: any) => (
                <Button
                  sx={{ marginRight: 1, marginBottom: 0.5 }}
                  variant="contained"
                  color={item.count > 0 ? "success" : "primary"}
                  id={item.btnId}
                  key={item.btnId}
                  //startIcon={<SearchIcon />}
                  onClick={() => searchAcTransactions(item)}
                >
                  {item.display}
                </Button>
              ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <>
              <div>
                <Grid container spacing={3} marginBottom={2}>
                  {/* <Grid item xs={12} sm={3}>
                  <Controls.ReactDatePicker
                    label="From Date"
                    value={fromDate}
                    onChange={(date: any) => setFromDate(globalService.convertLocalToUTCDate(date))}
                    max={toDate}
                    error={fromDate ? '' : 'From Date is required.'}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Controls.ReactDatePicker
                    label="To Date"
                    fullWidth
                    value={toDate}
                    onChange={(date: any) => setToDate(globalService.convertLocalToUTCDate(date))}
                    min={fromDate}
                    error={toDate ? '' : 'To Date is required.'}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={() =>
                      searchAcTransactions()
                    }
                  >
                    Search
                  </Button> */}
                  <Grid item>
                    {pageInfo &&
                      (docType === "MC" ||
                        docType == "YC" ||
                        (pageInfo.ShowBillingMenu && docType === "SB") ||
                        docType === "SB" ||
                        docType === "CV" ||
                        pageInfo.YearClosed) ? (
                      <></>
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() =>
                          navigate(
                            "/addAcTransaction/" + societySubscriptionId + "/" + docType
                          )
                        }
                      >
                        Add Record
                      </Button>
                    )}
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ marginLeft: 2 }}
                      startIcon={<DownloadIcon />}
                      onClick={() => downloadVoucherForRange()}
                    >
                      PDF Voucher
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </>
            <div style={{ width: "100%" }}>
              <DataGrid
                getRowId={(row) => row.AcTransactionId}
                rows={acTransactions}
                columns={columns}
                columnHeaderHeight={30}
                //rowHeight={30}
                autoHeight={true}
                getRowHeight={() => "auto"}
                getEstimatedRowHeight={() => 200}
                //loading={loading}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      // Hide columns Id, the other columns will remain visible
                      AcTransactionId: false,
                      AcHead: docType !== "JV", //show
                      ChequeNo: docType === "BP",
                      PayMode: docType === "BR",
                      PayRefNo: docType === "BR",
                      PayRefDate: docType === "BR",
                      BankName: docType === "BR",
                      Branch: docType === "BR",
                      BillNo:
                        docType === "SB" || docType === "EB" || docType === "PB",
                      BillDate:
                        docType === "SB" || docType === "EB" || docType === "PB",
                      DelDocNo: docType === "PB",
                      DelDocDate: docType === "PB",
                    },
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
        <ConfirmDialog
          confirmDialog={confirmDialog}
          setConfirmDialog={setConfirmDialog}
        />
      </>
      <div style={{ maxWidth: "100%" }}>
        <Dialog
          maxWidth={maxWidth}

          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >


          <DialogContent dividers>

            <Box >
              <AcTransactionView
                callFrom={"AcTransaction"}
                onCloseDialog={handleClose}
                acTransactionId={acTransactionId}
                onChange={(e: any) => {
                  handleOpen(e.target.value);

                }}
              />

            </Box>
          </DialogContent>
        </Dialog>
      </div>
    </div>

  );
};

export default AcTransactionsList;
