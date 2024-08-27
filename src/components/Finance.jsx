import { useState, useEffect } from 'react'; // Import useEffect here
import data from './JsonData/Data.json';

const Finance = () => {
  const [projects, setProjects] = useState(data.projects);
  const [totalCost, setTotalCost] = useState(0);

  // Calculate total cost when component mounts
  useEffect(() => {
    const total = projects.reduce((sum, { Cost }) => sum + (Cost || 0), 0);
    setTotalCost(total);
  }, [projects]);

  const handleFilterByPersonAndDate = () => {
    // Implement your filter logic here
  };

  const handleFilterByProjectNumber = () => {
    // Implement your filter logic here
  };

  const handleFilterBySalesmanName = () => {
    // Implement your filter logic here
  };

  const handleFilterByCost = () => {
    // Implement your filter logic here
  };

  return (
    <div className="flex flex-nowrap dashboard-container min-h-[700px] h-100">
      <div className="flex-1 p-6 pl-10" style={{ paddingLeft: '100px', marginLeft: '100px' }}>
        {/*------------------- Dashboard Table start------------------ */}
        <div className="container mx-auto mt-4">
          <div className="flex justify-between mb-4">
            <div className="bg-gray-200 p-5 rounded h-[50px] flex items-center">
              <div className="text-lg font-bold" style={{ fontSize: '20px' }}>
                Total Cost:&nbsp;
                <span className="ml-2" style={{ padding: '0 10px' }}>
                  ${totalCost.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                id="filterByPersonAndDate"
                onClick={handleFilterByPersonAndDate}
                className="h-[50px] bg-green-500 text-white font-semibold py-2 px-4 rounded"
              >
                FILTER BY PERSON & DATE
              </button>
              <button
                id="filterBySalesman"
                onClick={handleFilterBySalesmanName}
                className="h-[50px] bg-yellow-500 text-white font-semibold py-2 px-4 rounded"
              >
                FILTER BY SALESMAN
              </button>
              <button
                id="filterByProjectNumber"
                onClick={handleFilterByProjectNumber}
                className="h-[50px] bg-blue-500 text-white font-semibold py-2 px-4 rounded"
              >
                FILTER BY PROJECT NUMBER
              </button>
              <button
                id="filterByCost"
                onClick={handleFilterByCost}
                className="h-[50px] bg-orange-500 text-white font-semibold py-2 px-4 rounded"
              >
                FILTER BY COSTS
              </button>
            </div>
          </div>
          {/* Project Table start */}
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
              {projects.map(({ projectName, projectNumber, invoiceNumber, salesMan, overallProjectStatus, state, projectFilesFolder }, i) => (
                <tr
                  key={i}
                  className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-100"} hover:bg-gray-200`}
                  style={{ height: "50px" }}
                >
                  <td className="px-4 py-2 text-[14px] text-left">{projectName}</td>
                  <td className="px-4 py-2 text-[14px]">{projectNumber}</td>
                  <td className="px-4 py-2 text-[14px]">{invoiceNumber}</td>
                  <td className="px-4 py-2">
                    <select className="form-select border-2 border-gray-200 rounded-[8px] p-1 w-[120px] h-[40px] text-[14px]">
                      {data.salesmen.map((salesman) => (
                        <option key={salesman} value={salesman} selected={salesMan === salesman}>
                          {salesman}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <select className="form-select border-2 border-gray-200 rounded-[8px] p-1 w-[120px] h-[40px] text-[14px]">
                      <option key="-" value="" disabled></option>
                      {data.status.map((status) => (
                        <option key={status} value={status} selected={overallProjectStatus === status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <select className="form-select border-2 border-gray-200 rounded-[8px] p-1 w-[120px] h-[40px] text-[14px]">
                      <option key="-" value="" disabled></option>
                      {data.states.map((stateName) => (
                        <option key={stateName} value={stateName} selected={state === stateName}>
                          {stateName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 text-[20px]">
                    <a
                      href={projectFilesFolder}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline-none text-[15px] text-center pl-2.5"
                    >
                      View Files
                    </a>
                  </td>
                  <td className="px-4 py-2 ">
                    <button
                      onClick={() => handleOpenModal({ projectName, projectNumber, invoiceNumber })}
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
    </div>
  );
};

export default Finance;
