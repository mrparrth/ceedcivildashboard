import { useState, useEffect, useContext } from "react";
import data from "../data/JsonData/Data.json";
import ProjectDetails from "./ProjectDetails";
import { MyContext } from "../App";

const ProjectTracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const context = useContext(MyContext);

  useEffect(() => {
    context.setisHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the index of the first and last row on the current page
  const rowsPerPage = 25;
  const indexOfLastRow = 200;
  const indexOfFirstRow = 0;
  const currentProjects = data.projects.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.projects.length / rowsPerPage);

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive mt-3 table-scrollable">
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
                {currentProjects.map((project, i) => (
                  <tr key={i} className={`hover:bg-gray-200`}>
                    <td className="text-start w-25">{project.projectName}</td>
                    <td>{project.projectNumber}</td>
                    <td>{project.invoiceNumber}</td>
                    <td>
                      <select className="form-select w-auto">
                        {data.salesmen.map((salesman) => (
                          <option
                            key={salesman}
                            value={salesman}
                            selected={project.salesMan === salesman}
                          >
                            {salesman}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select className="form-select w-auto">
                        {data.status.map((status) => (
                          <option
                            key={status}
                            value={status}
                            selected={project.overallProjectStatus === status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select className="form-select w-auto">
                        {data.states.map((stateName) => (
                          <option
                            key={stateName}
                            value={stateName}
                            selected={project.state === stateName}
                          >
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
                      <button
                        onClick={() => handleOpenModal(project)}
                        className="bg-blue-500 text-white text-[12px] p-5 rounded hover:bg-blue-600"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-10">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 h-[30px] text-[15px] bg-gray-700 text-gray-50 rounded hover:bg-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 mx-1 h-[30px] text-[15px] ${
                    currentPage === index + 1
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 text-gray-50"
                  } rounded hover:bg-gray-600`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 h-[30px] text-[15px] bg-gray-700 text-gray-50 rounded hover:bg-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>

            {isModalOpen && (
              <ProjectDetails
                project={selectedProject}
                handleCloseModal={handleCloseModal}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectTracker;
