import React, { useEffect, useState } from "react";
import { Box, Card, Typography, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { styled } from "@mui/system";

const NotificationWrapper = styled(Card, {
  shouldForwardProp: (prop) => prop !== "isAlert",
})(({ theme, isAlert }) => ({
  position: "fixed",
  bottom: 20,
  right: 20,
  width: 300,
  padding: theme.spacing(2),
  zIndex: 9999,
  animation: "slideIn 0.5s ease-out",
  backgroundColor: isAlert
    ? theme.palette.error.light
    : theme.palette.background.paper,
  color: isAlert
    ? theme.palette.error.contrastText
    : theme.palette.text.primary,
  "@keyframes slideIn": {
    from: { transform: "translateX(100%)" },
    to: { transform: "translateX(0)" },
  },
}));

const PopupNotification = ({ notification, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  // Determine if it's an alert based on the notification object
  const isAlert = notification.heading === "alert" || notification.isAlert;
  return (
    <NotificationWrapper isAlert={isAlert}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="h6" color="inherit">
          {notification.heading}
        </Typography>
        <IconButton size="small" onClick={onClose} color="inherit">
          <Close />
        </IconButton>
      </Box>
      <Typography variant="body2" color="inherit">
        {notification.title}
      </Typography>
      <Typography variant="caption" color="inherit" style={{ opacity: 0.7 }}>
        {notification.subtitle}
      </Typography>
    </NotificationWrapper>
  );
};

export default PopupNotification;
