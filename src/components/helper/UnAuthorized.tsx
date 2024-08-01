import { useNavigate } from "react-router-dom";
import {

    Button,
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { Box } from "@mui/joy";

const UnAuthorized = () => {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    return (
        <>
            <Typography variant="h5" align="center">
                UnAuthorized
            </Typography>
            <Card>
                <CardContent>
                    <Typography align="center">
                        You do not have access to the requested page.
                    </Typography>
                    <Box alignContent="center" textAlign="center" marginTop={3}>
                        <Button
                            variant="outlined"
                            startIcon={<SkipPreviousIcon />}
                            onClick={goBack}
                        >
                            Go Back
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </>
    )
}

export default UnAuthorized
