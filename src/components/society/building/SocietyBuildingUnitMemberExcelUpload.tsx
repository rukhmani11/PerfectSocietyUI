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
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import fileDownload from "js-file-download";
import { globalService } from "../../../services/GlobalService";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { SocietyBuildingUnitTransfersService } from "../../../services/SocietyBuildingUnitTransfersService";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";

const SocietyBuildingUnitMemberExcelUpload = () => {
  const fileInputRef = useRef(null);
  const { societyBuildingId } = useParams();
  let societyId=localStorage.getItem("societyId");
  let societySubscriptionId = localStorage.getItem("societySubscriptionId");
  const [societyBuildingUnitMemberExcelUpload, setSocietyBuildingUnitMemberExcelUpload] = useState([]);
  const [files, setFiles] = useState<File[]>([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => {},
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
    const files = fileInputRef.current.files;
    console.log(files);
  };
  const downloadTemplate = () => {
    SocietyBuildingUnitTransfersService.downloadTemplate().then((response) => {
      let result = response.data;
      fileDownload(result, "SocietyBuildingUnitMemberExcelTemplate.xlsx");
    });
  };

  const onFileChange = (fileInput: any) => {
      setFiles(fileInput.target.files);
  };

  const uploadFile = () => {
    
    let payload = {
      SocietyBuildingId: societyBuildingId,
      societyId:societyId,
      societySubscriptionId:societySubscriptionId

    };
    SocietyBuildingUnitTransfersService.uploadExcel(files, payload).then((response) => {
      if (response) {
        
        let result = response.data;
        if(result.list!=null)
        {
            setSocietyBuildingUnitMemberExcelUpload(result.list);
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
    { field: "Unit", headerName: "Unit", width: 130, flex: 1 },
    { field: "MemberName", headerName: "Member Name", width: 130, flex: 1 },
     { field: "TransferDate", headerName: "Transfer Date", width: 130, flex: 1 },
     { field: "Remarks", headerName: "Remarks", width: 130, flex: 2 },
     { field: "TransferFee", headerName: "TransferFee", width: 130, flex: 2 },
     { field: "PaymentDetails", headerName: "PaymentDetails", width: 130, flex: 2 },
     { field: "UploadRemarks", headerName: "UploadRemarks", width: 130, flex: 2 },
  ];
  return (
    <>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5">Member Excel Upload</Typography>
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
            style={{marginLeft: '3vh'}}
              variant="contained"
              color="secondary"
              className="m-l-5"
              startIcon={<DownloadIcon />}
              onClick={downloadTemplate}
            >
              Template
            </Button>
            <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5">Error Lists</Typography>
        <Typography  style={{color: 'red', fontSize: '0.75rem'}}>Note: Transfer Date should be prefix with single quote (') in excel. (e.g. '01/Apr/2023)
</Typography>
      </Stack>
            
            <DataGrid
              getRowId={(row) => row.SocietyBuildingUnitTransferImportId}
              rows={societyBuildingUnitMemberExcelUpload}
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
                    SocietyBuildingUnitTransferImportId: false,
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

export default SocietyBuildingUnitMemberExcelUpload;
