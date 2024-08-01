import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocietyInvestmentsService } from "../../../services/SocietyInvestmentsService";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Button, Card, CardActions, CardContent, IconButton, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { globalService } from "../../../services/GlobalService";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ConfirmDialog from "../../helper/ConfirmDialog";
import dayjs from "dayjs";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";

const SocietyInvestmentList: React.FC = () => {
  const { societyId } = useParams();
  const [societyInvestments, setSocietyInvestment] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { } })
  const navigate = useNavigate();
  const { goToHome } = useSharedNavigation();

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    getSocietyInvestment(societyId);
  }, []);

  const getSocietyInvestment = (societyId: any) => {

    SocietyInvestmentsService.getSocietyInvestmentBySocietyId(societyId).then((response) => {
      
      let result = response.data;
      setSocietyInvestment(result.list);
    });
  };

  const columns: GridColDef[] = [
    { field: "SocietyInvestmentId", headerName: "SocietyInvestmentId", width: 130, flex: 1 },
    {
      field: "BankNavigation",
      headerName: "Bank",
      width: 130,
      flex: 1,
      valueGetter: (params) => params.row.BankNavigation?.Bank,
    },
    { field: "Bank", headerName: "Other Bank", width: 130, flex: 1 },
    { field: "DocumentNo", headerName: "Document No", width: 130, flex: 1 },
    {
      field: "DocumentDate", headerName: "Document Date", width: 130, flex: 1,
      valueFormatter: (params) => params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    {
      field: "MaturityDate", headerName: "Maturity Date", width: 130, flex: 1,
      valueFormatter: (params) => params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    { field: "Amount", headerName: "Amount", width: 130, flex: 1 },
    { field: "InterestRate", headerName: "Interest Rate", width: 130, flex: 1 },
    { field: "ChequeNo", headerName: "Cheque No", width: 130, flex: 1 },
    {
      field: "ChequeDate", headerName: "Cheque Date", width: 130, flex: 1,
      valueFormatter: (params) => params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    { field: "MaturityAmount", headerName: "Maturity Amount", width: 130, flex: 1 },
    {
      field: "ClosureDate", headerName: "Closure Date", width: 130, flex: 1,
      valueFormatter: (params) => params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    { field: "ClosureAmount", headerName: "Closure Amount", width: 130, flex: 1 },
    {
      field: "RealizationDate", headerName: "Realization Date", width: 130, flex: 1,
      valueFormatter: (params) => params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
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
              onClick={() => navigate("/editSocietyInvestment/" + societyId + '/' + params.row.SocietyInvestmentId)}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
            <IconButton size="small" aria-label="delete" color="error"
              onClick={() => {

                setConfirmDialog({
                  isOpen: true,
                  title: 'Are you sure to delete this Record ?',
                  subTitle: "You can't undo this operation",
                  onConfirm: () => { removeSocietyInvestment(params.row.SocietyInvestmentId) }
                })
              }}>
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  const removeSocietyInvestment = (SocietyInvestmentId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    SocietyInvestmentsService
      .remove(SocietyInvestmentId)
      .then((response) => {
        let result = response.data;
        if (response) {
          globalService.success(result.message);
          getSocietyInvestment(societyId);
        }
      });
  }

  return (
    <>
      <Typography variant="h5" align="center">
        Society Investment List
      </Typography>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/addSocietyInvestment/" + societyId)}
          >
            Add Record
          </Button>
          <div style={{ width: "100%" }}>
            <DataGrid
              getRowId={(row) => row.SocietyInvestmentId}
              rows={societyInvestments}
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
                    SocietyInvestmentId: false,
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

export default SocietyInvestmentList;