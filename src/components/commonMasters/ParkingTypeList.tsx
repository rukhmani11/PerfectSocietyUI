import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { parkingtypeService } from "../../services/ParkingTypesService";
import { globalService } from '../../services/GlobalService';
import { Button, Card, CardContent, IconButton, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ConfirmDialog from "../helper/ConfirmDialog";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

const ParkingTypeList: React.FC = () => {
  const [parkingTypes, setParkingTypes] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { } })
  const navigate = useNavigate();
  useEffect(() => {
    getParkingTypes();
  }, []);

  const getParkingTypes = () => {
    parkingtypeService
      .getAll()
      .then((response: { data: any; }) => {

        let result = response.data;
        setParkingTypes(result.list);
        
      });
  };

  const columns: GridColDef[] = [
    {
      field: 'ParkingTypeId',
      headerName: 'ParkingTypeId',
      width: 70,
      //hideable: false,
      flex: 1
    },
    { field: 'ParkingType', headerName: 'Parking Type', width: 130, flex: 1 },
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
      field: 'Actions',
      headerName: 'Actions',
      type: 'number',
      flex: 1,
      renderCell: (params) => {
        return (<Stack direction="row" spacing={0}>
          <IconButton size="small" color="primary" aria-label="add an alarm" onClick={() => navigate("/editParkingType/" + params.row.ParkingTypeId)}>
            <EditIcon fontSize="inherit" />
          </IconButton>

          <IconButton size="small" aria-label="delete" color="error"
            onClick={() => {
              setConfirmDialog({
                isOpen: true,
                title: 'Are you sure to delete this Parking type?',
                subTitle: "You can't undo this operation",
                onConfirm: () => { removeParkingType(params.row.ParkingTypeId) }
              })
            }}>
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Stack>);
      }
    }
  ];

  const removeParkingType = (ParkingTypeId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    parkingtypeService
      .remove(ParkingTypeId)
      .then((response: { data: any; }) => {
        let result=response.data
        if (response.data?.isSuccess) {
          globalService.success(result.message);
          getParkingTypes();
        } else {
          globalService.error(result.message);
        }
      });
  };

  return (
    <>
      <Typography variant="h5" align="center">
        Parking Types
      </Typography>
      <Card>
        <CardContent>
          <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate("/addParkingType/")}>
            Add Record
          </Button>
          <div style={{  width: '100%' }}>
            <DataGrid
              getRowId={(row) => row.ParkingTypeId}
              rows={parkingTypes}
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
                    ParkingTypeId: false
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
            //pageSize={5}
            //rowsPerPageOptions={[5]}
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
}

export default ParkingTypeList;
