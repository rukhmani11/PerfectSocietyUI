import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { Textarea } from "@mui/joy";
import IconButton from "@mui/material/IconButton";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import { config } from "../../utility/Config";

export default function ContactForm() {
  return (
    <React.Fragment>
      <div style={{ paddingTop: 20 }}></div>
      <> 
      
        <Box sx={{ bgcolor: "#e8f0f5", p: 5 }}>
          <Container>
            {/* <Box sx={{ bgcolor: '#cfe8fc', height: '40vh' }} /> */}
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  Contact Details
                </Typography>

                <Typography variant="body1" gutterBottom>
                  <IconButton
                    aria-label=" AddLocationAltOutlinedIcon"
                    sx={{ color: "#002db3" }}
                  >
                    <AddLocationAltOutlinedIcon />
                  </IconButton>{" "}
                  Mumbai
                </Typography>

                <Typography variant="body1" gutterBottom>
                  <IconButton
                    aria-label=" PhoneOutlined"
                    sx={{ color: "#002db3" }}
                  >
                    <PhoneOutlinedIcon />
                  </IconButton>{" "}
                  {localStorage.getItem('HomePageMobile')}
                </Typography>

                <Typography variant="body1" gutterBottom>
                  <IconButton
                    aria-label=" EmailOutlined"
                    sx={{ color: "#002db3" }}
                  >
                    <EmailOutlinedIcon />
                  </IconButton>{" "}
                 {localStorage.getItem('HomePageEmail')}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Box
                  sx={{
                    maxWidth: "100%",

                    // display: 'flex',
                    //alignItems: 'left',
                    "& > :not(style)": { m: 1 },
                  }}
                >
                  {/* <Typography variant="h6" gutterBottom>
      Contact Details
    </Typography> */}

                  <TextField label="Name" color="secondary" />

                  <TextField label="Email" color="secondary" />

                  <TextField label="Phone" color="secondary" />

                  <TextField
                    color="secondary"
                    fullWidth
                    multiline
                    rows="5"
                    label="Message"
                  />

                  <Button variant="contained" size="small">
                    Send Message
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
          
      </>
    </React.Fragment>
  );
}
