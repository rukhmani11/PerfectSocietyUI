import React, { useState, useEffect } from "react";
import {
  Stack,
  Breadcrumbs,
  Link,
  IconButton,
  Card,
  CardContent,
  Button,
  Typography,
  CardActions,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ConfirmDialog from "../../helper/ConfirmDialog";
import { useNavigate, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import { societyBuildingUnitsService } from "../../../services/SocietyBuildingUnitsService";
import { globalService } from "../../../services/GlobalService";
import { SocietyBuildingTitleModel } from "../../../models/SocietyBuildingsModel";
import { societyBuildingsService } from "../../../services/SocietyBuildingsService";
import UploadIcon from '@mui/icons-material/Upload';
import { Margin } from "@mui/icons-material";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";

const SocietyBuildingUnitList = () => {
  const { societyBuildingId }: any = useParams();
  const [societyBuildingUnits, setSocietyBuildingUnits] = useState([]);
  const [title, setTitle] = useState<any>({});
  let societyId = localStorage.getItem("societyId");
  const [isVisibleCreate, setIsVisible] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => { },
  });
  //const societyId: any = localStorage.getItem("societyId");

  const navigate = useNavigate();
  const { goToHome } = useSharedNavigation();
  
  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }

    if (Object.keys(title).length === 0)
      getBuildingTitle();

    getSocietyBuildingUnits(societyBuildingId);
    getSocietyFlatPendingCount(societyId);
  }, []);

  const getBuildingTitle = () => {
    let model: SocietyBuildingTitleModel = {
      SocietyBuildingUnitId: "",
      SocietyBuildingId: societyBuildingId
    }
    societyBuildingsService
      .getPageTitle(model)
      .then((response) => {
        setTitle(response.data);
      });
  };

  const getSocietyBuildingUnits = (societyBuildingId: any) => {
    societyBuildingUnitsService
      .getBySocietyBuildingId(societyBuildingId)
      .then((response) => {

        let result = response.data;
        setSocietyBuildingUnits(result.list);
      });
  };
  const getSocietyFlatPendingCount = (societyId: any) => {
    societyBuildingUnitsService
      .getSocietyFlatPendingCount(societyId)
      .then((response) => {

        let result = response.data;
        setIsVisible(result.count > 0 ? true : false);
      });
  };
  const refreshPage = () => {
    window.location.reload();
  }

  const goToDashboard = (societyBuildingUnitId: string) => {
    localStorage.setItem("societyBuildingUnitId", societyBuildingUnitId);
    navigate("/dashboard/" + societyBuildingUnitId);
  };

  const societyBuildingUnitColumns: GridColDef[] = [
    { field: "Unit", headerName: "Unit", flex: 1 },
    {
      field: "UnitType",
      headerName: "Unit Type", flex: 1,
      valueGetter: (params) => params.row.UnitType?.UnitType,
    },
    { field: "FloorNo", headerName: "Floor No.", flex: 1 },
    { field: "Wing", headerName: "Wing", flex: 1 },
    { field: "CarpetArea", headerName: "Carpet Area", flex: 1 },
    { field: "ChargeableArea", headerName: "Chargeable Area", flex: 1 },
    { field: "CertificateNo", headerName: "Certificate No.", flex: 1 },
    {
      field: "StartDate",
      headerName: "Start Date",
      //flex: 1,
      valueFormatter: (params) => params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    {
      field: "EndDate",
      headerName: "End Date",
      //flex: 1,
      valueFormatter: (params) => params.value ? dayjs(params.value).format("DD-MMM-YYYY") : "",
    },
    {
      field: "Actions",
      headerName: "Actions",
      //flex: 1,
      width: 450,
      renderCell: (params) => {
        return (
          <>
            <Stack direction="row" spacing={0}>
              <IconButton
                size="small"
                color="primary"
                aria-label="add an alarm"
                onClick={() =>
                  navigate(
                    "/editSocietyBuildingUnit/" +
                    societyBuildingId +
                    "/" +
                    params.row.SocietyBuildingUnitId
                  )}>
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
                      "Are you sure to delete building unit: " +
                      params.row.Unit +
                      " floor:" +
                      ((params.row.FloorNo != null) ? (params.row.FloorNo) : 0) +
                      "?",
                    subTitle: "You can't undo this operation",
                    onConfirm: () => {
                      removesocietyBuildingUnit(
                        params.row.SocietyBuildingUnitId
                      );
                    },
                  });
                }}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                size="small"
                color="info"
                aria-label="add an alarm"
                onClick={() =>
                  navigate(
                    "/viewSocietyBuildingUnit/" +
                    societyBuildingId +
                    "/" +
                    params.row.SocietyBuildingUnitId
                  )
                }
              >
                <VisibilityIcon fontSize="inherit" />
              </IconButton>
            </Stack>
            <Stack direction="row" spacing={0.2} sx={{
              overflowX: "auto",
              '&::-webkit-scrollbar': {
                height: '8px',

              },
              '&::-webkit-scrollbar-track': {
                background: "#f1f1f1",

              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,.2)',

              },
            }}>
              <Button
                className="btnGrid"
                variant="contained"
                onClick={() => navigate("/societyBuildingUnitChargeHeads/" +
                  params.row.SocietyBuildingUnitId)}
              >
                Charge Head
              </Button>
              <Button
                className="btnGrid"
                variant="contained"
                onClick={() =>
                  navigate("/societyBuildingUnitMembers/" + params.row.SocietyBuildingUnitId)
                }
              >
                Member
              </Button>
              <Button
                className="btnGrid"
                variant="contained"
                onClick={() =>
                  navigate("/societyBuildingUnitParkings/" + params.row.SocietyBuildingUnitId)
                }
              >
                Parking Lot
              </Button>
              <Button
                className="btnGrid"
                variant="contained"
                onClick={() =>
                  navigate("/societyBuildingUnitSubscriptionBalance/" + params.row.SocietyBuildingUnitId)
                }
              >
                Opening Balance
              </Button>
            </Stack>
          </>
        );
      },
    },

  ];

  const removesocietyBuildingUnit = (SocietyBuildingUnitId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    societyBuildingUnitsService
      .remove(SocietyBuildingUnitId)
      .then((response) => {
        if (response) {

          //console.log(response.data);

          globalService.success("Society Building Unit deleted successfully.");
          getSocietyBuildingUnits(societyBuildingId);
        }
      });
  };

  return (
    <>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5">Building Unit Details</Typography>
        <Typography variant="body1"><b>Building : </b>{title.Building} </Typography>

        {/* <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/mySociety">
            My Society
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href={"/societyBuildings/" + societyId}
          >
            Society Building
          </Link>
        </Breadcrumbs> */}

      </Stack>

      <Card>
        <CardContent>
          {isVisibleCreate && (
            <>
              <Button
                style={{ marginRight: '2vh' }}
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() =>
                  navigate("/addSocietyBuildingUnit/" + societyBuildingId)
                }
              >
                Add Record
              </Button>
            </>
          )}
          <Button
            style={{ marginRight: '2vh' }}
            variant="contained"
            color="success"
            startIcon={<UploadIcon />}
            onClick={() =>
              navigate("/societyBuildingUnitExcelUpload/" + societyBuildingId)
            }
          >
            Building Unit Import Excel
          </Button>
          <Button
            style={{ marginRight: '2vh' }}
            variant="contained"
            color="success"
            startIcon={<UploadIcon />}
            onClick={() =>
              navigate("/societyBuildingUnitChargeHeadsExcelUpload/" + societyBuildingId)
            }
          >
            Charge Head Import Excel
          </Button>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            color="success"
            onClick={() =>
              navigate("/societyBuildingUnitMemberExcelUpload/" + societyBuildingId)
            }
          >
            Member Import Excel
          </Button>

          <div>
            <DataGrid
              getRowId={(row) => row.SocietyBuildingUnitId}
              rows={societyBuildingUnits}
              columns={societyBuildingUnitColumns}
              columnHeaderHeight={30}
              //rowHeight={30}
              autoHeight={true}
              getRowHeight={() => "auto"}
              getEstimatedRowHeight={() => 200}
              scrollbarSize={1}
              //getRowHeight={() => 'auto'} getEstimatedRowHeight={() => 200}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    // Hide columns Id, the other columns will remain visible
                    SocietyBuildingUnitId: false,
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
              href={"/societyBuildings/" + societyId}
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

export default SocietyBuildingUnitList;
