import { Box, styled } from "@mui/material";
import Logo from "./Logo";

import useSettings from "hooks/useSettings";

// STYLED COMPONENTS
const BrandRoot = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 0",
  margin: "5px 0px",
  minHeight: "60px"
}));

const LogoWrapper = styled(Box)(() => ({
  width: "60px",
  height: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& > *": {
    width: "100%",
    height: "100%"
  }
}));

export default function Brand({ children }) {
  const { settings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;

  return (
    <BrandRoot mode={mode}>
      <LogoWrapper>
        <Logo />
      </LogoWrapper>
      {children && (
        <Box
          className="sidenavHoverShow"
          sx={{ display: mode === "compact" ? "none" : "block" }}>
          {children}
        </Box>
      )}
    </BrandRoot>
  );
}

