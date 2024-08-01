import { Box, Container, CssBaseline, Toolbar, Typography } from "@mui/material";
import Carousel from "nuka-carousel";
import React, { useEffect, useState } from "react";
import ContactForm from "./ContactForm";
import { config } from "../../utility/Config";
import { appInfoService } from "../../services/AppInfoService";
import { AuthContext } from "../../utility/context/AuthContext";
import { societiesService } from "../../services/SocietiesService";

const Index = () => {
  const [indexHtml, setIndexHtml] = useState('');
  const { auth, setAuth } = React.useContext(AuthContext);
 
  function getAppInfoHtml() {
    appInfoService.getAllHtml().then((response) => {
      if (response) {
        let result = response.data;
        if (result.isSuccess) {
          setIndexHtml(result.row?.HomePageHtml);
          localStorage.setItem('HomePageEmail', result.row.Email ?? '');
          localStorage.setItem('HomePageMobile', result.row.Mobile ?? '');
        }
      }
    });
  };

  useEffect(() => {
    console.log('Index Page called 1');
    societiesService.clearStorageForIndex();
    setAuth(null);

    if (!indexHtml)
      getAppInfoHtml();
  },[]);

  return (

    <>
      {/* <Marquee>
        Professional CLEANING SERVICES (Office/Home/Garden) 25% OFF 1St Services
        - Call : 9999999999
      </Marquee> */}
      <Carousel>
        <img src="images/banner.png" width="100%" />
      </Carousel>
      <React.Fragment>
        <CssBaseline />
        {/* <img src="banner.png" alt=""  width="100%"/> */}
        <Container>
          <Box>
            {/* <Toolbar /> */}
            {/* {config.project === 'sssociety' && (
              <>
                <Typography variant="h5" align="center">
                  {" "}
                  About Us{" "}
                </Typography>
                <br />
                <Typography align="justify" paddingBottom={2}>
                  We, at <b>{config.project === 'sssociety' && 'SS Society'}
                    {config.project !== 'sssociety' && 'Perfect Society'}
                  </b> relentlessly work towards
                  bringing the residential societies and commercial complexes on
                  an online platform. Founded in 2023, Perfect Society was the
                  pioneer in enabling this solution across Pune and later spread
                  its operations to other parts of the country.
                </Typography>

                <Typography align="justify" paddingBottom={2}>
                  Living in a residential society, it is inevitable for
                  residents to get entangled in complex issues. At SocietyRun,
                  we completely understand what it takes to run a housing
                  society seamlessly, thereby making it a hassle-free and easy
                  experience for the residents.
                </Typography>

                <Typography align="justify" paddingBottom={2}>
                  Over the years, we have emerged as a trusted partner by a
                  large number of housing and commercial spaces, in terms of
                  providing automated simplified solutions, thereby delighting
                  many societies. Our motto is to help the inhabitants run their
                  housing and commercial societies easily and accurately.
                </Typography>
              </>
            )} */}
            {/* {config.project !== 'sssociety' && (
              <>
                <Typography align="justify" paddingBottom={2}>
                  <b style={{ fontSize: '20px' }}>Welcome to Perfect Society: Simplifying Housing Society Financial Management</b>
                </Typography>
                <Typography align="justify" paddingBottom={2}>
                  At Perfect Society, we understand the unique challenges faced by housing societies in managing their finances, billing, and member interactions. Introducing the <b>Perfect Society App</b>, a revolutionary solution designed to streamline accounting, billing, and payments, providing your community with a powerful and user-friendly tool for efficient financial management.
                </Typography>
                <Typography align="justify" paddingBottom={2}>
                  <b style={{ fontSize: '20px' }}>Key Features:</b>
                </Typography>
                1. <b>Automated Accounting:</b>
                <Typography align="justify" paddingBottom={2}>
                  Say goodbye to complex spreadsheets and manual bookkeeping. Our automated accounting module ensures accurate and transparent financial tracking.
                </Typography>
                2. <b>Effortless Billing and Invoicing:</b>
                <Typography align="justify" paddingBottom={2}>
                  Generate bills and invoices effortlessly, saving time and minimizing errors. The Perfect Society App automates the billing process, allowing you to focus on what matters most.
                </Typography>
                3. <b>Integrated Payment Gateway:</b>
                <Typography align="justify" paddingBottom={2}>
                  Experience secure and convenient payment transactions within the app. Our integrated payment gateway supports various payment methods, providing flexibility for your community members.
                </Typography>
                4. <b>Member Management:</b>
                <Typography align="justify" paddingBottom={2}>
                  Maintain detailed member profiles with updated contact information and easily track unit allocations for precise billing.
                </Typography>
                5. <b>Maintenance Fee Calculation:</b>
                <Typography align="justify" paddingBottom={2}>
                  Customize maintenance fee calculations based on your society's specific criteria, ensuring fair and transparent fee structures.
                </Typography>
                6. <b>Robust Reporting and Analytics:</b>
                <Typography align="justify" paddingBottom={2}>
                  Access real-time financial reports and generate custom reports to make informed decisions and track the financial health of your housing society.
                </Typography>
                7. <b>Communication Tools:</b>
                <Typography align="justify" paddingBottom={2}>
                  Foster community engagement with built-in communication features. Send announcements, notices, and messages directly through the app.
                </Typography>
                8. <b>Document Management:</b>
                <Typography align="justify" paddingBottom={2}>
                  Securely store and manage important documents such as bylaws and meeting minutes. Define access levels for enhanced security.                        </Typography>

                <b style={{ fontSize: '20px' }}>Why Choose Perfect Society App?</b>
                <ul>
                  <li> <b>Tailored for Housing Societies:</b> Our app is specifically designed to meet the unique needs of housing societies, ensuring a seamless fit with your community's requirements.</li>
                  <li> <b>User-Friendly Interface:</b> Enjoy a simple and intuitive platform accessible to all members, promoting ease of use and adoption.</li>
                  <li> <b>Secure Payment Transactions:</b> Prioritize the security of financial transactions with our integrated payment gateway.</li>
                </ul>

                <Typography align="justify" paddingBottom={2}>
                  <b style={{ fontSize: '20px' }}>Get Started Today!</b>
                </Typography>
                <Typography align="justify" paddingBottom={2}>
                  Ready to elevate your housing society's financial management experience? Sign up for the Perfect Society App today and discover a new era of efficiency, transparency, and community collaboration
                </Typography>

                <Typography align="justify" paddingBottom={2}>
                  <b style={{ fontSize: '20px' }}>Contact Us for Inquiries and Demonstrations</b>
                </Typography>
                <Typography align="justify" paddingBottom={2}>
                  Have questions or need assistance? Contact our team at [Your Contact Information] for inquiries, demonstrations, and personalized support.
                </Typography>
                <Typography align="justify" paddingBottom={2}>
                  Simplify. Optimize. Perfect Society App.
                </Typography>
                <Typography align="justify" paddingBottom={2}>
                  [Sign Up Now] [Learn More] [Contact Us]
                </Typography>
              </>
            )} */}
            <div dangerouslySetInnerHTML={{ __html: indexHtml }} />
          </Box>
        </Container>
        <br />
        <br />
      </React.Fragment>
      <ContactForm />
    </>
  );
}

export default Index;