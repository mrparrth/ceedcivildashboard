import React, { useState } from "react";
import {
  Button,
  Checkbox,
  IconButton,
  TextField,
  CircularProgress,
  Link,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useData } from "../contexts/data/DataContext";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useNotification } from "../contexts/NotificationContext";

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

const FinanceTableRow = ({ row, isAdmin }) => {
  const { updatePayment, deletePayment, createExpense } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editedRow, setEditedRow] = useState(row);
  const [loading, setLoading] = useState(false);
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
    deletePayment(row.id);
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
        updatedRow.totalCost = parseFloat(
          (actualCost + revisionCost).toFixed(2)
        );
      }

      return updatedRow;
    });
  };

  const handleCreateExpense = async () => {
    setLoading(true);
    try {
      await createExpense(editedRow);
      setIsEditing(false);
    } catch (e) {
      addNotification({ title: e.message, type: "alert" });
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyle = {
    width: "100%",
    "& .MuiInputBase-input": {
      textAlign: "center",
    },
  };

  const checkboxStyle = {
    display: "flex",
    justifyContent: "center",
  };

  if (isEditing) {
    return (
      <tr>
        <td>
          <IconButton onClick={handleSave} color="primary">
            <SaveIcon />
          </IconButton>
          <IconButton onClick={handleCancel} color="secondary">
            <CancelIcon />
          </IconButton>
        </td>
        <td>{editedRow.assignee}</td>
        <td>{editedRow.projectNumber}</td>
        <td>{editedRow.projectName}</td>
        <td>{editedRow.salesMan}</td>
        <td>{editedRow.projectStatus}</td>
        <td>{editedRow.estimatedBudget}</td>
        <td>
          <TextField
            type="number"
            value={editedRow.actualCost || ""}
            onChange={(e) => handleChange("actualCost", e.target.value)}
            variant="standard"
            sx={textFieldStyle}
          />
        </td>
        <td style={checkboxStyle}>
          <Checkbox
            checked={editedRow.paid || false}
            onChange={(e) => handleChange("paid", e.target.checked)}
          />
        </td>
        <td>
          <TextField
            type="date"
            value={formatDate(editedRow.datePaid, "input")}
            onChange={(e) => handleChange("datePaid", e.target.value)}
            variant="standard"
            sx={textFieldStyle}
            placeholder="dd/MM/yyyy"
          />
        </td>
        <td style={checkboxStyle}>
          <Checkbox
            checked={editedRow.revisionNeeded || false}
            onChange={(e) => handleChange("revisionNeeded", e.target.checked)}
          />
        </td>
        <td>
          <TextField
            type="date"
            value={formatDate(editedRow.datePaid2, "input")}
            onChange={(e) => handleChange("datePaid2", e.target.value)}
            variant="standard"
            sx={textFieldStyle}
            placeholder="dd/MM/yyyy"
          />
        </td>
        <td>
          <TextField
            type="number"
            value={editedRow.revisionCost || ""}
            onChange={(e) => handleChange("revisionCost", e.target.value)}
            variant="standard"
            sx={textFieldStyle}
          />
        </td>
        <td style={checkboxStyle}>
          <Checkbox
            checked={editedRow.revisionPaid || false}
            onChange={(e) => handleChange("revisionPaid", e.target.checked)}
          />
        </td>
        <td>
          <TextField
            value={editedRow.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            variant="standard"
            sx={textFieldStyle}
            multiline
          />
        </td>
        <td>
          <TextField
            type="number"
            value={editedRow.totalCost || ""}
            onChange={(e) => handleChange("totalCost", e.target.value)}
            variant="standard"
            sx={textFieldStyle}
          />
        </td>
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
                onClick={() => handleCreateExpense(row)}
                size="small"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Create Expense"}
              </Button>
            )}
          </td>
        )}
      </tr>
    );
  }

  return (
    <tr>
      <td>
        <IconButton onClick={handleEdit} color="primary">
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleDelete} color="secondary">
          <DeleteIcon />
        </IconButton>
      </td>
      <td>{row.assignee}</td>
      <td>{row.projectNumber}</td>
      <td>{row.projectName}</td>
      <td>{row.salesMan}</td>
      <td>{row.projectStatus}</td>
      <td>{row.estimatedBudget}</td>
      <td>{row.actualCost}</td>
      <td>
        <Checkbox checked={row.paid || false} disabled />
      </td>
      <td>{formatDate(row.datePaid)}</td>
      <td>
        <Checkbox checked={row.revisionNeeded || false} disabled />
      </td>
      <td>{formatDate(row.datePaid2)}</td>
      <td>{row.revisionCost}</td>
      <td>
        <Checkbox checked={row.revisionPaid || false} disabled />
      </td>
      <td>{row.notes}</td>
      <td>{row.totalCost}</td>
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
            row.expenseId
          )}
        </td>
      )}
    </tr>
  );
};

export default FinanceTableRow;
