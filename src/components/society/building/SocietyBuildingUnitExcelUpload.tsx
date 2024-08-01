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
import {useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import { societyBuildingUnitsService } from "../../../services/SocietyBuildingUnitsService";
import fileDownload from "js-file-download";
import { globalService } from "../../../services/GlobalService";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";

const SocietyBuildingUnitExcelUpload = () => {
  const fileInputRef = useRef(null);
  const { societyBuildingId } = useParams();
  let societyId=localStorage.getItem("societyId");
  const [title, setTitle] = useState<any>({});
  const [files, setFiles] = useState<File[]>([]);
  const [societyBuildingUnitExcelUpload, setSocietyBuildingUnitExcelUpload] = useState([]);
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
    // Access the selected file(s) using the file input reference
    const files = fileInputRef.current.files;

    // Process the selected file(s) as needed
    // For example, you can access file properties, upload the file(s) to a server, etc.
    console.log(files);
  };

  const downloadTemplate = () => {
    societyBuildingUnitsService.downloadTemplate().then((response) => {
      let result = response.data;
      fileDownload(result, "SocietyBuildingUnitExcelTemplate.xlsx");
    });
  };

  const onFileChange = (fileInput: any) => {
    setFiles(fileInput.target.files);
  };

  const uploadFile = () => {
    let payload = {
      SocietyBuildingId: societyBuildingId,
      societyId:societyId,
    };
    societyBuildingUnitsService.uploadExcel(files, payload).then((response) => {
      if (response) {
        
        let result = response.data;
        if(result.list!=null)
        {
          setSocietyBuildingUnitExcelUpload(result.list);
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
    { field: "Unit", headerName: "Unit", width: 130, flex: 1 },
     { field: "UnitType", headerName: "Unit Type", width: 130, flex: 1 },
     { field: "FloorNo", headerName: "Floor No", width: 130, flex: 1 },
     { field: "Wing", headerName: "Wing", width: 130, flex: 1 },
     { field: "CarpetArea", headerName: "Carpet Area", width: 130, flex: 1 },
     { field: "ChargeableArea", headerName: "Chargeable Area", width: 130, flex: 1 },
     { field: "CertificateNo", headerName: "Certificate No", width: 130, flex: 1 },
     { field: "StartDate", headerName: "Start Date", width: 130, flex: 1 },
     { field: "EndDate", headerName: "End Date", width: 130, flex: 1 },
     { field: "Remarks", headerName: "Remarks", width: 130, flex: 1 },
    
 
  ];
  return (
    <>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5">Society Building Unit Excel Upload</Typography>
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
        <Typography   style={{color: 'red',  fontSize: '0.75rem'}}>Note: Start Date / End Date should be prefix with single quote (') in excel. (e.g. '01/Apr/2023)
</Typography>
      </Stack>
          <div>
            <DataGrid
              getRowId={(row) => row.SocietyBuildingUnitImportId}
              rows={societyBuildingUnitExcelUpload}
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
                    SocietyBuildingUnitImportId: false,
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

export default SocietyBuildingUnitExcelUpload;
