import React, { useState, useEffect } from "react";
import { societiesService } from "../../services/SocietiesService";
import {
  Stack,
  Breadcrumbs,
  Link,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "../../utility/context/AuthContext";
import ConfirmDialog from "../helper/ConfirmDialog";
import { ROLES, UserBackToListCallFrom } from "../../utility/Config";
import { globalService } from "../../services/GlobalService";

interface MySocietyProp {
  showCard: boolean;
  showApprovalButton: boolean;
}

//This is used in Admin Home and Subscriber Home - Admin Home doesnt need card as its in Tab, Subscriber home doesn't need card but not header component
const MySocietyList = (props: any) => {
  // const { mySociety, setMySociety } = props;
  const { auth } = React.useContext(AuthContext);
  const [societies, setSocieties] = useState([]);
  //const [showSociety, setShowSociety] = useState(true);
  //const [selectedSociety, setSelectedSociety] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => { },
  });

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Societies";
    
    societiesService.clearSocietyAndSubscription(true, true);
    getSocietiesByUserId();
  }, []);

  const getSocietiesByUserId = () => {
    societiesService.getByUserId(auth.UserId).then((response) => {
      let result = response.data;
      setSocieties(result.list);
    });
  };

  const getSubscriptions = (displaySociety: boolean, row: any) => {
    localStorage.setItem("societyId", row.SocietyId);
    localStorage.setItem('societyName', row.Society);
    //setShowSociety(displaySociety);
    //setSelectedSociety(row);
    navigate('/societySubscriptions/' + row.SocietyId);
  };

  const removeSociety = (SocietyId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    societiesService.remove(SocietyId).then((response) => {
      if (response.data?.isSuccess) {
        getSocietiesByUserId();
        globalService.success('Successfully deleted society.');
      }
      else
        globalService.error("Couldn't delete society.");
    });
  };

  let isSubscriber = auth.Roles?.some(x => x === ROLES.Subscriber) ? true : false;
  let isAdmin = auth.Roles?.some(x => x === ROLES.Admin) ? true : false;
  let isSocietyRole = auth.Roles?.some(x => x === ROLES.Society) ? true : false;
  let isReadonlyRole = auth.Roles?.some(x => x === ROLES.ReadOnly) ? true : false;

  const columns: GridColDef[] = [
    {
      field: "Actions",
      headerName: "Actions",
      width: 182,
      renderCell: (params) => {
        return (
          <>
            {(isSocietyRole || isReadonlyRole) && params.row.Active &&
              <Stack direction="row" spacing={0}>
                <Button
                  className="btnGrid"
                  variant="contained"
                  onClick={() => getSubscriptions(false, params.row)}
                >
                  Operate
                </Button>
              </Stack>
            }
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
                <Button
                  className="btnGrid"
                  variant="contained"
                  color={params.row.TotalUsers > 0 ? "success" : "error"}
                  sx={{ minWidth: '44px' }}
                  onClick={() => navigate("/societyUsers/" + params.row.SocietyId + "/" + UserBackToListCallFrom.mySociety)}
                >
                  User
                  {/* ({params.row.TotalUsers}) */}
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
                //navigate("/societySubscriptions/" + params.row.SocietyId)}
                >
                  Operate
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
                <Button
                  className="btnGrid"
                  variant="contained"
                  color={params.row.TotalUsers > 0 ? "success" : "error"}
                  sx={{ minWidth: '44px' }}
                  onClick={() => navigate("/societyUsers/" + params.row.SocietyId + "/" + UserBackToListCallFrom.admin)}
                >
                  User
                  {/* ({params.row.TotalUsers}) */}
                </Button>
              </Stack>
            }
          </>
        );
      },
    },
    { field: "Society", headerName: "Society Name", width: 200, flex: 1 },
    // { field: "Address", headerName: "Address", width: 130, flex: 1 },
    { field: "City", headerName: "City", width: 100 },
    { field: "Mobile", headerName: "Mobile", width: 100 },
    { field: "EmailId", headerName: "Email", width: 200 },
    { field: "Pin", headerName: "PIN", width: 80 },
    {
      field: "State",
      headerName: "State",
      width: 110,

      // renderCell: (params) => {
      //     return (params.row.State.State);
      // },
      valueGetter: (params) => params.row.State?.State,
    },
    {
      field: "UNoOfMembers",
      headerName: "No. Of Members",
      width: 50,

    },
    {
      field: "CreatedOn", headerName: "Created On",
      width: 110,
      valueFormatter: (params) => params.value ? dayjs(params.value).format('DD-MMM-YYYY') : ""
    },
    {
      field: "Active",
      headerName: "Active",

      renderCell: (params) => {
        return (
          <Stack>
            {params.row.Active && <DoneIcon color="success" />}
            {!params.row.Active && <CloseIcon color="error" />}
          </Stack>
        );
      },
    }
  ];

  return (
    <>
      {(isAdmin && !props.showCard) &&
        <div>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/addSociety/")}
          >
            Add Society
          </Button>
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
                  SubscriberActions: isSubscriber,
                  AdminActions: isAdmin
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
        </div>
      }

      {(props.showCard) &&
        <div>
          <Stack direction="row" spacing={0} justifyContent="space-between">
            <Typography variant="h5"> Societies </Typography>
            {isAdmin && <Typography variant="h6" color="error"> {localStorage.getItem('subscriberName')}</Typography>}

          </Stack>
          <Card>
            <CardContent>
              {!(isSocietyRole || isReadonlyRole) && <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => navigate("/addSociety/")}
              >
                Add Society
              </Button>
              }
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
                {/* <Button
                  variant="outlined"
                 
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(-1)}
                >
                  Back To List
                </Button> */}
              </Stack>
            </CardActions>
          </Card>
        </div>
      }
    </>
  );
};

export default MySocietyList;
