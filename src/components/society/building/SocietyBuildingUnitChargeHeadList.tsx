import React, { useState, useEffect } from "react";
import { societyBuildingUnitChargeHeadsService } from "../../../services/SocietyBuildingUnitChargeHeadsService";
import {
  Stack,
  IconButton,
  Card,
  CardContent,
  Button,
  CardActions,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ConfirmDialog from "../../helper/ConfirmDialog";
import { globalService } from "../../../services/GlobalService";
import { SocietyBuildingTitleModel } from "../../../models/SocietyBuildingsModel";
import { societyBuildingsService } from "../../../services/SocietyBuildingsService";
import UploadIcon from '@mui/icons-material/Upload';
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";

const SocietyBuildingUnitChargeHeadList: React.FC = () => {
  const { societyBuildingUnitId }: any = useParams();
  const societyBuildingId: any = localStorage.getItem('societyBuildingId');
  const [societyBuildingUnitChargeHeads, setSocietyBuildingUnitChargeHeads] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { } })
  const [title, setTitle] = useState<any>({});
  const navigate = useNavigate();
  const { goToHome } = useSharedNavigation();

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (societyBuildingUnitId)
      getSocietyBuildingUnitChargeHeads();
    if (Object.keys(title).length === 0)
      getBuildingTitle();

  }, [societyBuildingUnitId]);

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
  
  const getSocietyBuildingUnitChargeHeads = () => {
    societyBuildingUnitChargeHeadsService.getBySocietyBuildingUnitId(societyBuildingUnitId).then((response) => {
      let result = response.data;
      setSocietyBuildingUnitChargeHeads(result.list);
    });
  };

  const columns: GridColDef[] = [
    {
      field: "ChargeHead",
      headerName: "Charge Head",
      width: 130,
      flex: 1,
      // renderCell: (params) => {
      //     return (params.row.State.State);
      // },
      valueGetter: (params) => params.row.ChargeHead?.ChargeHead,
    },
    { field: "Rate", headerName: "Rate", width: 130, flex: 1 },
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
              onClick={() => navigate("/editSocietyBuildingUnitChargeHead/" + societyBuildingUnitId + "/" + params.id)}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
            <IconButton size="small" aria-label="delete" color="error"
              onClick={() => {

                setConfirmDialog({
                  isOpen: true,
                  title: 'Are you sure to delete this charge head ?',
                  subTitle: "You can't undo this operation",
                  onConfirm: () => { removeSocietyBuildingUnitChargeHead(params.row.SocietyBuildingUnitChargeHeadId) }
                })
              }}>
              <DeleteIcon fontSize="inherit" />
            </IconButton>

          </Stack>
        );
      },
    },
  ];

  const removeSocietyBuildingUnitChargeHead = (SocietyBuildingUnitChargeHeadId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    societyBuildingUnitChargeHeadsService
      .remove(SocietyBuildingUnitChargeHeadId)
      .then((response) => {
        if (response) {
          let result = response.data;
          if (result.isSuccess) {
            globalService.success("Building Unit charge head deleted successfully.");
            getSocietyBuildingUnitChargeHeads();
          }
          else {
            globalService.error(result.message);
          }
        }
      });
  }

  return (
    <>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5" align="center">
          Society Building Unit Charge Heads
        </Typography>
        <Typography variant="body1"><b>Building : </b>{title.Building}  <b>Unit :</b> {title.Unit}  </Typography>
      </Stack>
      <Card>
        <CardContent>
          <Button
          style={{marginRight: '2vh'}}
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/addSocietyBuildingUnitChargeHead/" + societyBuildingUnitId)}
          >
            Add Record
          </Button> 
          <div>
            <DataGrid
              getRowId={(row) => row.SocietyBuildingUnitChargeHeadId}
              rows={societyBuildingUnitChargeHeads}
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
        <CardActions sx={{ display: "flex", justifyContent: "center" }}>
          <Stack spacing={2} direction="row">
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/societyBuildingUnits/' + societyBuildingId)}
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

export default SocietyBuildingUnitChargeHeadList;
