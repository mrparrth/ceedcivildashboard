import React, { useState } from "react";
import { Drafter, Engineering, MEP, Civil } from "./ExpandableSections";
import { SingleSelectDropdown, MultiSelectDropdown, CheckBox } from "./Fields";
import { useData } from "../contexts/data/DataContext";

const ProjectModal = ({ closeModal, projectKey, viewOnly }) => {
  let { metadata, updateProject, createProject, projects } = useData();

  const defaultProject = {
    projectNumber: "",
    invoiceNumber: "",
    projectName: "",
    salesMan: "",
    description: "",
    overallProjectStatus: "",
    state: "",
    priority: "",
    projectFilesFolder: "",
    projectNotes: "",
    clientProjectNameAddress: "",
    assignedTo: [], // Array
    contractLink: "",
    depositPaid: false, // Boolean
    estimatedBudget: "",
    actualCost: "",
    initialProjectStatus: "",
    drafterNeeded: false, // Boolean
    drafterTaskedTo: "",
    draftingStatus: "",
    draftingDropboxLink: "",
    draftingEstimatedDeliveryTime: "",
    engineeringNeeded: false, // Boolean
    engineerTaskedTo: "",
    engineeringStatus: "",
    engineeringDropboxLink: "",
    engineeringEstimatedDeliveryTime: "",
    mepNeeded: false, // Boolean
    mepTaskedTo: "",
    mepStatus: "",
    mepDropboxLink: "",
    mepEstimatedDeliveryTime: "",
    civilNeeded: false, // Boolean
    civilEngineeringTaskedTo: "",
    civilEngineeringStatus: "",
    civilDropboxLink: "",
    civilEstimatedDeliveryTime: "",
    jobType: "",
    isArchived: false,
  };

  let initProject;
  if (projectKey)
    initProject = projects.find((project) => project.id == projectKey);

  const [project, setProject] = useState(initProject || defaultProject);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [drafterToggle, setDrafterToggle] = useState(false);
  const [mepToggle, setMepToggle] = useState(false);
  const [enggToggle, setEnggToggle] = useState(false);
  const [civilToggle, setCivilToggle] = useState(false);
  const isNewProject = !projectKey;

  const handleInputChange = (key, value) => {
    setProject((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    //change
    // if (!project.projectName)
    //   newErrors.projectName = "Project Name is required";
    // if (!project.salesMan) newErrors.salesMan = "Salesman is required";
    // if (!project.description) newErrors.description = "Description is required";
    // if (!project.overallProjectStatus)
    //   newErrors.overallProjectStatus = "Overall Status is required";
    // if (!project.state) newErrors.state = "State is required";
    // if (!project.priority) newErrors.priority = "Priority is required";
    // if (!project.estimatedBudget)
    //   newErrors.estimatedBudget = "Estimated Budget is required";

    // setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        if (isNewProject) {
          await createProject(project);
          closeModal();
        } else {
          updateProject(project);
          closeModal();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setErrors(
          "An error occurred while saving the project. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const formFields = [
    { label: "Project Name", key: "projectName" },
    {
      label: "Project Number",
      key: "projectNumber",
      isEditable: isNewProject,
      placeholder: isNewProject ? "Leave empty to generate new number" : "",
    },
    { label: "Invoice Number", key: "invoiceNumber" },
    {
      label: "Salesman",
      key: "salesMan",
      isSingleSelect: true,
      options: metadata.salesmen,
    },
    { label: "Description", key: "description", isTextarea: true },
    {
      label: "Overall Status",
      key: "overallProjectStatus",
      isSingleSelect: true,
      options: metadata.status,
    },
    {
      label: "State",
      key: "state",
      isSingleSelect: true,
      options: metadata.states,
    },
    {
      label: "Priority",
      key: "priority",
      isSingleSelect: true,
      options: metadata.priority,
    },
    { label: "Project Files Folder", key: "projectFilesFolder" },
    { label: "Project Notes", key: "projectNotes", isTextarea: true },
    { label: "Contract Link", key: "contractLink" },
    {
      label: "Deposit Paid",
      key: "depositPaid",
      isCheckbox: true,
    },
    { label: "Estimated Budget", key: "estimatedBudget" },
    {
      label: "Initial Status",
      key: "initialProjectStatus",
      isSingleSelect: true,
      options: metadata.initialStatus,
    },
    {
      label: "Assigned To",
      key: "assignedTo",
      options: metadata.assignTo,
      isMultiSelect: true,
    },
    {
      label: "Client Project Name/Address",
      key: "clientProjectNameAddress",
      isTextarea: true,
    },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={closeModal} className="close-button">
          ×
        </button>
        <h2 className="modal-title">
          {isNewProject ? "Create New Project" : "Project Details"}
        </h2>
        <form className="project-form">
          {formFields.map((item) => (
            <div key={item.key} className="form-row">
              <label htmlFor={item.key} className="form-label">
                {item.label}
              </label>
              <div className="form-field">
                {item.isSingleSelect ? (
                  <SingleSelectDropdown
                    itemKey={item.key}
                    options={item.options}
                    selectedOption={project[item.key]}
                    onChange={handleInputChange}
                    label={item.label}
                    viewOnly={viewOnly}
                  />
                ) : item.isMultiSelect ? (
                  <MultiSelectDropdown
                    options={item.options}
                    selectedOptions={project[item.key]}
                    setSelectedOptions={(newSelectedOptions) =>
                      handleInputChange(item.key, newSelectedOptions)
                    }
                    viewOnly={viewOnly}
                  />
                ) : item.isTextarea ? (
                  <textarea
                    id={item.key}
                    value={project[item.key]}
                    onChange={(e) =>
                      handleInputChange(item.key, e.target.value)
                    }
                    className="form-textarea"
                    disabled={viewOnly}
                  />
                ) : item.isCheckbox ? (
                  <CheckBox
                    id={item.key}
                    checked={project[item.key]}
                    onChange={(value) => handleInputChange(item.key, value)}
                    label={item.label}
                    viewOnly={viewOnly}
                  />
                ) : (
                  <input
                    id={item.key}
                    type="text"
                    value={project[item.key]}
                    onChange={(e) =>
                      handleInputChange(item.key, e.target.value)
                    }
                    readOnly={item.isEditable === false || viewOnly}
                    className="form-input text-wrap"
                    style={{
                      minWidth: item.key == "projectName" ? "25em" : "",
                    }}
                    placeholder={item.placeholder}
                  />
                )}
                {errors[item.key] && (
                  <div className="error-message">{errors[item.key]}</div>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={() => setDrafterToggle(!drafterToggle)}
            className="drafter-toggle bg-success text-white"
            type="button"
          >
            Drafter Details
            <span className={`dropdown-arrow ${drafterToggle ? "open" : ""}`}>
              ▼
            </span>
          </button>
          {drafterToggle && (
            <Drafter
              data={project}
              setter={(itemKey, value) => handleInputChange(itemKey, value)}
              viewOnly={viewOnly}
            />
          )}

          <button
            onClick={() => setEnggToggle(!enggToggle)}
            className="drafter-toggle bg-warning text-dark"
            type="button"
          >
            Engineering Details
            <span className={`dropdown-arrow ${enggToggle ? "open" : ""}`}>
              ▼
            </span>
          </button>
          {enggToggle && (
            <Engineering
              data={project}
              setter={(itemKey, value) => handleInputChange(itemKey, value)}
              viewOnly={viewOnly}
            />
          )}

          <button
            onClick={() => setMepToggle(!mepToggle)}
            className="drafter-toggle bg-dark text-light"
            type="button"
          >
            MEP Details
            <span className={`dropdown-arrow ${mepToggle ? "open" : ""}`}>
              ▼
            </span>
          </button>
          {mepToggle && (
            <MEP
              data={project}
              setter={(itemKey, value) => handleInputChange(itemKey, value)}
              viewOnly={viewOnly}
            />
          )}

          <button
            onClick={() => setCivilToggle(!civilToggle)}
            className="drafter-toggle text-light"
            style={{ backgroundColor: "#5378e4" }}
            type="button"
          >
            CIVIL Details
            <span className={`dropdown-arrow ${civilToggle ? "open" : ""}`}>
              ▼
            </span>
          </button>
          {civilToggle && (
            <Civil
              data={project}
              setter={(itemKey, value) => handleInputChange(itemKey, value)}
              viewOnly={viewOnly}
            />
          )}
        </form>

        <div className="form-footer">
          <button
            onClick={handleSubmit}
            disabled={loading || viewOnly}
            className="submit-button"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {isNewProject ? "Creating..." : "Saving..."}
              </>
            ) : isNewProject ? (
              "Create Project"
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
        {showAlert && (
          <div className="alert-success">
            {isNewProject
              ? "Project created successfully!"
              : "Project updated successfully!"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectModal;
