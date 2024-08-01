import React, { useContext, useEffect, useState } from "react";
import {Grid,CardActions,Card,CardContent, Button,Typography,Stack,CardHeader,} from "@mui/material";
import { societiesService } from "../../services/SocietiesService";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { statesService } from "../../services/StatesService";
import { SelectListModel } from "../../models/ApiResponse";
import { SocietiesModel } from "../../models/SocietiesModel";
import dayjs, { Dayjs } from "dayjs";
import { AuthContext } from "../../utility/context/AuthContext";
import { ROLES } from "../../utility/Config";
import { countriesService } from "../../services/CountriesService";

const SocietiesListView = (...props: any) => {
  const { auth } = useContext(AuthContext);
  globalService.pageTitle = "Societies";
  const { societyId } = useParams();
  const [title, setTitle] = useState<any>({});
  // const [states, setStates] = useState<SelectListModel[]>([]);
  // const [countries, setCountries] = useState<SelectListModel[]>([]);
  const [societies, setSocieties] =
    useState<any>(
      societiesService.initialFieldValues
    );
  let navigate = useNavigate();
  // const getCountries = () => {
  //   countriesService.getSelectList().then((response) => {
  //     setCountries(response.data);
  //   });
  // };

  // const getStates = () => {
  //   statesService.getSelectList().then((response: any) => {
  //     setStates(response.data);
  //   });
  // };
  useEffect(() => {
    if (societyId) {
      getSocieties(societyId);
    }
  }, [societyId]);

  const getSocieties = (SocietyId: any) => {
    societiesService
      .getById(SocietyId)
      .then((response) => {
        if (response) {
          let result = response.data;
          setSocieties(result.data);
        }
      });
  };
  return (
    <>
    <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5">Society Details</Typography>
        {/* <Typography variant="body1"><b>Society : </b>{title.societies} </Typography> */}
      </Stack>
      <Card>
        <CardHeader title="Society Details" />
        <CardContent>
          <React.Fragment>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Society</Typography>
                <Typography variant="body2">{societies.Society}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Abbreviation</Typography>
                <Typography variant="body2">{societies.Abbreviation}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Registration no</Typography>
                <Typography variant="body2">{societies.RegistrationNo}</Typography>
              </Grid>

              {societies.RegistrationDate != null &&(
                <Grid item xs={6} sm={3}>
                <Typography className="label">Registration Date</Typography>
                <Typography variant="body2">{dayjs(societies.RegistrationDate).format('DD-MMM-YYYY')}</Typography>
              </Grid>
                )}
              {societies.RegistrationDate == null &&(
                <Grid item xs={6} sm={3}>
                <Typography className="label">Registration Date</Typography>
                <Typography variant="body2">{(societies.RegistrationDate)}</Typography>
              </Grid>
                )}

              <Grid item xs={6} sm={3}>
                <Typography className="label">Address</Typography>
                <Typography variant="body2">{societies.Address}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Country code</Typography>
                <Typography variant="body2">{societies.CountryCode}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">City</Typography>
                <Typography variant="body2">{societies.City}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Pin</Typography>
                <Typography variant="body2">{societies.Pin}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Contact person</Typography>
                <Typography variant="body2">{societies.ContactPerson}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Phone</Typography>
                <Typography variant="body2">{societies.Phone}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Mobile</Typography>
                <Typography variant="body2">{societies.Mobile}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Builder</Typography>
                <Typography variant="body2">{societies.Builder}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Architect</Typography>
                <Typography variant="body2">{societies.Architect}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Signatory</Typography>
                <Typography variant="body2">{societies.Signatory}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Pan</Typography>
                <Typography variant="body2">{societies.Pan}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Tan</Typography>
                <Typography variant="body2">{societies.Tan}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Tax registration no</Typography>
                <Typography variant="body2">{societies.TaxRegistrationNo}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Capital</Typography>
                <Typography variant="body2">{societies.Capital}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Email id</Typography>
                <Typography variant="body2">{societies.EmailId}</Typography>
              </Grid>
              {/* <Grid item xs={6} sm={3}>
                <Typography className="label">Sms</Typography>
                <Typography variant="body2">{societies.Sms}</Typography>
              </Grid> */}
              {/* <Grid item xs={6} sm={3}>
                <Typography className="label">Show particulars in receipt</Typography>
                <Typography variant="body2">{societies.ShowParticularsInReceipt}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Enable SMS</Typography>
                <Typography variant="body2">{societies.EnableSms}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Enable Email</Typography>
                <Typography variant="body2">{societies.EnableEmail}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography className="label">Enable Payment Gateway</Typography>
                <Typography variant="body2">{societies.EnablePaymentGateway}</Typography>
              </Grid> */}
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

export default SocietiesListView;
