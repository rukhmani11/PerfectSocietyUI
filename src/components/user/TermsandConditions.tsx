import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { config } from '../../utility/Config'
import { appInfoService } from '../../services/AppInfoService';

const TermsandConditions = () => {

  const [termsConditionsHtml, setTermsConditionsHtml] = useState('');

  function getAppInfoHtml() {
    appInfoService.getAllHtml().then((response) => {
      if (response) {
        let result = response.data;
        if (result.isSuccess) {
          setTermsConditionsHtml(result.row?.TermsConditionsHtml);
        }
      }
    });
  };

  useEffect(() => {
    if (!termsConditionsHtml)
      getAppInfoHtml();
  });

  //const pefsoc = <b>{config.project === "sssociety" ? "(SSSociety - Sentient Systems Private Limited)" : "(Perfect Society)"}</b>

  return (
    <>
      <Box>
        <Typography variant="h5" align="center">
          {" "}
          TERMS AND CONDITIONS{" "}
        </Typography>
        <br />
        <div dangerouslySetInnerHTML={{ __html: termsConditionsHtml }} />
        {/* <b>For Software Development and Consulting services</b>
        <br />

        <Typography align="justify" paddingBottom={2}>
          This Service Agreement (“Agreement”) shall apply and govern the Statement of Work(s), project, letter of intent or any other document (“SOW”) executed between {pefsoc} or any of its affiliates [specifically identified in the SOW] (“Consultant/Consultant”) and Customer, for the purpose of providing professional services (“Services”) or deliverables (“Deliverable”) for software development and consulting.
        </Typography>

        <b>Payments:</b>
        <br />
        <Typography align="justify" paddingBottom={2}>
          Payment will be made by Customer within 15 days upon receipt of an invoice. In the event there is a delay in payment for more than 5 days from the due date, the Customer shall be liable to pay an interest of 1.5% per month or maximum permitted by applicable law, whichever is less, on the delayed payments from the due date of payment. Consultant shall be relieved of its obligations under this Agreement in the event of non-payment of the Fees or expenses due and shall retain the rights in the Services for which the amount is outstanding. Consultant will provide the Hardware and Software stated in Annexure – 01, as part of its standard package if required while providing the offshore Services from Consultant’s location(s) in India. Contractor’s relationship with Company is that of an independent contractor, and nothing in this Agreement will be construed to create a joint partnership, joint venture, agency, or employer-employee relationship.
        </Typography>

        <b>Approval Process:</b>
        <br />
        <Typography align="justify" paddingBottom={2}>
          Customer will have seven (7) days following receipt of the Services or Deliverable (“Acceptance Period”), to complete acceptance tests as per acceptance criteria agreed in the SOW (“Acceptance Criteria”). If no notice of non-conformance to Acceptance Criteria is reported during Acceptance Period, Deliverables or Services are deemed accepted by the Customer.
        </Typography>

        <b>Confidentiality:</b>
        <br />
        <Typography align="justify" paddingBottom={2}>
          Confidential information shall mean any information disclosed by one party to the other party, in any form including without limitation documents, business plans, source code, software, technical/ financial/ marketing/ customer/ business information, specifications, analysis, designs, drawings, data, computer programs, any information relating to personnel or Affiliates of a party and include information disclosed by third parties at the direction of a Disclosing Party and marked as confidential within 15 days of such disclosure. Confidential Information shall however, exclude any information which (i) is/ was publicly known or comes into public domain; (ii) is received by the Receiving Party from a third party, without breach of this Agreement; (iii) was already in the possession of Receiving Party, without confidentiality restrictions, at the time of disclosure by the Disclosing Party; (iv) is permitted for disclosure by the Disclosing Party in writing; (v) independently developed by the Receiving Party without use of Confidential Information; (vi) is required to be disclosed by the Receiving Party pursuant to any order or requirement from court, administrative or governmental agency, provided that the Receiving Party shall give the Disclosing Party prompt written notice of such order or requirement and an opportunity to contest or seek an appropriate protective order. The Receiving Party agrees not to use any Confidential Information for any purpose except for conducting business with the Disclosing Party, or otherwise agreed in writing.
        </Typography>

        <b>Intellectual Property Rights:</b>
        <br />
        <Typography align="justify" paddingBottom={2}>
          Customer shall own all right, title and interest in and to the Deliverables. The rights, title and interest in and to the Deliverables shall be granted to the Customer only upon receipt of full payment by the Consultant. To the extent that the Deliverables incorporates Consultant pre-existing intellectual property (“Consultant Pre-existing IP”), and such Consultant Pre-Existing IP are necessarily required for the proper functioning of the Deliverables Consultant grants to Customer a perpetual, non-exclusive, worldwide, transferable, royalty-free license to use such Consultant Pre-Existing IP solely along with the Deliverables. Source Code handover is based on Agreement agreed between {pefsoc} and Customer.
        </Typography>

        <b>Warranties:</b>
        <br />
        <Typography align="justify" paddingBottom={2}>
          Except as expressly stated in this Agreement, the parties disclaim all warranties of any kind, implied, statutory, or in any communication between them, including without limitation, the implied warranties of merchantability, non-infringement, title, and fitness for a particular purpose.
        </Typography>

        <b>Limitation of Liability:</b>
        <br />
        <Typography align="justify" paddingBottom={2}>
          The total liability of the parties under this Agreement (whether in contract, tort (including negligence)) shall not exceed the fees paid to Consultant hereunder. The parties disclaim any indirect, special, consequential or incidental damages or loss of revenue or business profits, however caused, even if advised of the possibility of such damages. The foregoing limitations of liability will apply notwithstanding the failure of essential purpose of any limited remedy herein.
        </Typography>

        <b>Termination:</b>
        <br />
        <Typography align="justify" paddingBottom={2}>
          Either party may terminate the Agreement upon sixty (60) days’ notice to the other party. Either party may terminate this Agreement immediately if the other party breaches the terms of this Agreement and the breach remain uncured for 30 days from the date of receipt of notice. In case of termination, the Consultant shall be paid for the Services provided on a pro-rata basis.
        </Typography>

        <b>Annexure-01:</b>
        <br />
        <Typography align="justify" paddingBottom={2}>
          Standard Hardware and Software for Development and Testing Consultant will provide the following Hardware and Software as part of its standard package if required for offshore services. In case any Hardware / Software are required in addition to this the same shall be paid by Customer.
        </Typography>

        <b>Important:</b>
        <br />
        <Typography align="justify" paddingBottom={2}>
          <b>We just do development of Software. We are not liable / responsible if client transacts any monetory transactions with their customers.</b>
        </Typography> */}
      </Box>
    </>
  )
}

export default TermsandConditions