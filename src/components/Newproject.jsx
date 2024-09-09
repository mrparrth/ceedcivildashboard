import { useState } from 'react';
import EditableField from './EditableField';
import DrafterDetails from './MoreData/Drafter';
import EngineeringDetails from './MoreData/Engineering';
import MEPDetails from './MoreData/Mep';
import CivilDetails from './MoreData/Civil';
import data from './JsonData/Data.json';

const Dropdown = ({ value, onChange, options, label }) => (
  <select
    className="bg-gray-50 border border-gray-300 text-gray-900 text-[13px] rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
    value={value || ''}
    onChange={onChange}
  >
    <option value="">Choose {label}</option>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

const CheckboxList = ({ options, selectedOptions, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-white border border-gray-300 rounded-md p-2 text-gray-700 text-[13px] w-full h-[30px] flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-gray-600"
      >
        {label}
        <svg
          className="w-4 h-4 ms-2 text-gray-500 dark:text-gray-300"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg dark:bg-gray-700">
          <ul className="p-2 space-y-1 text-sm text-gray-700 dark:text-gray-200">
            {options.map((option) => (
              <li key={option}>
                <div className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600">
                  <input
                    id={`checkbox-${option}`}
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => onChange(option)}
                    className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-700 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor={`checkbox-${option}`}
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {option}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const NewProject = ({ project = {} }) => {
  const [editableProject, setEditableProject] = useState({
    ...project,
    drafterDetails: {},
    mepDetails: {},
    civilDetails: {},
    engineeringDetails: {},
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [assignedOptions, setAssignedOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (key, value) => {
    setEditableProject((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckboxChange = (option) => {
    setAssignedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const validateFields = () => {
    const newErrors = {};
    if (!editableProject.projectName) newErrors.projectName = 'Project Name is required.';
    if (!editableProject.projectNumber) newErrors.projectNumber = 'Project Number is required.';
    if (!editableProject.invoiceNumber) newErrors.invoiceNumber = 'Invoice Number is required.';
    if (!editableProject.salesMan) newErrors.salesMan = 'SalesMan Name is required.';
    if (!editableProject.overallProjectStatus) newErrors.overallProjectStatus = 'Select OverallProjectStatus.';
    if (!editableProject.state) newErrors.state = 'State is required.';
    if (!editableProject.estimatedBudget) newErrors.estimatedBudget = 'EstimatedBudget is required.';
    if (!editableProject.currentlyAssignedTo) newErrors.currentlyAssignedTo = 'Select CurrentlyAssignedTo.';
    // Add more validation rules as needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateFields()) return;

    setLoading(true);

    setTimeout(() => {
      console.log('Submitted Project Details:', editableProject);

      let foundIndex = data.projects.findIndex(project => project.projectNumber === editableProject.projectNumber);
      if (foundIndex !== -1) {
        data.projects[foundIndex] = editableProject;
      } else {
        data.projects.push(editableProject);
      }

      console.log('Updated Data:', data);

      setLoading(false);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }, 5000);
  };

  const renderInput = (item) => {
    const error = errors[item.key];
    return (
      <div>
        {item.isDropdown ? (
          item.isMultiple ? (
            <CheckboxList
              options={item.options}
              selectedOptions={assignedOptions}
              onChange={handleCheckboxChange}
              label={item.label}
            />
          ) : (
            <Dropdown
              value={editableProject[item.key]}
              onChange={(e) => handleInputChange(item.key, e.target.value)}
              options={item.options}
              label={item.label}
            />
          )
        ) : item.isTextarea ? (
          <textarea
            className="bg-gray-50 border border-gray-300 text-gray-900 text-[13px] rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 h-[50px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
            value={editableProject[item.key] || ''}
            onChange={(e) => handleInputChange(item.key, e.target.value)}
          />
        ) : (
          <EditableField
            value={editableProject[item.key] || ''}
            onChange={(value) => handleInputChange(item.key, value)}
            isEditable={item.isEditable}
          />
        )}
        {error && <p className="text-red-500 text-[12px] mt-1">{error}</p>}
      </div>
    );
  };

  return (
    <div className="rounded-lg w-full h-[600px] overflow-y-none relative m-0">
      <h1 className="font-bold mb-5 text-[25px] text-center">Create New Project</h1>
      <div className="relative overflow-x-none shadow-lg p-5 rounded-[8px]">
        <table className="w-full text-sm text-left border-2 border-gray-200 text-green-500 dark:text-gray-400 rounded-[8px]">
          <tbody>
            {[
              { label: 'Project Name', key: 'projectName', isEditable: true },
              { label: 'Project #', key: 'projectNumber', isEditable: true },
              { label: 'Invoice #', key: 'invoiceNumber', isEditable: true },
              { label: 'Salesman', key: 'salesMan', isDropdown: true, options: data.salesmen },
              { label: 'Description', key: 'description', isTextarea: true },
              { label: 'Overall Status', key: 'overallProjectStatus', isDropdown: true, options: data.status },
              { label: 'State', key: 'state', isDropdown: true, options: data.states },
              { label: 'Priority', key: 'priority', isDropdown: true, options: data.priority },
              { label: 'Project Files Folder', key: 'projectFilesFolder', isEditable: true },
              { label: 'Project Notes', key: 'projectNotes', isTextarea: true },
              { label: 'Contract Link', key: 'contractLink', isEditable: true },
              { label: 'Deposit Paid', key: 'depositPaid', isDropdown: true, options: data.depositPaid },
              { label: 'Estimated Budget', key: 'estimatedBudget', isEditable: true },
              { label: 'Initial Status', key: 'initialProjectStatus', isDropdown: true, options: data.innitialStatus },
              { label: 'Currently Assigned', key: 'currentlyAssignedTo', isDropdown: true, options: data.currentlyAssigned, isMultiple: true },
              { label: 'Client Project Name/Address', key: 'clientProjectNameAddress', isTextarea: true },
            ].map((item, index) => (
              <tr
                key={index}
                className={`odd:bg-[#f9fafb] odd:dark:bg-gray-200 even:bg-[#f9fafb] even:dark:bg-gray-400 border-b dark:border-gray-200 hover:bg-[#eaedf0] odd:hover:bg-[#d2d8de] even:hover:bg-[#f4f5f7] cursor-pointer`}
              >
                <th
                  scope="row"
                  className="w-1/4 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-[15px]"
                >
                  {item.label}
                </th>
                <td className="px-4 py-2">
                  {item.key === 'projectFilesFolder' ? (
                    <input
                      type="text"
                      value={editableProject.projectFilesFolder || ''}
                      onChange={(e) => handleInputChange('projectFilesFolder', e.target.value)}
                      className="w-full font-[13px] text-sm text-gray-500 border border-gray-300 rounded-lg p-2 mt-3 "
                    />
                  ) : (
                    renderInput(item)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full mt-5 flex items-center justify-between text-[20px] rounded-lg p-5 hover:shadow-lg h-[50px] bg-gray-600 text-gray-50"
      >
        More Details
        <svg
          className="w-4 h-4 ms-2 text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-2 mt-2 rounded-lg border-gray-300 p-2  w-full overflow-x-auto">
          <DrafterDetails drafter={editableProject.drafter} handleInputChange={handleInputChange} />      
          <EngineeringDetails engineering={editableProject.engineeringDetails} />
          <MEPDetails mep={editableProject.mepDetails} />
          <CivilDetails civil={editableProject.civilDetails} />
          
        </div>
      )}

      <div className="flex mt-6  space-x-2 items-center justify-center pb-10">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#0b5508] text-white p-2 rounded-[8px] hover:bg-[#0a3369] hover:shadow-lg transition-all duration-200 text-[14px] flex items-center justify-center w-[100px] h-[40px]"
        >
          {loading && (
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 mr-2 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.59c0 27.61-22.39 50-50 50S0 78.2 0 50.59C0 22.98 22.39.59 50 .59s50 22.39 50 50z"
                fill="currentColor"
              />
              <path
                d="M93.97 39.04c-2.51-8.72-7.52-16.55-14.15-22.1C73.78 7.39 65.09 3.68 55.68 3.08c-9.41-.6-18.53 1.68-26.22 6.58l4.66 6.47c6.29-4.06 13.57-6.14 21.05-5.57 7.48.56 14.47 3.76 20.05 8.9 5.58 5.13 9.54 11.89 11.44 19.38l7.31-2.41z"
                fill="#E5E7EB"
              />
            </svg>
          )}
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#e4290c] text-[14px] text-[#f1f2f4] p-2 rounded-[8px] hover:bg-[#26468B] hover:text-white hover:shadow-lg transition-all duration-200 w-[100px] h-[40px]"
        >
          Cancel
        </button>
      </div>

      {showAlert && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg w-[250px] h-[50px] text-[18px] flex items-center justify-center">
          <i className="bi-check2 text-[20px] mr-2"></i>
          Project Saved!
        </div>
      )}
    </div>
  );
};

export default NewProject;
