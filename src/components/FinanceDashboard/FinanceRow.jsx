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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import useData from "hooks/useData";
import useNotification from "hooks/useNotification";

const formatDate = (dateValue, format = "display") => {
  if (!dateValue) return "";

  let date;
  if (dateValue instanceof Date) {
    date = dateValue;
  } else {
    date = new Date(dateValue);
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) return "";

  if (format === "input") {
    // Format as YYYY-MM-DD for input type="date"
    return date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } else {
    // Format as dd/mm/yyyy for display
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};

const FinanceRow = ({ row, isAdmin, onSelectRow, isSelected }) => {
  const { updatePayment, deletePayment, createFbExpense } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editedRow, setEditedRow] = useState(row);
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { addNotification } = useNotification();

  const handleEdit = () => {
    const formattedRow = {
      ...row,
      datePaid: row.datePaid ? new Date(row.datePaid) : null,
      datePaid2: row.datePaid2 ? new Date(row.datePaid2) : null,
    };
    setEditedRow(formattedRow);
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
      if (
        field === "actualCost" ||
        field === "revisionCost" ||
        field === "totalCost"
      ) {
        const actualCost = parseFloat(updatedRow.actualCost) || 0;
        const revisionCost = parseFloat(updatedRow.revisionCost) || 0;
        console.log(`actualCost:` + actualCost);
        console.log(`revisionCost:` + revisionCost);
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

  const renderCell = (field, type = "text") => {
    const value = isEditing ? editedRow[field] : row[field];

    switch (type) {
      case "checkbox":
        return (
          <Checkbox
            checked={value || false}
            onChange={(e) => handleChange(field, e.target.checked)}
            disabled={!isEditing}
          />
        );
      case "date":
        return isEditing ? (
          <TextField
            type="date"
            value={formatDate(value, "input")}
            onChange={(e) => handleChange(field, e.target.value)}
            variant="standard"
            fullWidth
          />
        ) : (
          formatDate(value)
        );
      case "number":
        return isEditing ? (
          <TextField
            type="number"
            value={value || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            variant="standard"
            fullWidth
          />
        ) : (
          value
        );
      default:
        return isEditing ? (
          <TextField
            value={value || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            variant="standard"
            fullWidth
            multiline={type === "multiline"}
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
        <td>{row.estimatedBudget}</td>
        <td>{renderCell("actualCost", "number")}</td>
        <td>{renderCell("paid", "checkbox")}</td>
        <td>{renderCell("datePaid", "date")}</td>
        <td>{renderCell("revisionNeeded", "checkbox")}</td>
        <td>{renderCell("datePaid2", "date")}</td>
        <td>{renderCell("revisionCost", "number")}</td>
        <td>{renderCell("revisionPaid", "checkbox")}</td>
        <td>{renderCell("notes", "multiline")}</td>
        <td>{renderCell("totalCost", "number")}</td>
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
                sx={{ color: "primary.main", textDecoration: "none" }}
              >
                {row.expenseId}
                <OpenInNewIcon fontSize="small" sx={{ ml: 0.5 }} />
              </Link>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateFbExpense}
                size="small"
                disabled={loading}
              >
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
        aria-describedby="alert-dialog-description"
      >
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
