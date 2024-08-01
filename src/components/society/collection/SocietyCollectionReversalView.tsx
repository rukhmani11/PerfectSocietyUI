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
import { SocietyCollectionReversalsService } from "../../../services/SocietyCollectionReversalsService";
//import { SocietyReceiptsModel } from "../../../models/SocietyReceiptsModel";
import { useNavigate, useParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { globalService } from "../../../services/GlobalService";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";
import { Messages } from "../../../utility/Config";
const SocietyCollectionReversalForm = (...props: any) => {
  const { societyCollectionReversalId }: any = useParams();
  const [societyCollectionReversal, setsocietyCollectionReversal] =
    useState<any>(
      SocietyCollectionReversalsService.initialFieldValues
    );
  let navigate = useNavigate();
  const { goToHome } = useSharedNavigation();

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (societyCollectionReversalId) {
      getsocietyCollectionReversal(societyCollectionReversalId);
    }
  }, [societyCollectionReversalId]);



  const getsocietyCollectionReversal = (societyCollectionReversalId: any) => {

    SocietyCollectionReversalsService
      .getById(societyCollectionReversalId)
      .then((response) => {
        if (response) {
          
          let result = response.data;
          setsocietyCollectionReversal(result.data);
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
                <Typography className="label">DocNo</Typography>
                <Typography variant="body2">{societyCollectionReversal.DocNo}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">BillAbbreviation</Typography>
                <Typography variant="body2">{societyCollectionReversal.BillAbbreviation}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Building Unit</Typography>
                <Typography variant="body2">{societyCollectionReversal.SocietyBuildingUnit?.Unit}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label"> Society Member </Typography>
                <Typography variant="body2">{societyCollectionReversal.SocietyMember?.Member}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">ReversalDate</Typography>
                <Typography variant="body2">{societyCollectionReversal.ReversalDate?dayjs(societyCollectionReversal.ReversalDate).format('DD-MMM-YYYY'):''}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Collection Receipt</Typography>
                <Typography variant="body2"><b>Receipt No :</b> {societyCollectionReversal.SocietyReceipt?.ReceiptNo}<br /><b>Date : </b>{dayjs(societyCollectionReversal.SocietyReceipt?.ReceiptDate).format('DD-MMM-YYYY')} <br /><b>Amount : </b> {societyCollectionReversal.SocietyReceipt?.Amount}  </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Particulars </Typography>
                <Typography variant="body2">{societyCollectionReversal.Particulars}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Principal Adjusted </Typography>
                <Typography variant="body2">{societyCollectionReversal.PrincipalAdjusted}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">NonChg Adjusted </Typography>
                <Typography variant="body2">{societyCollectionReversal.NonChgAdjusted}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Interest Adjusted </Typography>
                <Typography variant="body2">{societyCollectionReversal.InterestAdjusted}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">TaxAdjusted </Typography>
                <Typography variant="body2">{societyCollectionReversal.TaxAdjusted}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Advance </Typography>
                <Typography variant="body2">{societyCollectionReversal.Advance}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Pay Mode </Typography>
                <Typography variant="body2">{societyCollectionReversal.SocietyPayModes?.PayMode}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">PayRefNo </Typography>
                <Typography variant="body2">{societyCollectionReversal.PayRefNo}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">PayRef Date  </Typography>
                <Typography variant="body2">{societyCollectionReversal.PayRefDate ? dayjs(societyCollectionReversal.PayRefDate).format('DD-MMM-YYYY') : ""}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Bank  </Typography>
                <Typography variant="body2">{societyCollectionReversal.Bank?.Bank}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Branch </Typography>
                <Typography variant="body2">{societyCollectionReversal.Branch}</Typography>
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

export default SocietyCollectionReversalForm;
