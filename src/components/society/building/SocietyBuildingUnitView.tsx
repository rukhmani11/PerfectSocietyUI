import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  CardHeader,
  Button,
  CardActions,
} from "@mui/material";
import { SocietyBuildingUnitsModel } from "../../../models/SocietyBuildingUnitsModel";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../../services/GlobalService";

import { societyBuildingUnitsService } from "../../../services/SocietyBuildingUnitsService";
import dayjs, { Dayjs } from "dayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SocietyBuildingTitleModel } from "../../../models/SocietyBuildingsModel";
import { societyBuildingsService } from "../../../services/SocietyBuildingsService";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";
const SocietyBuildingUnitForm = (...props: any) => {
  const { societyBuildingId, societyBuildingUnitId }: any = useParams();
  const [title, setTitle] = useState<any>({});
  const [societyBuildingUnit, setSocietyBuildingUnit] =
    useState<any>(
      societyBuildingUnitsService.initialFieldValues
    );
  let navigate = useNavigate();
  const { goToHome } = useSharedNavigation();

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (societyBuildingUnitId) {
      getSocietyBuildingUnit(societyBuildingUnitId);
    }
    if (Object.keys(title).length === 0)
      getBuildingTitle();

  }, [societyBuildingUnitId]);

  const getBuildingTitle = () => {
    let model: SocietyBuildingTitleModel = {
      SocietyBuildingUnitId: "",
      SocietyBuildingId: societyBuildingId
    }
    societyBuildingsService
      .getPageTitle(model)
      .then((response) => {
        setTitle(response.data);
      });
  };

  const getSocietyBuildingUnit = (SocietyBuildingUnitId: any) => {
    societyBuildingUnitsService
      .getById(SocietyBuildingUnitId)
      .then((response) => {
        if (response) {

          let result = response.data;
          setSocietyBuildingUnit(result.data);
        }
      });
  };

  return (
    <>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5">Society Building Unit</Typography>
        <Typography variant="body1"><b>Building : </b>{title.Building} </Typography>
      </Stack>
      <Card>
        <CardHeader title="Building Unit" />
        <CardContent>
          <React.Fragment>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Unit</Typography>
                <Typography variant="body2">{societyBuildingUnit.Unit}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">UnitType</Typography>
                {/* <Typography variant="body2">{societyBuildingUnit.UnitType?.UnitType}</Typography> */}
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Floor No</Typography>
                <Typography variant="body2">{societyBuildingUnit.FloorNo}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Wing</Typography>
                <Typography variant="body2">{societyBuildingUnit.Wing}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Carpet Area</Typography>
                <Typography variant="body2">{societyBuildingUnit.CarpetArea}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Chargeable Area</Typography>
                <Typography variant="body2">{societyBuildingUnit.ChargeableArea}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Terrace Area</Typography>
                <Typography variant="body2">{societyBuildingUnit.TerraceArea}</Typography>
              </Grid>
              {societyBuildingUnit.StartDate != null && (
                <Grid item xs={6} sm={3}>
                  <Typography className="label">Start Date </Typography>
                  <Typography variant="body2">
                    {dayjs(societyBuildingUnit.StartDate).format("DD-MMM-YYYY")}
                  </Typography>
                </Grid>
              )}
              {societyBuildingUnit.StartDate == null && (
                <Grid item xs={6} sm={3}>
                  <Typography className="label">Start Date </Typography>
                  <Typography variant="body2">
                    {(societyBuildingUnit.StartDate)}
                  </Typography>
                </Grid>
              )}
              {societyBuildingUnit.EndDate != null && (
                <Grid item xs={6} sm={3}>
                  <Typography className="label">End Date </Typography>
                  <Typography variant="body2">
                    {dayjs(societyBuildingUnit.EndDate).format("DD-MMM-YYYY")}
                  </Typography>
                </Grid>
              )}
              {societyBuildingUnit.EndDate == null && (
                <Grid item xs={6} sm={3}>
                  <Typography className="label">End Date </Typography>
                  <Typography variant="body2">
                    {(societyBuildingUnit.EndDate)}
                  </Typography>
                </Grid>
              )}


            </Grid>
          </React.Fragment>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Share Certificate Details" />
        <CardContent>
          <React.Fragment>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Typography fontWeight={500}>Certificate No</Typography>
                <Typography>{societyBuildingUnit.CertificateNo}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">No Of Shares</Typography>
                <Typography variant="body2">{societyBuildingUnit.NoOfShares}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Distinctive From</Typography>
                <Typography variant="body2">{societyBuildingUnit.DistinctiveFrom}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Distinctive To</Typography>
                <Typography variant="body2">{societyBuildingUnit.DistinctiveTo}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Value</Typography>
                <Typography variant="body2">{societyBuildingUnit.Value}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Amount At Allotment</Typography>
                <Typography variant="body2">{societyBuildingUnit.AmountAtAllotment}</Typography>
              </Grid>
              {/* <Grid item xs={6} sm={3}>
                <Typography className="label">Pay Date</Typography>
                <Typography variant="body2">{dayjs(societyBuildingUnit.PayDate).format('DD-MMM-YYYY')}</Typography>
              </Grid> */}
              {societyBuildingUnit.PayDate != null && (
                <Grid item xs={6} sm={3}>
                  <Typography className="label">Pay Date </Typography>
                  <Typography variant="body2">
                    {dayjs(societyBuildingUnit.PayDate).format("DD-MMM-YYYY")}
                  </Typography>
                </Grid>
              )}
              {societyBuildingUnit.PayDate == null && (
                <Grid item xs={6} sm={3}>
                  <Typography className="label">Pay Date </Typography>
                  <Typography variant="body2">
                    {(societyBuildingUnit.PayDate)}
                  </Typography>
                </Grid>
              )}


              {societyBuildingUnit.IssueDate != null && (
                <Grid item xs={6} sm={3}>
                  <Typography className="label">Issue Date </Typography>
                  <Typography variant="body2">
                    {dayjs(societyBuildingUnit.IssueDate).format("DD-MMM-YYYY")}
                  </Typography>
                </Grid>
              )}
              {societyBuildingUnit.IssueDate == null && (
                <Grid item xs={6} sm={3}>
                  <Typography className="label">Issue Date </Typography>
                  <Typography variant="body2">
                    {(societyBuildingUnit.IssueDate)}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </React.Fragment>
        </CardContent>
      </Card>


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

export default SocietyBuildingUnitForm;
