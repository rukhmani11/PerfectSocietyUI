import React, { useState, useEffect, useContext } from "react";
import { societiesService } from "../../services/SocietiesService";
import {
  Stack,
  IconButton,
  CardContent,
  Button,
  CardActions,
  Typography,
  Card
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConfirmDialog from "../helper/ConfirmDialog";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AuthContext } from "../../utility/context/AuthContext";
import { ROLES, UserBackToListCallFrom } from "../../utility/Config";
import { globalService } from "../../services/GlobalService";
import dayjs from "dayjs";

const SocietiesList = (props: any) => {

  const { auth } = React.useContext(AuthContext);
  const { subscriberId } = useParams();
  const [societies, setSocieties] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => { },
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (subscriberId) {
      localStorage.setItem('subscriberId', subscriberId);
      getSocietiesBySubscriberId(subscriberId);
    }
  }, [subscriberId]);

  const getSocietiesBySubscriberId = (subscriberId: any) => {
    societiesService.getBySubscriberId(subscriberId).then((response) => {
      let result = response.data;
      setSocieties(result.list);
    });
  };

  const removeSociety = (societyId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    societiesService.remove(societyId).then((response) => {
      if (response.data && response.data?.isSuccess) {
        getSocietiesBySubscriberId(subscriberId);
        globalService.success('Successfully deleted.');
      }
      else
        globalService.error("Couldn't delete society.");
    });
  };

  const societyActivation = (societyId: string, active: boolean) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    let model = {
      SocietyId: societyId,
      Active: active
    };
    societiesService.activateOrDeActivate(model).then((response) => {
      if (response.data && response.data?.isSuccess) {
        getSocietiesBySubscriberId(subscriberId);
        let msg = `Successfully ${active ? 'activated' : 'deactivated'} society.`;
        globalService.success(msg);
      }
      else {
        globalService.error("Couldn't activate/deactivate society.");
      }
    });
  }
  const getSubscriptions = (displaySociety: boolean, row: any) => {
    localStorage.setItem("societyId", row.SocietyId);
    localStorage.setItem('societyName', row.Society);
    //setShowSociety(displaySociety);
    //setSelectedSociety(row);
    navigate('/societySubscriptions/' + row.SocietyId);
  };


  let isSubscriber = auth.Roles?.some(x => x === ROLES.Subscriber) ? true : false;
  let isAdmin = auth.Roles?.some(x => x === ROLES.Admin) ? true : false;

  const columns: GridColDef[] = [
    { field: "Society", headerName: "Society Name", width: 130, flex: 1 },
    { field: "Address", headerName: "Address", width: 130, flex: 1 },
    { field: "City", headerName: "City" },
    { field: "Pin", headerName: "PIN", },
    {
      field: "State",
      headerName: "State",
      width: 100,
      // renderCell: (params) => {
      //     return (params.row.State.State);
      // },
      valueGetter: (params) => params.row.State?.State,
    },
    {
      field: "UNoOfMembers",
      headerName: "No. Of Members",
      width: 20,
    },
    {
      field: "CreatedOn", headerName: "Created On",
      width: 110,
      valueFormatter: (params) => params.value ? dayjs(params.value).format('DD-MMM-YYYY') : ""
    },
    {
      field: "Active",
      headerName: "Active",
      width: 20,
      //flex: 1.5,
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
      width: 300,
      renderCell: (params) => {
        return (
          <>
            <Stack direction="row" spacing={0}>
              <IconButton size="small"
                color="primary"
                aria-label="add an alarm"
                onClick={() => navigate("/viewSociety/" + params.row.SocietyId)}
              >
                <VisibilityIcon fontSize="inherit" />
              </IconButton>
              {/* <IconButton size="small"
                aria-label="delete"
                color="error"
                onClick={() => {
                  setConfirmDialog({
                    isOpen: true,
                    title: "Are you sure to delete this Society ?",
                    subTitle: "You can't undo this operation",
                    onConfirm: () => {
                      removeSociety(params.row.SocietyId);
                    },
                  });
                }}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton> */}
              <Button
                className="btnGrid"
                variant="contained"
                color={params.row.Active ? "success" : "error"}
                onClick={() => {
                  let title = params.row.Active ? 'De Activate' : 'Activate';
                  setConfirmDialog({
                    isOpen: true,
                    title: "Are you sure to " + title + " Society : " + params.row.Society + " ?",
                    subTitle: "",
                    onConfirm: () => {
                      societyActivation(params.row.SocietyId, !params.row.Active);
                    },
                  });
                }}
              >
                {params.row.Active ? 'De Activate' : 'Activate'}
              </Button>
            </Stack>
            {isSubscriber && params.row.Active &&
              <Stack direction="row" spacing={0}>
                <Button
                  className="btnGrid"
                  variant="contained"
                  //startIcon={<SettingsSuggestIcon />}
                  onClick={() => getSubscriptions(false, params.row)}
                // navigate("/societySubscriptions/" + params.row.SocietyId)}
                >
                  Operate
                </Button>
              </Stack>
            }
            {isAdmin &&

              <Stack direction="row" spacing={0}>

                <Button
                  className="btnGrid"
                  variant="contained"
                  //startIcon={<SettingsSuggestIcon />}
                  onClick={() => getSubscriptions(false, params.row)}
                // navigate("/societySubscriptions/" + params.row.SocietyId)}
                >
                  Operate
                </Button>

                <Button
                  className="btnGrid"
                  variant="contained"
                  color={params.row.TotalUsers > 0 ? "success" : "error"}
                  sx={{ minWidth: '44px' }}
                  onClick={() => navigate("/societyUsers/" + params.row.SocietyId + "/" + UserBackToListCallFrom.society)}
                >
                  User
                  {/* ({params.row.TotalUsers}) */}
                </Button>

                <IconButton size="small"
                  color="primary"
                  aria-label="add an alarm"
                  onClick={() => navigate("/editSociety/" + params.row.SocietyId)}
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
                <IconButton size="small"
                  aria-label="delete"
                  color="error"
                  onClick={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: "Are you sure to delete this Society ?",
                      subTitle: "You can't undo this operation",
                      onConfirm: () => {
                        removeSociety(params.row.SocietyId);
                      },
                    });
                  }}
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </Stack>
            }
          </>
        );
      },
    },
  ];

  return (
    <>
      <div>
        <Stack direction="row" spacing={0} justifyContent="center">
          <Typography variant="h5">Society </Typography>
          {isAdmin && <Typography variant="h6" color="error" sx={{ paddingLeft: 1 }}> {localStorage.getItem('subscriberName')}</Typography>}
        </Stack>
        <Card>
          <CardContent>
            {/* <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => navigate("/addSociety/")}
            >
              Add Society
            </Button> */}
            <DataGrid
              getRowId={(row) => row.SocietyId}
              rows={societies}
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
                    SocietyId: false,
                    //SubscriberActions: isSubscriber,
                    //AdminActions: isAdmin
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

            <ConfirmDialog
              confirmDialog={confirmDialog}
              setConfirmDialog={setConfirmDialog}
            />
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "center" }}>
            <Stack spacing={2} direction="row">
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/admin")}
              >
                Back To List
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </div>
    </>
  );
};
export default SocietiesList;
