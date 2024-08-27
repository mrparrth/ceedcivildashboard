import { useState } from 'react';
import data from './JsonData/Data.json';
const Archieve = () => {

        const [isModalOpen, setIsModalOpen] = useState(false);
        const [selectedProject, setSelectedProject] = useState(null);
        const [isExpandedDrafter, setIsExpandedDrafter] = useState(false);
        const [isExpandedEngineering, setIsExpandedEngineering] = useState(false);
        const [isExpandedMEP, setIsExpandedMEP] = useState(false); // State for MEP expansion
        const [isExpandedCivil, setIsExpandedCivil] = useState(false); // State for Civil expansion
        const [showAlert, setShowAlert] = useState(false);
        const handleSubmit = () => {
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000); // Hide alert after 3 seconds
        };
        const handleOpenModal = (project) => {
          setSelectedProject(project);
          setIsModalOpen(true);
        };
      
        const handleCloseModal = () => {
          setIsModalOpen(false);
          setSelectedProject(null);
        };
      
        const toggleExpandDrafter = () => {
          setIsExpandedDrafter(!isExpandedDrafter);
          if (isExpandedEngineering) {
            setIsExpandedEngineering(false);
          }
          if (isExpandedMEP) {
            setIsExpandedMEP(false);
          }
          if (isExpandedCivil) {
            setIsExpandedCivil(false);
          }
        };
      
        const toggleExpandEngineering = () => {
          setIsExpandedEngineering(!isExpandedEngineering);
          if (isExpandedDrafter) {
            setIsExpandedDrafter(false);
          }
          if (isExpandedMEP) {
            setIsExpandedMEP(false);
          }
          if (isExpandedCivil) {
            setIsExpandedCivil(false);
          }
        };
      
        const toggleExpandMEP = () => {
          setIsExpandedMEP(!isExpandedMEP);
          if (isExpandedDrafter) {
            setIsExpandedDrafter(false);
          }
          if (isExpandedEngineering) {
            setIsExpandedEngineering(false);
          }
          if (isExpandedCivil) {
            setIsExpandedCivil(false);
          }
        };
      
        const toggleExpandCivil = () => {
          setIsExpandedCivil(!isExpandedCivil);
          if (isExpandedDrafter) {
            setIsExpandedDrafter(false);
          }
          if (isExpandedEngineering) {
            setIsExpandedEngineering(false);
          }
          if (isExpandedMEP) {
            setIsExpandedMEP(false);
          }
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
                  className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-100"
                    } hover:bg-gray-200`}
                  style={{ height: "50px" }}
                >
                  <td className="px-4 py-2 text-[14px] text-left">
                    {project.projectName}
                  </td>
                  <td className="px-4 py-2 text-[14px]">
                    {project.projectNumber}
                  </td>
                  <td className="px-4 py-2 text-[14px]">
                    {project.invoiceNumber}
                  </td>
                  <td className="px-4 py-2">
                    <select className="form-select border-2 border-gray-200 rounded-[8px] p-1 w-[120px] h-[40px] text-[14px]">
                      {data.salesmen.map((salesman) => {
                        return (
                          <option
                            key={salesman}
                            value={salesman}
                            selected={project.salesMan === salesman}
                          >
                            {salesman}
                          </option>
                        );
                      })}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <select className="form-select border-2 border-gray-200 rounded-[8px] p-1 w-[120px] h-[40px] text-[14px]">
                      <option key="-" value="" disabled></option>
                      {data.status.map((status) => (
                        <option
                          key={status}
                          value={status}
                          selected={project.overallProjectStatus === status} >
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <select className="form-select border-2 border-gray-200 rounded-[8px] p-1 w-[120px] h-[40px] text-[14px]">
                      <option key="-" value="" disabled></option>
                      {data.states.map((stateName) => {
                        return (
                          <option
                            key={stateName}
                            value={stateName}
                            selected={project.state === stateName}
                          >
                            {stateName}
                          </option>
                        );
                      })}
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

                  <td className="px-4 py-2 ">
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
      
      
      {/*------------------- Popup Table start------------------ */}
            {/* Modal for Project Details start*/}
            {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-1/3 h-[600px] overflow-y-auto relative">
            <button
              onClick={handleCloseModal}
              className="bg-red-500 p-2 absolute top-2 right-2 rounded-lg hover:bg-red-600 hover:shadow-lg transition-all duration-200"
            >
              <i className="text-4xl bi-x-lg text-white"></i>
            </button>

            <h2 className="text-xl font-bold mb-4">Project Details</h2>
            {selectedProject && (
              <table className="w-full">
                <tbody>
                  {[
                    {
                      label: "Project Name",
                      key: "projectName",
                      isInput: true,
                    },
                    {
                      label: "Project #",
                      key: "projectNumber",
                      isInput: false,
                    },
                    {
                      label: "Invoice #",
                      key: "invoiceNumber",
                      isInput: false,
                    },
                    {
                      label: "Salesman",
                      key: "salesman",
                      isInput: false,
                      options: data.salesmen || [],
                    },
                    { label: "Description", key: "description", isInput: true },
                    {
                      label: "Overall Status",
                      key: "overallProjectStatus",
                      isInput: false,
                      options: data.status,
                    },
                    {
                      label: "State",
                      key: "state",
                      isInput: false,
                      options: data.states || [],
                    },
                    { label: "Priority", key: "Priority", isInput: true },
                    {
                      label: "Project Files Folder",
                      key: "projectFilesFolder",
                      isInput: false,
                    },
                    {
                      label: "Project Notes",
                      key: "projectNotes",
                      isInput: true,
                    },
                    { label: "Contract Link", key: "Contract", isInput: true },
                    {
                      label: "Deposit Paid",
                      key: "depositPaid",
                      isInput: true,
                    },
                    {
                      label: "Estimated Budget",
                      key: "estimatedBudget",
                      isInput: true,
                    },
                    {
                      label: "Initial Status",
                      key: "initialProjectStatus",
                      isInput: true,
                    },
                    {
                      label: "Currently Assigned",
                      key: "currentlyAssignedTo",
                      isInput: false,
                      options: selectedProject["currentlyAssignedTo"],
                    },
                    {
                      label: "Address",
                      key: "clientProjectNameAddress",
                      isInput: true,
                    },
                  ].map((item, index) => (
                    <tr
                      key={index}
                      className={`border-b ${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <td className="px-2 py-1 font-medium">{item.label}</td>
                      <td className="px-2 py-1">
                        {item.isInput &&
                        item.key !== "Project#" &&
                        item.key !== "Invoice#" ? (
                          item.key === "projectAddress" ? (
                            <textarea
                              defaultValue={selectedProject[item.key]}
                              className="border border-gray-300 rounded px-2 py-1 w-full h-[100px]"
                            />
                          ) : (
                            <input
                              type="text"
                              defaultValue={selectedProject[item.key]}
                              className="border border-gray-300 rounded px-2 py-1 w-full"
                            />
                          )
                        ) : item.key === "projectNumber" ||
                          item.key === "invoiceNumber" ? (
                          <div className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-50 text-gray-700">
                            {selectedProject[item.key]}
                          </div>
                        ) : item.options ? (
                          <select
                            defaultValue={selectedProject[item.key]}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                          >
                            {item.options.map((option,) => (
                              <option
                                key={option}
                                value={option}
                                selected={option === selectedProject[item.key]}
                              >
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <a
                            href={selectedProject[item.key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            View Files
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* --------------End Modal for Project Details----------- */}

            {/*-------------------------- Expandable DRAFTER Section -------*/}
            <div className="mt-4">
              <button
                onClick={toggleExpandDrafter}
                className={`w-full flex items-center justify-between bg-green-500 text-black py-2 px-4 rounded h-[40px] text-center text-[15px] ${
                  isExpandedDrafter ? "bg-green-500" : "bg-green-300"
                }`}
              >
                <span>DRAFTING DETAILS</span>
                <span className="text-[24px]">
                  {isExpandedDrafter ? "-" : "+"}
                </span>
              </button>

              {isExpandedDrafter && (
                <div className="mt-4">
                  <div className="bg-green-300 text-black px-4 py-2 rounded mb-2">
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <label
                        htmlFor="drafterNeed"
                        className="font-medium self-center"
                      >
                        DRAFTER Need
                      </label>
                      <input
                        type="text"
                        id="drafterNeed"
                        className="border bg-green-200 rounded px-2 py-1 w-full"
                      />
                    </div>
                  </div>

                  <div className="bg-green-300 text-black px-4 py-2 rounded mb-2">
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <label
                        htmlFor="drafterTasked"
                        className="font-medium self-center"
                      >
                        DRAFTER Tasked To
                      </label>
                      <input
                        type="text"
                        id="drafterTasked"
                        className="border bg-green-200 rounded px-2 py-1 w-full"
                      />
                    </div>
                  </div>

                  <div className="bg-green-300 text-black px-4 py-2 rounded mb-2">
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <label
                        htmlFor="drafterStatus"
                        className="font-medium self-center"
                      >
                        DRAFTER Status
                      </label>
                      <input
                        type="text"
                        id="drafterStatus"
                        className="border bg-green-200 rounded px-2 py-1 w-full"
                      />
                    </div>
                  </div>

                  <div className="bg-green-300 text-black px-4 py-2 rounded mb-2">
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <label
                        htmlFor="drafterDropBoxLink"
                        className="font-medium self-center"
                      >
                        DRAFTER DropBox Link
                      </label>
                      <input
                        type="text"
                        id="drafterDropBoxLink"
                        className="border bg-green-200 rounded px-2 py-1 w-full"
                      />
                    </div>
                  </div>

                  <div className="bg-green-300 text-black px-4 py-2 rounded mb-2">
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <label
                        htmlFor="drafterEstimateTime"
                        className="font-medium self-center"
                      >
                        DRAFTER Estimate Time
                      </label>
                      <input
                        type="text"
                        id="drafterEstimateTime"
                        className="border bg-green-200 rounded px-2 py-1 w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Expandable ENGINEERING Section */}
            <div className="mt-4">
              <button
                onClick={toggleExpandEngineering}
                className={`w-full flex items-center justify-between bg-blue-300 py-2 px-4 rounded h-[40px] text-center text-[15px] ${
                  isExpandedEngineering ? "bg-blue-600" : "bg-blue-300"
                }`}
              >
                <span>ENGINEERING DETAILS</span>
                <span className="text-[24px]">
                  {isExpandedEngineering ? "-" : "+"}
                </span>
              </button>

              {isExpandedEngineering && (
                <div className="mt-4">
                  <div className="bg-blue-300 text-black px-4 py-2 rounded mb-2">
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <label
                        htmlFor="engineeringNeed"
                        className="font-medium self-center"
                      >
                        ENGINEERING Need
                      </label>
                      <input
                        type="text"
                        id="engineeringNeed"
                        className="border bg-blue-200 rounded px-2 py-1 w-full"
                      />
                    </div>
                  </div>
                  {/* Add additional fields for ENGINEERING if needed */}
                </div>
              )}
            </div>

            {/* Expandable MEP Section */}
            <div className="mt-4">
              <button
                onClick={toggleExpandMEP}
                className={`w-full flex items-center justify-between bg-purple-300 py-2 px-4 rounded h-[40px] text-center text-[15px] ${
                  isExpandedMEP ? "bg-purple-600" : "bg-purple-300"
                }`}
              >
                <span>MEP DETAILS</span>
                <span className="text-[24px]">{isExpandedMEP ? "-" : "+"}</span>
              </button>

              {isExpandedMEP && (
                <div className="mt-4">
                  <div className="bg-purple-300 text-black px-4 py-2 rounded mb-2">
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <label
                        htmlFor="mepNeed"
                        className="font-medium self-center"
                      >
                        MEP Need
                      </label>
                      <input
                        type="text"
                        id="mepNeed"
                        className="border bg-purple-200 rounded px-2 py-1 w-full"
                      />
                    </div>
                  </div>
                  {/* Add additional fields for MEP if needed */}
                </div>
              )}
            </div>

            {/* Expandable CIVIL Section */}
            <div className="mt-4">
              <button
                onClick={toggleExpandCivil}
                className={`w-full flex items-center justify-between bg-yellow-300 py-2 px-4 rounded h-[40px] text-center text-[15px] ${
                  isExpandedCivil ? "bg-yellow-600" : "bg-yellow-300"
                }`}
              >
                <span>CIVIL DETAILS</span>
                <span className="text-[24px]">
                  {isExpandedCivil ? "-" : "+"}
                </span>
              </button>

              {isExpandedCivil && (
                <div className="mt-4">
                  <div className="bg-yellow-300 text-black px-4 py-2 rounded mb-2">
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <label
                        htmlFor="civilNeed"
                        className="font-medium self-center"
                      >
                        CIVIL Need
                      </label>
                      <input
                        type="text"
                        id="civilNeed"
                        className="border bg-yellow-200 rounded px-2 py-1 w-full"
                      />
                    </div>
                  </div>
                  {/* Add additional fields for CIVIL if needed */}
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white h-[50px] w-[100px] rounded hover:bg-green-600 text-[18px]"
              >
                Submit
              </button>
              {showAlert && (
                <div className="fixed top-4 right-4 bg-green-500 text-white p-5 text-[18px] rounded shadow transition-opacity duration-500">
                  Submitted successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
          </div>
        );
      };

export default Archieve
