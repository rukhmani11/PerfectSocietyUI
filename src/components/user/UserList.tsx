import React, { useState, useEffect } from "react";
import { userService } from "../../services/UserService";
import { Stack, IconButton, Button, CardContent, Card, Typography, CardActions } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar, GridValueGetterParams } from '@mui/x-data-grid';
import ConfirmDialog from "../helper/ConfirmDialog";
import { globalService } from "../../services/GlobalService";
import { ROLES, UserBackToListCallFrom } from "../../utility/Config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UserList: React.FC = () => {
  const { societyId, callFrom }: any = useParams();
  const [users, setUsers] = useState([]);
  const [society, setSociety] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { } })
  // const [currentUser, setCurrentUser] = useState<any>(null);
  // const [currentIndex, setCurrentIndex] = useState(-1);
  // const [searchTitle, setSearchTitle] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
    localStorage.setItem('callFrom',callFrom);
  }, []);

  const getUsers = () => {

    if (societyId) {
      userService
        .getBySocietyId(societyId)
        .then((response) => {
          let result = response.data;
          setSociety(result.society);
          setUsers(result.list);
        });
    } else {
      userService
        .getExceptSocietyUsers()
        .then((response) => {
          let result = response.data;
          setSociety('');
          setUsers(result.list);
        });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'UserId',
      headerName: 'ID',
      width: 70,
      //hideable: false,
      flex: 1
    },
    { field: 'FirstName', headerName: 'First name', width: 130, flex: 1 },
    { field: 'LastName', headerName: 'Last name', width: 130, flex: 1 },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      flex: 1,
      //width: 160,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.FirstName || ''} ${params.row.LastName || ''}`,
    },
    {
      field: 'UserName',
      headerName: 'UserName',
      flex: 1
      //width: 90,
    },
    {
      field: 'Email',
      headerName: 'Email',
      width: 200,
    },
    {
      field: 'PhoneNumber',
      headerName: 'PhoneNumber',
      flex: 1
      //width: 90,
    },
    {
      field: 'RoleNames',
      headerName: 'RoleNames',
      flex: 1,
      renderCell: (params) => {

        return (params.row?.RoleNames.join(', '));
      }
    },
    {
      field: 'Actions',
      headerName: 'Actions',
      width: 175,
      renderCell: (params) => {
        //let subscriber = ROLES.Subscriber;
        return (<Stack direction="row" spacing={0}>
          {
            params.row.RoleNames && !params.row.RoleNames.some((x: string) => x === ROLES.Subscriber) &&
            <>
              {societyId ?
                <IconButton size="small" color="primary" aria-label="add an alarm" onClick={() => navigate("/societyUser/" + societyId + "/" + params.row.UserId)}>
                  <EditIcon fontSize="inherit" />
                </IconButton>
                :
                <>
                  <IconButton size="small" color="primary" aria-label="add an alarm" onClick={() => navigate("/user/" + params.row.UserId)}>
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton size="small" aria-label="delete" color="error"
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Are you sure to delete user ' + params.row.FullName + '?',
                        subTitle: "You can't undo this operation",
                        onConfirm: () => { removeUser(params.row.UserName) }
                      })
                    }}>
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </>
              }


              <Button className='btnGrid'
                variant="contained"
                onClick={() => navigate("/resetPassword/" + params.row.UserId, {
                  state: {
                    row: params.row
                  }
                })}
              >
                Reset Password
              </Button>
            </>
          }
        </Stack>);
      }
    }
  ];

  const removeUser = (userName: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    userService
      .remove(userName, societyId)
      .then((response) => {
        var result = response.data;
        if (result.isSuccess) {
          globalService.success("User deleted successfully.");
          getUsers();
        }
        else {
          globalService.error(result.message);
        }
      });
  }

  return (
    <>
      {society ? <Stack direction="row" spacing={0} justifyContent="space-between" alignContent={"center"}>
        <Typography></Typography>
        <Typography variant="h5">Users</Typography>
        <Typography variant="body1"><b>Society : </b>{society} </Typography>
      </Stack>
        :
        <Typography variant="h5" align={"center"}>Users</Typography>
      }
      <Card>
        <CardContent>
          {societyId ?
            <>
              {
              //users.length <= 0 &&
                <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate("/societyUser/" + societyId, {
                  state: {
                    society: society,
                  },
                })}>
                  Add Society User
                </Button>
              }
            </>
            :
            <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate("/user/")}>
              Add Record
            </Button>
          }
          <div className='dvDataGrid'>
            <DataGrid
              getRowId={(row) => row.UserId}
              rows={users}
              columns={columns}
              columnHeaderHeight={30}
              //rowHeight={30}
              autoHeight={true}
              getRowHeight={() => 'auto'}
              getEstimatedRowHeight={() => 200}
              //loading={loading}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    // Hide columns Id, the other columns will remain visible
                    UserId: false
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
            //checkboxSelection
            />
          </div>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "center" }}>
          <Stack spacing={2} direction="row" >
            {societyId && <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                if (callFrom === UserBackToListCallFrom.mySociety) {
                  navigate("/mySociety");
                }
                else if (callFrom === UserBackToListCallFrom.society) {
                  navigate("/societies/" + localStorage.getItem('subscriberId'));
                }
                else if (callFrom === UserBackToListCallFrom.admin) {
                  navigate("/admin");
                }
              }}
            >
              Back To List
            </Button>}
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

export default UserList;
