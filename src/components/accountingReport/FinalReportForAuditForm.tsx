import { Button, Card, CardActions, CardContent, Grid, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Theme, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Controls from '../../utility/controls/Controls';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useForm from '../../utility/hooks/UseForm';
import { SelectListModel } from '../../models/ApiResponse';
import { globalService } from '../../services/GlobalService';
import fileDownload from 'js-file-download';
import dayjs from 'dayjs';
import { makeStyles } from "@mui/styles";
import { BalanceSheetModel, IncomeExpenditureReportModel } from '../../models/AccountingReportModel';
import { accountingReportService } from '../../services/AccountingReportService';
import { SocietySubscriptionsModel } from '../../models/SocietySubscriptionsModel';
import { societySubscriptionsService } from '../../services/SocietySubscriptionsService';
import DownloadIcon from '@mui/icons-material/Download';
import { societyReportService } from '../../services/SocietyReportService';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FeedIcon from '@mui/icons-material/Feed';
import DescriptionSharpIcon from '@mui/icons-material/DescriptionSharp';
import { appInfoService } from '../../services/AppInfoService';
import { useSharedNavigation } from '../../utility/context/NavigationContext';

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        border: '0.5px solid grey',
        display: 'inline-flex',
        width: '100% !important',
        margin: "0px !important"
    },
    item: {
        border: '0.5px solid grey',
        paddingTop: '2px !important'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    footerCell: {
        fontWeight: "bold !important"
    },
    tableHead: {
        backgroundColor: "lightgrey !important",
    },
    tableCell: {
        paddingTop: "6px !important", //not working. size propr works
        paddingBottom: "6px !important",
        padding: "6px !important"
    }
}));

const FinalReportForAuditForm = () => {
    const { societyId, societySubscriptionId, type }: any = useParams();
    const [societySubscription, setSocietySubscription] = useState<SocietySubscriptionsModel>(null);
    let navigate = useNavigate();
    const [AppInfoFinal,setAppInfoFinal] = useState();
    const { goToHome } = useSharedNavigation();
    
    const validate = (fieldValues: IncomeExpenditureReportModel = values) => {
        let temp: any = { ...errors };
        if ("FromDate" in fieldValues)
            temp.FromDate = fieldValues.FromDate ? "" : "From Date is required.";
        if ("ToDate" in fieldValues)
            temp.ToDate = fieldValues.ToDate ? "" : "To Date is required.";

        setErrors({
            ...temp,
        });

        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };

    const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
        useForm(accountingReportService.initialIncomeExpenditureStatementFieldValues, validate, societyId);

    useEffect(() => {
        if (!globalService.isSocietySelected()) {
            globalService.info('Society is not selected.');
            return goToHome();
          }
        if (!societySubscription)
            getSocietySubscriptionById();
            getAppinfo();
    }, [societySubscription]);


    const getSocietySubscriptionById = () => {
        societySubscriptionsService.getById(societySubscriptionId)
            .then((response) => {
                var result = response.data;
                if (result.isSuccess) {
                    setSocietySubscription(result.data);
                    values.FromDate = globalService.convertLocalToUTCDate(new Date(result.data.SubscriptionStart));
                    values.ToDate = globalService.convertLocalToUTCDate(new Date(result.data.PaidTillDate));
                }
                else
                    globalService.error(result.message);
            });
    };

    //This is used since in get the null property is not returned
    function setFormValue(model: IncomeExpenditureReportModel) {
        let newValue = {
            SocietyId: societyId,
            SocietySubscriptionId: societySubscriptionId,
            FromDate: new Date(model.FromDate),
            ToDate: new Date(model.ToDate)
        }
        return newValue;
    }

    const getAppinfo = () => {
        appInfoService.getAppInfo().then((response)=> {
            
            let result = response.data;
            setAppInfoFinal(result.row.FlagInfo?.OtherReportExcel);
        });
    }

    const downloadFinalReport = (name: string) => {
        if (name === 'IncomeExpenditure') {
            accountingReportService.PDFIncomeExpenditure(localStorage.getItem('societySubscriptionId')).then((response) => {
                let result = response.data;
                let fileName = "IncomeExpenditureFinalReport" + dayjs(societySubscription.SubscriptionStart).format("DD-MMM-YYYY") + "To" + dayjs(societySubscription.SubscriptionEnd).format("DD-MMM-YYYY") + ".pdf";
                fileDownload(result, fileName);
            });
        }
        else if (name === 'ScheduleToIncomeExpenditure') {
            accountingReportService.PDFScheduleToIncomeExpenditure(localStorage.getItem('societySubscriptionId')).then((response) => {
                let result = response.data;
                let fileName = "ScheduleToIncomeExpenditureFinalStatement" + dayjs(societySubscription.SubscriptionStart).format("DD-MMM-YYYY") + "To" + dayjs(societySubscription.SubscriptionEnd).format("DD-MMM-YYYY") + ".pdf";
                fileDownload(result, fileName);
            });
        }
        else if (name === 'BalanceSheet') {
            accountingReportService.BalanceSheetFinalReport(localStorage.getItem('societySubscriptionId')).then((response) => {
                let result = response.data;
                let fileName = "BalanceSheetFinalAsOn" + dayjs(societySubscription.SubscriptionEnd).format("DD-MMM-YYYY") + ".pdf";
                fileDownload(result, fileName);
            });
        }
        else if (name === 'ScheduleToBalanceSheet') {
            accountingReportService.ScheduleToBalanceSheetFinalReport(localStorage.getItem('societySubscriptionId')).then((response) => {
                let result = response.data;
                let fileName = "ScheduleToBalanceSheetFinalAsOn" + dayjs(societySubscription.SubscriptionEnd).format("DD-MMM-YYYY") + ".pdf";
                fileDownload(result, fileName);
            });
        }
        else if (name === 'GeneralLedger') {
            accountingReportService.GeneralLedgerFinalReport(localStorage.getItem('societySubscriptionId')).then((response) => {
                let result = response.data;
                let fileName = "GeneralLedgerFinalReport.pdf";
                fileDownload(result, fileName);
            });
        }
        else if (name === 'TrialBalance') {
            accountingReportService.TrialBalanceFinalReport(localStorage.getItem('societySubscriptionId')).then((response) => {
                let result = response.data;
                let fileName = "TrialBalanceFinalReport.pdf";
                fileDownload(result, fileName);
            });
        }
        else if (name === 'MemberLedger') {
            societyReportService.MemberLedgerFinalReport(localStorage.getItem('societySubscriptionId')).then((response) => {
                let result = response.data;
                let fileName = "MemberLedgerFinalReport.pdf";
                fileDownload(result, fileName);
            });
        }
        else if (name === 'MemberBalance') {
            societyReportService.MemberBalancesFinalReport(localStorage.getItem('societySubscriptionId')).then((response) => {
                let result = response.data;
                let fileName = "MemberBalancesFinalReport.pdf";
                fileDownload(result, fileName);
            });
        }
        else if (name === 'ReceiptAndPaymentStatement') {
            accountingReportService.ReceiptAndPaymentStatementFinalReport(localStorage.getItem('societySubscriptionId')).then((response) => {
                let result = response.data;
                let fileName = "ReceiptAndPaymentStatementFinalReport.pdf";
                fileDownload(result, fileName);
            });
        }
        else if (name === 'BankReconciliation') {
            accountingReportService.BankReconciliationFinalReport(localStorage.getItem('societySubscriptionId')).then((response) => {
                let result = response.data;
                let fileName = "BankReconciliationFinalReport.pdf";
                fileDownload(result, fileName);
            });
        }
    }


    function setFormValue1(model: BalanceSheetModel) {
        let newValue = {
            SocietyId: societyId,
            SocietySubscriptionId: societySubscriptionId,
            // AsOnDate: AsOnDate,
        }
        return newValue;
    };

    const downloadFinalReportExcel = (name: string) => {
        
        if (name === 'ScheduleToBalanceSheetExcel') {
            accountingReportService.FinalReporScheduleToBalanceSheetExportToExcel(localStorage.getItem('societySubscriptionId')).then((response) => {
                let result = response.data;
                // + dayjs(values.AsOnDate).format("DD-MMM-YYYY") + "
                let fileName = "ScheduleToBalanceSheetExcel.xlsx";
                fileDownload(result,fileName);
            });
        }
        else if (name === 'BalanceSheetExcel') {
            
            accountingReportService.balanceSheetFinalReportExcel(localStorage.getItem('societySubscriptionId')).then((response) => {
                let result = response.data;
                let fileName = "BalanceSheetExcel" + dayjs(societySubscription.SubscriptionStart).format("DD-MMM-YYYY") + "To" + dayjs(societySubscription.SubscriptionEnd).format("DD-MMM-YYYY") + ".xlsx";
                fileDownload(result, fileName);
            });
        }
        else if (name === 'ScheduleToIncomeExpenditureExcel') {
            accountingReportService.ExcelScheduleToIncomeExpenditure(localStorage.getItem('societySubscriptionId')).then((response) => {
                let result = response.data;
                let fileName = "ScheduleToIncomeExpenditureFinalStatement" + dayjs(societySubscription.SubscriptionStart).format("DD-MMM-YYYY") + "To" + dayjs(societySubscription.SubscriptionEnd).format("DD-MMM-YYYY") +".xlsx";
                fileDownload(result, fileName);
            });
        }
        else if (name === 'GeneralLedgerExcel') {
            accountingReportService.ExcelGeneralLedger(localStorage.getItem('societySubscriptionId')).then((response) => {
                let result = response.data;
                let fileName = "GeneralLedgerExcel" + dayjs(societySubscription.SubscriptionStart).format("DD-MMM-YYYY") + "To" + dayjs(societySubscription.SubscriptionEnd).format("DD-MMM-YYYY") +".xlsx";
                fileDownload(result, fileName);
            });
        }
        else if (name === 'TrialBalanceExcel') {
            accountingReportService.ExcelTrialBalance(localStorage.getItem('societySubscriptionId')).then((response) => {
                let result = response.data;
                let fileName = "TrialBalanceExcel" + dayjs(societySubscription.SubscriptionStart).format("DD-MMM-YYYY") + "To" + dayjs(societySubscription.SubscriptionEnd).format("DD-MMM-YYYY") +".xlsx";
                fileDownload(result, fileName);
            });
        }
        else if (name === 'MemberLedgerExcel') {
            societyReportService.MemberLedgerFinalReportExcel(localStorage.getItem('societySubscriptionId')).then((response) => {
                let result = response.data;
                let fileName = "MemberLedgerExcel.xlsx";
                fileDownload(result, fileName);
            });
        }
      
    }

    const downloadIncomeExpenditureStatementReport = () => {
        
        accountingReportService.getIncomeExpenditureStatementExportToExcel(societySubscriptionId).then((response) => {
            
          let result = response.data;
          fileDownload(result, "IncomeExpenditureStatementExportToExcel.xlsx");
        });
      };

    const classes = useStyles();

    return (
        <div>
            <Typography variant="h5" align="center">
                Final Report For Audit
            </Typography>
            <form
                autoComplete="off"
                noValidate
            //className={classes.root}
            //onSubmit={handleSubmit}
            >
                <Card>
                    <CardContent>
                        <React.Fragment>
                            <Table sx={{ width: '60% !important' }} className='center'>
                                <TableHead className={classes.tableHead}>
                                    <TableRow>
                                        <TableCell size='small'>List Of Reports</TableCell>
                                        <TableCell size='small'>Download</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell size='small' sx={{ textAlign: "left" }}>1. Income & Expenditure Statement</TableCell>
                                        <TableCell size='small'>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="download pdf"
                                                onClick={(e) => downloadFinalReport('IncomeExpenditure')}
                                            >
                                                <PictureAsPdfIcon/>
                                            </IconButton>
                                            {/* <IconButton
                                                size="small"
                                                color="primary"
                                               // aria-label="download pdf"
                                                onClick={downloadIncomeExpenditureStatementReport}
                                            >
                                                <DescriptionSharpIcon/>
                                            </IconButton> */}
                                        </TableCell>
                    
                                    </TableRow>
                                    <TableRow>
                                        <TableCell size='small' sx={{ textAlign: "left" }}>2. Schedule To Income & Expenditure Statement</TableCell>
                                        <TableCell size='small'>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="download pdf"
                                                onClick={(e) => downloadFinalReport('ScheduleToIncomeExpenditure')}>
                                                <PictureAsPdfIcon/>
                                            </IconButton>
                                            {AppInfoFinal  &&
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="download pdf"
                                                onClick={(e) => downloadFinalReportExcel('ScheduleToIncomeExpenditureExcel')}>
                                                <FeedIcon/>
                                            </IconButton>
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell size='small' sx={{ textAlign: "left" }}>3. Balance Sheet</TableCell>
                                        <TableCell size='small'>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="download pdf"
                                                onClick={(e) => downloadFinalReport('BalanceSheet')}>
                                                <PictureAsPdfIcon/>
                                            </IconButton>
                                            {AppInfoFinal  &&
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="download pdf"
                                                onClick={(e) => downloadFinalReportExcel('BalanceSheetExcel')}>
                                                <FeedIcon/>
                                            </IconButton>
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell size='small' sx={{ textAlign: "left" }}>4. Schedule To Balance Sheet</TableCell>
                                        <TableCell size='small'>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="download pdf"
                                                onClick={(e) => downloadFinalReport('ScheduleToBalanceSheet')}>
                                                <PictureAsPdfIcon/>
                                            </IconButton>
                                            { AppInfoFinal &&  
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="download pdf"
                                                onClick={(e) => downloadFinalReportExcel('ScheduleToBalanceSheetExcel')}>
                                                <FeedIcon/>
                                            </IconButton>
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell size='small' sx={{ textAlign: "left" }}>5. General Ledger</TableCell>
                                        <TableCell size='small'>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="download pdf"
                                                onClick={(e) => downloadFinalReport('GeneralLedger')}>
                                                <PictureAsPdfIcon/>
                                            </IconButton>
                                            {AppInfoFinal  &&
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="download pdf"
                                                onClick={(e) => downloadFinalReportExcel('GeneralLedgerExcel')}>
                                                <FeedIcon/>
                                            </IconButton>
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell size='small' sx={{ textAlign: "left" }}>6. Trial Balance	</TableCell>
                                        <TableCell size='small'>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="download pdf"
                                                onClick={(e) => downloadFinalReport('TrialBalance')}>
                                               <PictureAsPdfIcon/>
                                            </IconButton>
                                            {AppInfoFinal  &&
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="download pdf"
                                                onClick={(e) => downloadFinalReportExcel('TrialBalanceExcel')}>
                                                <FeedIcon/>
                                            </IconButton>
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell size='small' sx={{ textAlign: "left" }}>7. Member Ledger Report</TableCell>
                                        <TableCell size='small'>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="download pdf"
                                                onClick={(e) => downloadFinalReport('MemberLedger')}>
                                                <PictureAsPdfIcon/>
                                            </IconButton>
                                            {AppInfoFinal  &&
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="download pdf"
                                                onClick={(e) => downloadFinalReportExcel('MemberLedgerExcel')}>
                                                <FeedIcon/>
                                            </IconButton>
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell size='small' sx={{ textAlign: "left" }}>8. Member Balance Report</TableCell>
                                        <TableCell size='small'>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="download pdf"
                                                onClick={(e) => downloadFinalReport('MemberBalance')}>
                                                <PictureAsPdfIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell size='small' sx={{ textAlign: "left" }}>9. Receipt and Payment Statement</TableCell>
                                        <TableCell size='small'>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="download pdf"
                                                onClick={(e) => downloadFinalReport('ReceiptAndPaymentStatement')}>
                                                <PictureAsPdfIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell size='small' sx={{ textAlign: "left" }}>10. Bank Reconciliation Report</TableCell>
                                        <TableCell size='small'>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="download pdf"
                                                onClick={(e) => downloadFinalReport('BankReconciliation')}>
                                                <PictureAsPdfIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    {/* <TableRow>
                                        <TableCell size='small'>11. Audit Ledger</TableCell>
                                        <TableCell size='small'>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="download pdf"
                                                onClick={(e) => downloadFinalReport('')}>
                                                <DownloadIcon fontSize="inherit" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow> */}
                                </TableBody>
                            </Table>
                        </React.Fragment>
                    </CardContent>
                    <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                        <Stack spacing={2} direction="row">
                            {/* <Button type="submit" variant="contained">
                                Submit
                            </Button> */}
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </Button>

                        </Stack>
                    </CardActions>
                </Card>
            </form >
        </div>
    )
}

export default FinalReportForAuditForm
