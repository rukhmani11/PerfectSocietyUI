import React, { useState, useEffect } from "react";
import { societyparkingsService } from "../../../services/SocietyParkingsService";

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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConfirmDialog from "../../helper/ConfirmDialog";
import { globalService } from "../../../services/GlobalService";

const SocietyParkingList: React.FC = () => {
  const { societyId } = useParams();
  const [societyparkings, setsocietyparkings] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { }})
  const navigate = useNavigate();
  useEffect(() => {
    getSocietyParking(societyId);
  }, []);

  const getSocietyParking = (societyId:any) => {
    societyparkingsService.getBySocietyId(societyId).then((response) => {
      let result = response.data;
      setsocietyparkings(result.list);
    });
  };

  const columns: GridColDef[] = [
    { field: "ParkingNo", headerName: "ParkingNo", width: 130, flex: 1 },
   {
      field: "ParkingType",
      headerName: "Parking Types",
      width: 130,
      flex: 1,
      valueGetter: (params) => params.row.ParkingType?.ParkingType ,
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
              onClick={() => navigate("/editsocietyParking/"+societyId+'/' + params.row.SocietyParkingId)}
            >
              <EditIcon fontSize="inherit"  />
            </IconButton>
          <IconButton size="small"  aria-label="delete"  color="error" 
            onClick={() => {
              
              setConfirmDialog({
                isOpen: true,
                title: 'Are you sure to delete this Record ?',
                subTitle: "You can't undo this operation",
                onConfirm: () => { removeSocietyParking(params.row.SocietyParkingId) }
              })
            }}>
            <DeleteIcon fontSize="inherit"  />
          </IconButton>
        
          </Stack>
        );
      },
    },
  ];

  const removeSocietyParking = (SocietyParkingId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    societyparkingsService
      .remove(SocietyParkingId)
      .then((response) => {
        let result=response.data;
        if (response) {
          globalService.success(result.message);
          getSocietyParking(societyId);
        }
      });
  }

  return (
    <>
      <Typography variant="h5" align="center">
       Parking Details
      </Typography>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/addsocietyParking/"+societyId)}
          >
            Add Record
          </Button>
          <div style={{ width: "100%" }}>
            <DataGrid
              getRowId={(row) => row.SocietyParkingId}
              rows={societyparkings}
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
                    SocietyParkingId: false,
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

export default SocietyParkingList;
