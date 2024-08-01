import React, { useState, useEffect } from "react";
import {
    Stack,
    IconButton,
    Card,
    CardContent,
    Button,
    CardActions,
    Typography,
    Grid,
    Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { societySpecialBillUnitsService } from "../../services/SocietySpecialBillUnitsService";
import { globalService } from "../../services/GlobalService";
import ConfirmDialog from "../helper/ConfirmDialog";
import dayjs from "dayjs";
import { useSharedNavigation } from "../../utility/context/NavigationContext";
import { Messages } from "../../utility/Config";


const SocietySpecialBillUnitList: React.FC = () => {
    const { societySpecialBillId }: any = useParams();
    const societyId: any = localStorage.getItem('societyId');
    const [societySpecialBillUnits, setSocietySpecialBillUnits] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { } })
    const [title, setTitle] = useState<any>({});
    const navigate = useNavigate();
    const prevPgState = useLocation();
    const { goToHome } = useSharedNavigation();

    useEffect(() => {
        if (!globalService.isSocietySelected()) {
            globalService.info(Messages.SocietyUnSelected);
            return goToHome();
        }
        if (societySpecialBillId)
            getSocietySpecialBillUnits();
        // if (Object.keys(title).length === 0)
        //   getBuildingTitle();

    }, [societySpecialBillId]);

    //   const getBuildingTitle = () => {
    //     let model: SocietyBuildingTitleModel = {
    //       SocietySpecialBillId: societySpecialBillId,
    //       SocietyBuildingId: ""
    //     }
    //     societyBuildingsService
    //       .getPageTitle(model)
    //       .then((response) => {
    //         setTitle(response.data);
    //       });
    //   };

    const getSocietySpecialBillUnits = () => {
        societySpecialBillUnitsService.getBySocietySpecialBillId(societySpecialBillId).then((response) => {
            let result = response.data;
            setSocietySpecialBillUnits(result.list);
        });
    };

    const columns: GridColDef[] = [
        {
            field: "Unit",
            headerName: "Society Building Unit",
            flex: 1,
            valueGetter: (params) => params.row.SocietyBuildingUnit?.Unit,
        },
        {
            field: "Actions",
            headerName: "Actions",
            type: "number",
            flex: 1,
            renderCell: (params) => {

                return (
                    <Stack direction="row" spacing={0}>
                        <IconButton size="small" aria-label="delete" color="error"
                            onClick={() => {

                                setConfirmDialog({
                                    isOpen: true,
                                    title: 'Are you sure to delete this building unit ?',
                                    subTitle: "You can't undo this operation",
                                    onConfirm: () => { removeSocietySpecialBillUnit(params.row.SocietySpecialBillId, params.row.SocietyBuildingUnitId) }
                                })
                            }}>
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>

                    </Stack>
                );
            },
        },
    ];

    const removeSocietySpecialBillUnit = (SocietySpecialBillUnitId: any, SocietyBuildingUnitId: any) => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        societySpecialBillUnitsService
            .remove(SocietySpecialBillUnitId, SocietyBuildingUnitId)
            .then((response) => {
                if (response) {
                    let result = response.data;
                    if (result.isSuccess) {
                        globalService.success("Special Bill Unit deleted successfully.");
                        getSocietySpecialBillUnits();
                    }
                    else {
                        globalService.error(result.message);
                    }
                }
            });
    }

    return (
        <>
            <Stack direction="row" spacing={0} justifyContent="space-between">
                <Typography variant="h5" align="center">
                    Society Special Bill Unit
                </Typography>
                {(prevPgState && prevPgState.state && prevPgState.state.row) &&
                    <Typography variant="body1"><b>Unit Type : </b>{prevPgState.state.row.UnitType?.UnitType}  <b>Building Unit :</b> {prevPgState.state.row.SocietyBuildingUnit?.Unit} </Typography>
                }
            </Stack>
            <Card>
                <CardContent>
                    {(prevPgState && prevPgState.state && prevPgState.state.row) && <>
                        <Grid container spacing={3}>
                            <Grid item xs={6} sm={2}>
                                <Typography className="label">From Date</Typography>
                                <Typography variant="body2">{prevPgState.state.row.FromDate ? dayjs(prevPgState.state.row.FromDate).format('DD-MMM-YYYY') : ""}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <Typography className="label">To Date</Typography>
                                <Typography variant="body2">{prevPgState.state.row.ToDate ? dayjs(prevPgState.state.row.ToDate).format('DD-MMM-YYYY') : ""}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Typography className="label">Remark</Typography>
                                <Typography variant="body2">{prevPgState.state.row.Remark}</Typography>
                            </Grid>
                        </Grid>
                        <Divider></Divider>
                    </>
                    }
                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => navigate("/addSocietySpecialBillUnit/" + societySpecialBillId)}
                    >
                        Add Record
                    </Button>
                    <div>
                        <DataGrid
                            getRowId={(row) => row.SocietySpecialBillId + "_" + row.SocietyBuildingUnitId}
                            rows={societySpecialBillUnits}
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
                                        BankId: false,
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
                            onClick={() => navigate('/societySpecialBills/' + societyId)}
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

export default SocietySpecialBillUnitList;
