import React, { useState, useEffect } from "react";
import { bankService } from "../../services/BankService";
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
import { mailerService } from "../../services/MailersService";


const MailersList: React.FC = () => {
  const [mailers, setMailer] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', onConfirm: () => { }})
  const navigate = useNavigate();
  useEffect(() => {
    getMailer();
  }, []);

  const getMailer = () => {
    mailerService.getAll().then((response) => {
      let result = response.data;
      setMailer(result.list);
    });
  };

  const columns: GridColDef[] = [
    { field: "MailType", headerName: "Mail Type", width: 130, flex: 1 },
    { field: "Subject", headerName: "Subject", width: 130, flex: 1 },
    { field: "MailTo", headerName: "MailTo", width: 130, flex: 1 },
    { field: "MailCc", headerName: "MailCc", width: 130, flex: 1 },
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
              onClick={() => navigate("/mailer/" + params.row.MailerId)}
            >
              <EditIcon fontSize="inherit"  />
            </IconButton>
          <IconButton size="small"  aria-label="delete"  color="error" 
            onClick={() => {
              
              setConfirmDialog({
                isOpen: true,
                title: 'Are you sure to delete this record ?',
                subTitle: "You can't undo this operation",
                onConfirm: () => { removeMailer(params.row.MailerId) }
              })
            }}>
            <DeleteIcon fontSize="inherit"  />
          </IconButton>

          </Stack>
        );
      },
    },
  ];

  const removeMailer = (MailerId: any) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    mailerService.remove(MailerId).then((response) => {
        let result=response.data;
        if (response) {
          globalService.success(result.message);
          getMailer();
        }
      });
  }

  return (
    <>
      <Typography variant="h5" align="center">
        Mailers
      </Typography>
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate("/mailer/")}
          >
            Add Record
          </Button>
          <div style={{width: "100%" }}>
            <DataGrid
              getRowId={(row) => row.MailerId}
              rows={mailers}
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
                    MailerId: false,
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

export default MailersList;
