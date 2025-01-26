import React, { useState, useRef } from "react";
import { Drafter, Engineering, MEP, Civil } from "../ExpandableSections";
import { SingleSelectDropdown, MultiSelectDropdown, CheckBox } from "../Fields";
import ConfirmationModal from "components/ConfirmationModal";
import useData from "hooks/useData";
import useappData from "hooks/useAppData";
import { BLANK_PROJECT } from "../../utils/constant";
import { getAssignedToBreakdown } from "utils/utils";

const ProjectModal = ({ closeModal, projectKey, viewOnly }) => {
  let { updateProject, createProject, projects } = useData();
  let { appData } = useappData();

  let initProject;
  if (projectKey)
    initProject = projects.find((project) => project.id == projectKey);

  const [project, setProject] = useState(initProject || BLANK_PROJECT);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [drafterToggle, setDrafterToggle] = useState(false);
  const [mepToggle, setMepToggle] = useState(false);
  const [enggToggle, setEnggToggle] = useState(false);
  const [civilToggle, setCivilToggle] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingProjectNumber, setPendingProjectNumber] = useState("");
  const hasShownConfirmation = useRef(false);
  const isNewProject = !projectKey;

  const handleInputChange = (key, value) => {
    if (key === "projectNumber" && value && !hasShownConfirmation.current) {
      setPendingProjectNumber(value);
      setShowConfirmation(true);
      return;
    }

    if (key == "") return;

    if (
      [
        "draftingEstimate",
        "engineeringEstimate",
        "mepEstimate",
        "civilEstimate"
      ].includes(key)
    ) {
      estimatedBudget = parseFloat(project.draftingEstimate) || 0;
      estimatedBudget += parseFloat(project.engineeringEstimate) || 0;
      estimatedBudget += parseFloat(project.mepEstimate) || 0;
      estimatedBudget += parseFloat(project.civilEstimate) || 0;
      estimatedBudget -= parseFloat(project[key]) || 0;
      estimatedBudget += parseFloat(value) || 0;

      setProject((prev) => ({ ...prev, [key]: value, estimatedBudget }));
    } else {
      setProject((prev) => ({ ...prev, [key]: value }));
    }

    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleManualProjectConfirmation = (confirmed) => {
    if (confirmed) {
      setProject((prev) => ({ ...prev, projectNumber: pendingProjectNumber }));
      hasShownConfirmation.current = true;
    }
    setShowConfirmation(false);
    setPendingProjectNumber("");
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

  const fieldRefs = {
    projectName: useRef(null),
    description: useRef(null),
    estimatedBudget: useRef(null)
  };

  const formFields = [
    { label: "Project Name", key: "projectName", ref: fieldRefs.projectName },
    {
      label: "Project Number",
      key: "projectNumber",
      placeholder: isNewProject ? "Leave empty to generate new number" : ""
    },
    { label: "Invoice Number", key: "invoiceNumber" },
    {
      label: "Salesman",
      key: "salesMan",
      isSingleSelect: true,
      options: appData.salesmen
    },
    {
      label: "Description",
      key: "description",
      isTextarea: true,
      ref: fieldRefs.description
    },
    {
      label: "Overall Status",
      key: "overallProjectStatus",
      isSingleSelect: true,
      options: appData.status
    },
    {
      label: "State",
      key: "state",
      isSingleSelect: true,
      options: appData.states
    },
    {
      label: "Priority",
      key: "priority",
      isSingleSelect: true,
      options: appData.priority
    },
    { label: "Project Files Folder", key: "projectFilesFolder" },
    { label: "Project Notes", key: "projectNotes", isTextarea: true },
    { label: "Contract Link", key: "contractLink" },
    {
      label: "Deposit Paid",
      key: "depositPaid",
      isCheckbox: true
    },
    {
      label: "Estimated Budget",
      key: "estimatedBudget",
      ref: fieldRefs.estimatedBudget,
      disabled: true,
      placeholder:
        "Autocalculated: Enter estimates For Engg, MEP, Drafting, Civil"
    },
    {
      label: "Initial Status",
      key: "initialProjectStatus",
      isSingleSelect: true,
      options: appData.initialStatus
    },
    {
      label: "Assigned To",
      key: "assignedTo",
      options: appData.assignTo,
      isMultiSelect: true
    },
    {
      label: "Client Project Name/Address",
      key: "clientProjectNameAddress",
      isTextarea: true
    }
  ];

  const getInputElement = (item) => {
    const commonProps = {
      id: item.key,
      ref: item.ref,
      className: `${item.baseClassName || ""} ${
        errors[item.key] ? "error" : ""
      }`
    };

    if (item.isSingleSelect) {
      return (
        <SingleSelectDropdown
          {...commonProps}
          options={item.options}
          selectedOption={project[item.key]}
          onChange={handleInputChange}
          label={item.label}
          viewOnly={viewOnly}
        />
      );
    }

    if (item.isMultiSelect) {
      return (
        <MultiSelectDropdown
          {...commonProps}
          options={item.options}
          selectedOptions={project[item.key]}
          setSelectedOptions={(newSelectedOptions) => {
            const {
              drafterTaskedTo,
              engineerTaskedTo,
              mepTaskedTo,
              civilTaskedTo
            } = getAssignedToBreakdown(newSelectedOptions, appData);

            handleInputChange(item.key, newSelectedOptions);
            handleInputChange("drafterTaskedTo", drafterTaskedTo);
            handleInputChange("drafterNeeded", drafterTaskedTo !== "");
            handleInputChange("engineerTaskedTo", engineerTaskedTo);
            handleInputChange("engineeringNeeded", engineerTaskedTo !== "");
            handleInputChange("mepTaskedTo", mepTaskedTo);
            handleInputChange("mepNeeded", mepTaskedTo !== "");
            handleInputChange("civilTaskedTo", civilTaskedTo);
            handleInputChange("civilNeeded", civilTaskedTo !== "");
          }}
          viewOnly={viewOnly}
        />
      );
    }

    if (item.isTextarea) {
      return (
        <textarea
          {...commonProps}
          id={item.key}
          value={project[item.key]}
          onChange={(e) => handleInputChange(item.key, e.target.value)}
          className="form-textarea"
          disabled={viewOnly}
        />
      );
    }

    if (item.isCheckbox) {
      return (
        <CheckBox
          {...commonProps}
          id={item.key}
          checked={project[item.key]}
          onChange={(value) => handleInputChange(item.key, value)}
          label={item.label}
          viewOnly={viewOnly}
        />
      );
    }

    return (
      <input
        {...commonProps}
        id={item.key}
        type="text"
        value={project[item.key]}
        onChange={(e) => handleInputChange(item.key, e.target.value)}
        readOnly={item.isEditable === false || viewOnly}
        className={`form-input text-wrap ${
          item.disabled ? "disabled-input" : ""
        }`}
        disabled={item.disabled}
        style={{
          minWidth: item.key == "projectName" ? "25em" : ""
        }}
        placeholder={item.placeholder}
      />
    );
  };

  const validateForm = () => {
    const newErrors = {};
    let firstErrorField = null;

    if (!project.projectName) {
      newErrors.projectName = "Project Name is required";
      firstErrorField = "projectName";
    }
    if (!project.description && !firstErrorField) {
      newErrors.description = "Description is required";
      firstErrorField = "description";
    }

    setErrors(newErrors);

    if (firstErrorField && fieldRefs[firstErrorField]?.current) {
      fieldRefs[firstErrorField].current.focus();
      fieldRefs[firstErrorField].current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
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
                  {getInputElement(item)}
                  {errors[item.key] && (
                    <div className="error-message">{errors[item.key]}</div>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={() => setDrafterToggle(!drafterToggle)}
              className="drafter-toggle bg-success text-white"
              type="button">
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
              type="button">
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
              type="button">
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
              type="button">
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

          <div
            className="form-footer"
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center"
            }}>
            <button
              onClick={closeModal}
              type="button"
              className="submit-button"
              style={{
                backgroundColor: "#dc3545"
              }}>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || viewOnly}
              className="submit-button">
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
        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleManualProjectConfirmation}
        title="Manual Project Number"
        message="Manually entering a project number may cause conflicts. Are you sure you want to proceed? Leave empty to auto-generate."
        choices={[
          { label: "Yes, I understand", value: true },
          { label: "No, auto-generate", value: false }
        ]}
        showCancel={false}
      />
    </>
  );
};

export default ProjectModal;
