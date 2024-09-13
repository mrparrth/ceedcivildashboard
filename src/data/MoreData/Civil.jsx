import { useState } from 'react';
import data from '../JsonData/Data.json'; // Adjust the path based on your file structure

const Civil = () => {
  const [project, setProject] = useState(data.projects[0]);

  // Accessing dropdown options from data.json
  const civilEngineeringNeedOptions = data.need;
  const civilEngineeringTaskedToOptions = data.taskTo;
  const civilEngineeringStatusOptions = data.status;

  const fields = [
    { label: "Civil Engineering Needed", name: "civilEngineering", type: "select", options: civilEngineeringNeedOptions },
    { label: "Civil Engineering Tasked To", name: "civilEngineeringTaskedTo", type: "select", options: civilEngineeringTaskedToOptions },
    { label: "Civil Engineering Status", name: "civilEngineeringStatus", type: "select", options: civilEngineeringStatusOptions },
    { label: "Civil Dropbox Link", name: "civilDropboxLink" },
    { label: "Civil Estimated Delivery Time", name: "civilEstimatedDeliveryTime", type: "date" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject(prevProject => ({ ...prevProject, [name]: value }));
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg backdrop-blur-md bg-opacity-30">
      <table className="w-full text-[13px] text-left text-gray-500 dark:text-gray-400">
        <tbody>
          {fields.map(({ label, name, type = "text", options }) => (
            <tr key={name} className="bg-transparent border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-green-100 dark:hover:bg-red-700">
              <td className="px-6 py-4 w-1/3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{label}</td>
              <td className="px-6 py-4 w-2/3">
                {type === "select" ? (
                  <select
                    name={name}
                    value={project[name] || ""} // Ensure the value is either the current value or an empty string
                    onChange={handleInputChange}
                    className="form-select border-2 border-gray-200 rounded-[8px] pl-2 w-full h-[30px] text-[14px]"
                  >
                    <option value="" disabled>Select {label}</option>
                    {options.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={project[name] || ""} // Ensure default value is empty if not set
                    onChange={handleInputChange}
                    className="form-select border-2 border-gray-200 rounded-[8px] pl-2 w-full h-[30px] text-[14px]"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Civil;
