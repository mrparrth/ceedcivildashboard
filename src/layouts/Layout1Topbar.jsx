import { memo, useState } from "react";
import {
  Box,
  styled,
  Avatar,
  Hidden,
  useTheme,
  MenuItem,
  IconButton,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography
} from "@mui/material";
import { Span } from "../components/Typography";
import { MatMenu } from "../components";
import { NotificationBar } from "../components/NotificationBar";
import { themeShadows } from "../theme/themeColors";
import { topBarHeight } from "../utils/constant";
import { keyframes } from "@mui/system";
import { Menu, PowerSettingsNew, Refresh } from "@mui/icons-material";

import useSettings from "hooks/useSettings";
import useData from "hooks/useData";
import useAuth from "hooks/useAuth";

// STYLED COMPONENTS
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary
}));

const TopbarRoot = styled("div")({
  top: 0,
  zIndex: 96,
  height: topBarHeight,
  boxShadow: themeShadows[8],
  transition: "all 0.3s ease"
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
  [theme.breakpoints.down("xs")]: { paddingLeft: 14, paddingRight: 16 }
}));

const UserMenu = styled(Box)({
  padding: 4,
  display: "flex",
  borderRadius: 24,
  cursor: "pointer",
  alignItems: "center",
  "& span": { margin: "0 8px" }
});

const StyledItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: 185,
  "& a": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    textDecoration: "none"
  },
  "& span": { marginRight: "10px", color: theme.palette.text.primary }
}));

const IconBox = styled("div")(({ theme }) => ({
  display: "inherit",
  [theme.breakpoints.down("md")]: { display: "none !important" }
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
  animation: refreshing ? `${spin} 2s linear infinite` : "none"
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    minWidth: "400px",
    padding: theme.spacing(2),
    borderRadius: "12px"
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  "& .MuiTypography-root": {
    fontSize: "1.5rem",
    fontWeight: 600
  }
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(3),
  "& .MuiDialogContentText-root": {
    color: theme.palette.text.secondary,
    fontSize: "1rem",
    marginBottom: 0
  }
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: theme.spacing(1),
  gap: theme.spacing(1),
  "& .MuiButton-root": {
    minWidth: "100px"
  }
}));

const Layout1Topbar = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const { logout, user } = useAuth();
  const { refreshData } = useData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({
      layout1Settings: { leftSidebar: { ...sidebarSettings } }
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

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    logout();
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
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
          </IconBox>
        </Box>

        <Box display="flex" alignItems="center">
          <NotificationBar />

          <MatMenu
            menuButton={
              <UserMenu>
                <Hidden xsDown>
                  <Span>
                    Hi <strong>{user.name}</strong>
                  </Span>
                </Hidden>
                <Avatar src={user.avatar} sx={{ cursor: "pointer" }} />
              </UserMenu>
            }>
            <StyledItem onClick={handleLogoutClick}>
              <PowerSettingsNew />
              <Span>Logout</Span>
            </StyledItem>
          </MatMenu>
        </Box>
        <StyledDialog
          open={logoutDialogOpen}
          onClose={handleLogoutCancel}
          aria-labelledby="logout-dialog-title"
          aria-describedby="logout-dialog-description">
          <StyledDialogTitle id="logout-dialog-title">
            <Typography>Confirm Logout</Typography>
          </StyledDialogTitle>
          <StyledDialogContent>
            <DialogContentText id="logout-dialog-description">
              Are you sure you want to logout?
              <br />
              All unsaved changes will be lost.
            </DialogContentText>
          </StyledDialogContent>
          <StyledDialogActions>
            <Button
              onClick={handleLogoutCancel}
              variant="outlined"
              color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleLogoutConfirm}
              variant="outlined"
              color="error"
              autoFocus>
              Logout
            </Button>
          </StyledDialogActions>
        </StyledDialog>
      </TopbarContainer>
    </TopbarRoot>
  );
};

export default memo(Layout1Topbar);
