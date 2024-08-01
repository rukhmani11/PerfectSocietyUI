import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { standardAcHeadsService } from "../../services/StandardAcHeadsService";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Stack } from "@mui/system";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../helper/ConfirmDialog";
import { globalService } from "../../services/GlobalService";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AuthContext } from "../../utility/context/AuthContext";
import React from "react";

const StandardAcHeadsList: React.FC = () => {
  const { auth } = React.useContext(AuthContext);
  const [standardAcheads, setstandardAcHead] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => {},
  });
  const navigate = useNavigate();
  useEffect(() => {
    getStandardAcHead();
  }, []);

  const getStandardAcHead = () => {
    standardAcHeadsService.GetBySubCategoryid(auth.UserId).then((response) => {
      let result = response.data;
      setstandardAcHead(result.list);
    });
  };

  const columns: GridColDef[] = [
    // {
    //     field: 'AcHeadId',
    //     headerName: 'AcHeadId',
    //     width: 70,
    //     //hideable: false,
    //     flex: 1
    // },
    { field: "AcHead", headerName: "Account Head", width: 130, flex: 1 },
    // { field: 'SubCategoryId', headerName: 'SubCategoryId', width: 130, flex: 1 },
    {
      field: "SubCategory",
      headerName: "SubCategory",
      width: 130,
      flex: 1,
      // renderCell: (params) => {
      //     return (params.row.State.State);
      // },
      valueGetter: (params) => params.row.SubCategory?.SubCategory,
    },
    {
      field: "Tdscategory",
      headerName: "TDS Category",
      width: 130,
      flex: 1,
      valueGetter: (params) => params.row.Tdscategory?.Tdscategory,
    },
    {
      field: "Nature",
      headerName: "Nature",
      width: 130,
      flex: 1,
      valueGetter: (params) => {
        const Nature = params.row.Nature;
        if (Nature === "B") return "Bank";
        if (Nature === "C") return "Cash";
        if (Nature === "S") return "Creditor";
        if (Nature === "D") return "Debtor";
        if (Nature === "T") return "TDS";
        if (Nature === "F") return "Year End Closing Transaction";
      },
    },

    { field: "Sequence", headerName: "Sequence", width: 80 },
    {
      field: "Tdscompany",
      headerName: "TDS Company",
      width: 130,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack>
            {params.row.Tdscompany && <DoneIcon color="success" />}
            {!params.row.Tdscompany && <CloseIcon color="error" />}
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
              onClick={() => navigate("/standardAchead/" + params.row.AcHeadId)}
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
                  title: "Are you sure to delete this Account Categories?",
                  subTitle: "You can't undo this operation",
                  onConfirm: () => {
                    removeStandardAcHead(params.row.AcHeadId);
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
  const removeStandardAcHead = (AcHeadId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    standardAcHeadsService.remove(AcHeadId).then((response) => {
      let result = response.data;
      if (response) {
        globalService.success(result.message);
        getStandardAcHead();
      }
    });
  };
  return (
    <>
      <Typography variant="h5" align="center">
        Account Heads
      </Typography>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/standardAchead/")}
          >
            Add New
          </Button>
          <div className="dvDataGrid">
            <DataGrid
              getRowId={(row) => row.AcHeadId}
              rows={standardAcheads}
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
                    SubCategoryId: false,
                    TdscategoryId: false,
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

export default StandardAcHeadsList;
