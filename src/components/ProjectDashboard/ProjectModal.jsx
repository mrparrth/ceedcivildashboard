import React, { useState, useRef } from "react";
import { Drafter, Engineering, MEP, Civil } from "../ExpandableSections";
import { SingleSelectDropdown, MultiSelectDropdown, CheckBox } from "../Fields";
import ConfirmationModal from "components/ConfirmationModal";
import useData from "hooks/useData";
import useAppData from "hooks/useAppData";
import { BLANK_PROJECT } from "../../utils/constant";
import { getAssignedToBreakdown } from "utils/utils";
import URLInput from "components/UrlInput";
import CustomTextArea from "components/CustomTextArea";
import ChatBox from "./ChatBox";
import { Box, Typography, Button, IconButton } from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ArchiveIcon from "@mui/icons-material/Archive";
import CloseIcon from "@mui/icons-material/Close";
import useAuth from "hooks/useAuth";
import { PERMISSIONS, AUTH_ROLES } from "contexts/auth/authRoles";

const ProjectModal = ({ closeModal, projectKey, viewOnly }) => {
  let { updateProject, createProject, projects, addNewChat, updateChat, archiveProjects } = useData();
  let { appData } = useAppData();
  let { user } = useAuth();

  let initProject;
  if (projectKey) initProject = projects.find((project) => project.id == projectKey);

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
  const [showArchiveConfirmation, setShowArchiveConfirmation] = useState(false);

  const handleInputChange = (key, value) => {
    if (key === "projectNumber" && value && !hasShownConfirmation.current && isNewProject) {
      setPendingProjectNumber(value);
      setShowConfirmation(true);
      return;
    }
    if (key == "") return;

    if (["draftingEstimate", "engineeringEstimate", "mepEstimate", "civilEstimate"].includes(key)) {
      let estimatedBudget = parseFloat(project.draftingEstimate) || 0;
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
        setErrors("An error occurred while saving the project. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const fieldRefs = {
    projectName: useRef(null),
    description: useRef(null),
    estimatedBudget: useRef(null),
  };

  const clientInfo = [
    { label: "Client Email", key: "clientEmail" },
    { label: "Client Phone", key: "clientPhone" },
  ];

  const formFields = [
    { label: "Project Name", key: "projectName", ref: fieldRefs.projectName },
    {
      label: "Project Number",
      key: "projectNumber",
      placeholder: isNewProject ? "Leave empty to generate new number" : "",
    },
    { label: "Invoice Number", key: "invoiceNumber" },
    {
      label: "Project Type",
      key: "projectType",
      isSingleSelect: true,
      options: appData.projectType,
    },
    {
      label: "Salesman",
      key: "salesMan",
      isSingleSelect: true,
      options: appData.salesmen,
    },
    {
      label: "Scope Of Work",
      key: "description",
      isTextarea: true,
      ref: fieldRefs.description,
    },
    {
      label: "Overall Status",
      key: "overallProjectStatus",
      isSingleSelect: true,
      options: appData.status,
    },
    {
      label: "State",
      key: "state",
      isSingleSelect: true,
      options: appData.states,
    },
    {
      label: "Priority",
      key: "priority",
      isSingleSelect: true,
      options: appData.priority,
    },
    { label: "Project Files Folder", key: "projectFilesFolder", isUrl: true },
    { label: "Project Notes", key: "projectNotes", isTextarea: true },
    { label: "Contract Link", key: "contractLink" },
    {
      label: "Deposit Paid",
      key: "depositPaid",
      isCheckbox: true,
    },
    {
      label: "Estimated Budget",
      key: "estimatedBudget",
      ref: fieldRefs.estimatedBudget,
      disabled: true,
      placeholder: "Autocalculated: Enter estimates For Engg, MEP, Drafting, Civil",
    },
    {
      label: "Initial Status",
      key: "initialProjectStatus",
      isSingleSelect: true,
      options: appData.initialStatus,
    },
    {
      label: "Assigned To",
      key: "assignedTo",
      options: appData.assignTo,
      isMultiSelect: true,
    },
    {
      label: "Who Is Working On It",
      key: "personWorking",
      isSingleSelect: true,
      options: project.assignedTo,
    },
    {
      label: "Client Project Name/Address",
      key: "clientProjectNameAddress",
      isTextarea: true,
    },
  ];

  const getInputElement = (formField) => {
    const commonProps = {
      id: formField.key,
      ref: formField.ref,
      className: `${formField.baseClassName || ""} ${errors[formField.key] ? "error" : ""}`,
    };

    if (formField.isSingleSelect) {
      return <SingleSelectDropdown {...commonProps} options={formField.options} selectedOption={project[formField.key] || ""} onChange={handleInputChange} label={formField.label} viewOnly={viewOnly} />;
    }

    if (formField.isMultiSelect) {
      return (
        <MultiSelectDropdown
          {...commonProps}
          options={formField.options}
          selectedOptions={project[formField.key]}
          setSelectedOptions={(newSelectedOptions) => {
            if (formField.key == "assignedTo") {
              const { draftingTaskedTo, engineeringTaskedTo, mepTaskedTo, civilTaskedTo } = getAssignedToBreakdown(newSelectedOptions, appData);

              handleInputChange(formField.key, newSelectedOptions);
              handleInputChange("draftingTaskedTo", draftingTaskedTo);
              handleInputChange("draftingNeeded", draftingTaskedTo.length > 0);
              handleInputChange("engineeringTaskedTo", engineeringTaskedTo);
              handleInputChange("engineeringNeeded", engineeringTaskedTo.length > 0);
              handleInputChange("mepTaskedTo", mepTaskedTo);
              handleInputChange("mepNeeded", mepTaskedTo.length > 0);
              handleInputChange("civilTaskedTo", civilTaskedTo);
              handleInputChange("civilNeeded", civilTaskedTo.length > 0);
            } else if (["draftingTaskedTo", "engineeringTaskedTo", "mepTaskedTo", "civilTaskedTo"].includes(formField.key)) {
              let section = formField.key.replace("TaskedTo", "");
              let neededField = section + "Needed";
              handleInputChange(neededField, newSelectedOptions.length > 0);

              let oldSelOptions = project[formField.key];
              handleInputChange("assignedTo", [...project["assignedTo"].filter((u) => !oldSelOptions.includes(u)), ...newSelectedOptions]);
            }
          }}
          viewOnly={viewOnly}
        />
      );
    }

    if (formField.isTextarea) {
      return <CustomTextArea {...commonProps} id={formField.key} value={project[formField.key]} onChange={(e) => handleInputChange(formField.key, e.target.value)} className="form-textarea" disabled={viewOnly} />;
    }

    if (formField.isCheckbox) {
      return <CheckBox {...commonProps} id={formField.key} checked={project[formField.key]} onChange={(value) => handleInputChange(formField.key, value)} label={formField.label} viewOnly={viewOnly} />;
    }

    if (formField.isUrl) {
      return (
        <URLInput
          {...commonProps}
          id={formField.key}
          value={project[formField.key]}
          onChange={(e) => handleInputChange(formField.key, e.target.value)}
          readOnly={formField.isEditable === false || viewOnly}
          className={`form-input text-wrap ${formField.disabled ? "disabled-input" : ""}`}
          disabled={formField.disabled}
          style={{
            minWidth: formField.key == "projectName" ? "20em" : "",
          }}
          placeholder={formField.placeholder}
        />
      );
    }

    return <input {...commonProps} id={formField.key} type="text" value={project[formField.key]} onChange={(e) => handleInputChange(formField.key, e.target.value)} readOnly={formField.isEditable === false || viewOnly} className={`form-input text-wrap ${formField.disabled ? "disabled-input" : ""}`} disabled={formField.disabled} placeholder={formField.placeholder} />;
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
        block: "center",
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSendMessage = (chat) => {
    // Update local state immediately for better UX
    setProject((prev) => ({
      ...prev,
      chats: [...(prev.chats || []), chat],
    }));

    // Update global state
    if (!isNewProject) addNewChat(project.id, chat);
  };

  const handleMessageCompletion = (updatedChat) => {
    setProject((prev) => ({
      ...prev,
      chats: prev.chats.map((pChat) => (pChat.id === updatedChat.id ? { ...pChat, ...updatedChat } : pChat)),
    }));

    if (!isNewProject) updateChat(project.id, updatedChat);
  };

  const handleArchiveClick = () => {
    if (project.isArchived) {
      alert("Project is already archived");
      return;
    }
    setShowArchiveConfirmation(true); // Show the confirmation modal
  };

  const confirmArchive = (confirmed) => {
    if (confirmed) {
      archiveProjects([project.id]);
      closeModal();
    }
    setShowArchiveConfirmation(false); // Close the confirmation modal
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content container-fluid">
          <div
            className="modal-header"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}>
            {!isNewProject && !project.isArchived && (
              <IconButton
                color="primary"
                onClick={() => handleArchiveClick()} // Replace with your archive logic
                title="Archive Project"
                style={{
                  position: "absolute",
                  left: "16px",
                }}>
                <ArchiveIcon />
              </IconButton>
            )}
            <h2 className="modal-title">{isNewProject ? "Create New Project" : `Project Details${viewOnly ? " (READ MODE)" : ""}`}</h2>
            <div
              style={{
                position: "absolute",
                right: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
              <IconButton
                color="secondary"
                onClick={closeModal} // Close the modal
                title="Close Modal">
                <CloseIcon />
              </IconButton>
            </div>
          </div>

          <div className="row flex-column flex-lg-row justify-content-center mt-6">
            <div className="col-12 col-lg-6 mb-4 mb-lg-0">
              <div className="project-form">
                {formFields.map((formField) => (
                  <div key={formField.key} className="form-row">
                    <label htmlFor={formField.key} className="form-label">
                      {formField.label}
                    </label>
                    <div className="form-field">
                      {getInputElement(formField)}
                      {errors[formField.key] && <div className="error-message">{errors[formField.key]}</div>}
                    </div>
                  </div>
                ))}
                {(project.clientEmail || project.clientPhone) && AUTH_ROLES[user.role].includes(PERMISSIONS.viewContacts) ? (
                  <>
                    <hr className="section-divider" />
                    <div className="client-contact-info">
                      <h4>Client Contact Info</h4>
                      <div className="project-form">
                        {clientInfo.map((formField) => (
                          <div key={formField.key} className="form-row">
                            <label htmlFor={formField.key} className="form-label">
                              {formField.label}
                            </label>
                            <div className="form-field">{getInputElement(formField)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            <div className="col-auto px-4 d-none d-lg-block">
              <div className="vr h-100"></div>
            </div>
            <div className="col-12 col-lg-5">
              <div className="d-flex flex-column gap-2">
                <div className="d-flex flex-column gap-1">
                  {project.draftingTaskedTo.length === 0 && project.engineeringTaskedTo.length === 0 && project.mepTaskedTo.length === 0 && project.civilTaskedTo.length === 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 2,
                        backgroundColor: "#f8f9fa",
                        borderRadius: 1,
                        border: "1px solid #e0e0e0",
                        mb: 2,
                      }}>
                      <LightbulbIcon sx={{ color: "primary.main", fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Assign to a Drafter, Engineer, MEP or Civil to show this section
                      </Typography>
                    </Box>
                  )}
                  {["draftingTaskedTo", "engineeringTaskedTo", "mepTaskedTo", "civilTaskedTo"].map((key) => {
                    const toggleState = {
                      draftingTaskedTo: drafterToggle,
                      engineeringTaskedTo: enggToggle,
                      mepTaskedTo: mepToggle,
                      civilTaskedTo: civilToggle,
                    }[key];
                    const setToggleState = {
                      draftingTaskedTo: setDrafterToggle,
                      engineeringTaskedTo: setEnggToggle,
                      mepTaskedTo: setMepToggle,
                      civilTaskedTo: setCivilToggle,
                    }[key];
                    const Component = {
                      draftingTaskedTo: Drafter,
                      engineeringTaskedTo: Engineering,
                      mepTaskedTo: MEP,
                      civilTaskedTo: Civil,
                    }[key];
                    const label = {
                      draftingTaskedTo: "Drafter Details",
                      engineeringTaskedTo: "Engineering Details",
                      mepTaskedTo: "MEP Details",
                      civilTaskedTo: "CIVIL Details",
                    }[key];
                    const buttonClass = {
                      draftingTaskedTo: "bg-success text-white",
                      engineeringTaskedTo: "bg-warning text-dark",
                      mepTaskedTo: "bg-dark text-light",
                      civilTaskedTo: "text-light",
                    }[key];
                    const buttonStyle = key === "civilTaskedTo" ? { backgroundColor: "#5378e4" } : {};

                    return project[key].length > 0 ? (
                      <React.Fragment key={key}>
                        <button onClick={() => setToggleState(!toggleState)} className={`drafter-toggle ${buttonClass}`} style={buttonStyle} type="button">
                          {label}
                          <span className={`dropdown-arrow ${toggleState ? "open" : ""}`}>▼</span>
                        </button>
                        {toggleState && <Component data={project} setter={(itemKey, value) => handleInputChange(itemKey, value)} viewOnly={viewOnly} />}
                      </React.Fragment>
                    ) : null;
                  })}
                </div>
              </div>
              <hr className="section-divider" />

              {/* Chat Section */}
              <Box sx={{ mt: 2 }}>
                <ChatBox chats={project.chats} onSendMessage={handleSendMessage} onMessageComplete={handleMessageCompletion} />
              </Box>
            </div>
          </div>
          <div
            className="form-footer"
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
            }}>
            <button
              onClick={closeModal}
              type="button"
              className="submit-button"
              style={{
                backgroundColor: "#dc3545",
              }}>
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading || viewOnly} className="submit-button">
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
          { label: "No, auto-generate", value: false },
        ]}
        showCancel={false}
      />
      <ConfirmationModal
        isOpen={showArchiveConfirmation}
        onClose={() => setShowArchiveConfirmation(false)}
        onConfirm={confirmArchive}
        title="Archive Project"
        message="Are you sure you want to archive this project?"
        choices={[
          { label: "Yes, Archive", value: true },
          { label: "Cancel", value: false },
        ]}
        showCancel={false}
      />
    </>
  );
};

export default ProjectModal;
