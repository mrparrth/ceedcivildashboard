import React, { useState } from "react";
import {
  Button,
  Checkbox,
  IconButton,
  TextField,
  CircularProgress,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import useData from "hooks/useData";
import useNotification from "hooks/useNotification";

const displayFormatDate = (dateString) => {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");
  return `${month}/${day}/${year}`;
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "";

  const number = parseFloat(value);
  if (isNaN(number)) return "";

  const hasDecimals = number % 1 !== 0;
  return `$${hasDecimals ? number.toFixed(2) : number.toString()}`;
};

const parseCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "";

  if (value.toString().endsWith(".")) {
    return value;
  }

  const stringValue = value.toString();

  const number = parseFloat(stringValue);

  return isNaN(number) ? "" : number;
};

const FinanceRow = ({ row, isAdmin, onSelectRow, isSelected }) => {
  const { updatePayment, deletePayment, createFbExpense } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editedRow, setEditedRow] = useState(row);
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { addNotification } = useNotification();

  const handleEdit = () => {
    setEditedRow(row);
    setIsEditing(true);
  };

  const handleSave = () => {
    updatePayment(editedRow);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedRow(row);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = () => {
    deletePayment(row.id);
    setOpenDeleteDialog(false);
  };

  const handleChange = (field, value) => {
    setEditedRow((prev) => {
      const updatedRow = { ...prev, [field]: value };

      // Recalculate total cost if actualCost or revisionCost changed
      if (field === "actualCost" || field === "revisionCost") {
        const actualCost = parseFloat(updatedRow.actualCost) || 0;
        const revisionCost = parseFloat(updatedRow.revisionCost) || 0;

        updatedRow.totalCost = parseFloat(
          (actualCost + revisionCost).toFixed(2)
        );
      }

      return updatedRow;
    });
  };

  const handleCreateFbExpense = async () => {
    setLoading(true);
    try {
      await createFbExpense(editedRow);
      setIsEditing(false);
    } catch (e) {
      addNotification({ title: e.message, type: "alert" });
    } finally {
      setLoading(false);
    }
  };

  const renderCell = (field, type = "text", isDisabled = false) => {
    const value = isEditing ? editedRow[field] : row[field];

    const centeredFieldStyle = {
      "& .MuiInputBase-input": {
        textAlign: "center"
      }
    };

    switch (type) {
      case "checkbox":
        return (
          <Checkbox
            checked={!!value}
            onChange={(e) => handleChange(field, e.target.checked)}
            disabled={!isEditing}
          />
        );
      case "date":
        return isEditing ? (
          <TextField
            type="date"
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            variant="standard"
            fullWidth
            sx={centeredFieldStyle}
          />
        ) : (
          displayFormatDate(value)
        );
      case "number":
        return isEditing ? (
          <TextField
            type="number"
            value={value || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            variant="standard"
            fullWidth
            sx={centeredFieldStyle}
          />
        ) : (
          value
        );
      case "currency":
        return isEditing && !isDisabled ? (
          <TextField
            type="text"
            value={parseCurrency(value)}
            onChange={(e) => handleChange(field, e.target.value)}
            variant="standard"
            fullWidth
            sx={centeredFieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              )
            }}
            onBlur={(e) => {
              // Format on blur for better UX
              const parsed = parseFloat(parseCurrency(e.target.value));
              if (!isNaN(parsed)) {
                // Only add decimals if they exist
                const formattedValue =
                  parsed % 1 !== 0 ? parsed.toFixed(2) : parsed.toString();
                handleChange(field, formattedValue);
              }
            }}
          />
        ) : (
          formatCurrency(value)
        );
      default:
        return isEditing && !isDisabled ? (
          <TextField
            value={value || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            variant="standard"
            fullWidth
            multiline={type === "multiline"}
            sx={centeredFieldStyle}
          />
        ) : (
          value
        );
    }
  };

  return (
    <>
      <tr>
        {isAdmin && (
          <td>
            <Checkbox checked={isSelected} onChange={() => onSelectRow(row)} />
          </td>
        )}
        <td>
          {isEditing ? (
            <>
              <IconButton onClick={handleSave} color="primary">
                <SaveIcon />
              </IconButton>
              <IconButton onClick={handleCancel} color="secondary">
                <CancelIcon />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton onClick={handleEdit} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDelete} color="secondary">
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </td>
        <td>{row.assignee}</td>
        <td>{row.projectNumber}</td>
        <td>{row.projectName}</td>
        <td>{row.salesMan}</td>
        <td>{row.projectStatus}</td>
        <td>{formatCurrency(row.estimatedBudget)}</td>
        <td>{renderCell("actualCost", "currency")}</td>
        <td>{renderCell("paid", "checkbox")}</td>
        <td>{renderCell("datePaid", "date")}</td>
        <td>{renderCell("revisionNeeded", "checkbox")}</td>
        <td>{renderCell("datePaid2", "date")}</td>
        <td>{renderCell("revisionCost", "currency")}</td>
        <td>{renderCell("notes", "multiline")}</td>
        <td>{renderCell("totalCost", "currency", true)}</td>
        {isAdmin && (
          <td>
            {row.expenseId ? (
              <Link
                href={`https://my.freshbooks.com/#/expense/${row.expenseId}/`}
                target="_blank"
                rel="noopener noreferrer"
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ color: "primary.main", textDecoration: "none" }}>
                {row.expenseId}
                <OpenInNewIcon fontSize="small" sx={{ ml: 0.5 }} />
              </Link>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateFbExpense}
                size="small"
                disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Create Expense"}
              </Button>
            )}
          </td>
        )}
      </tr>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this payment for project{" "}
            {row.projectNumber}
            ?
            <br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FinanceRow;
