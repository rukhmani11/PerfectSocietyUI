import React, { useEffect, useState } from "react";
import {
  Grid,
  CardActions,
  Card,
  CardContent,
  Button,
  Typography,
  Stack,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import { societyBillsService } from "../../services/SocietyBillsService";
import fileDownload from "js-file-download";
import { makeStyles } from "@mui/styles";
import { useSharedNavigation } from "../../utility/context/NavigationContext";
import { Messages } from "../../utility/Config";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    border: '0.5px solid grey',
    display: 'inline-flex',
    width: '100% !important',
    margin: "0px !important"
  },
  item: {
    border: '0.5px solid grey',
    paddingTop: '2px !important',
  },
  footerCell: {
    // border: '0.5px solid grey',
    fontWeight: "bold !important"
  },
  tableHead: {
    backgroundColor: "lightgrey !important",
    fontWeight: "bold !important"
  }
}));

const BillView = (...props: any) => {
  globalService.pageTitle = "Bill";
  const { societyBillId } = useParams();
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const [societyBill, setSocietyBill] = useState<any>(
    societyBillsService.initialFieldValues
  );
  let navigate = useNavigate();
  const { goToHome } = useSharedNavigation();
  let societySubscriptionId = localStorage.getItem("societySubscriptionId");
  
  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (societyBillId) {
      getBillDetails(societyBillId);
    }
  }, [societyBillId]);

  const downloadPDF = (societyBillId: any) => {
    societyBillsService.createBillsReceiptsPdf(societyBillId).then((response) => {
      let result = response.data;
      fileDownload(result, "SocietyBill.pdf");
    });
  };

  const getBillDetails = (societyBillId: any) => {
    societyBillsService
      .getViewSocietyBill(societyBillId, societySubscriptionId)
      .then((response) => {
        if (response) {
          let result = response.data;
          setSocietyBill(result.data);
          if (response.data.data.SocietyReceipts.length !== 0) {
            setIsReceiptVisible(true);
          }
        } else {
          setIsReceiptVisible(false);
        }
      });
  };
  const totalAmount =
    parseFloat(societyBill.UAmount) +
    (societyBill.Interest || 0) +
    (societyBill.TaxAmount || 0);

  //const terms = societyBill.SocietyBillSeries?.Terms;
  //const termsArray = terms ? terms.split("\n") : [];
  //const notes = societyBill.Note;
  //const noteArray = notes ? notes.split("\n") : [];
  const classes = useStyles();
  return (
    <>
      <Typography variant="h5" align="center">
        Society Bill
      </Typography>
      <Card sx={{ width: "100%" }}>
        <CardContent>
          <React.Fragment>
            <Box sx={{ width: "100%" }}>
              <Grid container fontSize={14} border={"1px solid rgba(224, 224, 224, 1)"}>
                <Grid item xs={12} sm={12} md={12} textAlign={"center"}>
                  <div style={{ fontSize: "15px", alignContent: "center", fontWeight: "bold" }}>
                    {societyBill.Society?.Society}
                  </div>
                  <div style={{ fontSize: "11px", alignContent: "center" }}>
                    Regd. No. : {societyBill.Society?.RegistrationNo} Dated
                    :{" "}
                    {societyBill.Society?.RegistrationDate ? dayjs(societyBill.Society?.RegistrationDate).format(
                      "DD-MMM-YYYY"
                    ) : ''}
                    ,
                    {societyBill.Society?.TaxRegistrationNo == null
                      ? ""
                      : `GST No. : ${societyBill.Society?.TaxRegistrationNo}`}
                  </div>
                  <div style={{ fontSize: "13px", alignContent: "center" }}>
                    {societyBill.Society?.Address},
                    {societyBill.Society?.City} - {societyBill.Society?.Pin}
                  </div>
                  <div style={{ fontSize: "15px", alignContent: "center" }}>
                    --
                    <u>
                      <strong>
                        {societyBill.SocietyBillSeries?.Note} B I L L{" "}
                      </strong>
                    </u>
                  </div>
                </Grid>
              </Grid>
              <Grid container fontSize={14} border={"1px solid rgba(224, 224, 224, 1)"}>
                <Grid item xs={4} sm={4} md={4} paddingLeft={1}>
                  <strong>
                    Unit No:{" "}
                    {
                      societyBill.SocietyBuildingUnit?.SocietyBuilding
                        ?.Building
                    }
                    -{societyBill.SocietyBuildingUnit?.Unit}
                  </strong>
                  <br />
                  <strong>Name: {societyBill.SocietyMember?.Member}</strong>
                </Grid>

                <Grid item xs={4} sm={4} md={4} textAlign={"center"} style={{ whiteSpace: "pre-line" }}>
                  <strong>
                    {societyBill.Particulars}
                    {/* {dayjs(societyBill.RegistrationDate).format( "DD-MMM-YYYY" )} */}
                  </strong>
                </Grid>
                <Grid item xs={4} sm={4} md={4} textAlign={"right"} paddingRight={1}>
                  <strong>
                    Bill No.:  {societyBill.BillNo}<br />
                    Bill Date:  {dayjs(societyBill.BillDate).format("DD-MMM-YYYY")}<br />
                    Bill Due Date:  {dayjs(societyBill.DueDate).format("DD-MMM-YYYY")}
                  </strong>
                </Grid>
              </Grid>

              <Table sx={{ width: '100% !important', border:'0.5 solid'}}>
                <TableBody>
                  <TableRow>
                    {societyBill.taxApplicable && (<TableCell size="small" colSpan={2}
                      className={classes.tableHead}
                    >
                      Customer GST No : {" "}
                      {societyBill.SocietyMember?.GstNo || "Not Available"}
                      &nbsp; &nbsp; &nbsp; &nbsp;
                      Place Of Delivery : {societyBill.Society?.State?.State}
                    </TableCell>
                    )}
                  </TableRow>

                  <TableRow className={classes.tableHead}>
                    <TableCell size="small" >
                      <strong>Nature Of Charges</strong>
                    </TableCell>
                    <TableCell size="small" width={150} >
                      <strong>Amount (Rs.)&nbsp;</strong>
                    </TableCell>
                  </TableRow>
                  {societyBill.spSocietyBillChargeHeads?.map((item: any) => (
                    <TableRow key={item.ChargeHead}>
                      <TableCell size="small">
                        {item.ChargeHead} {item.ChargeTax && "(GST)"}
                      </TableCell>

                      <TableCell size="small" 
                      >
                        {item.Amount}&nbsp;
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell size="small" >&nbsp;</TableCell>
                    <TableCell size="small"
                      
                    >
                      &nbsp;
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell size="small" className={classes.footerCell}
                    >
                      Gross Amount
                    </TableCell>
                    <TableCell size="small"
                      className={classes.footerCell}
                    >
                      {totalAmount}&nbsp;
                    </TableCell>
                  </TableRow>
                  {societyBill.Arrears !== null && societyBill.Arrears !== 0 &&
                    <TableRow>
                      <TableCell size="small" >
                        Additional Arrears
                      </TableCell>
                      <TableCell size="small" >

                        <>{societyBill.Arrears}</>

                      </TableCell>
                    </TableRow>
                  }
                  {societyBill.InterestArrears !== null &&
                    societyBill.InterestArrears !== 0 &&
                    <TableRow>
                      <TableCell size="small" >
                        Additional Interest Arrears
                      </TableCell>
                      <TableCell size="small" >
                        <>
                          {societyBill.InterestArrears}
                        </>
                      </TableCell>
                    </TableRow>
                  }
                  {societyBill.NonChgArrears !== null &&
                    societyBill.NonChgArrears !== 0 && <TableRow>
                      <TableCell size="small" >
                        Additional Non Chargeable Arrears
                      </TableCell>
                      <TableCell size="small" >
                        <>
                          {societyBill.NonChgArrears}
                        </>
                      </TableCell>
                    </TableRow>
                  }
                  {societyBill.TaxArrears !== null &&
                    societyBill.TaxArrears !== 0 &&
                    <TableRow>
                      <TableCell size="small" >
                        Additional Tax Arrears
                      </TableCell>
                      <TableCell size="small" >
                        <>{societyBill.TaxArrears}</>
                      </TableCell>
                    </TableRow>
                  }
                  {societyBill.Advance !== null && societyBill.Advance !== 0 &&
                    <TableRow>
                      <TableCell size="small" 
                      >
                        Less Advance
                      </TableCell>
                      <TableCell size="small"
                        
                      >
                        <>
                          {societyBill.Advance}
                        </>
                      </TableCell>
                    </TableRow>
                  }
                  <TableRow>
                    <TableCell size="small" className={classes.footerCell}
                    >
                      Net Amount Payable
                    </TableCell>
                    <TableCell size="small" className={classes.footerCell}>
                      <span className="WebRupee">Rs.</span>
                      {societyBill.Payable}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>


              <Typography>
                <strong>IN WORDS :{societyBill.PayableString}</strong>
              </Typography>
              <Box style={{ whiteSpace: "pre-line" }}>
                {societyBill.SocietyBillSeries?.Terms}
                {/* {termsArray.map((data: any, index: any) => (
                  <Box key={index}>
                    <p>{data}</p>
                  </Box>
                ))} */}
              </Box>
              <Typography align="right" marginTop={2} fontWeight={500}>
                For {societyBill.Society?.Society.toUpperCase()}
              </Typography>
              <Typography>Checked By:</Typography>
              <Typography align="right">
                {societyBill.Society?.Signatory}
              </Typography>
            </Box>
            {/* <Grid container spacing={2}>
              <Grid item>
                <Button
                  onClick={() => downloadPDF(societyBillId)}
                  variant="contained"
                  className="button"
                >
                  Download PDF
                </Button>
              </Grid>
            </Grid> */}
          </React.Fragment>
        </CardContent>
      </Card >
      {isReceiptVisible && (
        <Card sx={{ width: "100%" }}>
          <CardContent>
            <React.Fragment>
              <Box sx={{ width: "100%" }}>
                <Typography variant="h5" component="legend" textAlign={"center"}>
                  Receipt
                </Typography>
                <Table sx={{ width: "100%" }}>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ textAlign: "center" }}>
                        <div
                          style={{ fontSize: "15px", alignContent: "center" }}
                        >
                          <strong>{societyBill.Society?.Society}</strong>
                        </div>
                        <div
                          style={{ fontSize: "11px", alignContent: "center" }}
                        >
                          Regd. No. : {societyBill.Society?.RegistrationNo}{" "}
                          Dated :{" "}
                          {dayjs(societyBill.Society?.RegistrationDate).format(
                            "DD-MMM-YYYY"
                          )}
                          ,
                          {societyBill.Society?.TaxRegistrationNo == null
                            ? ""
                            : `GST No. : ${societyBill.Society?.TaxRegistrationNo}`}
                        </div>
                        <div
                          style={{ fontSize: "13px", alignContent: "center" }}
                        >
                          {societyBill.Society?.Address},
                          {societyBill.Society?.City} -{" "}
                          {societyBill.Society?.Pin}
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Table>
                  <TableHead className={classes.tableHead}>
                    <TableRow>
                      <TableCell size="small">Receipt No.</TableCell>
                      <TableCell size="small">Receipt Date</TableCell>
                      <TableCell size="small">Cheque No</TableCell>
                      <TableCell size="small">Dated</TableCell>
                      <TableCell size="small">Bank Name</TableCell>
                      <TableCell size="small">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {societyBill.SocietyReceipts?.map(
                      (item: any, index: any) => (
                        <TableRow key={index}>
                          <TableCell size="small">{item.ReceiptNo}</TableCell>
                          <TableCell size="small">
                            {item.ReceiptDate ? dayjs(item.ReceiptDate).format("DD-MMM-YYYY") : ''}
                          </TableCell>

                          {item.SocietyPayModes ? (
                            <>
                              {item.SocietyPayModes.AskDetails ? (
                                <>
                                  <TableCell size="small">
                                    {item.PayRefNo}
                                  </TableCell>
                                  <TableCell size="small">
                                    {item.PayRefDate ? dayjs(item.PayRefDate).format(
                                      "DD-MMM-YYYY"
                                    ) : ''}
                                  </TableCell>
                                  <TableCell size="small">
                                    {item.Bank ? item.Bank?.Bank : ""}{" "}
                                  </TableCell>
                                  <TableCell size="small">
                                    {item.Amount}
                                  </TableCell>
                                </>
                              ) : (
                                <>
                                  <TableCell colSpan={3} size="small"></TableCell>
                                  <TableCell size="small">
                                    {item.Amount}
                                  </TableCell>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <TableCell colSpan={3} size="small"></TableCell>
                              <TableCell size="small">{item.Amount}</TableCell>
                            </>
                          )}

                          {/* {item.SocietyPayModes &&
                        (
                          <>
                            <TableCell align="right">{""}</TableCell>
                            <TableCell align="right">{item.Amount}</TableCell>
                          </>
                        )} */}
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
                <Typography>

                </Typography>
                <Box style={{ whiteSpace: "pre-line" }}>
                  {societyBill.Note}
                  {/*  {noteArray.map((data: any, index: any) => (
                    <Box key={index}>
                      <p>{data}</p>
                    </Box>
                  ))} */}
                </Box>
                <Typography>
                  <strong>{societyBill.TotalAmountInWords}</strong>
                </Typography>
                <Typography align="right" marginTop={2} fontWeight={500}>
                  For {societyBill.Society?.Society.toUpperCase()}
                </Typography>
                <Typography>Checked By:</Typography>
                <Typography align="right">
                  {societyBill.Society?.Signatory}
                </Typography>
              </Box>
            </React.Fragment>
          </CardContent>
        </Card>
      )
      }
      <Grid container spacing={2}>
        <Grid item>
          <Button
            onClick={() => downloadPDF(societyBillId)}
            variant="contained"
            className="button"
          >
            Download PDF
          </Button>
        </Grid>
      </Grid>
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
    </>
  );
};
export default BillView;
