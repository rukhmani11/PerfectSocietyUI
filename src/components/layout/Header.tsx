import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../utility/context/AuthContext";
import { ROLES, config } from "../../utility/Config";
import { Paper, Stack, alpha } from "@mui/material";
import { styled } from '@mui/material/styles';
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { error } from "console";
import { societySubscriptionsService } from "../../services/SocietySubscriptionsService";
import dayjs from "dayjs";
import { societiesService } from "../../services/SocietiesService";
import { globalService } from "../../services/GlobalService";
import { useSharedNavigation } from "../../utility/context/NavigationContext";

//const Header: React.FC = () => {
export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  let showTopHeader = false;
  const [token, setToken] = useState("");
  const [open, setOpen] = React.useState(true);
  if (location.pathname == "/") showTopHeader = true;
  const { auth, setAuth } = React.useContext(AuthContext);
  let isLoggedIn = auth?.Token ? true : false;;
  const [societySubscription, setSocietySubscription] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = React.useState<null | HTMLElement>(null);
  const [companyAnchorEl, setCompanyAnchorEl] = React.useState<null | HTMLElement>(null);
  const openAccount = Boolean(accountAnchorEl);
  const { goToHome } = useSharedNavigation();

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    mainMenu: string
  ) => {
    if (mainMenu === "account") setAccountAnchorEl(event.currentTarget);
    else if (mainMenu === "company") setCompanyAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAccountAnchorEl(null);
    setCompanyAnchorEl(null);
  };

  useEffect(() => {
    
    // // Get the token from localStorage
    // const localStorageToken = localStorage.getItem("token");
    isLoggedIn = auth?.Token ? true : false;
    // // // If the token in localStorage is different from the token in state,
    // // // update the state
    // if (localStorageToken !=="" && localStorageToken !== token) {
    //   setToken(localStorageToken);
    //   navigate('/login');
    // }

    if (location.pathname === "/mySociety" || location.pathname === "/" || location.pathname === "/admin") {
      societiesService.clearSocietyAndSubscription(true, true);
      setSocietySubscription(null);
    } else {
      setSocietySubscription(societySubscriptionsService.getCurrentSocietySubscription());
    }
  }, [token]);

  function logout() {
    localStorage.clear();
    setAuth(null);
    navigate("/");
  }


  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === "light"
          ? "rgb(55, 65, 81)"
          : theme.palette.grey[300],
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      "& .MuiMenu-list": {
        padding: "4px 0",
      },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));


  return (
    <>
      {/* {config.project !== "sssociety" && ( */}
      <>
        {showTopHeader && (
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static"
              sx={{
                backgroundColor: "var(--primary-color)",
              }}>
              <Toolbar sx={{ minHeight: { xs: '40px', md: 'inherit' } }}>
                <Typography component="div" sx={{
                  padding: "5px",
                  fontSize: { xs: 12, md: 'inherit' },
                }}>
                  <IconButton
                    size="small"
                    aria-label=" EmailOutlined"
                    sx={{ color: "#FFFF" }}
                  >
                    <EmailOutlinedIcon />
                  </IconButton>
                  {/* {config.project === "sssociety" ? "sssociety@yahoo.com |" : "perfectsociety@yahoo.com |"} */}
                  {localStorage.getItem('HomePageEmail')}
                </Typography>
                <Typography component="div"
                  sx={{ fontSize: { xs: 12, md: 'inherit' } }}
                >
                  <IconButton
                    size="small"
                    aria-label=" PhoneOutlined"
                    sx={{ color: "#FFFF" }}
                  >
                    <PhoneOutlinedIcon />
                  </IconButton>{" "}
                  {/* +91 9999999999 */}
                  {localStorage.getItem('HomePageMobile')}
                  {/* <IconButton size="small"  aria-label=" PhoneOutlined" sx={{ color: "#FFFF" }} >
                <FacebookOutlinedIcon />
              </IconButton> */}
                </Typography>
              </Toolbar>
            </AppBar>
          </Box>
        )}

        <AppBar position="static" color="inherit">

          {/* <Toolbar> */}
          <Stack
            spacing={2}
            direction={"row"}
            //direction={{ xs: 'column', sm: 'row' }}
            justifyContent={"space-between"}
          //display={"-webkit-box"}
          >
            <Box
              m={1}
              pt={0}
              component="img"
              sx={{
                maxHeight: { xs: 200 },
                maxWidth: { xs: 95, md: 220 },
              }}
              alt=""
              src="/images/logo.png"
              style={{ cursor: 'pointer' }}
              onClick={() => goToHome()}
            />
            {/* <Link href={"/login"} sx={{ marginLeft: 'auto' }}>
            <Button variant="contained" size="medium" sx={{ marginLeft: 'auto' }} style={{ textTransform: 'none', flex: 1 }}
            >Login</Button>
          </Link> */}
            {/* <Paper component={Stack} direction="column" justifyContent="center">
            <div>
              <Typography variant="h5" component="h3">
                This is a sheet of paper.
              </Typography>
              <Typography component="p">
                Paper can be used to build surface or other elements for your
                application.
              </Typography>
            </div>
          </Paper> */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                //color={"var(--primary-color)"}
                //sx={{ display: { xs: 'block', sm: 'block' } }}
                sx={{
                  fontSize: { xs: 10, md: 'inherit' },
                }}
                color={'primary.main'}
                align="center"
              // style={{ wordWrap: "break-word" }}
              >
               
                {localStorage.getItem("societyName")}{" "}
                {(isLoggedIn && societySubscriptionsService.getCurrentSocietySubscription() &&
                  societySubscription) ?
                  (
                    "[" +
                    dayjs(societySubscription.SubscriptionStart).format(
                      "YY"
                    ) +
                    "-" +
                    dayjs(societySubscription.SubscriptionEnd).format("YY") +
                    "]"
                  )
                  : ''}
              </Typography>
            </Box>

            {isLoggedIn ? (
              <>
                <Box alignItems="center" >
                  {/* sx={{ display: { xs: 'none', sm: 'block flex' } }} */}
                  {/*sx={{ display: "flex", alignItems: "center" }} <Typography variant="body2">
                      {auth?.FullName}
                      <br />
                      {auth?.Roles.join(",")}
                    </Typography> */}

                  {/* <Button
                      variant="contained"
                      size="medium"
                      sx={{ margin: "10px" }}
                      style={{ textTransform: "none" }}
                      onClick={() => logout()}
                    >
                      {" "}
                      LOGOUT
                    </Button> */}

                  <Button
                    id="account-button"
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    // variant="contained"
                    className={`nav-btn`}
                    disableElevation
                    onClick={(e) => handleClick(e, "account")}
                    endIcon={<KeyboardArrowDownIcon />}
                    sx={{
                      fontSize: { xs: 7, md: 'inherit' },
                      margin: { xs: '2px', md: '10px' }
                    }}
                  >
                    {auth?.FullName}
                    <br />
                    {auth?.Roles?.join(",")}
                  </Button>
                  <StyledMenu
                    id="account-menu"
                    MenuListProps={{
                      "aria-labelledby": "account-button",
                    }}
                    anchorEl={accountAnchorEl}
                    open={openAccount}
                    onClose={handleClose}



                  >
                    {/* <Link color="inherit" href={"/"} className="nav-link">
              <MenuItem onClick={handleClose} disableRipple>
                My Account
              </MenuItem>
            </Link> */}
                    <Link color="inherit" href={"/resetPassword/" + auth.UserId} className="nav-link">
                      <MenuItem onClick={handleClose} disableRipple>
                        Change Password
                      </MenuItem>
                    </Link>
                    <Link color="inherit" onClick={() => logout()} className="nav-link">
                      <MenuItem onClick={handleClose} disableRipple>
                        Logout
                      </MenuItem>
                    </Link>
                  </StyledMenu>

                </Box>
              </>
            ) : (
              <>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button
                    variant="contained"
                    size="medium"
                    sx={{ marginLeft: "auto" }}
                    style={{ textTransform: "none" }}
                  >
                    <Link
                      href={"/login"}
                      sx={{
                        marginLeft: "auto",
                        color: "#fff",
                        textDecoration: "none",
                      }}
                    >
                      LOGIN
                    </Link>
                  </Button>
                </Box>
              </>
            )}

          </Stack>

        </AppBar>
      </>

    </>
  );
}
