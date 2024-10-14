import React, { useState, useEffect, useRef } from "react";
import { SingleSelectDropdown, CheckBox } from "../Fields";
import useData from "hooks/useData";
import useAppData from "hooks/useappData";
import useAuth from "hooks/useAuth";

const initialPayment = {
  id: crypto.randomUUID(),
  assignee: "",
  projectNumber: "",
  projectName: "",
  salesMan: "",
  overallProjectStatus: "",
  estimatedBudget: "",
  actualCost: "",
  paid: false,
  datePaid: "",
  revisionNeeded: false,
  datePaid2: "",
  revisionCost: "",
  revisionsPaid: false,
  notes: "",
  totalProjectCost: "",
  expenseId: null,
};

const NewPaymentModal = ({ closeModal }) => {
  const { createPayment, projects } = useData();
  const { appData } = useAppData();
  const { user } = useAuth();

  const [payment, setPayment] = useState(initialPayment);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [suggestion, setSuggestion] = useState("");
  const projectNameRef = useRef(null);

  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  initialPayment.assignee = isAdmin ? "" : user.name;

  useEffect(() => {
    calculateTotal();
  }, [payment.estimatedBudget, payment.actualCost, payment.revisionCost]);

  const handleInputChange = (key, value) => {
    setPayment((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));

    console.log(`value:` + value);
    if (["projectNumber", "projectName"].includes(key) && !value)
      setSuggestion("");
    else {
      if (key === "projectNumber") {
        populateProjectDetails(value, "number");
      } else if (key === "projectName") {
        handleProjectNameChange(value);
      }
    }
  };

  const handleProjectNameChange = (value) => {
    const matchingProject = projects.find((project) =>
      project.projectName.toLowerCase().startsWith(value.toLowerCase())
    );

    if (matchingProject && value !== matchingProject.projectName) {
      const remainingSuggestion = matchingProject.projectName.slice(
        value.length
      );
      setSuggestion(remainingSuggestion.replace(/^ /, "\u00A0"));
    } else {
      setSuggestion("");
    }
  };

  const populateProjectDetails = (value, type) => {
    const projectDetails = projects.find((project) =>
      type === "number"
        ? project.projectNumber == value
        : project.projectName.toLowerCase() === value.toLowerCase()
    );

    console.log(projectDetails);
    if (projectDetails) {
      setPayment((prev) => ({
        ...prev,
        projectNumber: projectDetails.projectNumber,
        projectName: projectDetails.projectName,
        salesMan: projectDetails.salesMan,
        overallProjectStatus: projectDetails.overallProjectStatus,
        estimatedBudget: projectDetails.estimatedBudget || "",
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
      const fullProjectName =
        payment.projectName + suggestion.replace(/^[\u00A0 ]/, " ");
      setPayment((prev) => ({ ...prev, projectName: fullProjectName }));
      setSuggestion("");
      populateProjectDetails(fullProjectName, "name");
    }
  };

  const calculateTotal = () => {
    const estimatedBudget = parseFloat(payment.estimatedBudget) || 0;
    const actualCost = parseFloat(payment.actualCost) || 0;
    const revisionCost = parseFloat(payment.revisionCost) || 0;

    const total = Math.max(estimatedBudget, actualCost) + revisionCost;

    setPayment((prev) => ({ ...prev, totalProjectCost: total.toFixed(2) }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!payment.assignee) newErrors.assignee = "Assignee is required";
    if (!payment.projectNumber)
      newErrors.projectNumber = "Project # is required";
    // if (!payment.projectName) newErrors.projectName = "Project Name is required";
    // if (!payment.salesMan) newErrors.salesMan = "Sales Man is required";
    // if (!payment.status) newErrors.status = "Status is required";
    if (!payment.estimatedBudget)
      newErrors.status = "Estimated Budget is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        console.log(1);
        createPayment(payment);
        closeModal();
      } catch (error) {
        console.error("Error creating payment:", error);
        setErrors({
          submit:
            "An error occurred while creating the payment. Please try again.",
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
      isShadowAutocomplete: true,
      placeHolder: "Type to search",
    },
    {
      label: "Sales Man",
      key: "salesMan",
      isSingleSelect: true,
      options: appData.salesmen,
    },
    {
      label: "Status",
      key: "overallProjectStatus",
      isSingleSelect: true,
      options: appData.status,
    },
    { label: "Estimated Budget", key: "estimatedBudget" },
    { label: "Actual Cost", key: "actualCost" },
    { label: "Paid?", key: "paid", isCheckbox: true },
    { label: "Date Paid", key: "datePaid", isDate: true },
    { label: "Revision Needed?", key: "revisionNeeded", isCheckbox: true },
    { label: "Date Paid", key: "datePaid2", isDate: true },
    { label: "Revision Cost", key: "revisionCost" },
    { label: "Revisions Paid?", key: "revisionsPaid", isCheckbox: true },
    { label: "Notes/Remarks", key: "notes", isTextarea: true },
    { label: "Total Project Cost", key: "totalProjectCost" },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={closeModal} className="close-button">
          ×
        </button>
        <h2 className="modal-title">Create New Payment</h2>
        <form className="project-form">
          {formFields.map((field) => (
            <div key={field.key} className="form-row">
              <label htmlFor={field.key} className="form-label">
                {field.label}
              </label>
              <div className="form-field">
                {field.isShadowAutocomplete ? (
                  <div className="inline-autocomplete-container">
                    <input
                      ref={projectNameRef}
                      type="text"
                      value={payment.projectName}
                      onChange={(e) =>
                        handleInputChange("projectName", e.target.value)
                      }
                      onKeyDown={handleProjectNameKeyDown}
                      className="form-input"
                      placeholder={field.placeHolder}
                    />
                    {suggestion && (
                      <div className="inline-suggestion">
                        <span className="invisible">{payment.projectName}</span>
                        <span className="suggestion-text">{suggestion}</span>
                      </div>
                    )}
                  </div>
                ) : field.isSingleSelect ? (
                  <SingleSelectDropdown
                    itemKey={field.key}
                    options={field.options}
                    selectedOption={payment[field.key]}
                    onChange={handleInputChange}
                    label={field.label}
                    viewOnly={field.isDisabled}
                  />
                ) : field.isCheckbox ? (
                  <CheckBox
                    id={field.key}
                    checked={payment[field.key]}
                    onChange={(value) => handleInputChange(field.key, value)}
                    label={field.label}
                  />
                ) : field.isDate ? (
                  <input
                    id={field.key}
                    type="date"
                    value={payment[field.key]}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                    className="form-input"
                  />
                ) : field.isTextarea ? (
                  <textarea
                    id={field.key}
                    value={payment[field.key]}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                    className="form-textarea"
                    placeholder={field.placeHolder}
                  />
                ) : (
                  <input
                    id={field.key}
                    type="text"
                    value={payment[field.key]}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                    className="form-input"
                    placeholder={field.placeHolder}
                  />
                )}
                {errors[field.key] && (
                  <div className="error-message">{errors[field.key]}</div>
                )}
              </div>
            </div>
          ))}
        </form>
        <div className="form-footer">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="submit-button"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating...
              </>
            ) : (
              "Create Payment"
            )}
          </button>
        </div>
        {errors.submit && <div className="error-message">{errors.submit}</div>}
      </div>
    </div>
  );
};

export default NewPaymentModal;
