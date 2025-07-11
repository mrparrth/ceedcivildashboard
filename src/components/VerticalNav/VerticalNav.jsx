import { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { Box, ButtonBase, Icon, styled, Divider } from "@mui/material";

import useSettings from "hooks/useSettings";
import { Paragraph, Span } from "../Typography";
import VerticalNavExpansionPanel from "./VerticalNavExpansionPanel";
import useAuth from "hooks/useAuth";
import { AUTH_ROLES } from "contexts/auth/authRoles";

// STYLED COMPONENTS
const ListLabel = styled(Paragraph)(({ theme, mode }) => ({
  fontSize: "12px",
  marginTop: "20px",
  marginLeft: "15px",
  marginBottom: "10px",
  textTransform: "uppercase",
  display: mode === "compact" && "none",
  color: theme.palette.text.secondary,
}));

const ExtAndIntCommon = {
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  borderRadius: "4px",
  height: 44,
  whiteSpace: "pre",
  marginBottom: "2px",
  textDecoration: "none",
  justifyContent: "flex-start",
  padding: "0 16px",
  transition: "all 150ms ease-in",
  "&:hover": { background: "rgba(255, 255, 255, 0.08)" },
  "&.compactNavItem": {
    overflow: "hidden",
    justifyContent: "center !important",
    padding: "0 8px",
  },
  "& .icon": {
    fontSize: "18px",
    width: "24px",
    marginRight: "8px",
    verticalAlign: "middle",
  },
};

const ExternalLink = styled("a")(({ theme }) => ({
  ...ExtAndIntCommon,
  color: theme.palette.text.primary,
  "& .buttonBase": {
    width: "100%",
    padding: "0",
    justifyContent: "flex-start",
  },
}));

const InternalLink = styled(Box)(({ theme }) => ({
  "& a": {
    ...ExtAndIntCommon,
    color: theme.palette.text.primary,
  },
  "& .navItemActive": {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },
  "& .buttonBase": {
    width: "100%",
    padding: "0",
    justifyContent: "flex-start",
  },
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginTop: "16px",
  marginBottom: "16px",
  backgroundColor: theme.palette.divider,
}));

const StyledText = styled(Span)(({ mode }) => ({
  fontSize: "0.875rem",
  paddingLeft: "0.8rem",
  display: mode === "compact" && "none",
}));

const BulletIcon = styled("div")(({ theme }) => ({
  padding: "2px",
  marginLeft: "24px",
  marginRight: "8px",
  overflow: "hidden",
  borderRadius: "300px",
  background: theme.palette.text.primary,
}));

const BadgeValue = styled("div")(() => ({
  padding: "1px 8px",
  overflow: "hidden",
  borderRadius: "300px",
  marginLeft: "auto",
}));

const LogoutItem = styled(ButtonBase)(({ theme, mode }) => ({
  width: "100%",
  padding: "8px 16px",
  marginTop: "auto",
  display: "flex",
  alignItems: "center",
  backgroundColor: theme.palette.error.dark,
  color: theme.palette.error.contrastText,
  borderRadius: "4px",
  transition: "all 150ms ease-in",
  "&:hover": {
    backgroundColor: theme.palette.error.main,
  },
  "& .icon": {
    marginRight: mode === "compact" ? 0 : "16px",
    transition: "margin 0.3s ease",
  },
  "& .text": {
    display: mode === "compact" ? "none" : "block",
    transition: "display 0.3s ease",
  },
}));

export default function VerticalNav({ items }) {
  const { settings } = useSettings();
  const { mode } = settings.layout1Settings.leftSidebar;
  const { logout, user } = useAuth();

  const availablePermissions = AUTH_ROLES[user.role];

  const renderLevels = (data) => {
    return data.map((item, index) => {
      if (item.type === "label")
        return (
          <ListLabel key={index} mode={mode} className="sidenavHoverShow">
            {item.label}
          </ListLabel>
        );

      if (item.children) {
        return (
          <VerticalNavExpansionPanel mode={mode} item={item} key={index}>
            {renderLevels(item.children)}
          </VerticalNavExpansionPanel>
        );
      } else if (item.type === "extLink") {
        return (
          <ExternalLink key={index} href={item.path} className={`${mode === "compact" && "compactNavItem"}`} rel="noopener noreferrer" target="_blank">
            <ButtonBase className="buttonBase">
              {(() => {
                if (item.icon) {
                  return <Icon className="icon">{item.icon}</Icon>;
                } else {
                  return <span className="item-icon icon-text">{item.iconText}</span>;
                }
              })()}
              <StyledText mode={mode} className="sidenavHoverShow">
                {item.name}
              </StyledText>
              {item.badge && <BadgeValue>{item.badge.value}</BadgeValue>}
            </ButtonBase>
          </ExternalLink>
        );
      } else if (item.type === "logout") {
        return (
          <LogoutItem onClick={logout} key={index} mode={mode}>
            <Icon className="icon">exit_to_app</Icon>
            <span className="text">{item.name}</span>
          </LogoutItem>
        );
      } else if (item.type === "divider") {
        return <StyledDivider key={index} />;
      } else {
        return (
          <InternalLink key={index}>
            <NavLink to={item.path} className={({ isActive }) => (isActive ? `navItemActive ${mode === "compact" && "compactNavItem"}` : `${mode === "compact" && "compactNavItem"}`)}>
              <ButtonBase className="buttonBase">
                {item?.icon ? (
                  <Icon className="icon" sx={{ width: 36 }}>
                    {item.icon}
                  </Icon>
                ) : (
                  <Fragment>
                    <BulletIcon className="nav-bullet" sx={{ display: mode === "compact" && "none" }} />
                    <Box
                      className="nav-bullet-text"
                      sx={{
                        ml: "20px",
                        fontSize: "11px",
                        display: mode !== "compact" && "none",
                      }}>
                      {item.iconText}
                    </Box>
                  </Fragment>
                )}
                <StyledText mode={mode} className="sidenavHoverShow">
                  {item.name}
                </StyledText>

                {item.badge && <BadgeValue className="sidenavHoverShow">{item.badge.value}</BadgeValue>}
              </ButtonBase>
            </NavLink>
          </InternalLink>
        );
      }
    });
  };

  return <div className="navigation">{renderLevels(items.filter((item) => !item.requiredPermission || availablePermissions.includes(item.requiredPermission)))}</div>;
}
