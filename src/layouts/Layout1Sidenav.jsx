import { Box, styled, useTheme, Tooltip, ButtonBase } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

import useSettings from "hooks/useSettings";

import Brand from "../components/Brand";
import Sidenav from "../components/Sidenav";
import { themeShadows } from "../theme/themeColors";
import { Span } from "../components/Typography";

import { sidenavCompactWidth, sideNavWidth } from "../utils/constant";

// STYLED COMPONENTS
const SidebarNavRoot = styled(Box)(({ theme, width, bg, image }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  width: width,
  boxShadow: themeShadows[8],
  backgroundRepeat: "no-repeat",
  backgroundPosition: "top",
  backgroundSize: "cover",
  zIndex: 111,
  overflow: "hidden",
  color: theme.palette.text.primary,
  transition: "all 250ms ease-in-out",
  backgroundImage: `linear-gradient(to bottom, rgba(${bg}, 0.96), rgba(${bg}, 0.96)), url(${image})`,
}));

const NavListBox = styled(Box)({
  height: "100%",
  display: "flex",
  flexDirection: "column"
});

const SidenavContainer = styled(Box)({
  flex: 1,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column"
});

const NavBottomSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 16px",
  borderTop: `1px solid rgba(255, 255, 255, 0.12)`,
  marginTop: "auto"
}));

const convertHexToRGB = (hex) => {
  if (!hex) return "0,0,0";
  if (hex.match("rgba")) {
    let triplet = hex.slice(5).split(",").slice(0, -1).join(",");
    return triplet;
  }

  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");

    return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",");
  }
  return "0,0,0";
};

const Layout1Sidenav = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode, bgImgURL } = leftSidebar;

  const getSidenavWidth = () => {
    switch (mode) {
      case "compact":
        return sidenavCompactWidth;

      default:
        return sideNavWidth;
    }
  };

  const primaryRGB = convertHexToRGB(theme.palette.primary.main);

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({
      layout1Settings: { leftSidebar: { ...sidebarSettings } }
    });
  };

  const handleSidenavToggle = () => {
    updateSidebarMode({ mode: mode === "compact" ? "full" : "compact" });
  };

  const isCompact = mode === "compact";

  return (
    <SidebarNavRoot image={bgImgURL} bg={primaryRGB} width={getSidenavWidth()}>
      <NavListBox>
        <Brand />
        <SidenavContainer>
          <Sidenav />
        </SidenavContainer>
        <NavBottomSection>
          <Tooltip
            title={isCompact ? "Maximize Sidebar" : "Minimize Sidebar"}
            placement="right"
            arrow
          >
            <ButtonBase
              onClick={handleSidenavToggle}
              sx={{
                width: "100%",
                height: 40,
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: isCompact ? "center" : "flex-start",
                padding: isCompact ? "0" : "0 12px",
                color: "text.primary",
                transition: "all 150ms ease-in",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)"
                }
              }}
            >
              {isCompact ? (
                <ChevronRight sx={{ fontSize: 22 }} />
              ) : (
                <>
                  <ChevronLeft sx={{ fontSize: 22, mr: 1.5 }} />
                  <Span sx={{ fontSize: "0.875rem", fontWeight: 500 }}>Minimize</Span>
                </>
              )}
            </ButtonBase>
          </Tooltip>
        </NavBottomSection>
      </NavListBox>
    </SidebarNavRoot>
  );
};

export default Layout1Sidenav;

