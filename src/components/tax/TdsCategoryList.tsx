import React, { useState, useEffect } from "react";
import { TdscategoriesService } from "../../services/TdscategoriesService";
import { Stack, IconButton, Card, CardContent, Button, Typography, } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConfirmDialog from "../helper/ConfirmDialog";
import { globalService } from "../../services/GlobalService";

const TdscategoryList: React.FC = () => {
  const { tdsCategoryId } = useParams();
  const [Tdscategory, setTdscategory] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { } })
  //const tdsCategoryRateId = localStorage.getItem('tdsCategoryRateId');
  const navigate = useNavigate();
  useEffect(() => {
    getTdscategory();
  }, []);

  const getTdscategory = () => {
    TdscategoriesService.getAll().then((response) => {
      let result = response.data;
      setTdscategory(result.list);

    });
  };

  function goToTdsCategoryRate(tdsCategoryId: string, tdsCategory: string) {
    localStorage.setItem('Tdscategory', tdsCategory);
    navigate('/tdsCategoryRates/' + tdsCategoryId);
  }

  const columns: GridColDef[] = [
    { field: "TdscategoryId", headerName: "TdscategoryId", width: 130, flex: 1 },
    { field: "Tdscategory", headerName: "TDS Category", width: 130, flex: 1 },
    {
      field: 'AcHead', headerName: 'Account Head', width: 130, flex: 1,
      valueGetter: (params) => params.row.AcHead?.AcHead
    },
    {
      field: "Section",
      headerName: "Section",
      width: 130,
      flex: 1,
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
              color="primary"
              aria-label="add an alarm"
              onClick={() => navigate("/tdsCategory/" + params.row.TdscategoryId)}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
            <IconButton aria-label="delete" color="error"
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: 'Are you sure to delete this TDS category?',
                  subTitle: "You can't undo this operation",
                  onConfirm: () => { removeTdscategory(params.row.TdscategoryId) }
                })
              }}>
              <DeleteIcon fontSize="inherit" />
            </IconButton>
            <Button
              className="btnGrid"
              variant="contained"
              onClick={() => goToTdsCategoryRate(params.row.TdscategoryId, params.row.Tdscategory)}
            >
              Rate
              ({params.row.TdsCategoryRatesCount})
            </Button>
          </Stack>
        );
      },
    },
  ];

  const removeTdscategory = (TdscategoryId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    TdscategoriesService.remove(TdscategoryId).then((response: { data: any }) => {
      let result = response.data
      if (response.data?.isSuccess) {
        globalService.success(result.message);
        getTdscategory();
      }
    });

  };

  return (
    <>
      <Typography variant="h5" align="center">
        TDS Categories
      </Typography>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/tdsCategory")}
          >
            Add Record
          </Button>
          <div className='dvDataGrid'>
            <DataGrid
              getRowId={(row) => row.TdscategoryId}
              rows={Tdscategory}
              columns={columns}
              columnHeaderHeight={30}
              //rowHeight={30}
              autoHeight={true}
              getRowHeight={() => "auto"}
              getEstimatedRowHeight={() => 200}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    // Hide columns Id, the other columns will remain visible
                    TdscategoryId: false,
                    AcHeadId: false
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
      </Card>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
};

export default TdscategoryList;
