import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { payModesService } from "../../services/PayModesService";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ConfirmDialog from "../helper/ConfirmDialog";
import { globalService } from "../../services/GlobalService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

const PayModeList: React.FC = () => {
  const [payModes, setpaymode] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { }})
  const navigate = useNavigate();
  useEffect(() => {
    getPayMode();
  }, []);

  const getPayMode = () => {
    payModesService.getAll().then((response: { data: any }) => {
      let result = response.data;
      setpaymode(result.list);
    
    });
  };

  const columns: GridColDef[] = [
    { field: "PayMode", headerName: "Pay Mode", width: 130, flex: 1 },
    {
      field: "PayModeCode",
      headerName: "Pay Mode Code",
      width: 70,
      //hideable: false,
      flex: 1,
    },
    {
      field: "AcHead",
      headerName: "AcHead",
      flex:1.5,
      valueGetter: (params) => params.row.AcHead?.AcHead,
    },
    {
      field: "AskDetails",
      headerName: "Ask Details",
      width: 130,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            {params.row.AskDetails && <DoneIcon color="success" />}
            {!params.row.AskDetails && <CloseIcon color="error" />}
          </Stack>
        );
      },
    },
    {
      field: "Active",
      headerName: "Active",
      width: 130,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            {params.row.Active && <DoneIcon color="success" />}
            {!params.row.Active && <CloseIcon color="error" />}
          </Stack>
        );
      },
    },
    { field: "AcHeadId", headerName: "ID", width: 130, flex: 1 },
    {
      field: "Actions",
      headerName: "Actions",
      type: "number",
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={0}>
            <IconButton size="small" 
              color="primary"
              aria-label="add an alarm"
              onClick={() => navigate("/paymode/" + params.row.PayModeCode)}
            >
              <EditIcon fontSize="inherit"  />
            </IconButton>

            <IconButton size="small" 
              aria-label="delete"
              color="error"
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: "Are you sure to delete this PayModeCode?",
                  subTitle: "You can't undo this operation",
                  onConfirm: () => {
                    removePaymode(params.row.PayModeCode);
                  },
                });
              }}
            >
              <DeleteIcon fontSize="inherit"  />
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  const removePaymode = (PayModeCode: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    payModesService
      .remove(PayModeCode)
      .then((response) => {
        let result=response.data;
        if (response) {
          globalService.success(result.message);
          getPayMode();
        }
      });
  }


  return (
    <>
      <Typography variant="h5" align="center">
        Pay Modes
      </Typography>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/paymode/")}
          >
            Add Record
          </Button>
          <div className="dvDataGrid">
            <DataGrid
              getRowId={(row) => row.PayModeCode}
              rows={payModes}
              columns={columns}
              columnHeaderHeight={30}
              //rowHeight={30}
              autoHeight={true}
              getRowHeight={() => 'auto'} 
              getEstimatedRowHeight={() => 200}
              //loading={loading}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    // Hide columns Id, the other columns will remain visible
                    AcHeadId: false,
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
              //checkboxSelection
            />
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
};

export default PayModeList;
