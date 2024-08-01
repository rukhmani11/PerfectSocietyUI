import React, { useState, useEffect } from "react";
// import { societyMembersService } from "../../../services/SocietyMembersService";
import { SocietyMemberNomineesService } from "../../../services/SocietyMemberNomineesService";
import { SocietyMemberNomineesModel } from "../../../models/SocietyMemberNomineesModel";
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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConfirmDialog from "../../helper/ConfirmDialog";
import dayjs from "dayjs";
import { globalService } from "../../../services/GlobalService";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";

const SocietyMemberNomineeList: React.FC = () => {
  const { societyMemberId, societyId }: any = useParams();
  const { goToHome } = useSharedNavigation();
  const [SocietyMemberNominees, setSocietyMemberNominees] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => { },
  });
  const navigate = useNavigate();
  //const prevPgState = useLocation();
  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    getsetSocietyMemberNominees(societyMemberId);
  }, []);

  const getsetSocietyMemberNominees = (societyMemberId: any) => {
    SocietyMemberNomineesService.GetBySocietyMemberId(societyMemberId).then(
      (response) => {
        let result = response.data;
        setSocietyMemberNominees(result.list);
      }
    );
  };

  const columns: GridColDef[] = [
    { field: "Name", headerName: "Name", width: 130, flex: 1 },
    {
      field: "Relationshipid",
      width: 130,
      flex: 1,
      headerName: "Relationship",
      valueGetter: (params) => params.row.RelationshipNavigation?.Relationship,
    },
    {
      field: "Relationship",
      headerName: "Other Relationship",
      width: 130,
      flex: 1,
    },
    {
      field: "BirthDate",
      headerName: "Birth Date",
      width: 130,
      flex: 1,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    {
      field: "NominationDate",
      headerName: "Nomination Date",
      width: 130,
      flex: 1,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    {
      field: "Mcmdate",
      headerName: "MCM Date",
      width: 130,
      flex: 1,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    {
      field: "RevocationDate",
      headerName: "Revocation Date",
      width: 130,
      flex: 1,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },

    // { field: "Relationship", headerName: "Relationship", width: 130, flex: 1 },
    {
      field: "NominationPerc",
      headerName: "Nomination Perc",
      width: 130,
      flex: 1,
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
              aria-label="add an alarm "
              onClick={() =>
                navigate(
                  "/editSocietyMemberNominee/" +
                  societyMemberId +
                  "/" +
                  params.row.SocietyMemberNomineeId +
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
                    removeSocietyMemberNominee(
                      params.row.SocietyMemberNomineeId
                    );
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

  const removeSocietyMemberNominee = (SocietyMemberNomineeId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });

    SocietyMemberNomineesService.remove(SocietyMemberNomineeId).then(
      (response) => {
        let result = response.data;
        if (response) {
          //console.log(response.data);
          globalService.success(result.message);
          getsetSocietyMemberNominees(societyMemberId);
        }
      }
    );
  };

  return (
    <>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5">Member Nominee</Typography>
        <Typography variant="body1"><b>Member : </b>{localStorage.getItem("MemberName")} </Typography>
      </Stack>

      {/* {prevPgState && prevPgState.state && prevPgState.state.row && (
        <Typography variant="body1">
          Member :<b> {prevPgState.state.row.Member} </b>
        </Typography>
      )} */}
    
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() =>
              navigate(
                "/addSocietyMemberNominee/" + societyMemberId + "/" + societyId
              )
            }
          >
            Add Record
          </Button>
          <div style={{ width: "100%" }}>
            <DataGrid
              getRowId={(row) => row.SocietyMemberNomineeId}
              rows={SocietyMemberNominees}
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
                    SocietyMemberNomineeId: false,
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

export default SocietyMemberNomineeList;
