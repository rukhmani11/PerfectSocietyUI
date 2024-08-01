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
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate, useParams } from "react-router-dom";
import { SocietyBuildingUnitParkingsService } from "../../../services/SocietyBuildingUnitParkingsService";
import { societyBuildingsService } from "../../../services/SocietyBuildingsService";
import { SocietyBuildingTitleModel } from "../../../models/SocietyBuildingsModel";
import dayjs from "dayjs";
import ConfirmDialog from "../../helper/ConfirmDialog";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { globalService } from "../../../services/GlobalService";
import UploadIcon from '@mui/icons-material/Upload';
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";


const SocietyBuildingUnitParkingList: React.FC = () => {
  const { societyBuildingUnitId } = useParams();
  const [SocietyBuildingUnitParkings, setSocietyBuildingUnitParking] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { }})
  const [title, setTitle] = useState<any>({});
  const navigate = useNavigate();
  const { goToHome } = useSharedNavigation();
  
useEffect(() => {
  if (!globalService.isSocietySelected()) {
    globalService.info(Messages.SocietyUnSelected);
    return goToHome();
  }
  getSocietyBuildingUnitParking(societyBuildingUnitId);
  if (Object.keys(title).length === 0)
  getBuildingTitle();
}, []);

const getBuildingTitle = () => {
  let model: SocietyBuildingTitleModel = {
      SocietyBuildingUnitId: societyBuildingUnitId,
      SocietyBuildingId: ""
  }
  societyBuildingsService
      .getPageTitle(model)
      .then((response) => {
          setTitle(response.data);
      });
};
const getSocietyBuildingUnitParking = (societyBuildingUnitId: any) => {
  SocietyBuildingUnitParkingsService.getBysocietyBuildingUnitId(societyBuildingUnitId).then((response) => {
      let result = response.data;
      setSocietyBuildingUnitParking(result.list);
  });
};

  const columns: GridColDef[] = [
    {
      field: "ParkingNo",
      width: 130,
      flex: 1,
     headerName :"Parking No",
      valueGetter: (params) => params.row.SocietyParking?.ParkingNo,
  },
    {
      field: "ParkingType",
      headerName: "Parking Type",
      width: 130,
      flex: 1,     
      valueGetter: (params) => params.row.ParkingType?.ParkingType,
  },
  {
    
    field: "Member",
    headerName: "Member",
    width: 130,
    flex: 1,     
    valueGetter: (params) => params.row.SocietyMember?.Member,
},
{
  field: "Tenant",
  headerName: "Tenant",
  width: 130,
  flex: 1,     
  valueGetter: (params) => params.row.SocietyMemberTenant?.Tenant,
},
{
  field: "VehicleNumber",
  headerName: "Vehicle Number",
  width: 130,
  flex: 1,     
},
 
    {
    field: "TransferredOn", headerName: "Transferred On", width: 130,flex: 1,
   valueFormatter: (params) => params.value ? dayjs(params.value).format('DD-MMM-YYYY') : ""
},
{
  
   field: "EndDate", headerName: "End Date",  width: 130,flex: 1,
   valueFormatter: (params) => params.value ? dayjs(params.value).format('DD-MMM-YYYY') : ""
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
              onClick={() => navigate("/editsocietyBuildingUnitParking/" + societyBuildingUnitId + "/" + params.id)}
            >
              <EditIcon fontSize="inherit"  />
            </IconButton>
          <IconButton size="small"  aria-label="delete"  color="error" 
            onClick={() => {
              
              setConfirmDialog({
                isOpen: true,
                title: 'Are you sure to delete this Record ?',
                subTitle: "You can't undo this operation",
                onConfirm: () => { removeSocietyBuildingUnitParking(params.row.SocietyBuildingUnitParkingId) }
              })
            }}>
            <DeleteIcon fontSize="inherit"  />
          </IconButton>

          </Stack>
        );
      },
    },
  ];

  const removeSocietyBuildingUnitParking = (SocietyBuildingUnitParkingId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    SocietyBuildingUnitParkingsService.remove(SocietyBuildingUnitParkingId).then((response) => {
        let result=response.data;
        if (response) {
          globalService.success(result.message);
          getSocietyBuildingUnitParking(societyBuildingUnitId);
        }
      });
  }

  return (
    <>
    <Stack direction="row" spacing={0} justifyContent="space-between">
      <Typography variant="h5" align="center">
     Building Unit Parking
      </Typography>
      <Typography variant="body1"><b>Building : </b>{title.Building}  <b>Unit :</b> {title.Unit}  </Typography>
      </Stack>
      <Card>
        <CardContent>
          <Button
           style={{marginRight: '2vh'}}
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/addsocietyBuildingUnitParking/" + societyBuildingUnitId)}
          >
            Add Record
          </Button>
          <div style={{  width: "100%" }}>
            <DataGrid
              getRowId={(row) => row.SocietyBuildingUnitParkingId}
              rows={SocietyBuildingUnitParkings}
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

export default SocietyBuildingUnitParkingList;
