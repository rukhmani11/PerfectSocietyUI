import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SelectListModel } from "../../../models/ApiResponse";
import useForm from "../../../utility/hooks/UseForm";
import { SocietyBuildingUnitTransfersService } from "../../../services/SocietyBuildingUnitTransfersService";
import { societyMembersService } from "../../../services/SocietyMembersService";
import { globalService } from "../../../services/GlobalService";
import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import Controls from "../../../utility/controls/Controls";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SocietyBuildingTitleModel } from "../../../models/SocietyBuildingsModel";
import { societyBuildingsService } from "../../../services/SocietyBuildingsService";
import { SocietyBuildingUnitTransfersModel } from "../../../models/SocietyBuildingUnitTransfersModel";
import { AuthContext } from "../../../utility/context/AuthContext";
import { ROLES,Messages } from "../../../utility/Config";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";

const SocietyBuildingUnitMemberForm = () => {
    const { auth } = React.useContext(AuthContext);
    const {SocietyBuildingUnitTransferId, societyBuildingUnitId }: any = useParams();
    const societyId: string = localStorage.getItem("societyId") || "";
    let navigate = useNavigate();
    const [members, setMembers] = useState<SelectListModel[]>([]);
    const mode = SocietyBuildingUnitTransferId ? 'Edit' : 'Create';
    const [title, setTitle] = useState<any>({});
    const { goToHome } = useSharedNavigation();

    const validate = (fieldValues: SocietyBuildingUnitTransfersModel = values) => {
        let temp: any = { ...errors };
        if ("SocietyMemberId" in fieldValues)
            temp.SocietyMemberId = fieldValues.SocietyMemberId ? "" : "Society member is required.";
        if ("TransferDate" in fieldValues)
            temp.TransferDate = fieldValues.TransferDate ? "" : "Transfer date is required.";

        setErrors({
            ...temp,
        });

        if (fieldValues === values)
            return Object.values(temp).every((x) => x === "");
    };

    const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
        useForm(SocietyBuildingUnitTransfersService.initialFieldValues, validate, SocietyBuildingUnitTransferId);

    const newSocietyBuildingUnitMember = () => {
        setValues(SocietyBuildingUnitTransfersService.initialFieldValues);
    };

    //This is used since in get the null property is not returned
    function setFormValue(model: SocietyBuildingUnitTransfersModel) {
        let newModel = {
            SocietyBuildingUnitTransferId: model.SocietyBuildingUnitTransferId,
            SocietyBuildingUnitId: model.SocietyBuildingUnitId || '',
            SocietyMemberId: model.SocietyMemberId || '',
            TransferDate: model.TransferDate? globalService.convertLocalToUTCDate(new Date(model.TransferDate)) : null,
            UEndDate: model.UEndDate ? globalService.convertLocalToUTCDate(new Date(model.UEndDate)) : null,
            Remarks: model.Remarks || '',
            TransferFee: model.TransferFee || '',
            PaymentDetails: model.PaymentDetails
        }
        return newModel;
    }

    useEffect(() => {
        if (!globalService.isSocietySelected()) {
            globalService.info(Messages.SocietyUnSelected);
            return goToHome();
          }
        if (members.length === 0)
            getMembers();
        if (SocietyBuildingUnitTransferId) {
            getSocietyBuildingUnitMember(SocietyBuildingUnitTransferId);
        }
        else {
            newSocietyBuildingUnitMember();
            setErrors({});
        }

        if (Object.keys(title).length === 0)
            getBuildingTitle();

    }, [SocietyBuildingUnitTransferId]);

    const getBuildingTitle = () => {
        let model: SocietyBuildingTitleModel = {
            SocietyBuildingUnitId: societyBuildingUnitId,
            SocietyBuildingId: ""
        }
        societyBuildingsService
            .getPageTitle(model)
            .then((response) => {
                setTitle(response.data);
            });
    };

    const getMembers = () => {
        societyMembersService
            .getSelectListBySocietyId(societyId)
            .then((response) => {
                setMembers(response.data);
            });
    };


    const getSocietyBuildingUnitMember = (SocietyBuildingUnitTransferId: any) => {
        SocietyBuildingUnitTransfersService
            .getById(SocietyBuildingUnitTransferId)
            .then((response) => {
                if (response) {
                    let result = response.data;
                    setValues(setFormValue(result.data));
                }
            })
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            values.SocietyBuildingUnitId = societyBuildingUnitId;
            if (SocietyBuildingUnitTransferId) {
                SocietyBuildingUnitTransfersService.put(values).then((response: any) => {
                    let result = response.data;
                    if (result.isSuccess) {
                        resetForm();
                        navigate("/societyBuildingUnitMembers/" + societyBuildingUnitId);
                        globalService.success(result.message);
                    }
                });
            } else {
                SocietyBuildingUnitTransfersService.post(values).then((response: any) => {
                    if (response) {
                        let result = response.data;
                        if (result.isSuccess) {
                            globalService.success(result.message);
                            resetForm();
                            navigate("/societyBuildingUnitMembers/" + societyBuildingUnitId);
                        } else {
                            globalService.error(result.message);
                        }
                    }
                });
            }
        }
    };

    return (
        <>
            <Stack direction="row" spacing={0} justifyContent="space-between">
                <Typography variant="h5" align="center">
                    Society Building Unit Member
                </Typography>
                <Typography variant="body1"><b>Building : </b>{title.Building}  <b>Unit :</b> {title.Unit}  </Typography>
            </Stack>
            <form
                //autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
            >
                <Card>
                    <CardContent>
                        <React.Fragment>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <Controls.Select
                                    showEmptyItem={false}
                                        name="SocietyMemberId"
                                        label="Member"
                                        required
                                        value={members.length > 0 ? values.SocietyMemberId : ''}
                                        onChange={handleInputChange}
                                        options={members}
                                        error={errors.SocietyMemberId}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.ReactDatePicker
                                        label="Transfer Date"
                                        name="TransferDate"
                                        value={values.TransferDate}
                                        onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'TransferDate' } })}
                                        error={errors.TransferDate}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        label="Remarks"
                                        name="Remarks"
                                        value={values.Remarks}
                                        onChange={handleInputChange}
                                        error={errors.Remarks}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        label="Transfer Fee"
                                        name="TransferFee"
                                        type="number"
                                        value={values.TransferFee}
                                        onChange={handleInputChange}
                                        error={errors.TransferFee}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Controls.Input
                                        label="Payment Details"
                                        name="PaymentDetails"
                                        value={values.PaymentDetails}
                                        onChange={handleInputChange}
                                        error={errors.PaymentDetails}
                                    />
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Stack spacing={2} direction="row">
                            <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}>Submit</Button>
                            <Button variant="outlined" startIcon={<ArrowBackIcon />}
                                onClick={() => navigate("/societyBuildingUnitMembers/" + societyBuildingUnitId)}
                            >Back To List</Button>
                        </Stack>

                    </CardActions>
                </Card>
            </form>
        </>
    );
};

export default SocietyBuildingUnitMemberForm;