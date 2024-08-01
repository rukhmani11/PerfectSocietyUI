import { useNavigate } from "react-router-dom";
import {

    Button,
    Card,
    CardContent,
    Container,
    Typography,
} from "@mui/material";
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { Box } from "@mui/joy";

const PageNotFound = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <>
            <Typography variant="h5" align="center">
                Page Not Found
            </Typography>
            <Container>
                <Card>
                    <CardContent>
                        <Typography align="center">
                            OOps!! Page Not Found
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
            </Container>
        </>
    )
}

export default PageNotFound

