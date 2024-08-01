import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom"

const SocietyView = () => {

    const { societySubscriptionId } = useParams();
    return (
        <>
            <Typography variant="h5">
                Society
            </Typography>

            <Card>
                <CardContent>
                    <React.Fragment>
                        {/* <Typography variant="h6" gutterBottom>
                  Shipping address
                </Typography> */}
                        <Grid container spacing={3}>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Price</Typography>
                                <Typography variant="body2">$123</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Typography className="label">Price</Typography>
                                <Typography variant="body2">$123</Typography>
                            </Grid>
                            
                        </Grid>
                    </React.Fragment>
                </CardContent>
            </Card>
        </>
    )
}

export default SocietyView