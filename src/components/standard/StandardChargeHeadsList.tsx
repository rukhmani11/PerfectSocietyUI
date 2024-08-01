import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { standardChargeHeadsService } from "../../services/StandardChargeHeadsService";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Stack } from "@mui/system";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { globalService } from "../../services/GlobalService";
import ConfirmDialog from "../helper/ConfirmDialog";

const StandardChargeHeadsList: React.FC = () => {
  const [standardChargeheads, setstandardChargeHead] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => {},
  });
  const navigate = useNavigate();
  useEffect(() => {
    getStandardChargeHead();
  }, []);

  const getStandardChargeHead = () => {
    standardChargeHeadsService.getAll().then((response: { data: any }) => {
      let result = response.data;
      setstandardChargeHead(result.list);
    });
  };

  const columns: GridColDef[] = [
    {
      field: "ChargeHeadId",
      headerName: "ChargeHeadId",
      width: 70,
      //hideable: false,
      flex: 1,
    },
    { field: "ChargeHead", headerName: "Charge Head", width: 130, flex: 1 },
    {
      field: "AcHead",
      headerName: "Account Head",
      width: 130,
      flex: 1,
      valueGetter: (params) => params.row.AcHead?.AcHead,
    },
    {
      field: "ChargeInterest",
      headerName: "Charge Interest",
      width: 80,
      renderCell: (params) => {
        return (
          <Stack>
            {params.row.ChargeInterest && <DoneIcon color="success" />}
            {!params.row.ChargeInterest && <CloseIcon color="error" />}
          </Stack>
        );
      },
    },
    {
      field: "ChargeTax",
      headerName: "Charge Tax",
      width: 80,

      renderCell: (params) => {
        return (
          <Stack>
            {params.row.ChargeTax && <DoneIcon color="success" />}
            {!params.row.ChargeTax && <CloseIcon color="error" />}
          </Stack>
        );
      },
    },
    { field: "AcHeadId", headerName: "AcHeadId", width: 130, flex: 1 },
    { field: "Hsncode", headerName: "HSNCode", width: 130, flex: 1 },
    {
      field: "Nature",
      headerName: "Nature",
      width: 130,

      valueGetter: (params) => {
        const Nature = params.row.Nature;
        if (Nature === "A") return "Per Area";
        if (Nature === "L") return "Late Payment Penalty";
        if (Nature === "E") return "Early Payment Discount";
        if (Nature === "I") return "Interest";
        if (Nature === "T") return "Tax";
        if (Nature === "N") return "Non-Occupancy";
      },
    },

    { field: "Sequence", headerName: "Sequence", width: 70 },
    { field: "Rate", headerName: "Rate", width: 70 },
    {
      field: "Actions",
      headerName: "Actions",
      type: "number",
      width: 100,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={0}>
            <IconButton
              size="small"
              color="primary"
              aria-label="add an alarm"
              onClick={() =>
                navigate("/standardChargeHead/" + params.row.ChargeHeadId)
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
                  title: "Are you sure to delete this Account Categories?",
                  subTitle: "You can't undo this operation",
                  onConfirm: () => {
                    removeStandardChargeHead(params.row.ChargeHeadId);
                  },
                });
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  const removeStandardChargeHead = (ChargeHeadId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    standardChargeHeadsService.remove(ChargeHeadId).then((response) => {
      let result = response.data;
      if (response) {
        globalService.success(result.message);
        getStandardChargeHead();
      }
    });
  };

  return (
    <>
      <Typography variant="h5" align="center">
        Charge Heads
      </Typography>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/standardChargeHead/")}
          >
            Add New
          </Button>
          <div className="dvDataGrid">
            <DataGrid
              getRowId={(row) => row.ChargeHeadId}
              rows={standardChargeheads}
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

export default StandardChargeHeadsList;
