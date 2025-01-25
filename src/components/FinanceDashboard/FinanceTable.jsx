import React, { useState, useCallback } from "react";
import FinanceRow from "./FinanceRow";
import PaginationCustom from "../PaginationCustom";
import Loader from "../LoaderCustom";
import useNotification from "../../hooks/useNotification";
import useData from "hooks/useData";
import useAuth from "hooks/useAuth";
import { Paper, Box, Checkbox } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

const FinanceTable = ({
  pageNo,
  onPageChange,
  data,
  selectedRows,
  onRowSelection
}) => {
  const { isLoading } = useData();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc"
  });

  const rowsPerPage = 50;
  const maxAllowedSelection = 7;

  const fixedHeaderStyle = {
    backgroundColor: "#343a40",
    color: "white",
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
    paddingRight: "20px" // Space for sort icon
  };

  const editableHeaderStyle = {
    backgroundColor: "#4a86e8",
    color: "white",
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
    paddingRight: "20px" // Space for sort icon
  };

  const checkboxStyle = {
    padding: 0,
    color: "white",
    "&.Mui-checked": { color: "white" },
    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" }
  };

  const sortIconStyle = {
    position: "absolute",
    right: "4px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "16px"
  };

  // Sorting logic
  const sortData = useCallback(
    (data) => {
      if (!sortConfig.key) return data;

      return [...data].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle special cases
        if (
          sortConfig.key === "estimatedBudget" ||
          sortConfig.key === "actualCost" ||
          sortConfig.key === "paid" ||
          sortConfig.key === "revisionCost" ||
          sortConfig.key === "totalProjectCost"
        ) {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        }

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    },
    [sortConfig]
  );

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return (
      <span style={sortIconStyle}>
        {sortConfig.direction === "asc" ? (
          <ArrowUpward fontSize="small" />
        ) : (
          <ArrowDownward fontSize="small" />
        )}
      </span>
    );
  };

  const handleSelectRow = (row) => {
    const updatedSelection = selectedRows.some(
      (selectedRow) => selectedRow.id === row.id
    )
      ? selectedRows.filter((selectedRow) => selectedRow.id !== row.id)
      : [...selectedRows, row];
    onRowSelection(updatedSelection);
  };

  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const sortedData = sortData(data);

  const currentPageData = sortedData.slice(
    (pageNo - 1) * rowsPerPage,
    pageNo * rowsPerPage
  );


  const handleSelectAll = useCallback(
    (event) => {
      if (event.target.checked) {
        onRowSelection(currentPageData.slice(0, maxAllowedSelection));
        if (currentPageData.length > maxAllowedSelection) {
          addNotification({
            title: `You can create a maximum of ${maxAllowedSelection} expenses at a time`
          });
        }
      } else {
        onRowSelection([]);
      }
    },
    [currentPageData]
  );

  const renderTableHeaders = () => {
    const headers = [
      { title: "Actions", key: null, style: fixedHeaderStyle },
      { title: "Assignee", key: "assignee", style: fixedHeaderStyle },
      { title: "Project #", key: "projectNumber", style: fixedHeaderStyle },
      { title: "Project", key: "projectName", style: fixedHeaderStyle },
      { title: "Sales Man", key: "salesMan", style: fixedHeaderStyle },
      { title: "Status", key: "status", style: fixedHeaderStyle },
      {
        title: "Estimated Budget",
        key: "estimatedBudget",
        style: fixedHeaderStyle
      },
      { title: "Actual Cost", key: "actualCost", style: editableHeaderStyle },
      { title: "Paid", key: "paid", style: editableHeaderStyle },
      { title: "Date Paid", key: "datePaid", style: editableHeaderStyle },
      {
        title: "Revisions Needed?",
        key: "revisionNeeded",
        style: editableHeaderStyle
      },
      {
        title: "Date Paid",
        key: "revisionDatePaid",
        style: editableHeaderStyle
      },
      {
        title: "Revision Cost",
        key: "revisionCost",
        style: editableHeaderStyle
      },
      { title: "Notes/Remarks", key: "notes", style: editableHeaderStyle },
      {
        title: "Total Project Cost",
        key: "totalProjectCost",
        style: editableHeaderStyle
      }
    ];

    if (isAdmin) {
      headers.unshift({
        title: (
          <Checkbox
            checked={
              selectedRows.length === currentPageData.length ||
              selectedRows.length === maxAllowedSelection
            }
            indeterminate={
              selectedRows.length > 0 &&
              selectedRows.length < currentPageData.length &&
              selectedRows.length < maxAllowedSelection
            }
            onChange={handleSelectAll}
            sx={checkboxStyle}
          />
        ),
        key: null,
        style: fixedHeaderStyle
      });
      headers.push({
        title: "Create Expense/Expense Id",
        key: "expenseId",
        style: editableHeaderStyle
      });
    }

    return headers.map((header, index) => (
      <th
        key={index}
        scope="col"
        style={header.style}
        onClick={() => header.key && requestSort(header.key)}>
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
            <tbody>
              {!isLoading &&
                currentPageData.map((financeRow) => (
                  <FinanceRow
                    key={financeRow.id}
                    row={financeRow}
                    isAdmin={isAdmin}
                    isSelected={selectedRows.some(
                      (selectedRow) => selectedRow.id === financeRow.id
                    )}
                    onSelectRow={handleSelectRow}
                  />
                ))}
            </tbody>
          </table>

          {isLoading && <Loader />}

          {!isLoading && (
            <PaginationCustom
              data={sortedData}
              pageNo={pageNo}
              rowsPerPage={rowsPerPage}
              isLoading={isLoading}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </Box>
    </Paper>
  );
};

export default FinanceTable;
