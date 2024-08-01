import { Button, Card, CardActions, CardContent, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Controls from '../../utility/controls/Controls';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ParkingRegisterReportModel } from '../../models/SocietyReportModel';
import { societyReportService } from '../../services/SocietyReportService';
import useForm from '../../utility/hooks/UseForm';
import { SelectListModel } from '../../models/ApiResponse';
import { societyBuildingsService } from '../../services/SocietyBuildingsService';
import { societyBuildingUnitsService } from '../../services/SocietyBuildingUnitsService';
import { SocietySubscriptionsModel } from '../../models/SocietySubscriptionsModel';
import { societySubscriptionsService } from '../../services/SocietySubscriptionsService';
import { globalService } from '../../services/GlobalService';
import fileDownload from 'js-file-download';
import { societyparkingsService } from '../../services/SocietyParkingsService';
import dayjs from 'dayjs';
import axios from 'axios';
import { Messages, ROLES, config } from '../../utility/Config';
import { AuthContext } from '../../utility/context/AuthContext';
import { useSharedNavigation } from '../../utility/context/NavigationContext';

const ParkingRegisterReportForm = () => {
    const { auth } = React.useContext(AuthContext);
    const { societyId, societySubscriptionId }: any = useParams();
    let navigate = useNavigate();
    const [buildings, setBuildings] = useState<SelectListModel[]>([]);
    const [buildingUnits, setBuildingUnits] = useState<SelectListModel[]>([]);
    const [parkings, setParkings] = useState<SelectListModel[]>([]);
    const [societySubscription, setSocietySubscription] = useState<SocietySubscriptionsModel>(null);
    const parkingStatus = globalService.getParkingRegisterReportStatus();
    const { goToHome } = useSharedNavigation();
    const validate = (fieldValues: ParkingRegisterReportModel = values) => {
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
        useForm(societyReportService.initialParkingRegisterReportFieldValues, validate, societyId);

    useEffect(() => {
        if (!globalService.isSocietySelected()) {
            globalService.info(Messages.SocietyUnSelected);
            return goToHome();
          }
        if (buildings.length === 0)
            getBuildingsForSociety();
        if (parkings.length === 0)
            getParkingsForSociety();
        if (!societySubscription)
            getSocietySubscriptionById();

    }, [societyId]);

    const newReport = () => {
        setValues(societyReportService.initialParkingRegisterReportFieldValues);
    };

    //This is used since in get the null property is not returned
    function setFormValue(model: ParkingRegisterReportModel) {
        let newValue = {
            SocietyId: societyId,
            SocietySubscriptionId: societySubscriptionId,
            SocietyBuildingId: model.SocietyBuildingId,
            SocietyBuildingUnitId: model.SocietyBuildingUnitId,
            FromDate: model.FromDate ? new Date(model.FromDate) : globalService.convertLocalToUTCDate(new Date(societySubscription.SubscriptionStart)),
            ToDate: model.ToDate ? new Date(model.ToDate) : globalService.convertLocalToUTCDate(new Date(societySubscription.PaidTillDate)),
            Status: model.Status,
            SocietyParkingId: model.SocietyParkingId
        }
        return newValue;
    }

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

    const getBuildingsForSociety = () => {
        societyBuildingsService.getSelectListBySocietyId(societyId)
            .then((response) => {
                setBuildings(response.data);
            });
    };

    const getParkingsForSociety = () => {
        societyparkingsService.getSelectListBySocietyId(societyId)
            .then((response) => {
                setParkings(response.data);
            });
    };

    const getSocietyBuildingUnitbySocietyBuildingId = (societyBuildingId: string) => {
        societyBuildingUnitsService.getSelectListBySocietyBuildingId(societyBuildingId)
            .then((response) => {
                setBuildingUnits(response.data);
            });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            
            var model = setFormValue(values);
            var url = `${process.env.REACT_APP_BASE_URL}/api/SocietyReport/ParkingRegisterReportExportToExcel`;
            // axios({
            //     method: 'post',
            //     url: url,
            //     responseType: 'blob',
            //     data: model
            // })
            //     .then((response) => {
            //         
            //         // handle success
            //         let result = response.data;
            //         const contentDisposition = response.headers['content-disposition'];
            //         const filename = contentDisposition ? contentDisposition.match(/filename="?(.+)"?/)[1] : 'unknown';
            //         fileDownload(result, "ParkingRegisterReport.xlsx");
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //         
            //         // how to get Json response?
            //         //  error.response.data.message - not exists because of blob content
            //     })
            //     .finally(() => {
            //         // console.log('finish');
            //     });

            societyReportService.parkingRegisterReportExcel(model).then((response) => {
                // let result = globalService.convertJsonToBlobExcel(response.data);
                // let r1= globalService.convertJsonToBlobExcel(response);
                let result = response.data;
                fileDownload(result, "ParkingRegisterReport.xlsx");
            })
        }
    }

    return (
        <>
            <Typography variant="h5" align="center">
                Parking Register Report
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
                                <Grid item xs={12} sm={4}>
                                    <Controls.Select
                                        showEmptyItem={false}
                                        name="SocietyBuildingId"
                                        label="For Building"
                                        required
                                        value={buildings.length > 0 ? values.SocietyBuildingId : ""}
                                        onChange={(e: any) => {
                                            getSocietyBuildingUnitbySocietyBuildingId(e.target.value);
                                            handleInputChange(e);
                                        }}
                                        options={buildings}
                                        error={errors.SocietyBuildingId}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Controls.Select
                                        showEmptyItem={true}
                                        name="SocietyBuildingUnitId"
                                        label="Building Unit"
                                        required
                                        value={buildingUnits.length > 0 ? values.SocietyBuildingUnitId : ""}
                                        onChange={handleInputChange}
                                        options={buildingUnits}
                                        error={errors.SocietyBuildingUnitId}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Controls.Select
                                        showEmptyItem={true}
                                        name="SocietyParkingId"
                                        label="Parking Lot"
                                        required
                                        value={parkings.length > 0 ? values.SocietyParkingId : ""}
                                        onChange={handleInputChange}
                                        options={parkings}
                                        error={errors.SocietyParkingId}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Controls.ReactDatePicker
                                        label="From Date"
                                        min={globalService.convertLocalToUTCDate(new Date(societySubscription?.SubscriptionStart))}
                                        max={globalService.convertLocalToUTCDate(new Date(societySubscription?.PaidTillDate))}
                                        onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'FromDate' } })}
                                        value={values.FromDate}
                                        error={errors.FromDate}
                                    />
                                    {societySubscription && <Typography className='small-text'>From Date & To Date must be between {dayjs(societySubscription.SubscriptionStart).format("DD-MMM-YYYY")} to {dayjs(societySubscription.PaidTillDate).format("DD-MMM-YYYY")}</Typography>}
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Controls.ReactDatePicker
                                        label="To Date"
                                        fullWidth
                                        value={values.ToDate}
                                        onChange={(date: Date) => handleInputChange({ target: { value: globalService.convertLocalToUTCDate(date), name: 'ToDate' } })}
                                        min={values.FromDate}
                                        max={globalService.convertLocalToUTCDate(new Date(societySubscription?.PaidTillDate))}
                                        error={errors.ToDate}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Controls.Select
                                        showEmptyItem={false}
                                        name="Status"
                                        label="Status"
                                        required
                                        value={parkingStatus.length > 0 ? values.Status : ""}
                                        onChange={handleInputChange}
                                        options={parkingStatus}
                                        error={errors.Status}
                                    />

                                </Grid>
                            </Grid>
                        </React.Fragment>
                    </CardContent>
                    <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                        <Stack spacing={2} direction="row">
                            <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}
                            >
                                Submit
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate("/dashboard/" + societyId)}
                            >
                                Back
                            </Button>
                        </Stack>
                    </CardActions>
                </Card>
            </form>
        </>
    )
}

export default ParkingRegisterReportForm