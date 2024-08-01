import React, { useState, useEffect } from "react";

import {
  Stack,
  IconButton,
  Card,
  CardContent,
  Button,
  Typography,
  Breadcrumbs,
  Link,
  CardActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConfirmDialog from "../helper/ConfirmDialog";
import { acHeadsService } from "../../services/AcHeadsService";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

const AcHeadsList: React.FC = () => {
  const { societyId } = useParams();
  const [acHeads, setAcHeads] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => { },
  });
  const navigate = useNavigate();

  useEffect(() => {
    getAcHeads(societyId);
  }, []);

  const getAcHeads = (societyId: any) => {
    acHeadsService.getBySocietyId(societyId).then((response) => {

      let result = response.data;
      setAcHeads(result.list);
      //console.log(response.data);
    });
  };

  const columns: GridColDef[] = [
    { field: "AcHead", headerName: "AcHead", flex: 2 },
    {
      field: "SubCategory",
      headerName: "Sub Category",
      flex: 1,
      valueGetter: (params) => params.row.S?.SubCategory,
    },
    { field: "Sequence", headerName: "Sequence", flex: 0.5 },
    {
      field: "Nature", headerName: "Nature", flex: 0.5,
      valueGetter: (params) => {
        const Nature = params.row.Nature;
        if (Nature === 'C') return 'Cash';
        if (Nature === 'B') return 'Bank';
        if (Nature === 'S') return 'Creditor';
        if (Nature === 'D') return 'Debtor';
        if (Nature === 'T') return 'TDS';
        if (Nature === 'F') return 'Year End Closing Transaction';
      }
    },
    { field: "TDSCategoryID", headerName: "TDSCategoryID", flex: 1 },
    { field: "TDSCompany", headerName: "TDSCompany", flex: 1 },
    {
      field: "Active",
      headerName: "Active",

      flex: 0.5,
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
            <IconButton
              size="small"
              color="primary"
              aria-label="add an alarm"
              onClick={() =>
                navigate(
                  "/editAcHeads/" +
                  societyId +
                  "/" +
                  params.row.AcHeadId
                )}
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
                  title:
                    "Are you sure to delete AcHead " +
                    " ?",
                  subTitle: "You can't undo this operation",
                  onConfirm: () => {
                    removeAcHead(params.row.AcHeadId);
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

  const removeAcHead = (AcHeadId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    acHeadsService.remove(AcHeadId).then((response) => {
      if (response) {
        getAcHeads(societyId);
      }
    });
  };

  return (
    <>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5">Account</Typography>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/mySociety">
            My Society
          </Link>
        </Breadcrumbs>
      </Stack>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/addAcHeads/" + societyId)}
          >
            Add Record
          </Button>
          <div>
            <DataGrid
              getRowId={(row) => row.AcHeadId}
              rows={acHeads}
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
                    AcHeadId: false,
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

export default AcHeadsList;
