import React, { useState, useEffect } from "react";
import {
  Stack,
  IconButton,
  Card,
  CardContent,
  Button,
  Typography,
  CardActions,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConfirmDialog from "../helper/ConfirmDialog";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { globalService } from "../../services/GlobalService";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { societySpecialBillsService } from "../../services/SocietySpecialBillsService";
import dayjs from "dayjs";
import Checkbox from "@mui/material/Checkbox";
import { useSharedNavigation } from "../../utility/context/NavigationContext";
import { Messages } from "../../utility/Config";

const SocietySpecialBillList: React.FC = () => {
  const { societyId }: any = useParams();
  const [societySpecialBills, setSocietySpecialBills] = useState([]);
  const { goToHome } = useSharedNavigation();
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => {},
  });
  const [showRunning, setShowRunning] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (societyId) getSocietySpecialBill();
  }, [societyId, showRunning]);

  const getSocietySpecialBill = () => {
    societySpecialBillsService
      .getSocietySpecialBills(societyId, showRunning)
      .then((response) => {
        let result = response.data;
        setSocietySpecialBills(result.list);
      });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowRunning(event.target.checked);
    getSocietySpecialBill();
  };

  // const getSocietySpecialBill = () => {
  //     societySpecialBillsService.getBySocietyId(societyId).then((response) => {
  //         let result = response.data;
  //         setSocietySpecialBills(result.list);
  //     });
  // };

  const removeSocietySpecialBill = (societySpecialBillId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    societySpecialBillsService.remove(societySpecialBillId).then((response) => {
      if (response) {
        let result = response.data;
        if (result.isSuccess) {
          globalService.success("Society special bill deleted successfully.");
          getSocietySpecialBill();
        } else {
          globalService.error(result.message);
        }
      }
    });
  };

  const columns: GridColDef[] = [
    {
      field: "UnitType",
      headerName: "Unit Type",
      flex: 1,
      //valueGetter: (params) => params.row.UnitType?.UnitType,
    },
    {
      field: "BuildingUnit",
      headerName: "Building Unit",
      flex: 1,
      //  valueGetter: (params) => params.row.SocietyBuildingUnit?.Unit,
    },
    {
      field: "FromDate",
      headerName: "From Date",
      width: 120,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    {
      field: "ToDate",
      headerName: "To Date",
      width: 120,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    { field: "Remark", headerName: "Remark", flex: 1 },
    {
      field: "Actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={0.2}>
            <IconButton
              size="small"
              color="primary"
              aria-label="add an alarm"
              onClick={() =>
                navigate(
                  "/editSocietySpecialBill/" + societyId + "/" + params.id
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
                    'Are you sure to delete special bill \n\r Unit Type"' +
                    params.row.UnitType?.UnitType +
                    '" Building Unit "' +
                    params.row.SocietyBuildingUnit?.Unit +
                    '"?',
                  subTitle: "You can't undo this operation",
                  onConfirm: () => {
                    removeSocietySpecialBill(params.id);
                  },
                });
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
            <Button
              className="btnGrid"
              variant="contained"
              onClick={() =>
                navigate("/societySpecialBillChargeHeads/" + params.id, {
                  state: {
                    row: params.row,
                  },
                })
              }
            >
              {/* Charge Head ({params.row.SocietySpecialBillChargeHeadsCount}) */}
              Charge Head ({params.row.TotChargeHeads})
            </Button>
            <Button
              className="btnGrid"
              variant="contained"
              onClick={() =>
                navigate("/societySpecialBillUnits/" + params.id, {
                  state: {
                    row: params.row,
                  },
                })
              }
            >
              {/* Unit ({params.row.SocietySpecialBillUnitsCount}) */}
              Unit ({params.row.TotUnits})
            </Button>
          </Stack>
        );
      },
    },
  ];

  return (
    <>
      <Typography variant="h5" align="center">
        Society Special Bills
      </Typography>
      <Card>
        <CardContent>
          <Button
            style={{ marginRight: "2vh" }}
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/addSocietySpecialBill/" + societyId)}
          >
            Add Record
          </Button>
          <FormControlLabel
            control={<Checkbox checked={showRunning} onChange={handleChange} />}
            label="Show Running"
          />
          <div>
            <DataGrid
              getRowId={(row) => row.SocietySpecialBillID}
              rows={societySpecialBills}
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
                    SocietySpecialBillID: false,
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
              Back
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

export default SocietySpecialBillList;
