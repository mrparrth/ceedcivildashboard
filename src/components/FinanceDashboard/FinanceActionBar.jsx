import React, { useMemo } from "react";
import { Button, CircularProgress, Typography, Box } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import useAuth from "hooks/useAuth";
import { Button, Paper, Box, Typography, Toolbar } from "@mui/material";
import { PERMISSIONS, AUTH_ROLES } from "contexts/auth/authRoles";

const FinanceActionBar = ({ selectedRows, handleNewPayment, onCreateFreshbooksExpense, totalExpenses, loading, processedRowsCount, justCompleted }) => {
  let { user } = useAuth();
  const progress = loading ? (processedRowsCount / selectedRows.length) * 100 : 0;
  const availablePermissions = AUTH_ROLES[user.role];
  const hasAdminToolsPermission = availablePermissions.includes(PERMISSIONS.adminTools);

  const totalSelectedPayments = useMemo(() => {
    return selectedRows.reduce((total, payment) => total + ((typeof payment.actualCost === "string" ? parseFloat(payment.actualCost) : payment.actualCost) || 0) + ((typeof payment.revisionCost === "string" ? parseFloat(payment.revisionCost) : payment.revisionCost) || 0), 0);
  }, [selectedRows]);

  return (
    <Paper elevation={3}>
      <Toolbar
        sx={{
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mt: 1,
          bgcolor: "grey.200",
        }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            flexGrow: 1,
          }}>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleNewPayment} disabled={loading}>
            New Payment
          </Button>
          {hasAdminToolsPermission && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button variant="contained" color="secondary" startIcon={loading ? justCompleted ? <CheckCircleOutlineIcon /> : <CircularProgress size={20} color="inherit" /> : <AddIcon />} onClick={onCreateFreshbooksExpense} disabled={selectedRows.length === 0 || loading}>
                {loading ? (justCompleted ? "Completed" : "Creating Expenses...") : `New Freshbooks Expense (${selectedRows.length})`}
              </Button>
              {loading && (
                <Box sx={{ width: "100%" }}>
                  <LinearProgress variant="determinate" value={justCompleted ? 100 : progress} />
                  <Typography variant="body2" color="text.secondary" align="right">
                    {justCompleted ? "100%" : `${Math.round(progress)}%`}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
        {hasAdminToolsPermission && (
          <>
            {selectedRows.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "flex-start", sm: "flex-end" },
                  justifyContent: "center",
                  minWidth: { sm: "120px" }, // Ensure consistent width on larger screens
                }}>
                <Typography variant="caption" sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                  Selected Payments Total
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ fontSize: "1.1rem", color: "primary.main" }} // Changed color to primary theme color
                >
                  $
                  {(totalSelectedPayments || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "flex-start", sm: "flex-end" },
                justifyContent: "center",
                minWidth: { sm: "120px" }, // Ensure consistent width on larger screens
              }}>
              <Typography variant="caption" sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                Total
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{ fontSize: "1.1rem", color: "primary.main" }} // Changed color to primary theme color
              >
                $
                {(totalExpenses || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
          </>
        )}
      </Toolbar>
    </Paper>
  );
};

export default FinanceActionBar;
