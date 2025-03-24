import React, { useState } from "react";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { IconButton, Box } from "@mui/material";
import ProjectRow from "./ProjectRow";
import PaginationCustom from "../PaginationCustom";
import Loader from "../LoaderCustom";

import useData from "hooks/useData";

const ProjectTable = ({
  projects,
  pageNo,
  onPageChange,
  viewRow,
  editRow,
  showArchivedIcon
}) => {
  const { isLoading } = useData();
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc"
  });

  // Sorting function
  const sortedProjects = React.useMemo(() => {
    if (!sortConfig.key) return projects;

    return [...projects].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [projects, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;

    return sortConfig.direction === "asc" ? (
      <ArrowUpward fontSize="small" />
    ) : (
      <ArrowDownward fontSize="small" />
    );
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
  };

  const SortableHeader = ({ column, label, className = "" }) => (
    <th scope="col" className={className}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: column === "projectName" ? "flex-start" : "center",
          cursor: "pointer",
          userSelect: "none",
          "&:hover": {
            opacity: 0.8
          }
        }}
        onClick={() => requestSort(column)}>
        {label}
        <Box
          component="span"
          sx={{ ml: 0.5, display: "flex", alignItems: "center" }}>
          <SortIcon columnKey={column} />
        </Box>
      </Box>
    </th>
  );

  return (
    <>
      <table className="table table-hover text-center align-middle relative">
        <thead className="table-dark">
          <tr>
            <th scope="col" className="text-start"></th>
            <SortableHeader
              column="projectName"
              label="Project"
              className="text-start col-3"
            />
            <SortableHeader
              column="projectNumber"
              label="Project ID"
              className="col-1"
            />
            <SortableHeader
              column="invoiceNumber"
              label="Invoice Number"
              className="col-1"
            />
            <SortableHeader
              column="assignedTo"
              label="Assigned To"
              className="col-2"
            />
            <SortableHeader
              column="overallProjectStatus"
              label="Status"
              className="col-1"
            />
            <SortableHeader column="state" label="State" className="col-1" />
            <th scope="col" className="col-1">
              Files
            </th>
            <th scope="col" className="col-1">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="px-4 py-2 text-center">
          {!isLoading &&
            sortedProjects
              .slice((pageNo - 1) * rowsPerPage, pageNo * rowsPerPage)
              .map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  viewRow={viewRow}
                  editRow={editRow}
                  showArchivedIcon={showArchivedIcon}
                />
              ))}
        </tbody>
      </table>

      {isLoading && <Loader />}

      {!isLoading && (
        <PaginationCustom
          data={sortedProjects}
          pageNo={pageNo}
          rowsPerPage={rowsPerPage}
          isLoading={isLoading}
          onPageChange={onPageChange}
          handleRowsPerPageChange={handleRowsPerPageChange}
        />
      )}
    </>
  );
};

export default ProjectTable;
