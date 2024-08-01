import React, { useState, useEffect } from "react";
import {
  Stack,
  IconButton,
  Card,
  CardContent,
  Button,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ConfirmDialog from "../helper/ConfirmDialog";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { globalService } from "../../services/GlobalService";
import { AdvertisementsService } from "../../services/AdvertisementsService";
import { FolderPath, config } from "../../utility/Config";


const AdvertisementsList: React.FC = () => {
  const [advertisements, setadvertisements] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { }})
  const navigate = useNavigate();
  useEffect(() => {
    getAdvertisement();
  }, []);

  const getAdvertisement = () => {
    AdvertisementsService.getAll().then((response) => {
      let result = response.data;
      setadvertisements(result.list);
    });
  };

  const columns: GridColDef[] = [
    { field: "AdvHeading", headerName: "Heading",  flex: 1 },
    { field: "AdvInfo", headerName: "Info",  flex: 1.5},
    { field: "AdvUrl", headerName: "URL",  flex: 1.5},
    { field: "AdvSequence", headerName: "Sequence",  flex: 1,
    },
    {
      field: "AdvImageName", headerName: "Image",  flex: 2,
      renderCell: (params) => {
        if (params.row.AdvImageName) {
          return (
            <img
            alt=""
              className="gridImg"
              src={`${process.env.REACT_APP_BASE_URL}/${FolderPath.AdvertisementLogo}/${params.row.AdvImageName}`}
              loading="lazy"
              style={{ width: '30px', height: '30px' }}
            />
          );
        }
      }
    },
    {
      field: "Active",
      headerName: "Active",
      width: 130,
      renderCell: (params) => {
        return (
          <Stack>
            {params.row.Active && <DoneIcon color="secondary" />}
            {!params.row.Active && <CloseIcon />}
          </Stack>
        );
      },
    },
    {
      field: "Actions",
      headerName: "Actions",
      type: "number",
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={0}>
            <IconButton size="small" 
              color="primary"
              aria-label="add an alarm"
              onClick={() => navigate("/advertisement/" + params.row.AdvertisementId)}
            >
              <EditIcon fontSize="inherit"  />
            </IconButton>
          <IconButton size="small"  aria-label="delete"  color="error" 
            onClick={() => {
              setConfirmDialog({
                isOpen: true,
                title: 'Are you sure to delete this Advertisement ?',
                subTitle: "You can't undo this operation",
                onConfirm: () => { removeAdvertisement(params.row.AdvertisementId) }
              })
            }}>
            <DeleteIcon fontSize="inherit"  />
          </IconButton>

          </Stack>
        );
      },
    },
  ];

  const removeAdvertisement = (AdvertisementId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    AdvertisementsService.remove(AdvertisementId).then((response) => {
        let result=response.data;
        if (response) {
          globalService.success(result.message);
          getAdvertisement();
        }
      });
  }

  return (
    <>
      <Typography variant="h5" align="center">
      Advertisements
      </Typography>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/advertisement/")}
          >
            Add Record
          </Button>
          <div style={{width: "100%" }}>
            <DataGrid
              getRowId={(row) => row.AdvertisementId}
              rows={advertisements}
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
                    AdvertisementId: false,
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

export default AdvertisementsList;
