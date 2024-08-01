import React, { useState, useEffect } from "react";
import { societyBillSeriesService } from "../../services/SocietyBillSeriesService";
import {
  Stack,
  IconButton,
  Card,
  CardContent,
  Button,
  Typography,
  CardActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConfirmDialog from "../helper/ConfirmDialog";
import { globalService } from "../../services/GlobalService";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { societyBillsService } from "../../services/SocietyBillsService";
import { SocietyBillGenerateModel } from "../../models/SocietyBillsModel";
import { societySubscriptionsService } from "../../services/SocietySubscriptionsService";
import { useSharedNavigation } from "../../utility/context/NavigationContext";
import { Messages } from "../../utility/Config";

const SocietyBillSeriesList: React.FC = () => {
  const { societyId }: any = useParams();
  const societySubscriptionId = localStorage.getItem('societySubscriptionId');
  const [societyBillSeries, setSocietyBillSeries] = useState([]);
  const { goToHome } = useSharedNavigation();
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => { },
  });
  const navigate = useNavigate();
  const [lockedTillDate, setLockedTillDate] = useState(null);

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (societyId) getSocietyBillSeries();
    if (!lockedTillDate) {
      let subscription =
        societySubscriptionsService.getCurrentSocietySubscription();
      if (subscription) setLockedTillDate(subscription.LockedTillDate);
      else setLockedTillDate(null);
    }
  }, [societyId]);

  const getSocietyBillSeries = () => {
    societyBillSeriesService.getBySocietySubscriptionId(societySubscriptionId).then((response) => {
      let result = response.data;
      setSocietyBillSeries(result.list);
    });
  };

  const generateBill = (billAbbr: string) => {
    let model: SocietyBillGenerateModel = {
      SocietyId: null,
      BillAbbreviation: billAbbr,
      SocietySubscriptionId: localStorage.getItem("societySubscriptionId"),
    };
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    societyBillsService.generateBill(model).then((response) => {
      if (response) {
        let result = response.data;
        if (result.isSuccess) {
          globalService.success(result.message);
          getSocietyBillSeries();
        } else {
          globalService.error(result.message);
        }
      }
    });
  };

  const deleteBill = (billAbbr: string) => {
    
    let model: SocietyBillGenerateModel = {
      SocietyId: localStorage.getItem("societyId"),
      BillAbbreviation: billAbbr,
      SocietySubscriptionId: localStorage.getItem("societySubscriptionId"),
    };
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    societyBillsService.deleteBill(model).then((response) => {
      if (response) {
        let result = response.data;
        if (result.isSuccess) {
          globalService.success(result.message);
          getSocietyBillSeries();
        } else {
          globalService.error(result.message);
        }
      }
    });
  };

  const removeSocietyBillSeries = (BillAbbreviation: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    societyBillSeriesService.remove(BillAbbreviation).then((response) => {
      let result = response.data;
      if (response) {
        globalService.success(result.message);
        getSocietyBillSeries();
      }
    });
  };

  const columns: GridColDef[] = [
    {
      field: "Actions",
      headerName: "Actions",
      width: 250,

      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={0}>
            <IconButton
              size="small"
              color="primary"
              aria-label="add an alarm"
              onClick={() =>
                navigate(
                  "/editSocietyBillSeries/" +
                  societyId +
                  "/" +
                  encodeURIComponent(params.row.BillAbbreviation)
                )
              }
            >
              <EditIcon fontSize="inherit" />
            </IconButton>

            <Button
              className="btnGrid"
              variant="contained"
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title:
                    "New Bills will be generated ! Do you want to proceed ?",
                  subTitle: "",
                  onConfirm: () => {
                    generateBill(params.row.BillAbbreviation);
                  },
                });
              }}
            >
              Generate Bill
            </Button>
            {params.row.LastBillDate != null &&
              (params.row.LastReceiptDate == null ||
                params.row.LastBillDate > params.row.LastReceiptDate) &&
              (lockedTillDate == null ||
                params.row.LastBillDate > lockedTillDate) && (
                <Button
                  className="btnGrid"
                  color="error"
                  variant="contained"
                  onClick={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title:
                        "All Bills of " +
                        dayjs(params.row.LastBillDate).format("DD-MMM-YYYY") +
                        " will be deleted! Do you want to proceed ?",
                      subTitle: "",
                      onConfirm: () => {
                        deleteBill(params.row.BillAbbreviation);
                      },
                    });
                  }}
                >
                  Delete Bill
                </Button>
              )}
            {params.row.LastBillDate === null && (
              <>
                <Button
                  className="btnGrid"
                  color="error"
                  variant="contained"
                  onClick={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Are you sure to delete this  Bill Series ?',
                      subTitle: "You can't undo this operation",
                      onConfirm: () => {
                        removeSocietyBillSeries(params.row.BillAbbreviation);
                      },
                    });
                  }}
                >
                  Delete
                </Button>
              </>
            )}
          </Stack>
        );
      },
    },
    { field: "BillAbbreviation", headerName: "Bill Abbreviation", flex: 1 },
    {
      field: "LastBillDate",
      headerName: "Last BillDate",
      flex: 1,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    {
      field: "LastReceiptDate",
      headerName: "Last ReceiptDate",
      flex: 1,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    // { field: "BillingFrequency",  headerName: "Billing Frequency", flex: 1  },
    {
      field: "BillingFrequency",
      headerName: "Billing Frequency",
      width: 200,
      valueGetter: (params) => {
        const billingFrequency = params.row.BillingFrequency;
        if (billingFrequency === "M") return "Monthly";
        if (billingFrequency === "B") return "Bi-Monthly";
        if (billingFrequency === "Q") return "Quarterly";
        if (billingFrequency === "H") return "Half-Yearly";
        if (billingFrequency === "Y") return "Yearly";
        return "";
      },
    },
    { field: "BillDay", headerName: "Bill Day", flex: 1 },
    { field: "DueDays", headerName: "Due Days", flex: 1 },
    { field: "InterestRate", headerName: "Interest Rate", flex: 1 },
    { field: "MinimumInterest", headerName: "Minimum Interest", flex: 1 },
    {
      field: "Osadjustment", headerName: "Os Adjustment", flex: 1,
      valueGetter: (params) => {
        const osAdjustments = params.row.Osadjustment;
        if (osAdjustments === "A") return "Tax/Int/NonChg/Chg";
        if (osAdjustments === "B") return "Tax/Chg/Int/NonChg";
      },
    },
    { field: "Tax", headerName: "Tax", flex: 1 },
    {
      field: "PrintArea",
      headerName: "Print Area",
      renderCell: (params) => {
        return (
          <Stack>
            {params.row.PrintArea && <DoneIcon color="secondary" />}
            {!params.row.PrintArea && <CloseIcon />}
          </Stack>
        );
      },
    },
    // {
    //     field: "Actions",
    //     headerName: "Actions",
    //     width: 350,
    //     flex: 1,
    //     renderCell: (params) => {

    //       return (
    //         <Stack direction="row" spacing={0}>
    //           <IconButton size="small" aria-label="delete" color="error"
    //             onClick={() => {
    //               setConfirmDialog({
    //                 isOpen: true,
    //                 title: 'Are you sure to delete this charge head ?',
    //                 subTitle: "You can't undo this operation",
    //                 onConfirm: () => { removeSocietyBillSeries(params.row.BillAbbreviation); }
    //               })
    //             }}>
    //             <DeleteIcon fontSize="inherit" />
    //           </IconButton>

    //         </Stack>
    //       );
    //     },
    //   },
  ];

  return (
    <>
      <Typography variant="h5" align="center">
        Society Bill Series
      </Typography>
      
      

      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/addSocietyBillSeries/" + societyId)}
          >
            Add Record
          </Button>
          <div>
            <DataGrid
              getRowId={(row) => row.SocietyId + "_" + row.BillAbbreviation}
              rows={societyBillSeries}
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
                    // BankId: false,
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
        <CardActions sx={{ display: "flex", justifyContent: "center" }}>
          <Stack spacing={2} direction="row">
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
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
};

export default SocietyBillSeriesList;
