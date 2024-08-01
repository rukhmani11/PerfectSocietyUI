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
import { societyBuildingUnitsService } from "../../../services/SocietyBuildingUnitsService";
import fileDownload from "js-file-download";
import { globalService } from "../../../services/GlobalService";
import { societyBuildingUnitChargeHeadsService } from "../../../services/SocietyBuildingUnitChargeHeadsService";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { AuthContext } from "../../../utility/context/AuthContext";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";

const SocietyBuildingUnitChargeHeadsExcelUpload = () => {
  const fileInputRef = useRef(null);
  const { societyBuildingId } = useParams();
  const [societyBuildingUnitChargeHeadsExcelUpload, setSocietyBuildingUnitChargeHeadsExcelUpload] = useState([]);
  const [files, setFiles] = useState<File[]>([]);
  const { auth } = React.useContext(AuthContext);
  let societyId = localStorage.getItem("societyId");
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
    const files = fileInputRef.current.files;
    console.log(files);
  };

  const downloadTemplate = () => {
    societyBuildingUnitChargeHeadsService.downloadTemplate(societyId, societyBuildingId).then((response) => {
      let result = response.data;
      fileDownload(result, "SocietyBuildingUnitChargeHeadsExcelTemplate.xlsx");
    });
  };

  const onFileChange = (fileInput: any) => {
    setFiles(fileInput.target.files);
  };

  const uploadFile = () => {
    let payload = {
      SocietyBuildingId: societyBuildingId,
    };
    societyBuildingUnitChargeHeadsService.uploadExcel(files, payload).then((response) => {
      if (response) {

        let result = response.data;
        if (result.list != null) {
          setSocietyBuildingUnitChargeHeadsExcelUpload(result.list);
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
    { field: "ChargeHead", headerName: "Charge Head", width: 130, flex: 1 },
    { field: "Rate", headerName: "Rate", width: 130, flex: 1 },
    { field: "Remarks", headerName: "Remarks", width: 130, flex: 2 },
  ];
  return (
    <>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5">Charge Heads Excel Upload</Typography>
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
              style={{ marginLeft: '3vh' }}
              variant="contained"
              color="secondary"
              className="m-l-5"
              startIcon={<DownloadIcon />}
              onClick={downloadTemplate}
            >
              Template
            </Button>
          </div>
          <Typography variant="h5">Error Lists</Typography>
          <div>
            <DataGrid
              getRowId={(row) => row.SocietyBuildingUnitChargeHeadImportId}
              rows={societyBuildingUnitChargeHeadsExcelUpload}
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
                    SocietyBuildingUnitChargeHeadImportId: false,
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

export default SocietyBuildingUnitChargeHeadsExcelUpload;
