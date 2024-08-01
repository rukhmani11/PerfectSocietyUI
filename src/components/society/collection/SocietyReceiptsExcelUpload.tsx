import { Button, Card, CardActions, CardContent, Stack, Typography } from "@mui/material";
import ConfirmDialog from "../../helper/ConfirmDialog";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { societyReceiptsService } from "../../../services/SocietyReceiptsService";
import fileDownload from "js-file-download";
import { globalService } from "../../../services/GlobalService";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";

const SocietyReceiptsExcelUpload = () => {
  const fileInputRef = useRef(null);
  const { societySubscriptionId, societyId } = useParams();
  const [title, setTitle] = useState<any>({});
  const [files, setFiles] = useState<File[]>([]);
  const [societyReceiptExcelUpload, setSocietyReceiptExcelUpload] = useState([]);
  const { goToHome } = useSharedNavigation();
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => { },
  });
  const navigate = useNavigate();
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
    societyReceiptsService.downloadTemplate(societyId).then((response) => {

      let result = response.data;
      fileDownload(result, "SocietyReceiptExcelTemplate.xlsx");
    });
  };

  const onFileChange = (fileInput: any) => {
    setFiles(fileInput.target.files);
  };

  const uploadFile = () => {
    let payload = {
      societySubscriptionId: societySubscriptionId,
      societyId: societyId,
    };
    societyReceiptsService.uploadExcel(files, payload).then((response) => {
      if (response) {

        let result = response.data;
        if (result.list != null) {
          setSocietyReceiptExcelUpload(result.list);
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
    { field: "Building", headerName: "Building", width: 130, flex: 1 },
    { field: "Unit", headerName: "Unit", width: 130, flex: 1 },
    { field: "MemberName", headerName: "Member Name", width: 130, flex: 1 },
    { field: "FolioNo", headerName: "FolioNo", width: 130, flex: 1 },
    { field: "ReceiptDate", headerName: "Receipt date", width: 130, flex: 1 },
    { field: "BillAbbreviation", headerName: "Bill Abbreviation", width: 130, flex: 1 },
    { field: "Amount", headerName: "Amount", width: 130, flex: 1 },
    { field: "Particulars", headerName: "Particulars", width: 130, flex: 1 },
    { field: "PayMode", headerName: "Pay Mode Code", width: 130, flex: 1 },
    { field: "PayRefNo", headerName: "Pay Ref No", width: 130, flex: 1 },
    { field: "PayRefDate", headerName: "Pay Ref Date", width: 130, flex: 1 },
    { field: "BankName", headerName: "Bank name", width: 130, flex: 1 },
    { field: "Branch", headerName: "Branch", width: 130, flex: 1 },
    { field: "Remarks", headerName: "Remarks", width: 130, flex: 1 },
  ];
  return (
    <>
      {/* <Stack direction="row" spacing={0} justifyContent="space-between"> */}
      <Typography variant="h5" align="center">Society Receipt Excel Upload</Typography>
      {/* </Stack> */}

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
            <Typography style={{ color: 'red', fontSize: '0.75rem' }}>Note: Receipt Date / Pay Ref Date should be prefix with single quote (') in excel. (e.g. '01/Apr/2023)
            </Typography>
          </Stack>
          <div>
            <DataGrid
              getRowId={(row) => row.SocietyReceiptImportId}
              rows={societyReceiptExcelUpload}
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
                    SocietyReceiptImportId: false,
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
export default SocietyReceiptsExcelUpload;
