import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocietyBuildingUnitTransfersService } from "../../../services/SocietyBuildingUnitTransfersService";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Button, Card, CardActions, CardContent, IconButton, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { globalService } from "../../../services/GlobalService";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConfirmDialog from "../../helper/ConfirmDialog";
import dayjs from "dayjs";
import { SocietyBuildingTitleModel } from "../../../models/SocietyBuildingsModel";
import { societyBuildingsService } from "../../../services/SocietyBuildingsService";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UploadIcon from '@mui/icons-material/Upload';
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";

const SocietyBuildingUnitMemberList: React.FC = () => {
    const { societyBuildingUnitId }: any = useParams();
    const societyBuildingId: any = localStorage.getItem('societyBuildingId');
    const [societyBuildingUnitMembers, setSocietyBuildingUnitMembers] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { } })
    const [title, setTitle] = useState<any>({});
    const navigate = useNavigate();
    const { goToHome } = useSharedNavigation();

    useEffect(() => {
        if (!globalService.isSocietySelected()) {
            globalService.info(Messages.SocietyUnSelected);
            return goToHome();
          }
        if (societyBuildingUnitId)
            getSocietyBuildingUnitMembers();
        if (Object.keys(title).length === 0)
            getBuildingTitle();

    }, [societyBuildingUnitId]);

    const getBuildingTitle = () => {
        let model: SocietyBuildingTitleModel = {
            SocietyBuildingUnitId: societyBuildingUnitId,
            SocietyBuildingId: ""
        }
        societyBuildingsService
            .getPageTitle(model)
            .then((response) => {
                setTitle(response.data);
            });
    };

    const getSocietyBuildingUnitMembers = () => {
        SocietyBuildingUnitTransfersService.getBySocietyBuildingUnitId(societyBuildingUnitId).then((response) => {
            
            let result = response.data;
            setSocietyBuildingUnitMembers(result.list);
        });
    };

    const columns: GridColDef[] = [
        {
            field: "Member",
            headerName: "Member",
            width: 130,
            flex: 1,
            valueGetter: (params) => params.row.SocietyMember?.Member,
        },
        {
            field:"FolioNo",
            headerName:'Folio No',
            width:130,
            flex:1,
            valueGetter:(params) => params.row.SocietyMember?.FolioNo,
        },
        {
            field: "TransferDate", headerName: "Transfer Date", width: 130, flex: 1,
            valueFormatter: (params) => dayjs(params.value).format('DD-MMM-YYYY'),
        },
        { field: "Remarks", headerName: "Remarks", width: 130, flex: 1 },
        { field: "TransferFee", headerName: "Transfer Fee", width: 130, flex: 1 },
        { field: "PaymentDetails", headerName: "Payment Details", width: 130, flex: 1 },
        { field: "UEndDate", headerName: "UEndDate", width: 130, flex: 1,
         valueFormatter: (params) =>  params.value ? dayjs(params.value).format('DD-MMM-YYYY') : '' ,
        },
        {
            field: "Actions",
            headerName: "Actions",
            type: "number",
            flex: 1,
            renderCell: (params) => {
                return (
                    <Stack direction="row" spacing={0}>
                           {(!params.row.SocietyMember.IsBillOrReceiptExists)&&( 
                        <>
                        <IconButton size="small"
                            color="primary"
                            aria-label="add an alarm"
                            onClick={() => navigate("/editSocietyBuildingUnitMember/" + societyBuildingUnitId + "/" + params.row.SocietyBuildingUnitTransferId)}
                        >
                            <EditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton size="small" aria-label="delete" color="error"
                            onClick={() => {      
                                setConfirmDialog({
                                    isOpen: true,
                                    title: 'Are you sure to delete this building unit member?',
                                    subTitle: "You can't undo this operation",
                                    onConfirm: () => { removeSocietyBuildingUnitMember(params.row.SocietyBuildingUnitTransferId) }
                                })
                            }}>
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                            </>  )}
                    </Stack>
                );
            },
        },
    ];

    const removeSocietyBuildingUnitMember = (SocietyBuildingUnitTransferId: any) => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        SocietyBuildingUnitTransfersService
            .remove(SocietyBuildingUnitTransferId)
            .then((response) => {
                if (response) {
                    let result = response.data;
                    if (response.data?.isSuccess) {
                        globalService.success(result.message);
                        getSocietyBuildingUnitMembers();
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
                    Society Building Unit Members
                </Typography>
                <Typography variant="body1"><b>Building : </b>{title.Building}  <b>Unit :</b> {title.Unit}  </Typography>
            </Stack>
            <Card>
                <CardContent>
                    <Button
                     style={{marginRight: '2vh'}}
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => navigate("/addSocietyBuildingUnitMember/" + societyBuildingUnitId)}
                    >
                        Add Record
                    </Button>
                    <div>
                        <DataGrid
                            getRowId={(row) => row.SocietyBuildingUnitTransferId}
                            rows={societyBuildingUnitMembers}
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
                <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                    <Stack spacing={2} direction="row">
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/societyBuildingUnits/' + societyBuildingId)}
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

export default SocietyBuildingUnitMemberList;