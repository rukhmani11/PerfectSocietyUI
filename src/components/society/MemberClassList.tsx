import React, { useState, useEffect } from "react";
import { memberClassesService } from "../../services/MemberClassesService";
import {
  Stack,
  IconButton,
  Card,
  CardContent,
  Button,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConfirmDialog from "../helper/ConfirmDialog";
import { globalService } from "../../services/GlobalService";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

const MemberClassList: React.FC = () => {

  const [MemberClass, setMemberClass] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { } })
  const navigate = useNavigate();
  useEffect(() => {

    getMemberClass();
  }, []);

  const getMemberClass = () => {
    memberClassesService.getAll().then((response) => {

      let result = response.data;
      setMemberClass(result.list);

    });
  };

  const columns: GridColDef[] = [
    { field: "MemberClass", headerName: "Member Class", width: 130, flex: 1 },
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
      field: "Actions",
      headerName: "Actions",
      type: "number",
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={0}>
            <IconButton size="small"
              color="primary"
              aria-label="add an alarm"
              onClick={() => navigate("/memberclass/" + params.row.MemberClassId)}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
            <IconButton size="small" aria-label="delete" color="error"
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: 'Are you sure to delete this Member class?',
                  subTitle: "You can't undo this operation",
                  onConfirm: () => { removeMemberClass(params.row.MemberClassId) }
                })
              }}>
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  const removeMemberClass = (MemberClassId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    memberClassesService.remove(MemberClassId).then((response: { data: any }) => {
      let result = response.data
      if (response.data?.isSuccess) {
        globalService.success(result.message);
        getMemberClass();
      }
    });
  };

  return (
    <>
      <Typography variant="h5" align="center">
        Member Classes
      </Typography>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/memberclass/")}
          >
            Add Record
          </Button>
          <div className='dvDataGrid'>
            <DataGrid
              getRowId={(row) => row.MemberClassId}
              rows={MemberClass}
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
                    MemberClassId: false,
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
      </Card>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
};

export default MemberClassList;
