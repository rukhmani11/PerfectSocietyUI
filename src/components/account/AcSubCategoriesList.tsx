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
import { acSubcategorieService } from "../../services/AcSubCategoriesService";

const AcSubCategoriesList: React.FC = () => {
  const { societyId } = useParams();
  const [acSubCategorie, setAcSubCategories] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => { },
  });
  const navigate = useNavigate();

  useEffect(() => {
    getAcSubCategorie(societyId);
  }, []);

  const getAcSubCategorie = (societyId: any) => {
    acSubcategorieService.getBySocietyId(societyId).then((response) => {
      
      let result = response.data;
      setAcSubCategories(result.list);
      //console.log(response.data);
    });
  };

  const columns: GridColDef[] = [
    { field: "Sequence", headerName: "Sequence", width: 130, flex: 1 },
    { field: "SubCategory", headerName: "Sub Category", width: 130, flex: 1 },
    {
      field: "Category",
      headerName: "Category",
      width: 130,
      flex: 1,
      valueGetter: (params) => params.row.AcCategories?.Category,
    },
    //{ field: "PartDetails", headerName: "Part Details", width: 130, flex: 1 },
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
                  "/editacSubCategorie/" +
                  societyId +
                    "/" +
                    params.row.SubCategoryId
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
                    removeAcSubCategories(params.row.SubCategoryId);
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

  const removeAcSubCategories = (SubCategoryId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    acSubcategorieService.remove(SubCategoryId).then((response) => {
      if (response) {
        getAcSubCategorie(societyId);
      }
    });
  };

  return (
    <>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5">Account Sub Category</Typography>
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
            onClick={() => navigate("/addacSubCategorie/" + societyId)}
          >
            Add Record
          </Button> 
          <div>
            <DataGrid
              getRowId={(row) => row.SubCategoryId}
              rows={acSubCategorie}
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
                    SubCategoryId: false,
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

export default AcSubCategoriesList;
