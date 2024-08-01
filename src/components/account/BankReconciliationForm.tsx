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
    TableContainer,
    TableHead,
    TableRow,
    Theme,
    DialogActions,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Controls from "../../utility/controls/Controls";
import { SelectListModel } from "../../models/ApiResponse";
import { acHeadsService } from "../../services/AcHeadsService";
import { BankReconciliationSearchModel } from "../../models/AcTransactionAcsModel";
import { acTransactionAcsService } from "../../services/AcTransactionAcsService";
import dayjs from "dayjs";
import { makeStyles } from "@mui/styles";
import fileDownload from "js-file-download";
import { accountingReportService } from "../../services/AccountingReportService";

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
    boldRow: {
        fontWeight: "bold !important"
    },
    footerCell: {
        fontWeight: "bold !important"
    },
    tableHead: {
        backgroundColor: "lightgrey !important"
    }
}));

const BankReconciliationForm = () => {
    const { societySubscriptionId, societyId }: any = useParams();
    let navigate = useNavigate();
    const [DrCr, setDrCr] = useState<SelectListModel[]>([]);
    const [acHeads, setAcHeads] = useState<SelectListModel[]>([]);
    const [bankRecon, setBankRecon] = useState<any>(null);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [reconDate, setReconDate] = useState(null);

    useEffect(() => {
        if (DrCr.length === 0)
            setDrCr(globalService.getDrCrList());

        if (acHeads.length === 0)
            getAcHeadsForSocietyByNature();

        //newBankReconciliation();
        setErrors({});

    }, []);

    const validate = (fieldValues: BankReconciliationSearchModel = values) => {
        let temp: any = { ...errors };
        if ("FromDate" in fieldValues)
            temp.FromDate = fieldValues.FromDate ? "" : "From date is required.";

        if ("ToDate" in fieldValues)
            temp.ToDate = fieldValues.ToDate ? "" : "To date is required.";

        if ("AcHeadId" in fieldValues)
            temp.AcHeadId = fieldValues.AcHeadId ? "" : "Bank Account is required.";

        setErrors({
            ...temp,
        });

        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };

    const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
        useForm(
            acTransactionAcsService.initialBankReconcilationSearchFields,
            validate,
            societyId
        );

    const newBankReconciliation = () => {
        setValues(setFormValue(acTransactionAcsService.initialBankReconcilationSearchFields));
    };

    //This is used since in get the null property is not returned
    function setFormValue(model: BankReconciliationSearchModel) {
        let newModel = {
            SocietyId: societyId,
            SocietySubscriptionId: societySubscriptionId,
            AcHeadId: model.AcHeadId || "",
            DrCr: model.DrCr,
            FromDate: model.FromDate
                ? globalService.convertLocalToUTCDate(new Date(model.FromDate))
                : null,
            ToDate: model.ToDate
                ? globalService.convertLocalToUTCDate(new Date(model.ToDate))
                : null,
            ReconciledOn: model.ReconciledOn
                ? globalService.convertLocalToUTCDate(new Date(model.ReconciledOn))
                : null,
            UpdateOnlyBlank: model.UpdateOnlyBlank || false,
        };
        return newModel;
    }

    const getAcHeadsForSocietyByNature = () => {
        acHeadsService
            .getSelectListBySocietyIDNature(societyId, 'B')
            .then((response) => {
                setAcHeads(response.data);
            });
    };

    const getBankReconciliation = () => {
        values.SocietyId = societyId;
        values.SocietySubscriptionId = societySubscriptionId;
        acTransactionAcsService.getBankReconciliation(values).then((response: any) => {

            let result = response.data;
            if (result.isSuccess) {

                setBankRecon(result.data);
            }
        });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            getBankReconciliation();
        }
    };

    const downloadExcel = () => {
        values.SocietyId = societyId;
        values.SocietySubscriptionId = societySubscriptionId;
        if (validate()) {
            accountingReportService.bankReconciliationReportExportToExcel(values).then((response) => {
                let result = response.data;
                let fileName = "BankReconciliationReportFrom" + dayjs(values.FromDate).format("DD-MMM-YYYY") + "To" + dayjs(values.ToDate).format("DD-MMM-YYYY") + ".xlsx";
                fileDownload(result, fileName);
            });
        }
    }

    const [open, setOpen] = React.useState(false);

    const openReconcilationDialog = (row: any) => {
        setSelectedRow(row);
        setOpen(true);
        setReconDate(row.Reconciled ? globalService.convertLocalToUTCDate(new Date(row.Reconciled)) : null);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const updateReconciliationDate = (AcTransactionAcId: any) => {

        // let model = {
        //     AcTransactionAcId: AcTransactionAcId,
        //     Reconciled: reconDate
        // };
        if (AcTransactionAcId === selectedRow.AcTransactionAcId) {
            selectedRow.Reconciled = reconDate;
            acTransactionAcsService.editReconciliationDate(selectedRow).then((response: any) => {
                let result = response.data;
                if (result.isSuccess) {
                    setReconDate(null);
                    setOpen(false);
                    if (validate()) {
                        getBankReconciliation();
                    }
                }
            });
        }
        else {
            globalService.error('Invalid')
        }
    }

    const classes = useStyles();

    return (
        <>
            <Typography variant="h5" align="center">
                Bank Reconciliation
            </Typography>
            <form
                autoComplete="off"
                noValidate
                //className={classes.root}
                onSubmit={handleSubmit}
            >
                <Card>
                    <CardContent>
                        <React.Fragment>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={3}>
                                    <Controls.ReactDatePicker
                                        label="From Date"
                                        value={values.FromDate}
                                        onChange={(date: Date) =>
                                            handleInputChange({
                                                target: {
                                                    value: globalService.convertLocalToUTCDate(date),
                                                    name: "FromDate",
                                                },
                                            })
                                        }
                                        max={values.ToDate}
                                        error={errors.FromDate}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={3}>
                                    <Controls.ReactDatePicker
                                        label="To Date"
                                        fullWidth
                                        value={values.ToDate}
                                        onChange={(date: Date) =>
                                            handleInputChange({
                                                target: {
                                                    value: globalService.convertLocalToUTCDate(date),
                                                    name: "ToDate",
                                                },
                                            })
                                        }
                                        min={values.FromDate}
                                        error={errors.ToDate}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={5}>
                                    <Controls.Select
                                        name="AcHeadId"
                                        showEmptyItem={false}
                                        label="Account Head"
                                        required
                                        value={acHeads.length > 0 ? values.AcHeadId : ""}
                                        onChange={handleInputChange}
                                        options={acHeads}
                                        error={errors.AcHeadId}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Controls.Select
                                        showEmptyItem={false}
                                        name="DrCr"
                                        label="Debit/Credit"
                                        required
                                        value={DrCr.length > 0 ? values.DrCr : ""}
                                        onChange={(e: any) => {
                                            handleInputChange(e);
                                        }}
                                        options={DrCr}
                                        error={errors.DrCr}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Controls.ReactDatePicker
                                        label="Reconciled On"
                                        value={values.ReconciledOn}
                                        onChange={(date: Date) =>
                                            handleInputChange({
                                                target: {
                                                    value: globalService.convertLocalToUTCDate(date),
                                                    name: "ReconciledOn",
                                                },
                                            })
                                        }
                                        error={errors.ReconciledOn}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Controls.Checkbox
                                        name="UpdateOnlyBlank"
                                        label="Update only when reconciled date is blank"
                                        value={values.UpdateOnlyBlank}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    </CardContent>
                    <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                        <Stack spacing={2} direction="row">
                            <Button type="submit" variant="contained">
                                Proceed
                            </Button>

                            <Button type="button" variant="contained"
                                startIcon={<DownloadIcon />}
                                color='success' onClick={(e) => downloadExcel()}>
                                Excel
                            </Button>

                        </Stack>
                    </CardActions>
                </Card>

                {bankRecon &&
                    <Card>
                        <CardContent>
                            <React.Fragment>
                                <Box sx={{ width: "100%" }}>
                                    <>
                                        <Table className="tblReceipt"
                                            sx={{
                                                width: "100% !important", border: "0.5 solid",
                                                display: { xs: 'block', md: 'table' },
                                                overflowX: 'auto',
                                                //whiteSpace: 'nowrap'
                                            }}>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell size="small" className={classes.boldRow} colSpan={4}> From Date :  {dayjs(bankRecon.FromDate).format('DD-MMM-YYYY')}</TableCell>
                                                    <TableCell size="small" className={classes.boldRow} colSpan={5}> To Date : {dayjs(bankRecon.ToDate).format('DD-MMM-YYYY')}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell size="small" className={classes.boldRow} colSpan={4}> Bank A/C : </TableCell>
                                                    <TableCell size="small" className={classes.boldRow} colSpan={5}> {bankRecon.AcHeadName}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell size="small" className={classes.boldRow} colSpan={4}> Opening Balance As Per Books :</TableCell>
                                                    <TableCell size="small" className={classes.boldRow} colSpan={5}> {(Math.abs(bankRecon.OpBalAsPerBooks)).toFixed(2)} {bankRecon.OpBalAsPerBooks < 0 ? 'Cr' : 'Dr'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell size="small" className={classes.boldRow} colSpan={4}> Opening Balance As Per Bank : </TableCell>
                                                    <TableCell size="small" className={classes.boldRow} colSpan={5}>  {(Math.abs(bankRecon.OpBalAsPerBank)).toFixed(2)} {bankRecon.OpBalAsPerBank < 0 ? 'Cr' : 'Dr'}</TableCell>
                                                </TableRow>
                                                <TableRow className={classes.tableHead}>
                                                    <TableCell size="small">Doc. No.</TableCell>
                                                    <TableCell size="small">Doc. Date</TableCell>
                                                    <TableCell size="small">Account Head</TableCell>
                                                    <TableCell size="small">Particular</TableCell>
                                                    <TableCell size="small">Amount</TableCell>
                                                    <TableCell size="small">Cheque No.</TableCell>
                                                    <TableCell size="small">Bank</TableCell>
                                                    <TableCell size="small">Branch</TableCell>
                                                    <TableCell size="small">Reconciled On</TableCell>
                                                </TableRow>
                                                {(bankRecon.AcTransactionAcs && bankRecon.AcTransactionAcs.length > 0) ? <>
                                                    {bankRecon.AcTransactionAcs.map((item: any) => (
                                                        <TableRow key={item.AcTransactionAcId}>
                                                            <TableCell size="small">{item.AcTransaction.DocNo}</TableCell>
                                                            <TableCell size="small">{dayjs(item.AcTransaction.DocDate).format('DD-MMM-YYYY')}</TableCell>
                                                            <TableCell size="small">{item.AcHeads.AcHead}</TableCell>
                                                            <TableCell size="small">{item.Particulars}</TableCell>
                                                            <TableCell size="small">{item.Amount == null ? "--" : item.Amount + (item.DrCr == "C" ? " Cr" : " Dr")}</TableCell>
                                                            <TableCell size="small">{item.AcTransaction.PayRefNo}</TableCell>
                                                            <TableCell size="small">{item.AcTransaction.Bank?.Bank ? item.AcTransaction.Bank?.Bank : ""}</TableCell>
                                                            <TableCell size="small">{item.AcTransaction.Branch}</TableCell>
                                                            <TableCell size="small">
                                                                <Button
                                                                    className="btnGrid"
                                                                    variant="contained"
                                                                    color={item.Reconciled ? 'primary' : 'error'}
                                                                    onClick={() => openReconcilationDialog(item)}
                                                                >
                                                                    {item.Reconciled ? dayjs(item.Reconciled).format('DD-MMM-YYYY') : 'Set Date'}
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </>
                                                    :
                                                    <>
                                                        <TableRow key="trNoRow">
                                                            <TableCell className={classes.boldRow} size="small" align="center" colSpan={9}>No Records Found</TableCell>
                                                        </TableRow>
                                                    </>
                                                }
                                                <TableRow>
                                                    <TableCell className={classes.boldRow} size="small" colSpan={4}> Closing Balance As Per Books :</TableCell>
                                                    <TableCell className={classes.boldRow} size="small" colSpan={5}> {(Math.abs(bankRecon.ClBalAsPerBooks)).toFixed(2)} {bankRecon.ClBalAsPerBooks < 0 ? 'Cr' : 'Dr'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className={classes.boldRow} size="small" colSpan={4}> Closing Balance As Per Bank : </TableCell>
                                                    <TableCell className={classes.boldRow} size="small" colSpan={5}>  {(Math.abs(bankRecon.ClBalAsPerBank)).toFixed(2)} {bankRecon.ClBalAsPerBank < 0 ? 'Cr' : 'Dr'}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </>

                                </Box>
                            </React.Fragment>
                        </CardContent>
                    </Card>
                }
            </form>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Set Reconciliation Date
                </DialogTitle>
                {selectedRow &&
                    <DialogContent sx={{ minHeight: 400 }}>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Typography className="label">Account Head</Typography>
                                <Typography variant="body2">{selectedRow.AcHeads.AcHead}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography className="label">Reconciled On</Typography>
                                <Controls.ReactDatePicker
                                    selected={reconDate}
                                    onChange={(date: any) => setReconDate(globalService.convertLocalToUTCDate(date))}
                                //error={reconDate ? "" : "Reconciled On is required."}
                                />
                            </Grid>

                            <Grid item sm={12}>
                                <Typography className="label">Particulars</Typography>
                                <Typography variant="body2">{selectedRow.Particulars}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography className="label">Amount</Typography>
                                <Typography variant="body2">{selectedRow.Amount}</Typography>
                            </Grid>
                        </Grid>

                    </DialogContent>
                }
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined">Close</Button>
                    <Button onClick={() => updateReconciliationDate(selectedRow.AcTransactionAcId)} autoFocus color="primary" variant="contained">
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default BankReconciliationForm;
