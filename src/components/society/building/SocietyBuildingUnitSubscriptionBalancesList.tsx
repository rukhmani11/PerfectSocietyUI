import React, { useState, useEffect } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import {
  DataGrid,
  GridColDef,
  GridColumnGroupingModel,
  GridToolbar,
} from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { SocietyBuildingUnitSubscriptionBalancesService } from "../../../services/SocietyBuildingUnitSubscriptionBalancesService";
import { globalService } from "../../../services/GlobalService";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SocietyBuildingTitleModel } from "../../../models/SocietyBuildingsModel";
import ConfirmDialog from "../../helper/ConfirmDialog";
import { societyBuildingsService } from "../../../services/SocietyBuildingsService";
import UploadIcon from '@mui/icons-material/Upload';
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";

const SocietyBuildingUnitSubscriptionBalancesList: React.FC = () => {
const { societyBuildingUnitId }: any = useParams();
const societyBuildingId: any = localStorage.getItem("societyBuildingId");
var societySubscriptionId = localStorage.getItem("societySubscriptionId");
const [isVisibleCreate, setIsVisibleCreate] = useState(false);
const [ societyBuildingUnitSubscriptionBalances,setsocietyBuildingUnitSubscriptionBalances, ] = useState([]);
const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => {},
  });
const [title, setTitle] = useState<any>({});
const navigate = useNavigate();
const { goToHome } = useSharedNavigation();

useEffect(() => {
  if (!globalService.isSocietySelected()) {
    globalService.info(Messages.SocietyUnSelected);
    return goToHome();
  }
    getsocietyBuildingUnitSubscriptionBalances();
    getForFormData();
    if (Object.keys(title).length === 0) getBuildingTitle();
  }, []);

  const getForFormData = () => {
    SocietyBuildingUnitSubscriptionBalancesService.getForForm(
      societyBuildingUnitId,
      societySubscriptionId
    ).then((response) => {
      var res = response.data;
      if (res && res.isSuccess) {
        if (res && res.societyMemberList && res.societyMemberList.length > 0) {
          if (!res.isFirstBillGenerated) {
            setIsVisibleCreate(true);
          }
        }
      } else {
        setIsVisibleCreate(false);
        globalService.error(res.message);
      }
    });
  };

  const getBuildingTitle = () => {
    let model: SocietyBuildingTitleModel = {
      SocietyBuildingUnitId: societyBuildingUnitId,
      SocietyBuildingId: "",
    };
    societyBuildingsService.getPageTitle(model).then((response) => {
      setTitle(response.data);
    });
  };

  const getsocietyBuildingUnitSubscriptionBalances = () => {
    
    SocietyBuildingUnitSubscriptionBalancesService.getBySocietyBuildingUnitOpeningBalancesForSocietyBuildingUnitIDWithBillReceiptExistCheck(
      societyBuildingUnitId
    ).then((response) => {
      
     let result = response.data;
  //     for (let j = 0; j < result.list.length; j++) {
  //       var currentValue = result.list[j];

  //       var curentAdvanceValue =
  //         currentValue.Advance - currentValue.AdvanceAdjusted;
  //       result.list[j].AdvanceBalance = curentAdvanceValue;

  //       var curentPrincipalValue =
  //         currentValue.PrincipalAmount - currentValue.PrincipalReceipt;
  //       result.list[j].PrincipalBalance = curentPrincipalValue;

  //       var curentInterestValue =
  //         currentValue.InterestAmount - currentValue.InterestReceipt;
  //       result.list[j].InterestBalance = curentInterestValue;

  //       var curentSpecialBalance =
  //         currentValue.SpecialBillAmount - currentValue.SpecialBillReceipt;
  //       result.list[j].SpecialBalance = curentSpecialBalance;

  //       var curentTaxBalance = currentValue.TaxAmount - currentValue.TaxReceipt;
  //       result.list[j].TaxBalance = curentTaxBalance;
  //     }
     setsocietyBuildingUnitSubscriptionBalances(result.list);
  });
 };

  const columns: GridColDef[] = [
    {
      field: "Member",
      headerName: "Member",
      width: 130,
      flex: 1,
      // valueGetter: (params) => params.row.SocietyMember?.Member,
    },
    { field: "BillAbbreviation", headerName: "Bill Abbr.", flex: 1 },
    { field: "PrincipalAmount", headerName: "Bill", flex: 1 },
    { field: "PrincipalReceipt", headerName: "Receipt", flex: 1 },
    { field: "PrincipalBalance", headerName: "Balance", flex: 1,
    renderCell: (params) => {
     return (params.row.PrincipalAmount - params.row.PrincipalReceipt)
    }
  },
    { field: "InterestAmount", headerName: "Amount", flex: 1 },
    { field: "InterestReceipt", headerName: "Bill", flex: 1 },
    { field: "InterestBalance", headerName: "Balance", flex: 1,
    renderCell: (params) => {
     return (params.row.InterestAmount - params.row.InterestReceipt)
    }
  },
    { field: "SpecialBillAmount", headerName: "Bill", flex: 1 },
    { field: "SpecialBillReceipt", headerName: "Receipt", flex: 1 },
    { field: "SpecialBalance", headerName: "Balance", flex: 1,
    renderCell: (params) => {
     return (params.row.SpecialBillAmount - params.row.SpecialBillReceipt)
    }
  },
    { field: "TaxAmount", headerName: "Bill", flex: 1 },
    { field: "TaxReceipt", headerName: "Receipt", flex: 1 },
    { field: "TaxBalance", headerName: "Balance", flex: 1,
    renderCell: (params) => {
     return (params.row.TaxAmount - params.row.TaxReceipt)
    }
  },
    { field: "Advance", headerName: "Amount", flex: 1 },
    { field: "AdvanceAdjusted", headerName: "Adjusted", flex: 1 },
    { field: "AdvanceBalance", headerName: "Balance", flex: 1,
    renderCell: (params) => {
     return (params.row.Advance - params.row.AdvanceAdjusted)
    }
 },
    { 
      field: "Actions",
      headerName: "Actions",
      type: "number",
      flex: 1,
      renderCell: (params) => {
        const item = params.row;
        if (item.BillExists === 1 || item.ReceiptExists === 1)
         {
          return <span></span>;  
        } else 
        {
            return ( <Stack direction="row" spacing={0}>
            <IconButton
              size="small"
              color="primary"
              aria-label="add an alarm"
              onClick={() =>
                navigate(
                  "/editSocietyBuildingUnitSubscriptionBalance/" 
                  + societyBuildingUnitId + "/" + params.id
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
                  title: "Are you sure to delete this Operation Balance ?",
                  subTitle: "You can't undo this operation",
                  onConfirm: () => {
                    removeSocietyBuildingUnitSubscriptionBalance(
                      params.row.SocietyBuildingUnitSubscriptionBalanceID
                    );
                  },
                });
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        );
             }   }
    },
  ];

  const removeSocietyBuildingUnitSubscriptionBalance = (
    SocietyBuildingUnitSubscriptionBalanceID: any
  ) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    SocietyBuildingUnitSubscriptionBalancesService.remove(
      SocietyBuildingUnitSubscriptionBalanceID
    ).then((response) => {
      let result = response.data;
      if (response) {
        globalService.success(result.message);
        getsocietyBuildingUnitSubscriptionBalances();
      }
    });
  };
  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "Principal",
      headerName: "Principal",
      headerAlign: "center",
      children: [
        { field: "PrincipalAmount" },
        { field: "PrincipalReceipt" },
        { field: "PrincipalBalance" },
      ],
    },
    {
      groupId: "Interest",
      headerName: "Interest",
      headerAlign: "center",
      children: [
        { field: "InterestAmount" },
        { field: "InterestReceipt" },
        { field: "InterestBalance" },
      ],
    },
    {
      groupId: "SpecialBill",
      headerName: "SpecialBill",
      headerAlign: "center",
      children: [
        { field: "SpecialBillAmount" },
        { field: "SpecialBillReceipt" },
        { field: "SpecialBalance" },
      ],
    },
    {
      groupId: "Tax",
      headerName: "Tax",
      headerAlign: "center",
      children: [
        { field: "TaxAmount" },
        { field: "TaxReceipt" },
        { field: "TaxBalance" },
      ],
    },
    {
      groupId: "Advance",
      headerName: "Advance",
      headerAlign: "center",
      children: [
        { field: "Advance" },
        { field: "AdvanceAdjusted" },
        { field: "AdvanceBalance" },
      ],
    },
 ];

 return (
  <>
    <Stack direction="row" spacing={0} justifyContent="space-between">
      <Typography variant="h5" align="center">
        Society Building Unit Subscription Balances
      </Typography>
      <Typography variant="body1">
        <b>Building : </b>
        {title.Building} <b>Unit :</b> {title.Unit}{" "}
      </Typography>
    </Stack>
    <Card>
      <CardContent>
        <div>
          {isVisibleCreate && (
            <Button
            style={{marginRight: '2vh'}}
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() =>
                navigate(
                  "/addSocietyBuildingUnitSubscriptionBalance/" +
                    societyBuildingUnitId
                )
              }
            >
              Add Record
            </Button>
            
          )}
        </div>

        <div style={{ width: "100%" }}>
          <DataGrid
          rows={societyBuildingUnitSubscriptionBalances}
          getRowId={(row) => row.SocietyBuildingUnitSubscriptionBalanceID}
            columns={columns}
            columnHeaderHeight={30}
            //rowHeight={30}
            autoHeight={true}
            experimentalFeatures={{ columnGrouping: true }}
            checkboxSelection={false}
            columnGroupingModel={columnGroupingModel}
            getRowHeight={() => "auto"}
            getEstimatedRowHeight={() => 200}
            //loading={loading}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  // Hide columns Id, the other columns will remain visible
                  SocietyBuildingUnitSubscriptionBalanceId: false,
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
            onClick={() =>
              navigate("/societyBuildingUnits/" + societyBuildingId)
            }
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

export default SocietyBuildingUnitSubscriptionBalancesList;
