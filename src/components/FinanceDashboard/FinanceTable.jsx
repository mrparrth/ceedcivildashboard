import React, { useState, useCallback, useMemo } from "react";
import FinanceRow from "./FinanceRow";
import PaginationCustom from "../PaginationCustom";
import Loader from "../LoaderCustom";
import useNotification from "../../hooks/useNotification";
import useData from "hooks/useData";
import useAuth from "hooks/useAuth";
import { Paper, Box, Checkbox } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { PERMISSIONS, AUTH_ROLES } from "contexts/auth/authRoles";

const FinanceTable = ({ pageNo, onPageChange, data, selectedRows, onRowSelection, onEditRow }) => {
  const { isLoading } = useData();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const maxAllowedSelection = 7;

  const fixedHeaderStyle = {
    backgroundColor: "#343a40",
    color: "white",
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
    paddingRight: "20px", // Space for sort icon
  };

  const editableHeaderStyle = {
    backgroundColor: "#4a86e8",
    color: "white",
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
    paddingRight: "20px", // Space for sort icon
  };

  const checkboxStyle = {
    padding: 0,
    color: "white",
    "&.Mui-checked": { color: "white" },
    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" },
  };

  const sortIconStyle = {
    position: "absolute",
    right: "4px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "16px",
  };

  const requestSort = useCallback((key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return <span style={sortIconStyle}>{sortConfig.direction === "asc" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}</span>;
  };

  const handleSelectRow = (row) => {
    const updatedSelection = selectedRows.some((selectedRow) => selectedRow.id === row.id) ? selectedRows.filter((selectedRow) => selectedRow.id !== row.id) : [...selectedRows, row];
    onRowSelection(updatedSelection);
  };

  const availablePermissions = AUTH_ROLES[user.role];
  const hasAdminToolsPermission = availablePermissions.includes(PERMISSIONS.adminTools);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const originalA = a[sortConfig.key];
      const originalB = b[sortConfig.key];

      // Handle null/undefined values first
      if (originalA === null || originalA === undefined) return 1;
      if (originalB === null || originalB === undefined) return -1;

      // Handle numeric fields
      const numericFields = ["estimatedBudget", "actualCost", "paid", "revisionCost", "totalProjectCost", "projectNumber"];

      let comparison;
      if (numericFields.includes(sortConfig.key)) {
        // Try to parse both values as numbers
        const numA = parseFloat(originalA);
        const numB = parseFloat(originalB);

        // If both are valid numbers, compare numerically
        if (!isNaN(numA) && !isNaN(numB)) {
          comparison = numA < numB ? -1 : numA > numB ? 1 : 0;
        } else {
          // If either is not a valid number, compare as strings
          comparison = String(originalA).localeCompare(String(originalB));
        }
      } else {
        // For non-numeric fields, always compare as strings
        comparison = String(originalA).localeCompare(String(originalB));
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const currentPageData = useMemo(() => {
    return sortedData.slice((pageNo - 1) * rowsPerPage, pageNo * rowsPerPage);
  }, [sortedData, pageNo]);

  const handleSelectAll = useCallback(
    (event) => {
      if (event.target.checked) {
        onRowSelection(currentPageData.slice(0, maxAllowedSelection));
        if (currentPageData.length > maxAllowedSelection) {
          addNotification({
            title: `You can create a maximum of ${maxAllowedSelection} expenses at a time`,
          });
        }
      } else {
        onRowSelection([]);
      }
    },
    [currentPageData]
  );

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
  };
  const renderTableHeaders = () => {
    const headers = [
      { title: "Actions", key: null, style: fixedHeaderStyle },
      { title: "Assignee", key: "assignee", style: fixedHeaderStyle },
      { title: "Project #", key: "projectNumber", style: fixedHeaderStyle },
      { title: "Project", key: "projectName", style: fixedHeaderStyle },
      {
        title: "Estimated Budget",
        key: "estimatedBudget",
        style: fixedHeaderStyle,
      },
      { title: "Created At", key: "dateCreated", style: fixedHeaderStyle },

      { title: "Actual Cost", key: "actualCost", style: editableHeaderStyle },
      { title: "Ready to be Paid?", key: "readyToBePaid", style: editableHeaderStyle },
      { title: "Paid", key: "paid", style: editableHeaderStyle },
      { title: "Date Paid", key: "datePaid", style: editableHeaderStyle },
      {
        title: "Revisions Needed?",
        key: "revisionNeeded",
        style: editableHeaderStyle,
      },
      {
        title: "Date Paid",
        key: "revisionDatePaid",
        style: editableHeaderStyle,
      },
      {
        title: "Revision Cost",
        key: "revisionCost",
        style: editableHeaderStyle,
      },
      { title: "Notes/Remarks", key: "notes", style: editableHeaderStyle, className: "notes-cell" },
    ];
    // { title: "Sales Man", key: "salesMan", style: fixedHeaderStyle },
    // {
    //   title: "Total Project Cost",
    //   key: "totalProjectCost",
    //   style: editableHeaderStyle
    // }
    if (hasAdminToolsPermission) {
      headers.unshift({
        title: <Checkbox checked={selectedRows.length === currentPageData.length || selectedRows.length === maxAllowedSelection} indeterminate={selectedRows.length > 0 && selectedRows.length < currentPageData.length && selectedRows.length < maxAllowedSelection} onChange={handleSelectAll} sx={checkboxStyle} />,
        key: null,
        style: fixedHeaderStyle,
      });
      headers.push({
        title: "Create Expense/Expense Id",
        key: "expenseId",
        style: editableHeaderStyle,
      });
    }

    return headers.map((header, index) => (
      <th key={index} scope="col" style={header.style} className={header.className} onClick={() => header.key && requestSort(header.key)}>
        {header.title}
        {header.key && <SortIcon columnKey={header.key} />}
      </th>
    ));
  };

  return (
    <Paper elevation={3} sx={{ mt: 1 }}>
      <Box p={1}>
        <div className="table-wrapper">
          <table className="table table-hover text-center align-middle relative">
            <thead>
              <tr>{renderTableHeaders()}</tr>
            </thead>
            <tbody>{!isLoading && currentPageData.map((financeRow) => <FinanceRow key={financeRow.id} row={financeRow} hasAdminToolsPermission={hasAdminToolsPermission} isSelected={selectedRows.some((selectedRow) => selectedRow.id === financeRow.id)} onSelectRow={handleSelectRow} onEditRow={() => onEditRow(financeRow)} />)}</tbody>
          </table>

          {isLoading && <Loader />}

          {!isLoading && <PaginationCustom data={sortedData} pageNo={pageNo} rowsPerPage={rowsPerPage} isLoading={isLoading} onPageChange={onPageChange} handleRowsPerPageChange={handleRowsPerPageChange} />}
        </div>
      </Box>
    </Paper>
  );
};

export default FinanceTable;
