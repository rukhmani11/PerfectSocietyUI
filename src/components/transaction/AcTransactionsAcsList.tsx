import React, { useState, useEffect } from "react";
import { acTransactionAcsService } from "../../services/AcTransactionAcsService";
import {
  Stack,
  IconButton,
  Card,
  CardContent,
  Button,
  Typography,
  CardActions,
  TableCell,
  TableRow,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConfirmDialog from "../helper/ConfirmDialog";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { globalService } from "../../services/GlobalService";
import dayjs from "dayjs";
import useForm from "../../utility/hooks/UseForm";
import { Messages } from "../../utility/Config";
import { useSharedNavigation } from "../../utility/context/NavigationContext";

const AcTransactionsAcsList: React.FC = () => {
  //const { acTransactionId, docType }: any = useParams();
  let isFirstSocietySubscription = globalService.isFirstSocietySubscription();
  const { acTransactionId, societySubscriptionId, docType } = useParams();
  // var societysubscriptionId = localStorage.getItem("societySubscriptionId");
  const [pageInfo, setPageInfo] = useState(null);
  const [actransactionacs, setActransactionac] = useState([]);
  const { goToHome } = useSharedNavigation();
  const [actransaction, setAcTransactionTitle] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => { },
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if ((docType.toUpperCase() === "OP" && !isFirstSocietySubscription)) {
      navigate('/unauthorized');
    }
    getByAcTransactionId(acTransactionId);
    getForAcTransactionACListPage();
  }, []);

  const getByAcTransactionId = (acTransactionId: any) => {
    acTransactionAcsService
      .getByAcTransactionId(acTransactionId)
      .then((response) => {
        let result = response.data;
        //add a row
        // result.list.push();

        setActransactionac(result.list);
        setAcTransactionTitle(response.data.acTransaction);
      });
  };
  const getForAcTransactionACListPage = () => {
    acTransactionAcsService
      .getForAcTransactionACListPage(
        societySubscriptionId,
        docType,
        acTransactionId
      )
      .then((response) => {
        let result = response.data;
        setPageInfo(result.data);
      });
  };
  const columns: GridColDef[] = [
    {
      field: "AcHead",
      headerName: "Account head",
      width: 130,
      flex: 1,
      valueGetter: (params) => params.row.AcHeads?.AcHead,
    },
    { field: "Particulars", headerName: "Particulars", width: 130, flex: 1 },
    {
      field: "DebitAmount",
      headerName: "Debit Amount",
      valueGetter: (params) => {
        return params.row.DrCr === "D" ? params.row.Amount?.toFixed(2) : 0.00;
      },
    },
    {
      field: "CreditAmount",
      headerName: "Credit Amount",
      valueGetter: (params) => {
        return params.row.DrCr === "C" ? params.row.Amount?.toFixed(2) : 0.00;
      },
    },
    {
      field: "Actions",
      headerName: "Actions",
      //flex: 1,
      width: 190,
      renderCell: (params) => {
        return (
          <>
            <Stack direction="row" spacing={0}>
              {pageInfo &&
                (docType === "MC" ||
                  docType === "YC" ||
                  (pageInfo.ShowBillingMenu && docType === "SB") ||
                  docType === "SB" ||
                  pageInfo.YearClosed ||
                  pageInfo.Locked) ? (
                <></>
              ) : (
                <>
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label="add an alarm"
                    // onClick={() => navigate("/acTransactionsac/" + params.row.AcTransactionAcId)}>
                    onClick={() =>
                      navigate(
                        "/editAcTransactionsAcs/" +
                        societySubscriptionId +
                        "/" +
                        docType +
                        "/" +
                        acTransactionId +
                        "/" +
                        params.row.AcTransactionAcId
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
                        title:
                          "Are you sure to delete Ac Transaction: " +
                          globalService.getDocTypeMenuText(docType) +
                          " Particulars: " +
                          params.row.Particulars +
                          "?",
                        subTitle: "You can't undo this operation",
                        onConfirm: () => {
                          removeAcTransactionAc(params.row.AcTransactionAcId);
                        },
                      });
                    }}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </>
              )}
            </Stack>
          </>
        );
      },
    },
  ];

  const removeAcTransactionAc = (AcTransactionAcId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    acTransactionAcsService.remove(AcTransactionAcId).then((response) => {
      if (response) {
        globalService.success("Account deleted successfully.");
        getByAcTransactionId(acTransactionId);
      }
    });
  };
  const renderFooter = () => {
    return (
      <>
        {actransaction && (
          <Grid item xs={20} container rowSpacing={1}>
            <Grid item xs={6}>
              <b>Total</b>
            </Grid>
            <Grid item xs={200}>
              <b>Total Debit: {actransaction.DrAmount}</b>
            </Grid>
            <Grid item xs={2}>
              <b>Total Credit: {actransaction.CrAmount}</b>
            </Grid>
          </Grid>
        )}
      </>
    );
  };

  return (
    <>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5" align="center">
          Account Transaction
        </Typography>
        {actransaction && (
          <Typography variant="body1">
            <b>Document Type : </b>
            {actransaction.DocNo} <b>Date :</b>
            {dayjs(actransaction.DocDate).format("DD-MMM-YYYY")}
          </Typography>
        )}
      </Stack>
      <Card>
        <CardContent>
          <>
            {pageInfo &&
              (docType === "MC" ||
                docType == "YC" ||
                (pageInfo.ShowBillingMenu && docType === "SB") ||
                pageInfo.YearClosed ||
                pageInfo.Locked) ? (
              <></>
            ) : (
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() =>
                  navigate(
                    "/addacTransactionsac/" +
                    societySubscriptionId +
                    "/" +
                    docType +
                    "/" +
                    acTransactionId
                  )
                }
              >
                Add Record
              </Button>
            )}
          </>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              getRowId={(row) => row.AcTransactionAcId}
              rows={actransactionacs}
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
                    AcTransactionAcId: false,
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
            {renderFooter()}
          </div>
        </CardContent>
      </Card>
      <CardActions sx={{ display: "flex", justifyContent: "center" }}>
        <Stack spacing={2} direction="row">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() =>
              navigate(
                "/acTransactions/" + societySubscriptionId + "/" + docType
              )
            }
          >
            Back To List
          </Button>
        </Stack>
      </CardActions>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
};

export default AcTransactionsAcsList;
