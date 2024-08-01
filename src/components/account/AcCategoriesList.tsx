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
import { acCategorieService } from "../../services/AcCategoriesService";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

const AcCategoriesList: React.FC = () => {
  const { societyId } = useParams();
  const [acCategorie, setAcCategories] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => { },
  });
  const navigate = useNavigate();

  useEffect(() => {
    getAcCategorie(societyId);
  }, []);

  const getAcCategorie = (societyId: any) => {
    acCategorieService.getBySocietyId(societyId).then((response) => {
      let result = response.data;
      setAcCategories(result.list);
      //console.log(response.data);
    });
  };

  const columns: GridColDef[] = [
    { field: "Category", headerName: "Category", width: 130, flex: 1 },
    { field: "DrCr", headerName: "DrCr", width: 130, flex: 1 },
    {
      field: "Nature",
      headerName: "Nature",
      width: 130,
      flex: 1,
      valueGetter: (params) => {
        const Nature = params.row.Nature;
        if (Nature === "B") return "Balance Sheet";
        if (Nature === "I") return "Income Expenditure";
      },
    },
    { field: "Sequence", headerName: "Sequence", width: 130, flex: 1 },
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
            <IconButton
              size="small"
              color="primary"
              aria-label="add an alarm"
              onClick={() =>
                navigate(
                  "/editacCategorie/" +
                  societyId +
                  "/" +
                  params.row.CategoryId
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
                  title: "Are you sure to delete AcCategories " + " ?",
                  subTitle: "You can't undo this operation",
                  onConfirm: () => {
                    removeAcCategories(params.row.CategoryId);
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

  const removeAcCategories = (CategoryId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    acCategorieService.remove(CategoryId).then((response) => {
      if (response) {
        getAcCategorie(societyId);
      }
    });
  };

  return (
    <>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5">Account Category</Typography>
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
            onClick={() => navigate("/addacCategorie/" + societyId)}
          >
            Add Record
          </Button>
          <div>
            <DataGrid
              getRowId={(row) => row.CategoryId}
              rows={acCategorie}
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
                    CategoryId: false,
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
              onClick={() => navigate("/dashboard/" + societyId)}
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

export default AcCategoriesList;
