import { useState } from 'react';
import data from './JsonData/Data.json';
import ProjectDetails from './ProjectDetails';

const ProjectTracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="flex flex-nowrap dashboard-container min-h-[700px] h-100">
      <div className="flex-1 p-6 pl-10" style={{ paddingLeft: '100px', marginLeft: '100px' }}>
        {/*------------------- Dashboard Table start------------------ */}
        <div className="container mx-auto mt-4">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-800 text-white text-[15px] h-[50px]">
              <tr>
                <th className="px-4 py-2 text-center">Project Name</th>
                {/* <th className="px-4 py-2 text-center">currentlyAssignedTo</th> */}
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
              {data.projects.map((project, i) => (
                <tr
                  key={i}
                  className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-100"} hover:bg-gray-200`}
                  style={{ height: "50px" }}
                >
                  <td className="px-4 py-2 text-[14px] text-left">{project.projectName}</td>
                  {/* <td className="px-4 py-2 text-[14px] text-left">{project.currentlyAssignedTo}</td> */}
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
                      <option key="-" value="" disabled></option>
                      {data.status.map((status) => (
                        <option key={status} value={status} selected={project.overallProjectStatus === status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <select className="form-select border-2 border-gray-200 rounded-[8px] p-1 w-[120px] h-[40px] text-[14px]">
                      <option key="-" value="" disabled></option>
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
        </div>
      </div>
      {/*------------------- Dashboard Table End------------------ */}

      {/*------------------- Popup Modal Start------------------ */}
      {isModalOpen && (
        <ProjectDetails project={selectedProject} handleCloseModal={handleCloseModal} />
      )}
      {/*------------------- Popup Modal End------------------ */}
    </div>
  );
};

export default ProjectTracker;
