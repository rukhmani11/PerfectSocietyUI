import React, { useState, useEffect } from "react";
import { bankService } from "../../services/BankService";
import {
  Stack,
  IconButton,
  Card,
  CardContent,
  Button,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConfirmDialog from "../helper/ConfirmDialog";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { globalService } from "../../services/GlobalService";


const BankList: React.FC = () => {
  const [banks, setBank] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { }})
  const navigate = useNavigate();
  useEffect(() => {
    getBank();
  }, []);

  const getBank = () => {
    bankService.getAll().then((response) => {
      let result = response.data;
      setBank(result.list);
    });
  };

  const columns: GridColDef[] = [
    { field: "Bank", headerName: "Banks Name.", width: 130, flex: 1 },
    // { field: "Abrv", headerName: "Abrv", width: 130, flex: 1 },
    {
      field: "Active",
      headerName: "Active",
      width: 130,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            {/* {params.row.Active && "Yes"}
            {!params.row.Active && "No"} */}
            {params.row.Active && <DoneIcon color="secondary" />}
            {!params.row.Active && <CloseIcon />}
          </Stack>
        );
      },
    },
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
              onClick={() => navigate("/bank/" + params.row.BankId)}
            >
              <EditIcon fontSize="inherit"  />
            </IconButton>
          <IconButton size="small"  aria-label="delete"  color="error"
            onClick={() => {

              setConfirmDialog({
                isOpen: true,
                title: 'Are you sure to delete this Bank ?',
                subTitle: "You can't undo this operation",
                onConfirm: () => { removeBank(params.row.BankId) }
              })
            }}>
            <DeleteIcon fontSize="inherit"  />
          </IconButton>

          </Stack>
        );
      },
    },
  ];

  const removeBank = (BankId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    bankService.remove(BankId).then((response) => {
        let result=response.data;
        if (response) {
          globalService.success(result.message);
          getBank();
        }
      });
  }

  return (
    <>
      <Typography variant="h5" align="center">
        Banks
      </Typography>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/bank/")}
          >
            Add Record
          </Button>
          <div style={{width: "100%" }}>
            <DataGrid
              getRowId={(row) => row.BankId}
              rows={banks}
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
                    BankId: false,
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
  );
};

export default BankList;
