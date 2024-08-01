import React, { useState, useEffect } from "react";
import { unitTypesService } from "../../services/UnitTypesService";
import ConfirmDialog from "../helper/ConfirmDialog";
import {
  Stack,
  IconButton,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

const UnitTypesList: React.FC = () => {
  const [unitTypes, setUnitType] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { }})
  const navigate = useNavigate();
  useEffect(() => {
    getUnitType();
  }, []);

  const getUnitType = () => {
    unitTypesService.getAll().then((response) => {
      let result = response.data;
      setUnitType(result.list);
    });
  };

  const columns: GridColDef[] = [
    { field: "UnitType", headerName: "Unit Types", width: 130, flex: 1 },
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
          
              <IconButton size="small"  color="primary" aria-label="add an alarm" onClick={() => navigate("/UnitType/" + params.row.UnitTypeId)}>
            <EditIcon fontSize="inherit"  />
          </IconButton>
           
             <IconButton size="small"  aria-label="delete"  color="error" 
            onClick={() => {
              setConfirmDialog({
                isOpen: true,
                title: 'Are you sure to delete this Unit Type?',
                subTitle: "You can't undo this operation",
                
                onConfirm: () => { removeUnitType(params.row.UnitTypeId) }
              })
            }}>
            <DeleteIcon fontSize="inherit"  />
          </IconButton>
          </Stack>
        );
      },
    },
  ];
  const removeUnitType = (UnitTypeId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
      unitTypesService
        .remove(UnitTypeId)
        .then((response: { data: any; }) => {
          let result=response.data;
          if (response) {
            globalService.success(result.message)
            getUnitType();
          }
        });
  };
  return (
    <>
      <Typography variant="h5" align="center">
        Unit Types
      </Typography>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/UnitType/")}
          >
            Add Record
          </Button>
          <div className='dvDataGrid'>
            <DataGrid
              getRowId={(row) => row.UnitTypeId}
              rows={unitTypes}
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
                    UnitTypeId: false,
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

export default UnitTypesList;
