import React, { useState, useCallback } from "react";
import FinanceRow from "./FinanceRow";
import PaginationCustom from "../PaginationCustom";
import Loader from "../LoaderCustom";
import { Checkbox, FormControlLabel, Tooltip } from "@mui/material";
import useNotification from "../../hooks/useNotification";
import useData from "hooks/useData";
import useAuth from "hooks/useAuth";

const FinanceTable = ({
  pageNo,
  onPageChange,
  data,
  selectedRows,
  onRowSelection,
}) => {
  const { isLoading } = useData();
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const rowsPerPage = 10;
  const maxAllowedSelection = 7;

  const fixedHeaderStyle = {
    backgroundColor: "#343a40",
    color: "white",
  };

  const editableHeaderStyle = {
    backgroundColor: "#4a86e8",
    color: "white",
  };

  const checkboxStyle = {
    padding: 0,
    color: "white",
    "&.Mui-checked": { color: "white" },
    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" },
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

  const currentPageData = data.slice(
    (pageNo - 1) * rowsPerPage,
    pageNo * rowsPerPage
  );

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

  const renderTableHeaders = () => {
    const headers = [
      { title: "Actions", style: fixedHeaderStyle },
      { title: "Assignee", style: fixedHeaderStyle },
      { title: "Project #", style: fixedHeaderStyle },
      { title: "Project", style: fixedHeaderStyle },
      { title: "Sales Man", style: fixedHeaderStyle },
      { title: "Status", style: fixedHeaderStyle },
      { title: "Estimated Budget", style: fixedHeaderStyle },
      { title: "Actual Cost", style: editableHeaderStyle },
      { title: "Paid", style: editableHeaderStyle },
      { title: "Date Paid", style: editableHeaderStyle },
      { title: "Revision Needed?", style: editableHeaderStyle },
      { title: "Date Paid", style: editableHeaderStyle },
      { title: "Revision Cost", style: editableHeaderStyle },
      { title: "Revisions Paid?", style: editableHeaderStyle },
      { title: "Notes/Remarks", style: editableHeaderStyle },
      { title: "Total Project Cost", style: editableHeaderStyle },
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
        style: fixedHeaderStyle,
      });
      headers.push({
        title: "Create Expense/Expense Id",
        style: editableHeaderStyle,
      });
    }

    return headers.map((header, index) => (
      <th key={index} scope="col" style={header.style}>
        {header.title}
      </th>
    ));
  };

  return (
    <>
      <div className="card shadow border-0 p-3 mt-3">
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
              data={data}
              pageNo={pageNo}
              rowsPerPage={rowsPerPage}
              isLoading={isLoading}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default FinanceTable;
