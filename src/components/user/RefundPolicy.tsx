import React from 'react'
import { Box, Typography } from '@mui/material'

const RefundPolicy = () => {
    return (
        <>
            <Box>
                <Typography variant="h5" align="center">
                    {" "}
                    REFUND / CANCELLATION POLICY{" "}
                </Typography>
                <br />
                <Typography align="justify" paddingBottom={2}>
                    <b>No Refund.</b>
                   
                   <br/>
                    <b>No Cancellation.</b>
                </Typography>

                <Typography align="justify" paddingBottom={2}>
                    <b>We just do development of Software. We are not liable / responsible if client transacts any monetory transactions with their customers.</b>
                </Typography>

            </Box>
        </>
    )
}

export default RefundPolicy