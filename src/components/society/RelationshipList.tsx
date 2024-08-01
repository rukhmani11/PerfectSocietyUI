import React, { useState, useEffect } from "react";
import { RelationshipsService } from "../../services/RelationshipsService";
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

const RelationshipList: React.FC = () => {

  const [Relationship, setRelationship] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { } })
  const navigate = useNavigate();
  useEffect(() => {

    getRelationship();
  }, []);

  const getRelationship = () => {
    RelationshipsService.getAll().then((response) => {

      let result = response.data;
      setRelationship(result.list);
    });
  };

  const columns: GridColDef[] = [
    { field: "Relationship", headerName: "Relationship", width: 130, flex: 1 },
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
            <IconButton size="small" color="primary" aria-label="add an alarm" onClick={() => navigate("/Relationship/" + params.row.RelationshipId)}>
              <EditIcon fontSize="inherit" />
            </IconButton>
            <IconButton size="small" aria-label="delete" color="error"
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: 'Are you sure to delete this Relationship?',
                  subTitle: "You can't undo this operation",
                  onConfirm: () => { removeRelationship(params.row.RelationshipId) }
                })
              }}>
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Stack>);
      }
    }
  ];

  const removeRelationship = (RelationshipId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    RelationshipsService
      .remove(RelationshipId)
      .then((response) => {
        let result = response.data
        if (response.data?.isSuccess) {
          globalService.success(result.message);
          getRelationship();
        }
      });
  }


  return (
    <>
      <Typography variant="h5" align="center">
        Relationships
      </Typography>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/Relationship/")}
          >
            Add Record
          </Button>
          <div className='dvDataGrid'>
            <DataGrid
              getRowId={(row) => row.RelationshipId}
              rows={Relationship}
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
                    RelationshipId: false,
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

export default RelationshipList;
