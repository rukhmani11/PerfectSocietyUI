import React, { useState, useEffect } from "react";
import { uomsService } from "../../services/UomsService";
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
import { globalService } from "../../services/GlobalService";
import ConfirmDialog from "../helper/ConfirmDialog";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

 
const UomsList: React.FC = () => {
  const [uoms, setUoms] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { } })
  const navigate = useNavigate();
  useEffect(() => {

    getUoms();
  }, []);

  const getUoms = () => {
    uomsService.getAll().then((response) => {
      let result = response.data;
      setUoms(result.list);
      
    });
  };

  const columns: GridColDef[] = [
    { field: "Uom", headerName: "Uom", width: 130, flex: 1 },
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
              onClick={() => navigate("/uom/" + params.row.Uomid)}
            >
              <EditIcon fontSize="inherit"  />
            </IconButton>
            <IconButton size="small"  aria-label="delete" color="error"
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: 'Are you sure to delete this Uom?',
                  subTitle: "You can't undo this operation",
                  onConfirm: () => { removeUom(params.row.Uomid) }
                })
              }}>
              <DeleteIcon fontSize="inherit"  />
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  const removeUom = (Uomid: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    uomsService.remove(Uomid).then((response: { data: any }) => {
      let result=response.data
      if (response.data?.isSuccess) {
        globalService.success(result.message);
        
        getUoms();
      }
    });

  };

  return (
    <>
      <Typography variant="h5" align="center">
        UOMs
      </Typography>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/uom")}
          >
            Add Record
          </Button>
          <div className='dvDataGrid'>
            <DataGrid
              getRowId={(row) => row.Uomid}
              rows={uoms} 
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
                    Uomid: false,
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

export default UomsList;


