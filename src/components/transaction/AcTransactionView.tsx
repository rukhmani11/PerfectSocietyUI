import React, { useEffect, useState } from "react";
import {
    Grid,
    CardActions,
    Card,
    CardContent,
    Button,
    Typography,
    Stack,
    CardHeader,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Theme
} from "@mui/material";
import { AcTransactionsModel } from "../../models/AcTransactionsModel";
import { actransactionsService } from "../../services/AcTransactionsService";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Controls from '../../utility/controls/Controls';
import { SelectListModel } from "../../models/ApiResponse";
import dayjs from "dayjs";
import { makeStyles } from "@mui/styles";
import { societySubscriptionsService } from "../../services/SocietySubscriptionsService";
import { BorderAll, BorderStyle } from "@mui/icons-material";
import { Messages } from "../../utility/Config";
import { useSharedNavigation } from "../../utility/context/NavigationContext";

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
        backgroundColor: "lightgrey !important"
    }
}));

const AcTransactionView = (props: any) => {

    interface ClientProps {
        callFrom: boolean;
        acTransactionId: string;
    }


    let { societySubscriptionId, docType } = useParams();
    const [acTransaction, setAcTransaction] = useState<any>(null);
    const { callFrom, acTransactionId } = props;
    const [societySubscription, setSocietySubscription] = useState(null);
    const [totalCredit, setTotalCredit] = useState<number>(0);
    const [totalDebit, setTotalDebit] = useState<number>(0);

    let navigate = useNavigate();
    const { goToHome } = useSharedNavigation();
    let societyId = localStorage.getItem("societyId");
    const validate = (fieldValues: AcTransactionsModel = values) => {
        let temp: any = { ...errors };

        setErrors({
            ...temp,
        });

        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };

    const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
        useForm(
            actransactionsService.initialFieldValues,
            validate,
            acTransactionId
        );

    const newAcTransaction = () => {
        setValues(actransactionsService.initialFieldValues);
    };

    //This is used since in get the null property is not returned
    // function setFormValue(model: AcTransactionsModel) {
    //     
    //     let newModel = {
    //         AcTransactionId: model.AcTransactionId,
    //         SocietyId: model.SocietyId,
    //         SocietySubscriptionId: model.SocietySubscriptionId,
    //         DocType: model.DocType,
    //         Serial: model.Serial || '0',
    //         AcYear: model.AcYear || '',
    //         DocNo: model.DocNo || '',
    //         DocDate: model.DocDate ? globalService.convertLocalToUTCDate(new Date(model.DocDate)) : null,
    //         Particulars: model.Particulars || '',
    //         AcHeadId: model.AcHeadId || '',
    //         DrAmount: model.DrAmount || '',
    //         CrAmount: model.CrAmount || '',
    //         PayModeCode: model.PayModeCode || '',
    //         PayRefNo: model.PayRefNo || '',
    //         PayRefDate: model.PayRefDate ? globalService.convertLocalToUTCDate(new Date(model.PayRefDate)) : null,
    //         BankId: model.BankId || '',
    //         Branch: model.Branch || '',
    //         BillNo: model.BillNo || '',
    //         BillDate: model.BillDate ? globalService.convertLocalToUTCDate(new Date(model.BillDate)) : null,
    //         DelDocNo: model.DelDocNo || '',
    //         DelDocDate: model.DelDocDate ? globalService.convertLocalToUTCDate(new Date(model.DelDocDate)) : null,
    //     };
    //     return newModel;
    // }

    useEffect(() => {
        if (!globalService.isSocietySelected()) {
            globalService.info(Messages.SocietyUnSelected);
            return goToHome();
        }
        getAcTransaction(acTransactionId);
        setErrors({});
        setSocietySubscription(
            societySubscriptionsService.getCurrentSocietySubscription()
        );
    }, [acTransactionId]);

    const getAcTransaction = (acTransactionId: any) => {
        values.acTransactionId = props.callFrom == "AcTransaction" ? props.acTransactionId : acTransactionId;
        actransactionsService.getById(acTransactionId).then(
            (response) => {
                let result = response.data;
                if (result && result.isSuccess) {
                    setAcTransaction(result.data);
                    if (result.data.AcTransactionAcs) {
                        var totalDr = result.data.AcTransactionAcs.filter((x: any) => x.DrCr === 'D')
                            .reduce((total: number, currentRow: any) => total = total + currentRow.Amount, 0);
                        setTotalDebit(totalDr);

                        var totalCr = result.data.AcTransactionAcs.filter((x: any) => x.DrCr === 'C')
                            .reduce((total: number, currentRow: any) => total = total + currentRow.Amount, 0);
                        setTotalCredit(totalCr);
                    }
                }
                else {
                    globalService.error(result.message);
                }
            }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        values.SocietySubscriptionId = societySubscriptionId;
        values.SocietyId = societyId;
        values.DocType = docType;
        if (validate()) {
            if (acTransactionId) {
                actransactionsService.put(values).then((response: any) => {
                    let result = response.data;
                    if (result.isSuccess) {
                        resetForm();
                        globalService.success(result.message);
                        navigate("/acTransactions/" + societySubscriptionId + "/" + docType);
                    } else {
                        globalService.error(result.message);
                    }

                });
            } else {
                actransactionsService.post(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {
                            globalService.success(result.message);
                            resetForm();
                            navigate("/acTransactions/" + societySubscriptionId + "/" + docType);
                        } else {
                            globalService.error(result.message);
                        }
                    }
                });
            }
        }
    };

    const getAcHeadLabel = () => {
        if (docType == "CP" || docType == "CR") {
            return "Cash Account";
        }
        else if (docType === "BP" || docType === "BR") {
            return "Bank Account";
        }
        else if (docType === "PB" || docType === "EB") {
            return "Creditor Account";
        }
        else {
            return "Account Head";
        }
    }

    const classes = useStyles();

    return (
        <>
            <div style={{ alignItems: 'center' }}>
                <Typography
                    variant="h6"
                    color={"var(--primary-color)"}
                    align="center"
                >
                    {" "}
                    {localStorage.getItem("societyName")}{" "}
                    {societySubscription &&
                        "[" +
                        dayjs(societySubscription.SubscriptionStart).format(
                            "YY"
                        ) +
                        "-" +
                        dayjs(societySubscription.SubscriptionEnd).format("YY") +
                        "]"}
                </Typography></div>
            <Typography align="center" variant="h6">{globalService.getDocTypeMenuText(docType)}  </Typography>
            <Card>
                <CardContent>
                    <React.Fragment>
                        <Box sx={{ width: "100%" }}>
                            {acTransaction &&
                                <>
                                    <Grid container spacing={3} className={classes.container}>
                                        <Grid item xs={6} sm={6} md={6} className={classes.item}>
                                            Document No : {acTransaction.DocNo}
                                        </Grid>
                                        <Grid item xs={6} sm={6} md={6} className={classes.item}>
                                            Document Date : {dayjs(acTransaction.DocDate).format('DD-MMM-YYYY')}
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} className={classes.item} >
                                            Particular : {acTransaction.Particulars}
                                        </Grid>
                                        {docType !== "JV" &&
                                            <Grid item xs={12} sm={12} md={12} className={classes.item}>
                                                Account Head :  {acTransaction.AcHeads.AcHead}
                                            </Grid>
                                        }
                                        {docType === "BP" &&
                                            <Grid item xs={12} sm={12} md={12} className={classes.item}>
                                                Cheque No. : {acTransaction.PayRefNo}
                                            </Grid>
                                        }
                                        {docType == "BR" &&
                                            <>
                                                <Grid item xs={12} sm={12} md={12} className={classes.item}>
                                                    Pay Mode : {acTransaction.SocietyPayMode?.PayMode}
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={12} className={classes.item}>
                                                    Pay Ref. No : {acTransaction.PayRefNo}
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={12} className={classes.item}>
                                                    Pay Ref. Date : {dayjs(acTransaction.PayRefDate).format('DD-MMM-YYYY')}
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={12} className={classes.item}>
                                                    Bank : {acTransaction.Bank?.Bank}
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={12} className={classes.item}>
                                                    Branch : {acTransaction.Branch}
                                                </Grid>
                                            </>
                                        }
                                        {(docType == "SB" || docType == "EB") &&
                                            <>
                                                <Grid item xs={12} sm={12} md={12} className={classes.item}>
                                                    Bill No : {acTransaction.BillNo}
                                                </Grid>

                                                <Grid item xs={12} sm={12} md={12} className={classes.item}>
                                                    Bill Date :{dayjs(acTransaction.BillDate).format('DD-MMM-YYYY')}
                                                </Grid>
                                            </>
                                        }
                                        {(docType == "PB") &&
                                            <>
                                                <Grid item xs={12} sm={12} md={12} className={classes.item}>
                                                    Bill No : {acTransaction.BillNo}
                                                </Grid>

                                                <Grid item xs={12} sm={12} md={12} className={classes.item}>
                                                    Bill Date : {dayjs(acTransaction.BillDate).format('DD-MMM-YYYY')}
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={12} className={classes.item}>
                                                    Delivery Doc No : {acTransaction.DelDocNo}
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={12} className={classes.item}>
                                                    Delivery Doc Date : {dayjs(acTransaction.DelDocDate).format('DD-MMM-YYYY')}
                                                </Grid>
                                            </>
                                        }
                                    </Grid>
                                    <Typography variant="h5" align="center">
                                        Accounts
                                    </Typography>
                                    <Table >
                                        <TableHead className={classes.tableHead} >
                                            <TableRow>
                                                <TableCell size="small" style={{ border: '1px solid #4a4a4a' }} >Account</TableCell>
                                                <TableCell size="small" style={{ border: '1px solid #4a4a4a' }}>Particular</TableCell>
                                                <TableCell size="small" style={{ border: '1px solid #4a4a4a' }}>Dr. Amount</TableCell>
                                                <TableCell size="small" style={{ border: '1px solid #4a4a4a' }}>Cr. Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(acTransaction.AcTransactionAcs && acTransaction.AcTransactionAcs.length > 0) ? <>
                                                {acTransaction.AcTransactionAcs.map((item: any) => (
                                                    <TableRow key={item.AcTransactionAcId}>
                                                        <TableCell size="small" style={{ border: '1px solid #4a4a4a' }}>{item.AcHeads?.AcHead}</TableCell>
                                                        <TableCell size="small" style={{ border: '1px solid #4a4a4a' }}>{item.Particulars}</TableCell>
                                                        <TableCell size="small" style={{ border: '1px solid #4a4a4a' }}>{item.DrCr == "D" ? item.Amount + "" : "-"}</TableCell>
                                                        <TableCell size="small" style={{ border: '1px solid #4a4a4a' }}>{item.DrCr == "C" ? item.Amount + "" : "-"}</TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow key="totRow">
                                                    <TableCell size="small" className={classes.footerCell} style={{ border: '1px solid #4a4a4a' }} align="left" colSpan={2}>Total</TableCell>
                                                    <TableCell size="small" className={classes.footerCell} style={{ border: '1px solid #4a4a4a' }}>{totalDebit}</TableCell>
                                                    <TableCell size="small" className={classes.footerCell} style={{ border: '1px solid #4a4a4a' }}>{totalCredit}</TableCell>
                                                </TableRow>
                                            </>
                                                :
                                                <>
                                                    <TableRow key="trNoRow">
                                                        <TableCell size="small" align="right" colSpan={4}>No Records Found</TableCell>
                                                    </TableRow>
                                                </>
                                            }
                                        </TableBody>
                                    </Table>
                                </>
                            }
                        </Box>
                    </React.Fragment>
                </CardContent>
            </Card >


        </>
    )
}

export default AcTransactionView
