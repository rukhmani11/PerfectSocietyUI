import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { taxesService } from "../../services/TaxesService";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Stack } from "@mui/system";
import { Button, Card, CardContent, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ConfirmDialog from "../helper/ConfirmDialog";
import { globalService } from "../../services/GlobalService";

const TaxList: React.FC = () => {
    const [taxes, settax] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { } })
    const navigate = useNavigate();
    useEffect(() => {
        getTax();
    }, []);

    const getTax = () => {
        taxesService
            .getAll()
            .then((response: { data: any; }) => {

                let result = response.data;
                settax(result.list);

            });
    };

    const columns: GridColDef[] = [
        {
            field: 'TaxId',
            headerName: 'TaxId',
            width: 70,
            //hideable: false,
            flex: 1
        },
        { field: 'Tax', headerName: 'Tax', width: 130, flex: 1 },
        { field: 'TaxRate', headerName: 'TaxRate', width: 130, flex: 1 },
        { field: 'Surcharge', headerName: 'Surcharge', width: 130, flex: 1 },
        { field: 'Cess', headerName: 'Cess', width: 130, flex: 1 },
        { field: 'HiEduCess', headerName: 'HiEduCess', width: 130, flex: 1 },
        // { field: 'TaxPerc', headerName: 'TaxPerc', width: 130, flex: 1 },
        { field: 'RoundToPs', headerName: 'RoundToPs', width: 130, flex: 1 },
        {
            field: 'AcHead', headerName: 'Account Head', width: 130, flex: 1,
            valueGetter: (params) => params.row.AcHead?.AcHead
          },
        {
            field: 'Actions',
            headerName: 'Actions',
            type: 'number',
            flex: 1,
            renderCell: (params) => {
                return (<Stack direction="row" spacing={0}>
                    <IconButton size="small" color="primary" aria-label="add an alarm" onClick={() => navigate("/tax/" + params.row.TaxId)}>
                        <EditIcon fontSize="inherit" />
                    </IconButton>

                    <IconButton size="small" aria-label="delete" color="error"
                        onClick={() => {
                            setConfirmDialog({
                                isOpen: true,
                                title: 'Are you sure to delete this Tax?',
                                subTitle: "You can't undo this operation",
                                onConfirm: () => { removeTax(params.row.TaxId) }
                            })
                        }}>
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                </Stack>);
            }
        }
    ];

    const removeTax = (TaxId: any) => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        taxesService
            .remove(TaxId)
            .then((response: { data: any; }) => {
                let result = response.data
                if (response.data?.isSuccess) {
                    globalService.success(result.message);
                    getTax();
                }else {
                    globalService.error(result.message);
                  }
            });
    };

    return (
        <>
            <Typography variant="h5" align="center">
                Taxes
            </Typography>
            <Card>
                <CardContent>

                    <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate("/tax/")}>
                        Add New
                    </Button>
                    <div className='dvDataGrid'>
                        <DataGrid
                            getRowId={(row) => row.TaxId}
                            rows={taxes}
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
                                        TaxId: false,
                                        AcHeadId: false
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
}

export default TaxList;


