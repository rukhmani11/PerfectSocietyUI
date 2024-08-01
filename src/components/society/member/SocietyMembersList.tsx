import React, { useState, useEffect } from "react";
import { societyMembersService } from "../../../services/SocietyMembersService";
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
import UploadIcon from "@mui/icons-material/Upload";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";

const SocietyMembersList: React.FC = () => {
  const { societyId } = useParams();
  const [societyMembers, setSocietyMember] = useState([]);
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
    
    getSocietyMember(societyId);
  }, []);

  const getSocietyMember = (societyId: any) => {
    societyMembersService.getBySocietyId(societyId).then((response) => {
      let result = response.data;
      setSocietyMember(result.list);
    });
  };

  const redirectToSocietyMemberNominees = (row: any) => {
    localStorage.setItem("MemberName", row.Member);
    navigate("/societyMemberNominees/" + row.SocietyMemberId + "/" + row.SocietyId);
  }

  const redirectTosocietyMemberJointHolders = (row: any) => {
    localStorage.setItem("MemberName", row.Member);
    navigate("/societyMemberJointHolders/" + row.SocietyMemberId + "/" + row.SocietyId);
  }

  const columns: GridColDef[] = [
    { field: "FolioNo", headerName: "Folio No", width: 75 },
    { field: "Member", headerName: "Member", flex: 1 },
    {
      field: "MemberClassId",
      headerName: "Member Class",
      width: 130,
      flex: 1,
      valueGetter: (params) => params.row.MemberClass?.MemberClass,
    },

    { field: "EmailId", headerName: "Email Id", width: 220 },
    { field: "MobileNo", headerName: "Mobile No", width: 110 },

    {
      field: "IsCommitteeMember",
      headerName: "Is Committee Member",
      align: "center",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Stack>
            {params.row.IsCommitteeMember && <DoneIcon color="success" />}
            {!params.row.IsCommitteeMember && <CloseIcon color="error" />}
          </Stack>
        );
      },
    },
    {
      field: "Actions",
      headerName: "Actions",
      type: "number",
      width: 500,
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
                  "/editsocietyMember/" +
                  societyId +
                  "/" +
                  params.row.SocietyMemberId
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
                    removeSocietyMember(params.row.SocietyMemberId);
                  },
                });
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
            <Button
              variant="contained"
              className="btnGrid"
              //onClick={() => navigate("/societyMemberNominees/"+params.row.SocietyMemberId)}
              onClick={() => redirectToSocietyMemberNominees(params.row)
                // navigate(
                //   "/societyMemberNominees/" +
                //     params.row.SocietyMemberId +
                //     "/" +
                //     params.row.SocietyId,{
                //       state:{
                //         row: params.row,
                //       },
                //      }
                // )
              }
            >
              Nominee({params.row.SocietyMemberNomineesCount})
            </Button>
            <Button
              variant="contained"
              className="btnGrid"
              onClick={() => redirectTosocietyMemberJointHolders(params.row)}
            // onClick={() =>
            //   navigate(
            //     "/societyMemberJointHolders/" +
            //       params.row.SocietyMemberId +
            //       "/" +
            //       params.row.SocietyId,{
            //         state:{
            //           row: params.row,
            //         },
            //        }
            //   )
            // }
            >
              Joint Holder({params.row.SocietyMemberJointHoldersCount})
            </Button>
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
    societyMembersService.remove(SocietyMemberId).then((response) => {
      let result = response.data;
      if (response) {
        globalService.success(result.message);
        getSocietyMember(societyId);
      }
    });
  };

  return (
    <>
      <Typography variant="h5" align="center">
        Member Details
      </Typography>
      <Card>
        <CardContent>
          <Button
            style={{ marginRight: "2vh" }}
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/addsocietyMember/" + societyId)}
          >
            Add Record
          </Button>
          <Button
            style={{ marginRight: "2vh" }}
            variant="contained"
            startIcon={<UploadIcon />}
            color="success"
            onClick={() => navigate("/societyMembersExcelUpload/" + societyId)}
          >
            Member Import Excel
          </Button>
          <div style={{ width: "100%" }}>
            <DataGrid
              getRowId={(row) => row.SocietyMemberId}
              rows={societyMembers}
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

export default SocietyMembersList;
