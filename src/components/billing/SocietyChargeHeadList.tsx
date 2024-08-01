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
import { societyChargeHeadsService } from "../../services/SocietyChargeHeadsService";
import { appInfoService } from "../../services/AppInfoService";
import { useSharedNavigation } from "../../utility/context/NavigationContext";
import { Messages } from "../../utility/Config";

const SocietyChargeHeadList: React.FC = () => {
  const { societyId }: any = useParams();
  const [societyChargeHeads, setSocietyChargeHeads] = useState([]);
  //const [appInfo, setAppInfo] = useState([]);
  const [isVisible, setVisible] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { } })
  const navigate = useNavigate();
  const { goToHome } = useSharedNavigation();
  
  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (societyId)
      getSocietyChargeHead();
      getAppInfo();
  }, [societyId]);

  const getAppInfo = () => {
    appInfoService.getAppInfo().then((response) => {
      
     // let result = response.data;
      // let data= response.data.list[0].Flags.length
      // for(var i=0;i<data;i++)
      // {
      //   if(response.data.list[0].Flags[i]==='Y')
      //   {
          setVisible(response.data.row.FlagInfo.MonthlyCharge);
      //   }
      //   if(response.data.list[0].Flags[i]==='N')
      //   {
      //     setVisible(false);
      //   }

      // }
    //  setAppInfo(result.list);
    });
  };
  const getSocietyChargeHead = () => {
    societyChargeHeadsService.getBySocietyId(societyId).then((response) => {
      let result = response.data;
      setSocietyChargeHeads(result.list);
    });
  };

  const removeSocietyChargeHead = (chargeHeadId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    societyChargeHeadsService
      .remove(chargeHeadId)
      .then((response) => {
        if (response) {
          let result = response.data;
          if (result.isSuccess) {
            globalService.success("Society charge head deleted successfully.");
            getSocietyChargeHead();
          }
          else {
            globalService.error(result.message);
          }
        }
      });
  }

  const columns: GridColDef[] = [
    { field: "ChargeHead", headerName: "Charge Head",width: 200, flex: 2 },
    {
      field: "ChargeInterest",
      headerName: "Charge Interest",
      renderCell: (params) => {
        return (
          <Stack>
            {params.row.ChargeInterest && <DoneIcon color="secondary" />}
            {!params.row.ChargeInterest && <CloseIcon />}
          </Stack>
        );
      },
    },
    {
      field: "ChargeTax", headerName: "Charge Tax",
      renderCell: (params) => {
        return (
          <Stack>
            {params.row.ChargeTax && <DoneIcon color="secondary" />}
            {!params.row.ChargeTax && <CloseIcon />}
          </Stack>
        );
      }
    },

    // {
    //   field: "MonthlyCharge", headerName: "Monthly Charge",
    //   renderCell: (params) => {
    //     return (
    //       <Stack>
    //         {params.row.MonthlyCharge && <DoneIcon color="secondary" />}
    //         {!params.row.MonthlyCharge && <CloseIcon />}
    //       </Stack>

    //     );
    //   }
    // },

    {
      field: "AcHead",
      headerName: "Account Head",
      width: 200,
      valueGetter: (params) => params.row.AcHeads?.AcHead,
    },
    { field: "Nature", headerName: "Nature", flex: 1 ,
    valueGetter: (params) => {
      const Nature  = params.row.Nature;
      if (Nature === 'A') return 'Per Area';
      if (Nature === 'L') return 'Late Payment Penalty';
      if (Nature === 'E') return 'Early Payment Discount';
      if (Nature === 'I') return 'Interest';
      if (Nature === 'T') return 'Tax';
      if (Nature === 'N') return 'Non-Occupancy';
    }
  },
  { field: "Hsncode", headerName: "HSNCode", width: 130, flex: 1 },

    { field: "Rate", headerName: "Rate"},
    { field: "Sequence", headerName: "Sequence" },
    { field: "BillAbbreviation", headerName: "Bill Abbreviation",flex:1},
    {
      field: "Actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={0}>
            <IconButton size="small"
              color="primary"
              aria-label="add an alarm"
              onClick={() => navigate("/editSocietyChargeHead/" + societyId + "/" + params.id)}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
            <IconButton size="small" aria-label="delete" color="error"
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: 'Are you sure to delete this charge head ?',
                  subTitle: "You can't undo this operation",
                  onConfirm: () => { removeSocietyChargeHead(params.id) }
                })
              }}>
              <DeleteIcon fontSize="inherit" />
            </IconButton>

          </Stack>
        );
      },
    },
  ];

  if (isVisible) {
    
    const newColumn: GridColDef = {
      field: 'MonthlyCharge',
      headerName: 'Monthly Charge',
      renderCell: (params) => {
        return (
          <Stack>
            {params.row.MonthlyCharge && <DoneIcon color="secondary" />}
            {!params.row.MonthlyCharge && <CloseIcon />}
          </Stack>
        );
      }
    };
     columns.splice(3, 0, newColumn);
  }

  return (
    <>
      <Typography variant="h5" align="center">
        Society Charge Heads
      </Typography>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/addSocietyChargeHead/" + societyId)}
          >
            Add Record
          </Button>
          <div>
            <DataGrid
              getRowId={(row) => row.ChargeHeadId}
              rows={societyChargeHeads}
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
                    ChargeHeadId: false,
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

export default SocietyChargeHeadList;
