import { memo } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  styled,
  Avatar,
  Hidden,
  useTheme,
  MenuItem,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { NotificationProvider } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/auth/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import { Span } from "../components/Typography";
import { MatxMenu } from "../components";
import { NotificationBar } from "../components/NotificationBar";
import { themeShadows } from "../theme/themeColors";
import { topBarHeight } from "../utils/constant";
import { keyframes } from "@mui/system";
import { Menu, PowerSettingsNew, Refresh } from "@mui/icons-material";
import { useData } from "../contexts/data/DataContext";

// STYLED COMPONENTS
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const TopbarRoot = styled("div")({
  top: 0,
  zIndex: 96,
  height: topBarHeight,
  boxShadow: themeShadows[8],
  transition: "all 0.3s ease",
});

const TopbarContainer = styled(Box)(({ theme }) => ({
  padding: "8px",
  paddingLeft: 18,
  paddingRight: 20,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: { paddingLeft: 16, paddingRight: 16 },
  [theme.breakpoints.down("xs")]: { paddingLeft: 14, paddingRight: 16 },
}));

const UserMenu = styled(Box)({
  padding: 4,
  display: "flex",
  borderRadius: 24,
  cursor: "pointer",
  alignItems: "center",
  "& span": { margin: "0 8px" },
});

const StyledItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: 185,
  "& a": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  "& span": { marginRight: "10px", color: theme.palette.text.primary },
}));

const IconBox = styled("div")(({ theme }) => ({
  display: "inherit",
  [theme.breakpoints.down("md")]: { display: "none !important" },
}));

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const RefreshIconButton = styled(IconButton)(({ theme, refreshing }) => ({
  color: theme.palette.text.primary,
  animation: refreshing ? `${spin} 2s linear infinite` : "none",
}));

const Layout1Topbar = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const { logout, user } = useAuth();
  const { refreshData } = useData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({
      layout1Settings: { leftSidebar: { ...sidebarSettings } },
    });
  };

  const handleRefresh = async () => {
    if (!isRefreshing) {
      setIsRefreshing(true);
      try {
        await refreshData();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleSidebarToggle = () => {
    let { layout1Settings } = settings;
    let mode;
    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === "close" ? "mobile" : "close";
    } else {
      mode = layout1Settings.leftSidebar.mode === "full" ? "close" : "full";
    }
    updateSidebarMode({ mode });
  };

  return (
    <TopbarRoot>
      <TopbarContainer>
        <Box display="flex">
          <StyledIconButton onClick={handleSidebarToggle}>
            <Menu />
          </StyledIconButton>

          <IconBox>
            <RefreshIconButton onClick={handleRefresh} disabled={isRefreshing}>
              <Refresh />
            </RefreshIconButton>
            {/* <StyledIconButton>
              <WebAsset />
            </StyledIconButton> */}

            {/* <StyledIconButton>
              <StarOutline />
            </StyledIconButton> */}
          </IconBox>
        </Box>

        <Box display="flex" alignItems="center">
          {/* <MatxSearchBox /> */}

          {/* <NotificationProvider> */}
          <NotificationBar />
          {/* </NotificationProvider> */}

          <MatxMenu
            menuButton={
              <UserMenu>
                <Hidden xsDown>
                  <Span>
                    Hi <strong>{user.name}</strong>
                  </Span>
                </Hidden>
                <Avatar src={user.avatar} sx={{ cursor: "pointer" }} />
              </UserMenu>
            }
          >
            {/* <StyledItem>
              <Settings />
              <Span>Settings</Span>
            </StyledItem> */}
            <StyledItem onClick={logout}>
              <PowerSettingsNew />
              <Span>Logout</Span>
            </StyledItem>
          </MatxMenu>
        </Box>
      </TopbarContainer>
    </TopbarRoot>
  );
};

export default memo(Layout1Topbar);
