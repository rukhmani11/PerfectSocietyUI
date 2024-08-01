import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { standardAcCategoriesService } from "../../services/StandardAcCategoriesService";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Button, Card, CardContent, IconButton, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import { globalService } from "../../services/GlobalService";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ConfirmDialog from "../helper/ConfirmDialog";


const StandardAcCategoryList: React.FC = () => {
    const [standardAcCategories, setstandardAcCategory] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { } })
    const navigate = useNavigate();
    useEffect(() => {
        getStandardAcCategory();
    }, []);

    const getStandardAcCategory = () => {
        standardAcCategoriesService
            .getAll()
            .then((response: { data: any; }) => {

                let result = response.data;
                setstandardAcCategory(result.list);

            });
    };

    const columns: GridColDef[] = [
        {
            field: 'CategoryId',
            headerName: 'ID',
            width: 70,
            //hideable: false,
            flex: 1
        },
        { field: 'Category', headerName: 'Category', width: 130, flex: 1 },
        { field: 'DrCr', headerName: 'DrCr', width: 130, flex: 1 },
        { field: 'Nature', headerName: 'Nature', width: 130, flex: 1 },
        { field: 'Sequence', headerName: 'Sequence', width: 130, flex: 1 },
        {
            field: 'Actions',
            headerName: 'Actions',
            type: 'number',
            flex: 1,
            renderCell: (params) => {
                return (<Stack direction="row" spacing={0}>

                    <IconButton size="small" color="primary" aria-label="add an alarm" onClick={() => navigate("/standardAcCategorie/" + params.row.CategoryId)}>
                        <EditIcon fontSize="inherit" />
                    </IconButton>

                    <IconButton size="small" aria-label="delete" color="error"
                        onClick={() => {
                            setConfirmDialog({
                                isOpen: true,
                                title: 'Are you sure to delete this Account Categories?',
                                subTitle: "You can't undo this operation",
                                onConfirm: () => { removeStandardAcCategory(params.row.CategoryId) }
                            })
                        }}>
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                </Stack>);
            }
        }
    ];
    const removeStandardAcCategory = (CategoryId: any) => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        standardAcCategoriesService.remove(CategoryId).then((response) => {
            let result = response.data;
            if (response) {
                globalService.success(result.message);
                getStandardAcCategory();
            }
        });
    }

    return (
        <>
            <Typography variant="h5" align="center">
                Account Categories
            </Typography>
            <Card>
                <CardContent>

                    <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate("/standardAcCategorie/")}>
                        Add New
                    </Button>
                    <div className='dvDataGrid'>
                        <DataGrid
                            getRowId={(row) => row.CategoryId}
                            rows={standardAcCategories}
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
                                        CategoryId: false,
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

export default StandardAcCategoryList;
