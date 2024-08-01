import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { smsService } from "../../services/SmsService";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Button, Card, CardContent, IconButton, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import { SmssService } from "../../services/SmssService";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const SmsList: React.FC = () => {
    const [sms, setsms] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        getSms();
    }, []);

    const getSms = () => {
        smsService
            .getAll()
            .then((response: { data: any; }) => {
                
                let result = response.data;
                setsms(result.list);
                //console.log(response.data);
            });
    };

    const columns: GridColDef[] = [
        {
            field: 'Smsid',
            headerName: 'Id',
            width: 70,
            //hideable: false,
            flex: 1
        },
        { field: 'Smstype', headerName: 'Sms Type', width: 130, flex: 1 },
        { field: 'Smsmessage', headerName: 'Sms Message', width: 130, flex: 1 },
        {
            field: 'DltEnglishId',
            headerName: 'DltEnglishId',
            width: 70,
            //hideable: false,
            flex: 1
        },
        {
            field: 'Actions',
            headerName: 'Actions',
            type: 'number',
            flex: 1,
            renderCell: (params) => {
                return (<Stack direction="row" spacing={0}>
                    <IconButton size="small"  color="primary" aria-label="add an alarm" onClick={() => navigate("/sms/" + params.row.SmsId)}>
                        <EditIcon fontSize="inherit"  />
                    </IconButton>

                    <IconButton size="small"  aria-label="delete" color="error" onClick={() => removeSms(params.row.Smsid)} >
                        <DeleteIcon fontSize="inherit"  />
                    </IconButton>
                </Stack>);
            }
        }
    ];

    const removeSms = (Smsid: any) => {
        if (window.confirm('Are you sure to delete this record?')) {
            smsService
                .remove(Smsid)
                .then((response: { data: any; }) => {
                    if (response) {
                        //console.log(response.data);
                        getSms();
                    }
                });
        }
    };

    return (
        <>
            <Typography variant="h5" align="center">
                SMS
            </Typography>
            <Card>
                <CardContent>

                    <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate("/sms/")}>
                        Add Record
                    </Button>
                    <div className='dvDataGrid'>
                        <DataGrid
                            getRowId={(row) => row.Smsid}
                            rows={sms}
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
                                        Smsid: false,
                                        DltEnglishId: false
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
            </Card>
        </>
    );
}

export default SmsList;
