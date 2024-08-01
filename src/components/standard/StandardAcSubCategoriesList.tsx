import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { standardAcSubCategoriesService } from "../../services/StandardAcSubCategoriesService";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Stack } from "@mui/system";
import ConfirmDialog from "../helper/ConfirmDialog";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { globalService } from "../../services/GlobalService";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

const StandardAcSubCategoriesList: React.FC = () => {
  const [standardAcSubCategories, setstandardAcSubCategory] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => {},
  });
  const navigate = useNavigate();
  useEffect(() => {
    getStandardAcSubCategory();
  }, []);

  const getStandardAcSubCategory = () => {
    standardAcSubCategoriesService.getAll().then((response: { data: any }) => {
      let result = response.data;
      setstandardAcSubCategory(result.list);
    });
  };

  const columns: GridColDef[] = [
    {
      field: "SubCategoryId",
      headerName: "ID",
      width: 70,
      //hideable: false,
      flex: 1,
    },
    { field: "SubCategory", headerName: "Sub Category", width: 130, flex: 1 },
    { field: "CategoryId", headerName: "CategoryId", width: 130, flex: 1 },
    {
      field: "PartDetails",
      headerName: "Part Details",
      width: 130,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            {params.row.PartDetails && <DoneIcon color="success" />}
            {!params.row.PartDetails && <CloseIcon color="error" />}
          </Stack>
        );
      },
    },
    
    { field: "Sequence", headerName: "Sequence", width: 130, flex: 1 },
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
                navigate("/standardAcSubCategorie/" + params.row.SubCategoryId)
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
                  title: "Are you sure to delete this Account Sub Categories?",
                  subTitle: "You can't undo this operation",

                  onConfirm: () => {
                    removeStandardAcSubCategory(params.row.SubCategoryId);
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
  const removeStandardAcSubCategory = (SubCategoryId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    standardAcSubCategoriesService.remove(SubCategoryId).then((response) => {
      let result = response.data;
      if (response) {
        globalService.success(result.message);
        getStandardAcSubCategory();
      }
    });
  };

  return (
    <>
      <Typography variant="h5" align="center">
        Account Sub Categories
      </Typography>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/standardAcSubCategorie/")}
          >
            Add New
          </Button>
          <div className="dvDataGrid">
            <DataGrid
              getRowId={(row) => row.SubCategoryId}
              rows={standardAcSubCategories}
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

export default StandardAcSubCategoriesList;
