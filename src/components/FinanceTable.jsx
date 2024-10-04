import React from "react";
import { useData } from "../contexts/DataContext";
import FinanceTableRow from "../components/FinanceRow";
import PaginationCustom from "./PaginationCustom";
import Loader from "./LoaderCustom";

const FinanceTable = ({ pageNo, onPageChange, data }) => {
  const { isLoading, error } = useData();

  const rowsPerPage = 10;

  return (
    <>
      <div className="card shadow border-0 p-3 mt-3">
        <div className="table-wrapper">
          <table className="table table-hover text-center align-middle relative">
            <thead className="table-dark">
              <tr>
                <th scope="col">Assignee</th>
                <th scope="col">Project #</th>
                <th scope="col">Project</th>
                <th scope="col">Sales Man</th>
                <th scope="col">Status</th>
                <th scope="col">Estimated Budget</th>
                <th scope="col">Actual Cost</th>
                <th scope="col">Paid</th>
                <th scope="col">Date Paid</th>
                <th scope="col">Revision Needed?</th>
                <th scope="col">Date Paid</th>
                <th scope="col">Revision Cost</th>
                <th scope="col">Revisions Paid?</th>
                <th scope="col">Notes/Remarks</th>
                <th scope="col">Total Project Cost</th>
                <th scope="col">Create Expense/Expense Id</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading &&
                data
                  .slice((pageNo - 1) * rowsPerPage, pageNo * rowsPerPage)
                  .map((financeRow) => (
                    <FinanceTableRow key={financeRow.id} row={financeRow} />
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
