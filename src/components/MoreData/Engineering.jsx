import { useState } from 'react';
import data from '../JsonData/Data.json'; // Adjust the path based on your file structure

const Engineering = () => {
  const [project, setProject] = useState(data.projects[0]);

  // Accessing dropdown options from data.json
  const engineeringNeededOptions = data.Need;
  const engineerTaskedToOptions = data.TaskTo;
  const engineeringStatusOptions = data.Status;

  const fields = [
    { label: "Engineering Needed", name: "engineeringNeeded", type: "select", options: engineeringNeededOptions },
    { label: "Engineer Tasked To", name: "engineerTaskedTo", type: "select", options: engineerTaskedToOptions },
    { label: "Engineering Status", name: "engineeringStatus", type: "select", options: engineeringStatusOptions },
    { label: "Engineering Dropbox Link", name: "engineeringDropboxLink" },
    { label: "Engineering Estimated Delivery Time", name: "engineeringEstimatedDeliveryTime", type: "date" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg backdrop-blur-md bg-opacity-30">
      <table className="w-full text-[13px] text-left text-gray-500 dark:text-gray-400">
        <tbody>
          {fields.map(({ label, name, type = "text", options }) => (
            <tr key={name} className="bg-transparent border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-green-100 dark:hover:bg-green-700">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{label}</td>
              <td className="px-6 py-4">
                {type === "select" ? (
                  <select
                    name={name}
                    value={project[name]}
                    onChange={handleInputChange}
                    className="form-select border-2 border-gray-200 rounded-[8px] pl-2 w-full h-[30px] text-[14px]"
                  >
                    <option value="">Select {label}</option>
                    {options.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={project[name]}
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

export default Engineering;
