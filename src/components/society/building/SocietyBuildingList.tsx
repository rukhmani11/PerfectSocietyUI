import React, { useState, useEffect } from "react";

import {
  Stack,
  IconButton,
  Card,
  CardContent,
  Button,
  Typography,
  Breadcrumbs,
  Link,
  CardActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { societyBuildingsService } from "../../../services/SocietyBuildingsService";
import ConfirmDialog from "../../helper/ConfirmDialog";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { globalService } from "../../../services/GlobalService";
import { Messages } from "../../../utility/Config";

const SocietyBuildingList: React.FC = () => {
  const { societyId } = useParams();
  const [societyBuildings, setSocietyBuildings] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => { },
  });
  const navigate = useNavigate();
  const { goToHome } = useSharedNavigation();
  
  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    getSocietyBuildings(societyId);
  }, []);

  const getSocietyBuildings = (societyId: any) => {
    societyBuildingsService.getBySocietyId(societyId).then((response) => {
      let result = response.data;
      setSocietyBuildings(result.list);
      //console.log(response.data);
    });
  };

  const columns: GridColDef[] = [
    { field: "Building", headerName: "Building", width: 130, flex: 1 },
    { field: "NoOfFloors", headerName: "No Of Floors", width: 130, flex: 1 },
    {
      field: "Lift",
      headerName: "Lift",
      width: 130,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            {params.row.Lift && <DoneIcon color="secondary" />}
            {!params.row.Lift && <CloseIcon />}
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
            <IconButton
              size="small"
              color="primary"
              aria-label="add an alarm"
              onClick={() =>
                navigate(
                  "/editSocietyBuilding/" +
                  societyId +
                  "/" +
                  params.row.SocietyBuildingId
                )
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
                  title:
                    "Are you sure to delete Building " +
                    params.row.Building +
                    " ?",
                  subTitle: "You can't undo this operation",
                  onConfirm: () => {
                    removeSocietyBuilding(params.row.SocietyBuildingId);
                  },
                });
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
            <Button
              className="btnGrid"
              variant="contained"
              size="small"
              onClick={() => goToBuildingUnits(params.row.SocietyBuildingId)}
            >
              Building Unit({params.row.BuildingUnitsCount})
            </Button>
          </Stack>
        );
      },
    },
  ];

  const goToBuildingUnits = (societyBuildingId: any) => {
    localStorage.setItem('societyBuildingId', societyBuildingId);
    navigate("/societyBuildingUnits/" + societyBuildingId);
  }

  const removeSocietyBuilding = (SocietyBuildingId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    societyBuildingsService.remove(SocietyBuildingId).then((response) => {
      if (response) {
        //console.log(response.data);
        getSocietyBuildings(societyId);
      }
    });
  };

  return (
    <>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5">Society Buildings</Typography>
        {/* <Typography variant="h6" color="error">
          {" "}
          {localStorage.getItem("societyName")}
        </Typography> */}

        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/mySociety">
            My Society
          </Link>
        </Breadcrumbs>
      </Stack>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/addSocietyBuilding/" + societyId)}
          >
            Add Record
          </Button>
          <div>
            <DataGrid
              getRowId={(row) => row.SocietyBuildingId}
              rows={societyBuildings}
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
                    SocietyBuildingId: false,
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
              onClick={() => navigate("/dashboard/" + societyId)}
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

export default SocietyBuildingList;
