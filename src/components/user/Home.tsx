import {
  CssBaseline,
  Container,
  Box,
  Toolbar,
  Typography,
} from "@mui/material";
import Carousel from "nuka-carousel";
import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { AuthContext } from "../../utility/context/AuthContext";
import { ROLES, config } from "../../utility/Config";
import { useLocation, useNavigate } from "react-router-dom";
import Index from "./Index";
import { appInfoService } from "../../services/AppInfoService";
import { useSharedNavigation } from "../../utility/context/NavigationContext";

const Home: React.FC = () => {
  const { auth } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const { goToHome } = useSharedNavigation();
  
  useEffect(() => {
    goToHome();
  },[]);

  return (
    <>
      {/* <Index indexHtml={indexHtml}/> */}
      <Index />
    </>
  );
};

export default Home;


