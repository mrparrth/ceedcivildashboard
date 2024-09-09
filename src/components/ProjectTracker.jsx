import { useState, useEffect } from 'react';
import data from './JsonData/Data.json';
import ProjectDetails from './ProjectDetails';

const ProjectTracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setRowsPerPage(5);
      } else {
        setRowsPerPage(10);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value

    return () => window.removeEventListener('resize', handleResize);
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
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentProjects = data.projects.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.projects.length / rowsPerPage);

  return (
    <div className="flex flex-nowrap dashboard-container min-h-[700px] ">
      <div className="flex-1 mt-20 w-full">
        <table className="border border-gray-200 w-full">
          <thead className="bg-gray-800 text-white text-[15px] h-[50px]">
            <tr>
              <th className="px-4 py-2 text-center">Project Name</th>
              <th className="px-4 py-2 text-center">Project #</th>
              <th className="px-4 py-2 text-center">Invoice #</th>
              <th className="px-4 py-2 text-center">Sales Man</th>
              <th className="px-4 py-2 text-center">Overall Project Status</th>
              <th className="px-4 py-2 text-center">State</th>
              <th className="px-4 py-2 text-center">Project Files Folder</th>
              <th className="px-4 py-2 text-center">See More</th>
            </tr>
          </thead>
          <tbody className="px-4 py-2 text-center">
            {currentProjects.map((project, i) => (
              <tr
                key={i}
                className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-100"} hover:bg-gray-200`}
                style={{ height: "50px" }}
              >
                <td className="px-4 py-2 text-[14px] text-left">{project.projectName}</td>
                <td className="px-4 py-2 text-[14px]">{project.projectNumber}</td>
                <td className="px-4 py-2 text-[14px]">{project.invoiceNumber}</td>
                <td className="px-4 py-2">
                  <select className="form-select border-2 border-gray-200 rounded-[8px] p-1 w-[120px] h-[40px] text-[14px]">
                    {data.salesmen.map((salesman) => (
                      <option key={salesman} value={salesman} selected={project.salesMan === salesman}>
                        {salesman}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <select className="form-select border-2 border-gray-200 rounded-[8px] p-1 w-[120px] h-[40px] text-[14px]">
                    {data.status.map((status) => (
                      <option key={status} value={status} selected={project.overallProjectStatus === status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <select className="form-select border-2 border-gray-200 rounded-[8px] p-1 w-[120px] h-[40px] text-[14px]">
                    {data.states.map((stateName) => (
                      <option key={stateName} value={stateName} selected={project.state === stateName}>
                        {stateName}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2 text-[20px]">
                  <a
                    href={project.projectFilesFolder}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline-none text-[15px] text-center pl-2.5"
                  >
                    View Files
                  </a>
                </td>
                <td className="px-4 py-2">
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
        <div className="flex justify-center mt-0">
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
              className={`px-3 py-1 mx-1 h-[30px] text-[15px] ${currentPage === index + 1
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-700 text-gray-50'
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
      </div>

      {isModalOpen && (
        <ProjectDetails project={selectedProject} handleCloseModal={handleCloseModal} />
      )}
    </div>
  );
};

export default ProjectTracker;
