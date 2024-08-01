import React, { useState, useEffect, useRef } from "react";
import {
  Stack,
  Card,
  CardContent,
  Button,
  Typography,
  CardActions,
} from "@mui/material";
import ConfirmDialog from "../../helper/ConfirmDialog";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import fileDownload from "js-file-download";
import { globalService } from "../../../services/GlobalService";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { societyMembersService } from "../../../services/SocietyMembersService";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";

const SocietyMembersExcelUpload = () => {
  const fileInputRef = useRef(null);
  const { societyId } = useParams();
  const [title, setTitle] = useState<any>({});
  const [files, setFiles] = useState<File[]>([]);
  const [societyMembersExcelUpload, setSocietyMembersExcelUpload] = useState([]);
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
  }, []);

  const handleFileSelect = () => {
    // Access the selected file(s) using the file input reference
    const files = fileInputRef.current.files;

    // Process the selected file(s) as needed
    // For example, you can access file properties, upload the file(s) to a server, etc.
    console.log(files);
  };

  const downloadTemplate = () => {
    societyMembersService.downloadTemplate().then((response) => {
      let result = response.data;
      fileDownload(result, "SocietyMemberExcelTemplate.xlsx");
    });
  };

  const onFileChange = (fileInput: any) => {
    setFiles(fileInput.target.files);
  };

  const uploadFile = () => {
    let payload = {
      SocietyId: societyId,
    };
    societyMembersService.uploadExcel(files, payload).then((response) => {
      if (response) {

        let result = response.data;
        if (result.list != null) {
          setSocietyMembersExcelUpload(result.list);
        }
        if (result.isSuccess) {
          globalService.success(result.message);
          // resetForm();
        } else {
          globalService.error(result.message);
        }
      }
    });
  };

  const columns: GridColDef[] = [
    { field: "FolioNo", headerName: "Folio No", width: 130, flex: 1 },
    { field: "Member", headerName: "Member", width: 130, flex: 1 },
    { field: "MemberClass", headerName: "Member Class", width: 130, flex: 1 },
    { field: "ContactPerson", headerName: "Contact Person", width: 130, flex: 1 },
    { field: "Address", headerName: "Address", width: 130, flex: 1 },
    { field: "City", headerName: "City", width: 130, flex: 1 },
    { field: "Pin", headerName: "Pin", width: 130, flex: 1 },
    { field: "StateName", headerName: "State Name ", width: 130, flex: 1 },
    { field: "PhoneNo", headerName: "Phone No", width: 130, flex: 1 },
    { field: "HomePhoneNo", headerName: "Home Phone No", width: 130, flex: 1 },
    { field: "OfficePhoneNo", headerName: "Office Phone No", width: 130, flex: 1 },
    { field: "MobileNo", headerName: "Mobile No", width: 130, flex: 1 },
    { field: "Occupation", headerName: "Occupation", width: 130, flex: 1 },
    { field: "FourWheelers", headerName: "Four Wheelers", width: 130, flex: 1 },
    { field: "TwoWheelers", headerName: "Two Wheelers", width: 130, flex: 1 },
    { field: "EmailId", headerName: "Email Id", width: 130, flex: 1 },
    { field: "GstNo", headerName: "Gst No", width: 130, flex: 1 },
    { field: "Remarks", headerName: "Remarks", width: 130, flex: 1 },


  ];
  return (
    <>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5">Society Member Excel Upload</Typography>
      </Stack>

      <Card>
        <CardContent>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(event: any) => {
                onFileChange(event);
              }}
            // onChange={handleFileSelect}
            />
            <Button variant="contained" color="primary" onClick={uploadFile}>
              Upload Excel
            </Button>

            <Button
              variant="contained"
              color="secondary"
              className="m-l-5"
              startIcon={<DownloadIcon />}
              onClick={downloadTemplate}
            >
              Template
            </Button>
          </div>
          <Stack direction="row" spacing={0} justifyContent="space-between">
            <Typography variant="h5">Error Lists</Typography>
          </Stack>
          <div>
            <DataGrid
              getRowId={(row) => row.SocietyMemberImportId}
              rows={societyMembersExcelUpload}
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
                    SocietyMemberImportId: false,
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
              onClick={() => navigate(-1)}
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

export default SocietyMembersExcelUpload;
