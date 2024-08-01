import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TdscategoryRatesService } from "../../services/TdscategoryRatesService";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Button, Card, CardActions, CardContent, IconButton, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import { globalService } from "../../services/GlobalService";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ConfirmDialog from "../helper/ConfirmDialog";
import dayjs from "dayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const TdsCategoryRateList: React.FC = () => {
    const { tdsCategoryId } = useParams();
    const [tdsCategoryRates, setTdsCategoryRates] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { } })
    const navigate = useNavigate();
    useEffect(() => {
        getTdsCategoryRates(tdsCategoryId);
    }, []);

    const getTdsCategoryRates = (tdsCategoryId: any) => {
        TdscategoryRatesService.getByTdsCategoryId(tdsCategoryId).then((response) => {
            let result = response.data;
            setTdsCategoryRates(result.list);
        });
    };

    // const goToDashboard = (tdsCategoryRateId: string) => {
    //     localStorage.setItem('tdsCategoryRateId', tdsCategoryRateId);
    //     navigate("/dashboard/" + tdsCategoryRateId);
    // }

    const columns: GridColDef[] = [
        {
            field: 'TdscategoryRateId',
            headerName: 'TdscategoryRateId',
            width: 70,
            //hideable: false,
            flex: 1
        },
        {
            field: 'TdscategoryId', headerName: 'TdscategoryId', width: 130, flex: 1,
        },
        {
            field: 'FromDate', headerName: 'From Date', width: 130, flex: 1,
            valueFormatter: (params) => params.value ? dayjs(params.value).format('DD-MMM-YYYY') : "",
        },
        {
            field: 'ToDate', headerName: 'To Date', width: 130, flex: 1,
            valueFormatter: (params) => params.value ? dayjs(params.value).format('DD-MMM-YYYY') : "",
        },
        { field: 'CompanyRate', headerName: 'Company Rate', width: 130, flex: 1 },
        { field: 'NonCompanyRate', headerName: 'Non Company Rate', width: 130, flex: 1 },
        {
            field: 'Actions',
            headerName: 'Actions',
            type: 'number',
            flex: 1,
            renderCell: (params) => {
                return (<Stack direction="row" spacing={0}>

                    <IconButton size="small" color="primary" aria-label="add an alarm" onClick={() => navigate("/editTdsCategoryRate/" + tdsCategoryId + "/" + params.row.TdscategoryRateId)}>
                        <EditIcon fontSize="inherit" />
                    </IconButton>

                    <IconButton size="small" aria-label="delete" color="error"
                        onClick={() => {
                            setConfirmDialog({
                                isOpen: true,
                                title: 'Are you sure to delete this TDS category rate?',
                                subTitle: "You can't undo this operation",
                                onConfirm: () => { removeTdsCategoryRate(params.row.TdscategoryRateId) }
                            })
                        }}>
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                </Stack>);
            }
        }
    ];

    const removeTdsCategoryRate = (TdscategoryRateId: any) => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        TdscategoryRatesService
            .remove(TdscategoryRateId)
            .then((response: { data: any; }) => {
                let result = response.data
                if (response.data?.isSuccess) {
                    globalService.success(result.message);
                    getTdsCategoryRates(tdsCategoryId);
                }
            });
    };

    return (
        <>
            <Stack direction="row" spacing={0} justifyContent="center">
                <Typography variant="h5"> TDS Category Rates </Typography>
                {<Typography variant="h6" color="error" sx={{ paddingLeft: 1 }}> {localStorage.getItem('Tdscategory')}</Typography>}
            </Stack>
            <Card>
                <CardContent>
                    <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate("/addTdsCategoryRate/" + tdsCategoryId)}>
                        Add Record
                    </Button>
                    <div>
                        <DataGrid
                            getRowId={(row) => row.TdscategoryRateId}
                            rows={tdsCategoryRates}
                            columns={columns}
                            columnHeaderHeight={30}
                            //rowHeight={30}
                            autoHeight={true}
                            getRowHeight={() => 'auto'} 
                            getEstimatedRowHeight={() => 200}
                            //loading={loading}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        // Hide columns Id, the other columns will remain visible
                                        TdscategoryRateId: false,
                                        TdscategoryId: false
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
                        //pageSize={5}
                        //rowsPerPageOptions={[5]}
                        //checkboxSelection
                        />
                    </div>

                </CardContent>
                <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                    <Stack spacing={2} direction="row">
                        <Button
                            variant="outlined" 
                            startIcon={<ArrowBackIcon />}
                            href="/tdsCategories"
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
}

export default TdsCategoryRateList;
