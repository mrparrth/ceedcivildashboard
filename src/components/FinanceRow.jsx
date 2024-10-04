import React from "react";
import Button from "@mui/material/Button";

const formatDate = (dateValue) => {
  if (!dateValue) return "";

  let date;
  if (dateValue instanceof Date) {
    date = dateValue;
  } else {
    date = new Date(dateValue);
  }
  // Check if the date is valid
  if (isNaN(date.getTime())) return "";

  // Format the date as dd/mm/yyyy
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const FinanceTableRow = ({ row, createExpense }) => {
  return (
    <tr>
      <td>{row.assignee}</td>
      <td>{row.projectNumber}</td>
      <td>{row.projectName}</td>
      <td>{row.salesMan}</td>
      <td>{row.projectStatus}</td>
      <td>{row.estimatedBudget}</td>
      <td>{row.actualCost}</td>
      <td>
        <input
          type="checkbox"
          checked={row.paid}
          readOnly
          style={{ width: "1.2rem", height: "1.2rem" }}
        />
      </td>
      <td>{formatDate(row.datePaid)}</td>
      <td>
        <input
          type="checkbox"
          checked={row.revisionNeeded}
          readOnly
          style={{ width: "1.2rem", height: "1.2rem" }}
        />
      </td>
      <td>{formatDate(row.datePaid2)}</td>
      <td>{row.revisionCost}</td>
      <td>
        <input
          type="checkbox"
          checked={row.revisionPaid}
          readOnly
          style={{ width: "1.2rem", height: "1.2rem" }}
        />
      </td>
      <td>{row.notes}</td>
      <td>{row.totalCost}</td>
      <td>
        {row.expenseId ? (
          row.expenseId
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => createExpense(row.id)}
          >
            Create Expense
          </Button>
        )}
      </td>
    </tr>
  );
};

export default FinanceTableRow;
