

import React, { FC, ReactElement } from "react";
import { Box, Container, Grid, Link, Typography } from "@mui/material";

export const Footer: FC = (): ReactElement => {
  return (
    <Box
      sx={{
        width: "100%",
        //position: "fixed",
        height: "auto",
        //bottom:0,
        backgroundColor: "var(--primary-color)",
        paddingTop: "0.5rem",
        paddingBottom: "0.6rem",
       // textAlign: "center",
      }}
    >
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="Left">
          <Grid item xs={12}>
            {/* <Typography color="black" variant="h5">
              React Starter App
            </Typography> */}
          </Grid>
          <Grid item xs={12}   >
            <Typography color="#e6e6fa" variant="subtitle1">
              2023 © All Rights Reserved | Designed and Developed by
              <Link
                color="#00ff00"
                variant="subtitle1"
                underline="none"
                href="http://www.sentientsystems.net/"
                target="_blank"
                style={{ textAlign: 'right', marginRight: '50px' }}

              >
                {" "}
                Sentient Systems Pvt Ltd.
              </Link>
              <Link
                color="#00ff00"
                variant="subtitle1"
                underline="none"
                href="/privacyPolicy"
                target="_blank"
              >
                {" "}
                Privacy Policy |
              </Link>
              <Link
                color="#00ff00"
                variant="subtitle1"
                underline="none"
                href="/refundPolicy"
                target="_blank"
              >
                {" "}

                Refund / Cancellation Policy |
              </Link>
              <Link
                color="#00ff00"
                variant="subtitle1"
                underline="none"
                href="/termsandConditions"
                target="_blank"
                textAlign={"right"}
              >
                {" "}
                Terms and Conditions.
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
////////////////////Below By Sujashree///////////////////////
// import * as React from "react";
// import { Link, Box, Container, Typography } from "@mui/material";

// function Copyright() {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center" >
//       {'Copyright © '}
//       <Link color="inherit" href="https://google.com/">
//         Perfect Society
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//       <br />
//       Created By <Link color="inherit" href="http://www.sentientsystems.net/">Sentient Systems</Link>
//     </Typography>
//   );
// }

// interface FooterProps {
//   description: string;
//   title: string;
// }

// export default function Footer(props: FooterProps) {
//   const { description, title } = props;

//   return (
//     <Box component="footer" sx={{ bgcolor: "background.paper", py: 6 }}>
//       <Container maxWidth="lg">
//         <Typography variant="h6" align="center" gutterBottom>
//           {/* {props.title} */}
//           {title}
//         </Typography>
//         <Typography
//           variant="subtitle1"
//           align="center"
//           color="text.secondary"
//           component="p"
//         >
//           {/* {props.description} */}
//           {description}
//         </Typography>
//         <Copyright />
//       </Container>
//     </Box>
//   );
// }
