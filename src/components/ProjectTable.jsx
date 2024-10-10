import React, { useState, useContext, useEffect } from "react";

import ProjectTableRow from "../components/ProjectRow";
import { useData } from "../contexts/data/DataContext";
import PaginationCustom from "./PaginationCustom";
import Loader from "./LoaderCustom";

const ProjectTable = ({ projects, pageNo, onPageChange, viewRow, editRow }) => {
  const { error, isLoading } = useData();
  const rowsPerPage = 10;

  return (
    <>
      <table className="table table-hover text-center align-middle relative">
        <thead className="table-dark">
          <tr>
            <th scope="col" className="text-start"></th>
            <th scope="col" className="text-start col-3">
              Project
            </th>
            <th scope="col" className="col-1">
              Project ID
            </th>
            <th scope="col" className="col-1">
              Job Number
            </th>
            <th scope="col" className="col-2">
              Assigned To
            </th>
            <th scope="col" className="col-1">
              Status
            </th>
            <th scope="col" className="col-1">
              State
            </th>
            <th scope="col" className="col-1">
              Files
            </th>
            <th scope="col" className="col-1">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="px-4 py-2 text-center ">
          {!isLoading &&
            projects
              .slice((pageNo - 1) * rowsPerPage, pageNo * rowsPerPage)
              .map((project) => (
                <ProjectTableRow
                  key={project.id}
                  project={project}
                  viewRow={viewRow}
                  editRow={editRow}
                />
              ))}
        </tbody>
      </table>

      {isLoading && <Loader />}

      {!isLoading && (
        <PaginationCustom
          data={projects}
          pageNo={pageNo}
          rowsPerPage={rowsPerPage}
          isLoading={isLoading}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default ProjectTable;
