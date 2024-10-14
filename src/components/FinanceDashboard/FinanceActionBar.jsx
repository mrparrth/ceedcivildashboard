import React from "react";
import { Button, CircularProgress, Typography, Box } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import useAuth from "hooks/useAuth";

const FinanceActionBar = ({
  selectedRows,
  handleNewPayment,
  onCreateFreshbooksExpense,
  totalExpenses,
  loading,
  processedRowsCount,
  justCompleted,
}) => {
  let { user } = useAuth();
  const progress = loading
    ? (processedRowsCount / selectedRows.length) * 100
    : 0;
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  return (
    <div className="mt-2 w-100 rounded-2 bg-warning px-3 bg-opacity-25 shadow">
      <div className="d-flex flex-wrap align-items-center justify-content-between p-2">
        <div className="d-flex gap-2">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNewPayment}
            disabled={loading}
          >
            New Payment
          </Button>
          {isAdmin && (
            <div>
              <Button
                variant="contained"
                color="secondary"
                startIcon={
                  loading ? (
                    justCompleted ? (
                      <CheckCircleOutlineIcon />
                    ) : (
                      <CircularProgress size={20} color="inherit" />
                    )
                  ) : (
                    <AddIcon />
                  )
                }
                onClick={onCreateFreshbooksExpense}
                disabled={selectedRows.length === 0 || loading}
              >
                {loading
                  ? justCompleted
                    ? "Completed"
                    : "Creating Expenses..."
                  : `New Freshbooks Expense (${selectedRows.length})`}
              </Button>
              {loading && (
                <Box sx={{ mt: 1, width: "100%" }}>
                  <LinearProgress
                    variant="determinate"
                    value={justCompleted ? 100 : progress}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="right"
                  >
                    {justCompleted ? "100%" : `${Math.round(progress)}%`}
                  </Typography>
                </Box>
              )}
            </div>
          )}
        </div>
        {isAdmin && (
          <div className="text-end">
            <Typography variant="subtitle1">Total</Typography>
            <Typography variant="h5" component="div" fontWeight="bold">
              ${(totalExpenses || 0).toFixed(2)}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceActionBar;
