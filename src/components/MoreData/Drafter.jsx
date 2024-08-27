import { useState } from 'react';
import data from '../JsonData/Data.json'; // Adjust the path based on your file structure

const Drafter = () => {
  const [project, setProject] = useState(data.projects[0]);

  const fields = [
    { label: "Drafter Needed", name: "drafterNeeded" },
    { label: "Drafter Tasked To", name: "drafterTaskedTo" },
    { label: "Drafting Status", name: "draftingStatus" },
    { label: "Drafting Dropbox Link", name: "draftingDropboxLink" },
    { label: "Drafting Estimated Delivery Time", name: "draftingEstimatedDeliveryTime", type: "date" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject(prevProject => ({ ...prevProject, [name]: value }));
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg backdrop-blur-md bg-opacity-30">
      <table className="w-full text-[13px] text-left text-gray-500 dark:text-gray-400">
        <tbody>
          {fields.map(({ label, name, type = "text" }) => (
            <tr key={name} className="bg-transparent border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-green-100 dark:hover:bg-green-700">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{label}</td>
              <td className="px-6 py-4">
                <input
                  type={type}
                  name={name}
                  value={project[name]}
                  onChange={handleInputChange}
                  className="form-select border-2 border-gray-200 rounded-[8px] pl-2 w-full h-[30px] text-[14px]"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Drafter;
