import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordQuestionsService } from "../../services/PasswordQuestionsService";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Button, Card, CardContent, IconButton, Stack, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import { globalService } from "../../services/GlobalService";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ConfirmDialog from "../helper/ConfirmDialog";

const PasswordQuestionList: React.FC = () => {
    const [passwordQuestions, setPasswordQuestion] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { } })
    const navigate = useNavigate();
    useEffect(() => {
      getPasswordQuestions();
    }, []);
  
    const getPasswordQuestions = () => {
        PasswordQuestionsService
        .getAll()
        .then((response: { data: any; }) => {
  
          let result = response.data;
          setPasswordQuestion(result.list);
          
        });
    };
  
    const columns: GridColDef[] = [
      {
        field: 'PasswordQuestionId',
        headerName: 'PasswordQuestionId',
        width: 70,
        //hideable: false,
        flex: 1
      },
      { field: 'PasswordQuestion', headerName: 'Password Question', width: 130, flex: 2 },
      {
        field: "Active",
        headerName: "Active",
        width: 130,
        flex: 1,
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
        field: 'Actions',
        headerName: 'Actions',
        type: 'number',
        flex: 1,
        renderCell: (params) => {
          return (<Stack direction="row" spacing={0}>
            <IconButton size="small" color="primary" aria-label="add an alarm" onClick={() => navigate("/editPasswordQuestion/" + params.row.PasswordQuestionId)}>
              <EditIcon fontSize="inherit" />
            </IconButton>
  
            <IconButton size="small" aria-label="delete" color="error"
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: 'Are you sure to delete this Password Question?',
                  subTitle: "You can't undo this operation",
                  onConfirm: () => { removePasswordQuestionId(params.row.PasswordQuestionId) }
                })
              }}>
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Stack>);
        }
      }
    ];
  
    const removePasswordQuestionId = (PasswordQuestionId: any) => {
      setConfirmDialog({
        ...confirmDialog,
        isOpen: false
      })
      PasswordQuestionsService
        .remove(PasswordQuestionId)
        .then((response: { data: any; }) => {
          let result=response.data
          if (response.data?.isSuccess) {
            globalService.success(result.message);
            getPasswordQuestions();
          } else {
            globalService.error(result.message);
          }
        });
    };
  
    return (
      <>
        <Typography variant="h5" align="center">
        Password Questions
        </Typography>
        <Card>
          <CardContent>
            <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate("/addPasswordQuestion/")}>
              Add Record
            </Button>
            <div style={{ width: '100%' }}>
              <DataGrid
                getRowId={(row) => row.PasswordQuestionId}
                rows={passwordQuestions}
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
                      PasswordQuestionId: false
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
              //pageSize={5}
              //rowsPerPageOptions={[5]}
              //checkboxSelection
              />
            </div>
          </CardContent>
        </Card>
        <ConfirmDialog
          confirmDialog={confirmDialog}
          setConfirmDialog={setConfirmDialog}
        />
      </>
    );
  }
  
  export default PasswordQuestionList;