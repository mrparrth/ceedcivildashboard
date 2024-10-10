import React, { useEffect, useRef } from "react";
import { ThemeProvider, useMediaQuery, Box, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import Scrollbar from "react-perfect-scrollbar";
import { useSettings } from "../contexts/SettingsContext";
import {
  topBarHeight,
  sideNavWidth,
  sidenavCompactWidth,
} from "../utils/constant";

import { SidenavTheme } from "../theme/SidenavTheme";
import Layout1Sidenav from "./Layout1Sidenav";
import Layout1Topbar from "./Layout1Topbar";
import MatxSuspense from "../components/MatxSuspense";

// Styled components
const Layout1Root = styled(Box)(({ theme }) => ({
  display: "flex",
  background: theme.palette.background.default,
}));

const MainContainer = styled(Box)(() => ({
  display: "flex",
  flexGrow: 1,
}));

const ContentBox = styled(Box)(() => ({
  height: "100%",
  display: "flex",
  overflowY: "auto",
  overflowX: "hidden",
  flexDirection: "column",
  justifyContent: "space-between",
}));

const StyledScrollBar = styled(Scrollbar)(() => ({
  height: "100%",
  position: "relative",
  display: "flex",
  flexGrow: "1",
  flexDirection: "column",
}));

const LayoutContainer = styled(Box)(({ width, open }) => ({
  height: "100vh",
  display: "flex",
  flexGrow: "1",
  flexDirection: "column",
  verticalAlign: "top",
  marginLeft: width,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease",
  marginRight: open ? 50 : 0,
}));

const Layout1 = () => {
  const { settings, updateSettings } = useSettings();
  const { layout1Settings, secondarySidebar, showHeader } = settings;
  const topbarTheme = settings.themes[layout1Settings.topbar.theme];
  const {
    leftSidebar: { mode: sidenavMode, show: showSidenav },
    topbar: { show: showTopbar, fixed: topbarFixed },
  } = layout1Settings;

  const getSidenavWidth = () => {
    switch (sidenavMode) {
      case "full":
        return sideNavWidth;

      case "compact":
        return sidenavCompactWidth;

      default:
        return "0px";
    }
  };

  const sidenavWidth = getSidenavWidth();

  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
  const ref = useRef({ isMdScreen, settings });
  const layoutClasses = `theme-${theme.palette.type}`;

  useEffect(() => {
    let { settings } = ref.current;
    let sidebarMode = settings.layout1Settings.leftSidebar.mode;
    if (settings.layout1Settings.leftSidebar.show) {
      let mode = isMdScreen ? "close" : sidebarMode;
      updateSettings({ layout1Settings: { leftSidebar: { mode } } });
    }
  }, [isMdScreen]);

  return (
    <Layout1Root className={layoutClasses}>
      {showSidenav && sidenavMode !== "close" && (
        <SidenavTheme>
          <Layout1Sidenav />
        </SidenavTheme>
      )}

      <LayoutContainer width={sidenavWidth} open={secondarySidebar.open}>
        {layout1Settings.topbar.show && layout1Settings.topbar.fixed && (
          <ThemeProvider theme={topbarTheme}>
            <Layout1Topbar fixed={true} className="elevation-z8" />
          </ThemeProvider>
        )}

        <ContentBox>
          {layout1Settings.topbar.show && !layout1Settings.topbar.fixed && (
            <ThemeProvider theme={topbarTheme}>
              <Layout1Topbar />
            </ThemeProvider>
          )}

          <Box flexGrow={1} position="relative">
            <MatxSuspense>
              <Outlet />
            </MatxSuspense>
          </Box>
        </ContentBox>
      </LayoutContainer>
      {/* {settings.secondarySidebar.show && <SecondarySidebar />} */}
    </Layout1Root>
  );
};

export default Layout1;
