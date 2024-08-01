import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { societyPayModesService } from "../../../services/SocietyPayModesService";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Button, Card, CardActions, CardContent, IconButton, Stack, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConfirmDialog from "../../helper/ConfirmDialog";
import { AnyNaptrRecord } from "dns";
import { globalService } from "../../../services/GlobalService";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";

const SocietyPayModeList: React.FC = () => {
    
    const { societyId }:any = useParams();
    const [societyPayModes, setSocietyPayModes] = useState([]);
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
        if (societyId)
            getSocietyPayModes();
    }, [societyId]);

    const getSocietyPayModes = () => {
        
        societyPayModesService.getBySocietyId(societyId ).then((response) => {
            
            let result = response.data;
            setSocietyPayModes(result.list);
        });
    };

    const columns: GridColDef[] = [
       
        { field: "PayMode", headerName: "Pay Mode", width: 130, flex: 1 },
        { field: "PayModeCode", headerName: "Code",  },
        {
            field: "AskDetails",
            headerName: "Ask Details",
            width: 130,
            flex: 1,
            renderCell: (params) => {
                return (
                    <Stack>
                        {params.row.AskDetails && <DoneIcon color="success" />}
                        {!params.row.AskDetails && <CloseIcon color="error" />}
                    </Stack>
                );
            },
        },
        {
            field: "Active",
            headerName: "Active",
            width: 130,
            flex: 1,
            renderCell: (params) => {
                return (
                    <Stack>
                        {params.row.Active && <DoneIcon color="success" />}
                        {!params.row.Active && <CloseIcon color="error" />}
                    </Stack>
                );
            },
        },
        {
            field: "AcHead.AcHead",
            headerName: "AcHead",
            width: 130,
            flex: 1,
            // renderCell: (params) => {
            //     return (params.row.State.State);
            // },
            valueGetter: (params) => params.row.AcHeads?.AcHead,
        },
        // { field: "IsForPayInSlip", headerName: "For Pay-In-Slip", width: 130, flex: 1 },
        {
            field: "IsForPayInSlip",
            headerName: "Is For Pay-In-Slip",
            width: 130,
            flex: 1,
            renderCell: (params) => {
                return (
                    <Stack>
                        {params.row.IsForPayInSlip && <DoneIcon color="success" />}
                        {!params.row.IsForPayInSlip && <CloseIcon color="error" />}
                    </Stack>
                );
            },
        },
        {
            field: "Bank.Bank",
            headerName: "Bank",
            width: 130,
            flex: 1,
           
            valueGetter: (params) => params.row.Bank?.Bank,
        },
        { field: "BranchName", headerName: "Branch", width: 130, flex: 1 },
        { field: "BankAddress", headerName: "Address", width: 130, flex: 1 },
        { field: "BankAccountNo", headerName: "A/C Number", width: 130, flex: 1 },
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
                                    "/editSocietyPayMode/" +
                                    societyId +
                                    "/" +
                                    params.row.PayModeCode
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
                                        "Are you sure to delete this society pay mode ?",
                                    subTitle: "You can't undo this operation",
                                    onConfirm: () => {
                                        removeSocietyPayMode(params.row.PayModeCode);
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

    const removeSocietyPayMode = (PayModeCode: any) => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false,
        });
        societyPayModesService.remove(PayModeCode).then((response) => {
            if (response) {
                let result = response.data;
                if (response.data?.isSuccess) {
                    globalService.success(result.message);
                    getSocietyPayModes();
                }
                else {
                    globalService.error(result.message);
                }
            }
        });
    };

    return (
        <>
            <Typography variant="h5" align="center">Society Pay Modes</Typography>
            <Card>
                <CardContent>
                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => navigate("/addSocietyPayMode/" + societyId)}
                    >
                        Add Record
                    </Button>
                    <div>
                        <DataGrid
                            getRowId={(row) => row.SocietyId + "_" + row.PayModeCode}
                            rows={societyPayModes}
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

export default SocietyPayModeList;