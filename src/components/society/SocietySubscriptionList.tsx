import React, { useState, useEffect } from "react";
import { societySubscriptionsService } from "../../services/SocietySubscriptionsService";
import {
  Stack,
  Breadcrumbs,
  Link,
  IconButton,
  Card,
  CardContent,
  Button,
  Typography,
  CardActions,
  Grid,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import ConfirmDialog from "../helper/ConfirmDialog";
import { globalService } from "../../services/GlobalService";
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";
import { SocietySubscriptionsModel } from "../../models/SocietySubscriptionsModel";
import { societiesService } from "../../services/SocietiesService";
import EditIcon from "@mui/icons-material/Edit";

function SocietySubscriptionList(props: any) {
  const { societyId }: any = useParams();
  const [societySubscriptions, setSocietySubscriptions] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => { },
  });
  const { auth } = React.useContext(AuthContext);
  const navigate = useNavigate();
  let isSocietyRole = auth.Roles?.some(x => x === ROLES.Society) ? true : false;
  let isReadonlyRole = auth.Roles?.some(x => x === ROLES.ReadOnly) ? true : false;

  useEffect(() => {
    getSocietySubscriptions();
    
    societiesService.clearSocietyAndSubscription(false, true);
  }, []);

  const getSocietySubscriptions = () => {
    societySubscriptionsService.getBySocietyId(societyId).then((response) => {
      let result = response.data;
      setSocietySubscriptions(result.list);
      localStorage.setItem("firstSocietySubscriptionId",result.firstSocietySubscriptionId);
    });
  };

  const goToDashboard = (
    societySubscription: SocietySubscriptionsModel,
    societySubscriptionId: string
  ) => {
    localStorage.setItem(
      "currentSocietySubscription",
      JSON.stringify(societySubscription)
    );
    localStorage.setItem("societySubscriptionId", societySubscriptionId);
    navigate("/dashboard/" + societySubscriptionId);
    window.location.reload();
  };

  const workOnYearEndEntry = (
    societySubscriptionId: string,
    closed: boolean
  ) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    if (closed) {
      societySubscriptionsService
        .deleteAcYearClosingEntry(societySubscriptionId)
        .then((response) => {
          let result = response.data;
          if (result) {
            globalService.success(
              "Year Closing Entry has been deleted successfully."
            );
            getSocietySubscriptions();
          } else {
            globalService.success("Couldn't delete Year Closing Entry.");
          }
        });
    } else {
      societySubscriptionsService
        .createAcYearClosingEntry(societySubscriptionId)
        .then((response) => {
          let result = response.data;
          if (result) {
            globalService.success(
              "Year Closing Entry has been created successfully."
            );
            getSocietySubscriptions();
          } else {
            globalService.success("Couldn't create Year Closing Entry.");
          }
        });
    }
  };
  const societySubscriptionColumns: GridColDef[] = [
    {
      field: "Actions",
      headerName: "Actions",
      type: "number",
      width: 350,
      minWidth: 100,
      maxWidth: 350,
      // flex: 1,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={0.2}>
            {!(isSocietyRole || isReadonlyRole) &&
              <IconButton
                size="small"
                color="primary"
                aria-label="add an alarm"
                onClick={() =>
                  navigate(
                    "/editSocietySubscription/" +
                    societyId +
                    "/" +
                    params.row.SocietySubscriptionId
                  )
                }
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
            }
            <Button
              className="btnGrid"
              variant="contained"
              onClick={() =>
                goToDashboard(params.row, params.row.SocietySubscriptionId)
              }
            >
              Select
            </Button>
            { !isReadonlyRole && 
            <Button
              color={`${params.row.Closed ? "error" : "success"}`}
              className="btnGrid"
              variant="contained"
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: params.row.Closed
                    ? "This will delete Year Closing Entry. Click Yes to Proceed."
                    : "This will set balances of all Income & Expenditure A/cs to zero. Click Yes to Proceed.",
                  subTitle: "",
                  onConfirm: () => {
                    workOnYearEndEntry(
                      params.row.SocietySubscriptionId,
                      params.row.Closed
                    );
                  },
                });
              }}
            >
              {params.row.Closed
                ? "Delete Year End Entry"
                : "Create Year End Entry"}
            </Button>
      }
          </Stack>
        );
      },
    },
    {
      field: "SubscriptionStart",
      headerName: "Start Date",
      flex: 1,
      width: 80,
      minWidth: 100,
      maxWidth: 150,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    {
      field: "SubscriptionEnd",
      headerName: "End Date",
      flex: 1,
      width: 80,
      minWidth: 100,
      maxWidth: 150,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    {
      field: "PaidTillDate",
      headerName: "Paid Till",
      width: 80,
      minWidth: 100,
      maxWidth: 150,
      flex: 1,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },

    {
      field: "LockedTillDate",
      headerName: "Locked Till",
      width: 80,
      minWidth: 100,
      maxWidth: 150,
      flex: 1,
    },
    {
      field: "NoOfMembers",
      headerName: "No. Of flats",
      width: 80,
      minWidth: 100,
      maxWidth: 150,
      flex: 1,
    },
    {
      field: "Closed",
      headerName: "Closed",
      width: 130,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            {params.row.Closed && <DoneIcon color="success" />}
            {!params.row.Closed && <CloseIcon color="error" />}
          </Stack>
        );
      },
    },
  ];
  return (
    <>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5">Society Subscriptions</Typography>

        <div role="presentation">
          {auth.Roles.some((x) => x !== ROLES.Society) && <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/mySociety">
              My Society
            </Link>
            {/* <Link
                            underline="hover"
                            color="inherit"
                            href="/material-ui/getting-started/installation/"
                        >
                            Core
                        </Link> */}
          </Breadcrumbs>
          }
        </div>
      </Stack>

      <Card>
        <CardContent>
          {!(isSocietyRole || isReadonlyRole)&& <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/addSocietySubscription/" + societyId)}
          >
            Add Record
          </Button>
          }
          <div>
            <Grid item xs={12}>
              <DataGrid
                getRowId={(row) => row.SocietySubscriptionId}
                rows={societySubscriptions}
                columns={societySubscriptionColumns}
                columnHeaderHeight={30}
                //rowHeight={30}
                autoHeight={true}
                getRowHeight={() => "auto"}
                getEstimatedRowHeight={() => 200}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      // Hide columns Id, the other columns will remain visible
                      SocietySubscriptionId: false,
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
            </Grid>
          </div>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "center" }}>
          <Stack spacing={2} direction="row">
            {auth.Roles.some((x) => x !== ROLES.Society) && <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                if (auth && auth.Roles) {
                  if (auth.Roles.some((x) => x === ROLES.Admin)) {
                    navigate("/admin");
                  } else if (auth.Roles.some((x) => x === ROLES.Subscriber)) {
                    navigate("/mySociety");
                  }
                }
              }}
            >
              Back To List
            </Button>
            }
          </Stack>
        </CardActions>
      </Card>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}

export default SocietySubscriptionList;
