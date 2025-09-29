import React, { useState, useEffect, useRef } from "react";
import { SingleSelectDropdown, CheckBox } from "../Fields";
import useData from "hooks/useData";
import useAppData from "hooks/useAppData";
import useAuth from "hooks/useAuth";
import { BLANK_PAYMENT } from "../../utils/constant";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { BillingItemsModal } from "components/ProjectDashboard";
import { PERMISSIONS, AUTH_ROLES } from "contexts/auth/authRoles";

const NewPaymentModal = ({ closeModal, payment: existingPayment }) => {
  const { createPayment, updatePayment, projects } = useData();
  const { appData } = useAppData();
  const { user } = useAuth();
  const isEditing = !!existingPayment?.id;
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const [payment, setPayment] = useState({
    ...(isEditing ? existingPayment : BLANK_PAYMENT),
    assignee: isEditing ? existingPayment.assignee : isAdmin ? "" : user.manager || user.name,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [suggestion, setSuggestion] = useState("");
  const projectNameRef = useRef(null);
  const [billingModalOpen, setBillingModalOpen] = useState(false);

  useEffect(() => {
    payment.revisionNeeded
      ? setPayment((prev) => ({
          ...prev,
          actualCost: "",
          datePaid: "",
          paid: false,
        }))
      : setPayment((prev) => ({
          ...prev,
          revisionCost: "",
          datePaid2: "",
          revisionsPaid: false,
        }));
  }, [payment.revisionNeeded]);

  useEffect(() => {
    const { projectNumber, projectName, assignee } = payment;
    if ((projectNumber || projectName) && assignee) {
      updateEstimate();
    }

    // if (projectNumber || projectName) {
    //   const matchingProject = findMatchingProject();
    //   console.log("matchingProject", matchingProject);
    //   if (matchingProject) {
    //     setPayment((prev) => ({
    //       ...prev,
    //       projectNumber: matchingProject.projectNumber,
    //       projectName: matchingProject.projectName,
    //       salesMan: matchingProject.salesMan,
    //       overallProjectStatus: matchingProject.overallProjectStatus,
    //     }));
    //     setSuggestion("");
    //   }
    // }
  }, [payment.projectNumber, payment.projectName, payment.assignee]);

  const findMatchingProject = () => {
    return projects.find((project) => (project.projectNumber && project.projectNumber === payment.projectNumber) || (project.projectName && project.projectName.toLowerCase() === payment.projectName.toLowerCase()));
  };

  const updateEstimate = () => {
    const matchingProject = findMatchingProject();
    if (!matchingProject || !payment.assignee) return;

    const estimateMap = {
      drafting: {
        team: matchingProject.draftingTaskedTo,
        value: matchingProject.draftingEstimate,
      },
      mep: {
        team: matchingProject.mepTaskedTo,
        value: matchingProject.mepEstimate,
      },
      civil: {
        team: matchingProject.civilTaskedTo,
        value: matchingProject.civilEstimate,
      },
      engineering: {
        team: matchingProject.engineeringTaskedTo,
        value: matchingProject.engineeringEstimate,
      },
    };

    const assigneeEstimate = Object.values(estimateMap).find(({ team }) => team.includes(payment.assignee))?.value || matchingProject.estimatedBudget;

    setPayment((prev) => ({
      ...prev,
      estimatedBudget: assigneeEstimate,
    }));
  };

  const handleInputChange = (field, value) => {
    setPayment((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (field === "projectName") {
      if (value?.length < 3) {
        setSuggestion("");
      } else {
        handleProjectNameSuggestion(value);
      }
    } else if (field === "projectNumber") {
      if (value?.length >= 3) {
        const matchingProject = projects.find((project) => project.projectNumber == value);
        if (matchingProject) {
          setPayment((prev) => ({ ...prev, projectName: matchingProject.projectName }));
        }
      } else {
        setPayment((prev) => ({ ...prev, projectName: "" }));
      }
    }
  };

  const handleProjectNameSuggestion = (value) => {
    const matchingProject = projects.find((project) => project.projectName.toLowerCase().startsWith(value.toLowerCase()));

    if (matchingProject && value !== matchingProject.projectName) {
      setSuggestion(matchingProject.projectName + " - Press TAB to select");
    } else {
      setSuggestion("");
    }
  };

  const populateProjectDetails = (value, type) => {
    const projectDetails = projects.find((project) => (type === "number" ? project.projectNumber == value : project.projectName.toLowerCase() === value.toLowerCase()));
    if (!projectDetails) return;

    if (projectDetails) {
      setPayment((prev) => ({
        ...prev,
        projectNumber: projectDetails.projectNumber,
        projectName: projectDetails.projectName,
        salesMan: projectDetails.salesMan,
        overallProjectStatus: projectDetails.overallProjectStatus,
      }));
      setSuggestion("");
    } else {
      // setErrors((prev) => ({
      //   ...prev,
      //   [type === "number" ? "projectNumber" : "projectName"]:
      //     "Project not found",
      // }));
    }
  };

  const handleProjectNameKeyDown = (e) => {
    if (e.key === "Tab" && suggestion) {
      e.preventDefault();
      const matchingProject = projects.find((project) => project.projectName.toLowerCase().startsWith(payment.projectName.toLowerCase()));
      const remainingSuggestion = matchingProject.projectName.slice(payment.projectName.length);

      const fullProjectName = payment.projectName + remainingSuggestion;
      setPayment((prev) => ({ ...prev, projectName: fullProjectName }));
      setSuggestion("");
      populateProjectDetails(fullProjectName, "name");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!payment.assignee) newErrors.assignee = "Assignee is required";
    if (!payment.projectNumber) newErrors.projectNumber = "Project # is required";
    if (!payment.projectName) newErrors.projectName = "Project Name is required";
    // if (!payment.salesMan) newErrors.salesMan = "Sales Man is required";
    // if (!payment.status) newErrors.status = "Status is required";
    // if (!payment.estimatedBudget)
    //   newErrors.estimatedBudget = "Estimated Budget is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        isEditing ? await updatePayment(payment) : await createPayment(payment);
        closeModal();
      } catch (error) {
        console.error(`Error ${isEditing ? "updating" : "creating"} payment:`, error);
        setErrors({
          submit: `An error occurred while ${isEditing ? "updating" : "creating"} the payment. Please try again.`,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const formFields = [
    {
      label: "Assignee",
      key: "assignee",
      isSingleSelect: true,
      options: appData.assignTo,
      isDisabled: !isAdmin,
    },
    { label: "Project #", key: "projectNumber", placeHolder: "Type to search" },
    {
      label: "Project",
      key: "projectName",
      placeHolder: "Type to search",
    },
    {
      label: "Estimated Budget",
      key: "estimatedBudget",
      isDisabled: true,
      placeHolder: "Estimated budget is auto populated using project number",
    },
    {
      label: "Actual Cost",
      key: "actualCost",
      isDisabled: payment.revisionNeeded,
      placeHolder: payment.revisionNeeded ? "Uncheck revision needed to enter actual cost" : "",
    },
    {
      label: "Ready to be Paid?",
      key: "readyToBePaid",
      isCheckbox: true,
    },
    {
      label: "Paid?",
      key: "paid",
      isCheckbox: true,
      isDisabled: payment.revisionNeeded,
    },
    {
      label: "Date Paid",
      key: "datePaid",
      isDate: true,
      isDisabled: payment.revisionNeeded,
    },
    { label: "Revision Needed?", key: "revisionNeeded", isCheckbox: true },
    {
      label: "Date Paid",
      key: "datePaid2",
      isDate: true,
      isDisabled: !payment.revisionNeeded,
    },
    {
      label: "Revision Cost",
      key: "revisionCost",
      isDisabled: !payment.revisionNeeded,
      placeHolder: !payment.revisionNeeded ? "Check revision needed to enter revision cost" : "",
    },
    {
      label: "Revisions Paid?",
      key: "revisionsPaid",
      isCheckbox: true,
      isDisabled: !payment.revisionNeeded,
    },
    { label: "Notes/Remarks", key: "notes", isTextarea: true },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: "1000px" }}>
        <button onClick={closeModal} className="close-button">
          ×
        </button>
        <h2 className="modal-title">{isEditing ? "Update Payment" : "Create New Payment"}</h2>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 2 }}>
          <Box
            sx={{
              flex: 3,
              paddingRight: "16px",
              borderRight: "1px solid #e0e0e0",
            }}>
            <form className="project-form">
              {formFields.map((field) => (
                <div key={field.key} className="form-row">
                  <label htmlFor={field.key} className="form-label">
                    {field.label}
                    {(field.key === "assignee" || field.key === "projectNumber" || field.key === "projectName") && <span style={{ color: "red", marginLeft: "4px" }}>*</span>}
                  </label>
                  <div className="form-field">
                    {field.key === "projectNumber" ? (
                      <input id={field.key} type="text" value={payment[field.key]} onChange={(e) => handleInputChange(field.key, e.target.value)} disabled={field.isDisabled} className="form-input" placeholder={field.placeHolder} />
                    ) : field.key == "projectName" ? (
                      <>
                        <div className="inline-autocomplete-container">
                          <input ref={projectNameRef} type="text" value={payment.projectName} onChange={(e) => handleInputChange("projectName", e.target.value)} onKeyDown={handleProjectNameKeyDown} className="form-input" placeholder={field.placeHolder} disabled={field.isDisabled} />
                        </div>

                        <div className="inline-suggestion">{suggestion && <span className="suggestion-text">{suggestion}</span>}</div>
                      </>
                    ) : field.isSingleSelect ? (
                      <SingleSelectDropdown id={field.key} options={field.options} selectedOption={payment[field.key]} onChange={handleInputChange} label={field.label} viewOnly={field.isDisabled} />
                    ) : field.isCheckbox ? (
                      <CheckBox id={field.key} checked={payment[field.key]} onChange={(value) => handleInputChange(field.key, value)} label={field.label} disabled={field.isDisabled} />
                    ) : field.isDate ? (
                      <input id={field.key} type="date" value={payment[field.key]} onChange={(e) => handleInputChange(field.key, e.target.value)} className="form-input" disabled={field.isDisabled} />
                    ) : field.isTextarea ? (
                      <textarea id={field.key} value={payment[field.key]} onChange={(e) => handleInputChange(field.key, e.target.value)} className="form-textarea" placeholder={field.placeHolder} />
                    ) : (
                      <input id={field.key} type="text" value={payment[field.key]} onChange={(e) => handleInputChange(field.key, e.target.value)} disabled={field.isDisabled} className="form-input" placeholder={field.placeHolder} />
                    )}
                    {errors[field.key] && <div className="error-message">{errors[field.key]}</div>}
                  </div>
                </div>
              ))}
            </form>
          </Box>
          <Box
            sx={{
              flex: 1,
              paddingLeft: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              p: 2,
              backgroundColor: "#f8f9fa",
              borderRadius: 1,
              border: "1px solid #e0e0e0",
            }}>
            <Typography variant="h6" sx={{ color: "text.primary" }}>
              Billing Summary
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Total Items: {payment.billingItems?.length || 0}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Total Hours: {payment.billingItems?.reduce((sum, item) => sum + (item.hoursWorked || 0), 0).toFixed(2) || 0}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Total Amount: ${payment.billingItems?.reduce((sum, item) => sum + (item.hoursWorked * item.hourlyRate || 0), 0).toFixed(2) || 0}
            </Typography>
            <Button variant="contained" color="primary" sx={{ alignSelf: "flex-start", mt: 2 }} onClick={() => setBillingModalOpen(true)}>
              View Details
            </Button>
          </Box>
        </Box>
        <div className="form-footer">
          <button onClick={handleSubmit} disabled={loading} className="submit-button">
            {loading ? (
              <>
                <span className="spinner"></span>
                {isEditing ? "Updating" : "Creating..."}
              </>
            ) : (
              <>{isEditing ? "Update Payment" : "Create Payment"}</>
            )}
          </button>
        </div>
        {errors.submit && <div className="error-message">{errors.submit}</div>}
      </div>
      <BillingItemsModal open={billingModalOpen} onClose={() => setBillingModalOpen(false)} onSave={(items) => handleInputChange("billingItems", items)} initialItems={payment.billingItems || []} />
    </div>
  );
};

export default NewPaymentModal;
