import { Link, Box, Button, Checkbox, createTheme, CssBaseline, FormControlLabel, Grid, Paper, TextField, ThemeProvider, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { userService } from '../../services/UserService';
import { globalService } from '../../services/GlobalService';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utility/context/AuthContext';
import { ROLES, config } from '../../utility/Config';

const Login: React.FC = () => {
  //const { auth, setAuth } = useAuth() as AuthContextType;
  const { auth, setAuth } = useContext(AuthContext)
  //const { isAuth, setAuth1 } = useContext(LoginContext)
  //const theme = createTheme();

  useEffect(() => {
    if (auth?.Token) {
      localStorage.clear();
      setAuth(null);
    }
  });

  const initialFieldValues = {
    UserName: "",
    Password: ""
  }

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  //const userRef = useRef();
  const [user, setUser] = useState(initialFieldValues);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    userService
      .login(user)
      .then((response) => {
        if (response) {
          let result = response.data;

          if (result?.isSuccess) {

            const accessToken = result?.user?.JwtToken;
            let roles: string[] = result?.user?.RoleNames;
            //dont comment this. Its used in AuthContext. Without localstorage, its unable to fetch auth
            localStorage.setItem('currentUser', JSON.stringify(result.user));
            setAuth({ SocietyId: result?.user?.SocietyId, Roles: roles, Token: accessToken, UserId: result?.user?.UserId, FullName: result?.user?.FullName, UserName: result?.user?.UserName });
            // navigate(from, { replace: true });
            //alert(result?.user?.SocietyId);
            localStorage.setItem("token", accessToken); //this is used in customAxios

            if (roles.some(x => x === ROLES.Admin)) {
              navigate("/admin");
            }
            else if (roles.some(x => x === ROLES.Subscriber || x === ROLES.Society || x == ROLES.ReadOnly)) {
              navigate("/mySociety");
            }
            //we commented this as the society info is getting cleared from header
            // else if (roles.some((x) => x === ROLES.Society)) {
            //   //since we are not loading the societies page. Operate btn is not available to set these values. Hence setting it here.
            //   localStorage.setItem("societyId", result?.user?.SocietyId);
            //   localStorage.setItem('societyName', result?.user?.Society);
            //   navigate("/societySubscriptions/" + result?.user?.SocietyId);
            // }
            else {
              navigate("/");
            }
            //navigate("/societySubscriptions/82d8a475-e301-4d9a-8012-15d1bd5092f3", { replace: true });
            //navigate(from, { replace: true });
            //setAuth1(true); //or conditional state
          }
          else {
            globalService.error(result.message);
          }
          //console.log(response.data);
        }
      });
  };

  return (
    // <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            //backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundImage: `url(${process.env.PUBLIC_URL + "/images/society-images.jpg"
              })`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t: any) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <>

              <Box
                m={1}
                pt={0}
                component="img"
                sx={{
                  maxHeight: { xs: 233 },
                  maxWidth: { xs: 250, md: 250 },
                }}
                alt=""
                src="/images/logo.png"
              />

            </>
            {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        */}
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                //size='small'
                variant="standard"
                margin="normal"
                required
                fullWidth
                id="UserName"
                label="UserName / Email Address"
                name="UserName"
                autoComplete="email"
                autoFocus
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                variant="standard"
                required
                fullWidth
                name="Password"
                label="Password"
                type="Password"
                id="Password"
                autoComplete="current-password"
                onChange={handleInputChange}
              />
              {/* <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            /> */}
              <Button
                type="submit"
                fullWidth
                color='primary'
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              {/* <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot Password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/user" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid> */}
              {/* <Copyright sx={{ mt: 5 }} /> */}
            </Box>
          </Box>
        </Grid>
      </Grid>
    // </ThemeProvider>
  );
}

export default Login