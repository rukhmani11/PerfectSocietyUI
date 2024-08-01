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
import { societyReceiptsService } from "../../../services/SocietyReceiptsService";
import { SocietyReceiptsModel } from "../../../models/SocietyReceiptsModel";
import { useNavigate, useParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { globalService } from "../../../services/GlobalService";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";

const SocietyBuildingUnitForm = (...props: any) => {
  const { societyReceiptId }: any = useParams();
  const [societyReceipt, setsocietyReceipt] = useState<any>(societyReceiptsService.initialFieldValues);
  let navigate = useNavigate();
  const { goToHome } = useSharedNavigation();

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (societyReceiptId) {
      getSocietyBuildingUnit(societyReceiptId);
    }
  }, [societyReceiptId]);



  const getSocietyBuildingUnit = (SocietyReceiptId: any) => {
    societyReceiptsService
      .getById(SocietyReceiptId)
      .then((response) => {
        if (response) {

          let result = response.data;
          setsocietyReceipt(result.data);
        }
      });
  };

  return (
    <>
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5">Society Receipt Details</Typography>
      </Stack>
      <Card>
        <CardContent>
          <React.Fragment>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Typography className="label">ReceiptNo</Typography>
                <Typography variant="body2">
                  {societyReceipt.ReceiptNo}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Receipt Date</Typography>
                <Typography variant="body2">
                  {dayjs(societyReceipt.ReceiptDate).format("DD-MMM-YYYY")}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Building Unit</Typography>
                <Typography variant="body2">
                  {societyReceipt.SocietyBuildingUnit?.Unit}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Member </Typography>
                <Typography variant="body2">
                  {societyReceipt.SocietyMember?.Member}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">BillAbbreviation</Typography>
                <Typography variant="body2">
                  {societyReceipt.BillAbbreviation}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Particulars</Typography>
                <Typography variant="body2">
                  {societyReceipt.Particulars}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Amount </Typography>
                <Typography variant="body2">
                  {societyReceipt.Amount}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Principal Adjusted </Typography>
                <Typography variant="body2">
                  {societyReceipt.PrincipalAdjusted}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">NonChg Adjusted </Typography>
                <Typography variant="body2">
                  {societyReceipt.NonChgAdjusted}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Interest Adjusted </Typography>
                <Typography variant="body2">
                  {societyReceipt.InterestAdjusted}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">TaxAdjusted </Typography>
                <Typography variant="body2">
                  {societyReceipt.TaxAdjusted}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Advance </Typography>
                <Typography variant="body2">
                  {societyReceipt.Advance}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Pay Mode </Typography>
                <Typography variant="body2">
                  {societyReceipt.SocietyPayModes?.PayMode}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">PayRefNo </Typography>
                <Typography variant="body2">
                  {societyReceipt.PayRefNo}
                </Typography>
              </Grid>
              {societyReceipt.PayRefDate != null && (
                <Grid item xs={6} sm={3}>
                  <Typography className="label">PayRef Date </Typography>
                  <Typography variant="body2">
                    {dayjs(societyReceipt.PayRefDate).format("DD-MMM-YYYY")}
                  </Typography>
                </Grid>
              )}
              {societyReceipt.PayRefDate == null && (
                <Grid item xs={6} sm={3}>
                  <Typography className="label">PayRef Date </Typography>
                  <Typography variant="body2">
                    {(societyReceipt.PayRefDate)}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={6} sm={3}>
                <Typography className="label">Bank </Typography>
                <Typography variant="body2">
                  {societyReceipt.Bank?.Bank}
                </Typography>
              </Grid>
              {/* <Grid item xs={6} sm={3}>
                  <Typography className="label">Bank Name </Typography>
                  <Typography variant="body2">
                    {societyReceipt.BankName}
                  </Typography>
                </Grid> */}
              <Grid item xs={6} sm={3}>
                <Typography className="label">Branch </Typography>
                <Typography variant="body2">
                  {societyReceipt.Branch}
                </Typography>
              </Grid>
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
