import React, { useState, useContext, useEffect } from "react";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";

const Table = ({
  rows,
  currentPage,
  onPageChange,
  onOpenModal,
  viewRow,
  editRow,
  deleteRow,
}) => {
  const rowsPerPage = 10;

  // Calculate the index of the first and last row on the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentProjects = rows.slice(indexOfFirstRow, indexOfLastRow);
  const metaData = window.MetaData;
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  return (
    <>
      <table className="table table-hover text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th scope="col" className="text-start w-25">
              Project
            </th>
            <th scope="col">Project ID</th>
            <th scope="col">Job Number</th>
            <th scope="col">Assigned To</th>
            <th scope="col">Status</th>
            <th scope="col">State</th>
            <th scope="col">Files</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody className="px-4 py-2 text-center">
          {currentProjects.map((project, idx) => (
            <tr key={idx} className="hover:bg-gray-200">
              <td className="text-start w-25">{project.projectName}</td>
              <td>{project.projectNumber}</td>
              <td>{project.invoiceNumber}</td>
              <td>
                <select
                  className="form-select w-auto"
                  value={project.salesMan}
                  onChange={(e) => console.log(e.target.value)} // Replace with actual handler
                >
                  {metaData.salesmen.map((salesman) => (
                    <option key={salesman} value={salesman}>
                      {salesman}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  className="form-select w-auto"
                  value={project.overallProjectStatus}
                  onChange={(e) => console.log(e.target.value)} // Replace with actual handler
                >
                  {metaData.status.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  className="form-select w-auto"
                  value={project.state}
                  onChange={(e) => console.log(e.target.value)} // Replace with actual handler
                >
                  {metaData.states.map((stateName) => (
                    <option key={stateName} value={stateName}>
                      {stateName}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <a
                  href={project.projectFilesFolder}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline-none text-[15px] text-center pl-2.5"
                >
                  View Files
                </a>
              </td>
              <td>
                <div className="actions d-flex align-items-center">
                  <Button
                    className="secondary"
                    color="secondary"
                    onClick={() => viewRow(idx)} // Call the prop method for modal
                  >
                    <FaEye />
                  </Button>
                  <Button
                    className="success"
                    color="success"
                    onClick={() => editRow(idx)}
                  >
                    <FaPencilAlt />
                  </Button>
                  <Button
                    className="error"
                    color="error"
                    onClick={() => deleteRow(idx)}
                  >
                    <MdDelete />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center">
        <p>
          Showing <b>{indexOfFirstRow + 1}</b> to{" "}
          <b>{Math.min(indexOfLastRow, rows.length)}</b> of <b>{rows.length}</b>{" "}
          results
        </p>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={onPageChange} // Pass the page change handler here
          color="primary"
          showFirstButton
          showLastButton
        />
      </div>
    </>
  );
};

export default Table;
