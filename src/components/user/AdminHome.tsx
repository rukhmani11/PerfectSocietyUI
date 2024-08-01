import * as React from "react";
import {
  Card,
  CardContent,
  Tabs,
  Tab,
  Typography,
  Box,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { subscriberService } from "../../services/SubscribersService";
import { useNavigate } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import SocietiesList from "../society/SocietiesList";
import MySocietyList from "../society/MySocietyList";
import { societiesService } from "../../services/SocietiesService";

export default function AdminHome() {
  let selAdminTab = localStorage.getItem('selAdminTab');
  const [tabValue, setTabValue] = React.useState(selAdminTab ? selAdminTab : "1");
  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => { },
  });
  const [subscribers, setSubscribers] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    getSubscribers();

    societiesService.clearSocietyAndSubscription(true, true);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    localStorage.setItem('selAdminTab', newValue.toString());
  };

  function goToSubscriberSociety(subscriberId: string, subscriber: string) {
    localStorage.setItem('subscriberName', subscriber);
    navigate('/societies/' + subscriberId);
  }

  const subscriberColumns: GridColDef[] = [

    {
      field: "SubscriberId",
      headerName: "SubscriberId",
      headerAlign: "center",
      align: "center"
    },
    {
      field: "Subscriber", headerName: "Subscriber", flex: 1,
      headerAlign: "center",
      align: "center"
    },
    // { field: "Abbreviation", headerName: "Abbreviation", flex: 1,width: },
    // { field: "Address", headerName: "Address", flex: 1 },
    {
      field: "City", headerName: "City", width: 100, headerAlign: "center",
      align: "center"
    },
    //{ field: "CountryCode", headerName: "CountryCode", flex: 1 },
    { field: "Email", headerName: "Email", flex: 1 },
    { field: "ContactPerson", headerName: "ContactPerson", flex: 1 },
    // { field: "Phone", headerName: "Phone", flex: 1 },

    {
      field: "Mobile",
      headerName: "Mobile",
      width: 100
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
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={0}>
            <Button
              className="btnGrid"
              variant="contained"
              size="small"
              onClick={() => goToSubscriberSociety(params.row.SubscriberId, params.row.Subscriber)}
            >
              Societies ({params.row.SocietyCount})
            </Button>
            <IconButton size="small"
              color="primary"
              aria-label="add an alarm"
              onClick={() => navigate("/subscriber/" + params.row.SubscriberId)}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>

            {/* onClick={() => removeUser(params.row.Id)}  */}
            <IconButton size="small"
              aria-label="delete"
              color="error"
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title:
                    "Are you sure to delete subscriber " +
                    params.row.Subscriber +
                    "?",
                  subTitle: "You can't undo this operation",
                  onConfirm: () => {
                    removeSubscriber(params.row.SubscriberId);
                  },
                });
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
            {params.row.UserId && <Button className='btnGrid'
              variant="contained"
              color="error"
              onClick={() => navigate("/resetPassword/" + params.row.UserId, {
                state: {
                  row: params.row
                }
              })}
            >
              Reset
            </Button>
            }
          </Stack>
        );
      },
    }
  ];

  const getSubscribers = () => {
    subscriberService.getAll().then((response) => {
      let result = response.data;
      setSubscribers(result.list);
    });
  };

  const removeSubscriber = (id: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    subscriberService.remove(id).then((response) => {
      if (response.data?.isSuccess) {
        globalService.success("Business Associate deleted successfully.");
        getSubscribers();
      } else {
        globalService.error(response.data?.message);
      }
    });
  };

  return (
    <>
      <Typography variant="h5" align="center">
        Admin Home
      </Typography>
      <Card>
        <CardContent>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="lab API tabs example"
                >
                  <Tab
                    label="Societies"
                    value="1"
                  />
                  <Tab label="Business Associate" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <MySocietyList showCard={false} />
              </TabPanel>
              <TabPanel value="2">
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => navigate("/subscriber/")}
                >
                  Add Business Associate
                </Button>
                <div className="dvDataGrid">
                  <DataGrid
                    getRowId={(row) => row.SubscriberId}
                    rows={subscribers}
                    columns={subscriberColumns}
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
                          SubscriberId: false,
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
              </TabPanel>
            </TabContext>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
