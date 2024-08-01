import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from 'react'
import { config } from "../../utility/Config";
import { appInfoService } from "../../services/AppInfoService";

const PrivacyPolicy = () => {
    // const domain = <b>{config.project === "sssociety" ? "sssociety.sentientsystems.net" : "perfectsociety.co.in"}</b>
    // const pefsoc = <b>{config.project === "sssociety" ? "(SSSociety - Sentient Systems Private Limited)" : "(Perfect Society)"}</b>

    const [privacyPolicyHtml, setPrivacyPolicyHtml] = useState('');

    function getAppInfoHtml() {
        appInfoService.getAllHtml().then((response) => {
            if (response) {
                let result = response.data;
                if (result.isSuccess) {
                    setPrivacyPolicyHtml(result.row?.PrivacyPolicyHtml);
                }
            }
        });
    };

    useEffect(() => {
        if (!privacyPolicyHtml)
           getAppInfoHtml();
    });

    return (
        // <>
        //     <Box>
        //         <Typography variant="h5" align="center">
        //             {" "}
        //             PRIVACY POLICY{" "}
        //         </Typography>
        //         <br />
        //         <Typography align="justify" paddingBottom={2}>
        //             This statement discloses the privacy policy of the {domain} {pefsoc}. By submitting your information and using our website, you consent to the collection, storage and processing of your personal information by us in the manner set out in the policy. {domain} {pefsoc} reserves the right to change the policy at any time by posting any changes here. Your continued use of the website after a change is made constitutes acceptance of the policy as modified.
        //         </Typography>

        //         <Typography align="justify" paddingBottom={2}>
        //             {domain} {pefsoc} does not collect any personally identifiable information about you unless you voluntarily submit it to us or submit it to us as part of the process of purchasing publications from our e-commerce site. {domain} {pefsoc} is the sole owner of the information collected on this site. We will not pass this information to others except as disclosed in our privacy policy.
        //         </Typography>

        //         <Typography align="justify" paddingBottom={2}>
        //             {domain} {pefsoc} assumes no responsibility for the data-collection and data-use practices of third parties that process online, debit/credit-card transactions.
        //         </Typography>

        //         <b>Cookies</b>
        //         <br />
        //         <Typography align="justify" paddingBottom={2}>
        //             {domain} {pefsoc} website uses cookies. A cookie is a piece of data stored on the user's hard drive containing information about the user. Usage of a cookie is in no way linked to any personally identifiable information. Cookies are only used to obtain non-personal information to improve the online experience. No other information is stored in these cookies. You can set your browser to notify you when you receive a cookie and delete any cookies you receive.
        //         </Typography>


        //         <b>Log files</b>
        //         <br />
        //         <Typography align="justify" paddingBottom={2}>
        //             {domain} {pefsoc} uses the IP address from your internet connection to analyses trends, administer the site, track users' movements and gather broad demographic information for aggregate use. IP addresses are not linked to any personally identifiable information.
        //         </Typography>


        //         <b>Links</b>
        //         <br />
        //         <Typography align="justify" paddingBottom={2}>
        //             {domain} {pefsoc} website contains links to other sites. We are not responsible for the privacy practices of other sites.
        //         </Typography>
        //     </Box>
        // </>

        <>
            <Box>
                <Typography variant="h5" align="center">
                    {" "}
                    PRIVACY POLICY{" "}
                </Typography>
                <br />
                <div dangerouslySetInnerHTML={{ __html: privacyPolicyHtml }} />
            </Box>
        </>
    )
}

export default PrivacyPolicy