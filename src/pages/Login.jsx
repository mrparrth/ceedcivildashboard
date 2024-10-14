import React, { useState, useEffect } from "react";
import useAuth from "hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import CustomInput from "../components/CustomTextField";
import SafeImageBox from "../components/ParcelSafeImage";

const GradientBackground = styled(Box)({
  backgroundImage: "linear-gradient(135deg, #91eae4, #86A8E7, #7F7FD5)",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
});

const GlassmorphicContainer = styled(Box)({
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  width: "80%",
  maxWidth: "1000px",
});

const WelcomeSection = styled(Box)({
  padding: "40px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
});

const LoginSection = styled(Box)({
  padding: "40px",
});

const LoginGrid = styled(Grid)({
  backgroundColor: "rgba(255, 255, 255, 0.25)",
  padding: "40px",
});

const GradientButton = styled(Button)({
  backgroundImage: "linear-gradient(to right, #4776E6, #8E54E9)",
  color: "white",
  borderRadius: "10px",
  padding: "10px 0",
  "&:hover": {
    opacity: 0.9,
  },
});

const safeUrl = (url) => {
  if (typeof url !== "string") return url;
  const [protocol, rest] = url.split("://");
  if (!rest) return url; // URL doesn't contain '://', return as is
  return `${protocol}:/` + `/${rest}`; // Split the '://' to avoid build issues
};

export default function Login() {
  const [userId, setUserId] = useState("fakeuser@ceedcivil.com");
  const [password, setPassword] = useState("password");
  const { login, isAuthenticated, isAuthInProgress, error, setError } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const logoUrl =
    "/ucarecdn.com/e767c054-980a-4511-aabe-8d7cbe48d732/-/preview/857x1000/";

  useEffect(() => {
    if (isAuthenticated) {
      const origin = location.state?.from || "/dashboard";
      navigate(origin, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    if (userId && password) login(userId, password);
  };

  return (
    <GradientBackground>
      <GlassmorphicContainer>
        <Grid container>
          <Grid item xs={12} md={6}>
            <WelcomeSection>
              <SafeImageBox
                src={logoUrl}
                alt="CeedCivil Logo"
                sx={{ width: "150px", mb: 4 }}
              />
              <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Welcome Back to CeedCivil
              </Typography>
              <Typography
                variant="body1"
                align="center"
                sx={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                Please login to access your account
              </Typography>
            </WelcomeSection>
          </Grid>
          <LoginGrid item xs={12} md={6}>
            <LoginSection>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "white", fontWeight: "bold" }}
              ></Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <CustomInput
                  fullWidth
                  id="userId"
                  label=""
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <CustomInput
                  fullWidth
                  type="password"
                  id="password"
                  label=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <GradientButton
                  fullWidth
                  type="submit"
                  disabled={isAuthInProgress}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isAuthInProgress ? "Logging in..." : "Log In"}
                </GradientButton>

                {error && (
                  <Typography color="error" align="center" sx={{ mt: 2 }}>
                    {error}
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ color: "white", mt: 2 }}
                ></Typography>
              </Box>
            </LoginSection>
          </LoginGrid>
        </Grid>
      </GlassmorphicContainer>
    </GradientBackground>
  );
}
