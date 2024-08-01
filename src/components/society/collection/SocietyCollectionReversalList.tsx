import React, { useState, useEffect } from "react";
import { SocietyCollectionReversalsService } from "../../../services/SocietyCollectionReversalsService";
import {
  Stack,
  IconButton,
  Card,
  CardContent,
  Button,
  Typography,
  CardActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConfirmDialog from "../../helper/ConfirmDialog";
import { globalService } from "../../../services/GlobalService";
import dayjs from "dayjs";
import useForm from "../../../utility/hooks/UseForm";
import { SocietyCollectionReversalsModel } from "../../../models/SocietyCollectionReversalsModel";
import { societiesService } from "../../../services/SocietiesService";
import { SocietiesModel } from "../../../models/SocietiesModel";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";

const SocietyCollectionReversalList: React.FC = () => {

  const { societyId } = useParams();
  var societySubscriptionId = localStorage.getItem('societySubscriptionId');
  const [society, setSociety] = useState<SocietiesModel>(null);
  const [SocietyCollectionReversal, setSocietyCollectionReversal] = useState(
    []
  );
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => { },
  });
  const navigate = useNavigate();
  const { goToHome } = useSharedNavigation();

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (!society) getSociety(societyId);
    getsetSocietyCollectionReversal(societyId);
  }, []);

  const validate = (fieldValues: SocietyCollectionReversalsModel = values) => {
    let temp: any = { ...errors };

    setErrors({
      ...temp,
    });

  }

  const { values, setValues, errors, setErrors, handleInputChange } = useForm(
    SocietyCollectionReversalsService.initialFieldValues,
    validate,
    societyId
  )

  const getsetSocietyCollectionReversal = (societyId: any) => {
    SocietyCollectionReversalsService.getBySocietyId(
      societyId
    ).then((response) => {
      let result = response.data;
      setSocietyCollectionReversal(result.list);
    });
  };

  const getSociety = (societyId: any) => {
    societiesService.getById(societyId).then((response) => {

      let result = response.data;
      setSociety(result.data);
    });
  };

  const sendEmail = (societyCollectionReversalId: any) => {
    values.SocietyId = societyId;
    values.SocietySubscriptionId = societySubscriptionId;
    values.SocietyCollectionReversalId = societyCollectionReversalId;
    let isValidated = societyCollectionReversalId ? true : validate(); // if single bill then no validate method will be called
    if (isValidated) {
      SocietyCollectionReversalsService.sendCollectionReversalEmail(values).then((response) => {
        let result = response.data;
        if (result.isSuccess) {
          globalService.success(result.errorMessage);
        }
      });
    }
  }

  const columns: GridColDef[] = [
    { field: "BillAbbreviation", headerName: "Bill Abbreviation", width: 30, },
    {
      field: "BuildingUnit",
      headerName: "Building Unit",
      width: 100,
      valueGetter: (params) => params.row.SocietyBuildingUnit?.Unit,
    },
    {
      field: "Member",
      headerName: "Member",
      width: 250,
      valueGetter: (params) => params.row.SocietyMember?.Member,
    },
    {
      field: "ReversalDate", headerName: "Reversal Date", width: 130, flex: 1,
      valueFormatter: (params) => params.value ? dayjs(params.value).format('DD-MMM-YYYY') : ""
    },
    {
      field: "ReceiptNo", headerName: "Receipt No", width: 130, flex: 1,
      valueGetter: (params) => params.row.SocietyReceipt?.ReceiptNo,
    },
    {
      field: "PrincipalAdjusted",
      headerName: "Principal Adjusted",
      width: 130,
      flex: 1,
    },
    {
      field: "InterestAdjusted",
      headerName: "Interest Adjusted",
      width: 130,
      flex: 1,
    },
    {
      field: "NonChgAdjusted",
      headerName: "NonChg Adjusted",
      width: 130,
      flex: 1,
    },
    { field: "TaxAdjusted", headerName: "Tax Adjusted", width: 130, flex: 1 },
    { field: "Advance", headerName: "Advance", width: 130, flex: 1 },
    {
      field: "Actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={0}>
            {(!params.row.IsBillExists) && (
              <IconButton
                size="small"
                aria-label="delete"
                color="error"
                onClick={() => {
                  setConfirmDialog({
                    isOpen: true,
                    title: "Are you sure to delete this Record ?",
                    subTitle: "You can't undo this operation",
                    onConfirm: () => {
                      removeSocietyCollectionReversal(
                        params.row.SocietyCollectionReversalId
                      );
                    },
                  });
                }}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            )}
            <Button
              variant="contained"
              className="btnGrid"
              onClick={() =>
                navigate(
                  "/viewSocietyCollectionReversal/" +
                  societyId +
                  "/" +
                  params.row.SocietyCollectionReversalId
                )
              }
            >
              Detail
            </Button>
            {society && society.EnableEmail === true &&
              <Button
                variant="contained"
                className="btnGrid"
                size="small"
                onClick={() => sendEmail(params.row.SocietyCollectionReversalId)}
              >
                Send Email
              </Button>
            }
          </Stack>
        );
      },
    },
  ];

  const removeSocietyCollectionReversal = (
    SocietyCollectionReversalId: any
  ) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    SocietyCollectionReversalsService.remove(SocietyCollectionReversalId).then(
      (response) => {
        let result = response.data;
        if (response) {
          globalService.success(result.message);
          getsetSocietyCollectionReversal(societyId);
        }
      }
    );
  };

  return (
    <>
      <Typography variant="h5" align="center">
        Society Collection Reversal
      </Typography>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() =>
              navigate("/addsocietyCollectionReversal/" + societySubscriptionId + "/" + societyId)
            }
          >
            Add Record
          </Button>
          <div style={{ width: "100%" }}>
            <DataGrid
              getRowId={(row) => row.SocietyCollectionReversalId}
              rows={SocietyCollectionReversal}
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
                    SocietyMemberId: false,
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

export default SocietyCollectionReversalList;
