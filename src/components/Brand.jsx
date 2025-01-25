import { Box, styled } from "@mui/material";
import Logo from "./Logo";

import { Span } from "./Typography";
import useSettings from "hooks/useSettings";

// STYLED COMPONENTS
const BrandRoot = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0px 16px",
  margin: "5px 0px"
}));

const StyledSpan = styled(Span)(({ mode }) => ({
  fontSize: 18,
  marginLeft: ".5rem",
  display: mode === "compact" ? "none" : "block"
}));

export default function Brand({ children }) {
  const { settings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;

  return (
    <BrandRoot>
      <Box display="flex" alignItems="center">
        <Logo />
        {/* <StyledSpan mode={mode} className="sidenavHoverShow">
          Ceed Civil
        </StyledSpan> */}
      </Box>

      <Box
        className="sidenavHoverShow"
        sx={{ display: mode === "compact" ? "none" : "block" }}>
        {children || null}
      </Box>
    </BrandRoot>
  );
}
