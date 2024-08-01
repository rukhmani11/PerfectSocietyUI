import React, { useState, useEffect } from "react";
import { societyMemberJointHoldersService } from "../../../services/SocietyMemberJointHoldersService";
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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConfirmDialog from "../../helper/ConfirmDialog";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { globalService } from "../../../services/GlobalService";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";

const SocietyMemberJointHoldersList: React.FC = () => {
  const { societyMemberId, societyId }: any = useParams();
  const [societyMemberJointHolders, setSocietyMemberJointHolders] = useState(
    []
  );
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => { },
  });
  const navigate = useNavigate();
  const { goToHome } = useSharedNavigation();
  //const prevPgState = useLocation();
  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    getSocietyMemberJointHolders(societyMemberId);
  }, []);

  const getSocietyMemberJointHolders = (societyMemberId: any) => {
    societyMemberJointHoldersService
      .GetBySocietyMemberId(societyMemberId)
      .then((response) => {
        let result = response.data;
        setSocietyMemberJointHolders(result.list);
      });
  };

  const columns: GridColDef[] = [
    { field: "Name", headerName: "Name", width: 130, flex: 1 },
    { field: "Address", headerName: "Address", width: 130, flex: 1 },
    { field: "City", headerName: "City", width: 130, flex: 1 },
    { field: "Pin", headerName: "Pin", width: 130, flex: 1 },
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
                  "/ediSocietyMemberJointHolders/" +
                  societyMemberId +
                  "/" +
                  params.row.SocietyMemberJointHolderId +
                  "/" +
                  societyId
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
                  title: "Are you sure to delete this Record ?",
                  subTitle: "You can't undo this operation",
                  onConfirm: () => {
                    removeSocietyMember(params.row.SocietyMemberJointHolderId);
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

  const removeSocietyMember = (SocietyMemberId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    societyMemberJointHoldersService
      .remove(SocietyMemberId)
      .then((response) => {
        let result = response.data;
        if (response) {
          globalService.success(result.message);
          getSocietyMemberJointHolders(societyMemberId);
        }
      });
  };

  return (
    <>
     <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5">Society Member Joint Holders</Typography>
        <Typography variant="body1"><b>Member : </b>{localStorage.getItem("MemberName")} </Typography>
      </Stack>
    
      {/* {prevPgState && prevPgState.state && prevPgState.state.row && (
        <Typography variant="body1">
          Member:
          <b> {prevPgState.state.row.Member}</b>
        </Typography>
      )} */}
     
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() =>
              navigate(
                "/addSocietyMemberJointHolders/" +
                societyMemberId +
                "/" +
                societyId
              )
            }
          >
            Add Record
          </Button>
          <div style={{ width: "100%" }}>
            <DataGrid
              getRowId={(row) => row.SocietyMemberJointHolderId}
              rows={societyMemberJointHolders}
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
                    SocietyMemberId: false,
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
              onClick={() => navigate("/societyMembers/" + societyId)}
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

export default SocietyMemberJointHoldersList;
