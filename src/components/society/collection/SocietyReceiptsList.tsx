import React, { useState, useEffect } from "react";
import { societyReceiptsService } from "../../../services/SocietyReceiptsService";
import {
  Stack,
  IconButton,
  Card,
  CardContent,
  Button,
  Typography,
  CardActions,
  TableCell,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConfirmDialog from "../../helper/ConfirmDialog";
import { globalService } from "../../../services/GlobalService";
//import { SelectListModel } from "../../../models/ApiResponse";
import fileDownload from "js-file-download";
import dayjs from "dayjs";
import UploadIcon from "@mui/icons-material/Upload";
import Controls from "../../../utility/controls/Controls";
import SearchIcon from "@mui/icons-material/Search";
import { SocietyReceiptRangeModel, SocietyReceiptsModel } from "../../../models/SocietyReceiptsModel";
import useForm from "../../../utility/hooks/UseForm";
import { societiesService } from "../../../services/SocietiesService";
import { SocietiesModel } from "../../../models/SocietiesModel";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";

const SocietyReceiptsList: React.FC = () => {
  const { societyId, societySubscriptionId } = useParams();
  const [societyReceipts, setSocietyReceipts] = useState([]);
  //const [isVisibleCreate, setIsVisibleCreate] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => { },
  });

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [society, setSociety] = useState<SocietiesModel>(null);
  const { goToHome } = useSharedNavigation();
  const navigate = useNavigate();

  // const [fromDate, setFromDate] = useState(
  //   globalService.addMonths(new Date(), -3)
  // );
  // const [toDate, setToDate] = useState(new Date());

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }

    if (!society) getSociety(societyId);
    if (initialData == null) getInitialData();
    //getSocietyReceipts(societyId);
  }, [fromDate, toDate]);

  // const getSocietyReceipts = (societyId: any) => {

  //   societyReceiptsService
  //     .getSocietyReceiptBySocietyId(societyId)
  //     .then((response) => {
  //       let result = response.data;
  //       setSocietyReceiptss(result.list);
  //     });
  // };
  const validate = (fieldValues: SocietyReceiptsModel = values) => {
    let temp: any = { ...errors };

    setErrors({
      ...temp,
    });
  };

  const { values, setValues, errors, setErrors, handleInputChange } = useForm(
    societyReceiptsService.initialFieldValues,
    validate,
    societyId
  );

  const getInitialData = () => {
    societyReceiptsService
      .getDetailsForSocietyReceiptList(societySubscriptionId)
      .then((response) => {
        let result = response.data;
        setInitialData(result.data);
        if (result) {
          let fDate = globalService.convertLocalToUTCDate(new Date(result.data.ReceiptDate ? result.data.ReceiptDate : result.data.Subscription.SubscriptionStart));
          let tDate = globalService.convertLocalToUTCDate(new Date(result.data.Subscription.SubscriptionEnd));
          setFromDate(fDate);
          setToDate(tDate);
          searchSocietyReceipt(fDate, tDate);
        }
        // if (
        //   !initialData?.IsReadOnly &&
        //   result.SocietyCollectionReversals.Length == 0 &&
        //   (initialData?.Subscription?.LockedTillDate === null ||
        //     result.ReceiptDate > initialData.Subscription.LockedTillDate)
        // ) {
        //   setIsVisibleCreate(true);
        // } else
        // setIsVisibleCreate(false);
      });
    // .finally(() => {
    //   if (fromDate && toDate) {

    //   }
    // });
  };

  const downloadPDF = (societyReceiptId: any) => {
    societyReceiptsService.createPdf(societyReceiptId).then((response) => {
      let result = response.data;
      fileDownload(result, "SocietyReceipt.pdf");
    });
  };

  //this wont work since fromDate and ToDate value changes are not updating on immediate function call  --if (!fromDate || !toDate) {
  const validates = (fDate: any, tDate: any) => {
    if (!fDate || !tDate) {
      globalService.error("Please select FromDate and ToDate.");
      return false;
    } else return true;
  };

  const searchSocietyReceipt = (fDate: any = null, tDate: any = null) => {
    let model: SocietyReceiptRangeModel = {
      SocietyId: localStorage.getItem("societyId"),
      FromDate: fromDate ? fromDate : fDate,
      ToDate: toDate ? toDate : tDate,
    };

    if (validates(model.FromDate, model.ToDate)) {
      societyReceiptsService
        .getBySocietyReceiptForRange(model)
        .then((response) => {
          let result = response.data;
          setSocietyReceipts(result.list);
          //globalService.error(result.message);
          if (result.list.length < 1) {
            globalService.error("No records found.");
          }
        });
    }
  };


  const getSociety = (societyId: any) => {
    societiesService.getById(societyId).then((response) => {
      let result = response.data;
      setSociety(result.data);
    });
  };

  const sendEmail = (societyReceiptId: any) => {
    values.SocietyId = societyId;
    values.SocietySubscriptionId = societySubscriptionId;
    values.SocietyReceiptId = societyReceiptId;
    let isValidated = societyReceiptId ? true : validate(); // if single bill then no validate method will be called
    if (isValidated) {
      societyReceiptsService.sendReceiptEmail(values).then((response) => {
        let result = response.data;
        if (result.isSuccess) {
          globalService.success(result.message)
        }
      });
    }
  }

  const columns: GridColDef[] = [
    // { field: "SocietyBuildingUnitId", headerName: "Building Unit", width: 130, flex: 1 },
    {
      field: "BuildingUnit",
      headerName: "Building Unit",
      width: 150,
      valueGetter: (params) => params.row.SocietyBuildingUnit?.Unit,
    },
    {
      field: "ReceiptDate",
      headerName: "Receipt Date",
      width: 120,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    { field: "ReceiptNo", headerName: "Receipt No", width: 150 },
    { field: "Amount", headerName: "Amount", width: 75 },
    { field: "PrincipalAdjusted", headerName: "Principal Adjusted", width: 75 },
    {
      field: "InterestAdjusted",
      headerName: "Interest Adjusted",
      width: 100,
    },
    {
      field: "NonChgAdjusted",
      headerName: "NonChg Adjusted",
      width: 100,
    },
    { field: "TaxAdjusted", headerName: "Tax Adjusted", width: 80 },
    { field: "Advance", headerName: "Advance", width: 80 },
    { field: "BankId", headerName: "BankId", width: 80 },

    {
      field: "PayMode",
      headerName: "Pay Mode",
      width: 100,
      valueGetter: (params) => params.row.SocietyPayModes?.PayMode,
    },
    // { field: "PayRefNo", headerName: "PayRefNo", width: 100 },
    // {
    //   field: "IsBillExists",
    //   headerName: "Bill Exists",
    //   width: 20,
    //   renderCell: (params) => {
    //     return (
    //       <Stack>
    //         {params.row.IsBillExists && <DoneIcon color="success" />}
    //         {!params.row.IsBillExists && <CloseIcon color="error" />}
    //       </Stack>
    //     );
    //   },
    // },
    {
      field: "Actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 250,
      renderCell: (params) => {
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack direction="row" spacing={0}>
                  <Button
                    variant="contained"
                    className="btnGrid"
                    onClick={() =>
                      navigate(
                        "/viewSocietyReceipt/" +
                        societyId +
                        "/" +
                        params.row.SocietyReceiptId
                      )
                    }
                  >
                    Detail
                  </Button>
                  <Button
                    className="btnGrid"
                    variant="contained"
                    color="error"
                    startIcon={<DownloadIcon />}
                    size="small"
                    onClick={() => downloadPDF(params.row.SocietyReceiptId)}
                  >
                    PDF
                  </Button>
                  {society && society.EnableEmail === true &&
                    <Button
                      className="btnGrid"
                      variant="contained"
                      color="primary"
                      // startIcon={}
                      size="small"
                      onClick={() => sendEmail(params.row.SocietyReceiptId)}
                    >
                      Send Email
                    </Button>
                  }
                  {/* {!params.row.IsBillExists && (initialData &&
                    !initialData.IsReadOnly &&
                    params.row.SocietyCollectionReversals.length == 0 &&
                    (!initialData.LockedTillDate ||
                      globalService.convertLocalToUTCDate(
                        new Date(params.row.ReceiptDate)
                      ) >
                      globalService.convertLocalToUTCDate(
                        new Date(initialData.LockedTillDate)
                      ))) && ( */}
                  {(!params.row.IsBillExists && (initialData && !initialData.IsReadOnly)) && (
                    <IconButton
                      size="small"
                      aria-label="delete"
                      color="error"
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: "Are you sure to delete Receipt : " + params.row.ReceiptNo + "?",
                          subTitle: "You can't undo this operation",
                          onConfirm: () => {
                            removeSocietyReceipt(params.row.SocietyReceiptId);
                          },
                        });
                      }}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  )}
                </Stack>
              </Grid>

              {params.row.SocietyCollectionReversals.length > 0 && (
                <Grid item xs={12}>
                  <Stack direction="row" spacing={0} className="receipt">
                    <samp> REVERSED: </samp>
                    {params.row.SocietyCollectionReversals[0].DocNo}
                  </Stack>
                </Grid>
              )}
            </Grid>
          </>
        );
      },
    },
  ];

  const removeSocietyReceipt = (SocietyReceiptId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    societyReceiptsService.remove(SocietyReceiptId).then((response) => {
      let result = response.data;
      if (response) {
        globalService.success(result.message);
        //  getSocietyReceipts(societyId);
        searchSocietyReceipt();
      }
    });
  };

  return (
    <>
      <Typography variant="h5" align="center">
        Society Receipt List
      </Typography>
      <Card>
        <CardContent>
          <>
            <div>
              <Grid container spacing={3} marginBottom={2}>
                <Grid item xs={12} sm={3}>
                  <Controls.ReactDatePicker
                    label="From Date"
                    value={fromDate}
                    onChange={(date: any) =>
                      setFromDate(globalService.convertLocalToUTCDate(date))
                    }
                    max={toDate}
                    error={fromDate ? "" : "From Date is required."}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Controls.ReactDatePicker
                    label="To Date"
                    fullWidth
                    value={toDate}
                    onChange={(date: any) =>
                      setToDate(globalService.convertLocalToUTCDate(date))
                    }
                    min={fromDate}
                    error={toDate ? "" : "To Date is required."}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={() => searchSocietyReceipt()}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </div>
            {initialData && !initialData.IsReadOnly && <> <Button
              style={{ marginRight: "2vh" }}
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() =>
                navigate(
                  "/addSocietyReceipt/" +
                  societyId +
                  "/" +
                  societySubscriptionId
                )
              }
            >
              Add Record
            </Button>
              <Button
                sx={{ marginLeft: 1 }}
                variant="contained"
                color="success"
                startIcon={<UploadIcon />}
                onClick={() =>
                  navigate(
                    "/societyReceiptExcelUpload/" +
                    societyId +
                    "/" +
                    societySubscriptionId
                  )
                }
              >
                Society Receipt Import Excel
              </Button>
            </>
            }

            <div style={{ width: "100%" }}>
              <DataGrid
                getRowId={(row) => row.SocietyReceiptId}
                rows={societyReceipts}
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
                      SocietyMemberId: false,
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
          </>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "center" }}>
          <Stack spacing={2} direction="row">
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
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
};

export default SocietyReceiptsList;
