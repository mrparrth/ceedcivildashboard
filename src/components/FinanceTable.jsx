import React from "react";
import { useData } from "../contexts/data/DataContext";
import FinanceTableRow from "../components/FinanceRow";
import PaginationCustom from "./PaginationCustom";
import Loader from "./LoaderCustom";
import { useAuth } from "../contexts/auth/AuthContext";

const FinanceTable = ({ pageNo, onPageChange, data }) => {
  const { isLoading, error } = useData();
  const { user } = useAuth();

  const rowsPerPage = 10;

  const fixedHeaderStyle = {
    backgroundColor: "#343a40",
    color: "white",
  };

  const editableHeaderStyle = {
    backgroundColor: "#4a86e8",
    color: "white",
  };

  const isAdmin = user?.role?.toLowerCase() === "admin";

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
                data
                  .slice((pageNo - 1) * rowsPerPage, pageNo * rowsPerPage)
                  .map((financeRow) => (
                    <FinanceTableRow
                      key={financeRow.id}
                      row={financeRow}
                      isAdmin={isAdmin}
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
