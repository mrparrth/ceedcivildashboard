import React, { useState, useEffect, useCallback, useMemo } from "react";
import { runScriptFunction } from "../db/index";
import { MultiSelectDropdown } from "components/Fields";
import ScopeSelectorModal from "components/ScopeSelectorModal";
import useContractMetadata from "hooks/useContractMetadata";
import { runScriptFunction } from "../db";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import {
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  InfoOutlined as InfoIcon,
} from "@mui/icons-material";

import { CustomTextArea2 } from "components";

import useData from "hooks/useData";
import useAppData from "hooks/useAppData";
import useContractMetadata from "hooks/useContractMetadata";
import { BLANK_PROJECT, DEV_PREFILL_FORM, INITIAL_FORM } from "@/utils/constant";

const CEEDCivilForm = () => {
  let { isLoading: isDataLoading, createProject } = useData();
  let { appData } = useAppData();
  let { contractMetadata, isLoading: isContractDataLoading } =
    useContractMetadata();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isCreatingFreshbooks, setIsCreatingFreshbooks] = useState(false);
  const [isCreatingContract, setIsCreatingContract] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isScopeModalOpen, setIsScopeModalOpen] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, content: {} });
  const [projectScopes, setProjectScopes] = useState([]);
  const [allScopes, setAllScopes] = useState(contractMetadata.scopes);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFormData((prevData) => ({ ...prevData, date: today }));
  }, []);

  useEffect(() => {
    if (formData.sameAsClient) {
      setFormData((prevData) => ({
        ...prevData,
        siteStreet: prevData.clientStreet,
        siteCity: prevData.clientCity,
        siteState: prevData.clientState,
        siteZip: prevData.clientZip,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        siteStreet: "",
        siteCity: "",
        siteState: "",
        siteZip: "",
      }));
    }
  }, [
    formData.sameAsClient,
    formData.clientStreet,
    formData.clientCity,
    formData.clientState,
    formData.clientZip,
  ]);

  useEffect(() => {
    const clientData = contractMetadata.favClients?.find(
      (client) => client.name === formData.favClient
    );
    if (clientData) {
      const mappedClientData = Object.entries(clientData).reduce(
        (acc, [key, value]) => {
          const newKey = `client${key.charAt(0).toUpperCase() + key.slice(1)}`;
          acc[newKey] = value;
          return acc;
        },
        {}
      );

      setFormData((prevData) => ({ ...prevData, ...mappedClientData }));
    }
  }, [formData.favClient]);

  const handleSectionAssigneeChange = useCallback((updatedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      ...updatedValues,
    }));
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? checked
          : ["remainingBalance", "retainerDeposit"].includes(name)
          ? Math.round(parseFloat(value) * 100) / 100
          : value,
    }));
  }, []);

  const showDialog = useCallback((title, body, type = "info") => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        content: {
          title,
          body,
          type,
          onConfirm: (result) => {
            setModalState((prev) => ({ ...prev, isOpen: false }));
            resolve(result);
          },
        },
      });
    });
  }, []);

  const handleCloseModal = useCallback(
    (confirmed = false) => {
      modalState.content.onConfirm(confirmed);
    },
    [modalState]
  );

  const createClientInvoiceProject = useCallback(async () => {
    setIsCreatingFreshbooks(true);
    try {
      // Initial checks
      if (!formData.projectName) {
        await showDialog(
          "Error",
          "Project description is not provided",
          "error"
        );
        return;
      }
      if (formData.scopes.length === 0) {
        await showDialog("Error", "No scopes selected", "error");
        return;
      }

      // Check for gap
      if (parseFloat(formData.gap) !== 0) {
        const confirmed = await showDialog(
          "Warning",
          `Total scope value is not in align with retainer/deposit + remaining (Gap of ${parseFloat(
            formData.gap
          )}). Go ahead despite the issues?`,
          "confirm"
        );
        if (!confirmed) return;
      }

      // Get new project number
      const projectNumber = await runScriptFunction("getNewProjectNumber");
      if (!projectNumber) throw new Error("Failed to get project number");

      // Get or create FB client
      let fbClientId = await runScriptFunction("getFBClient", formData);
      if (fbClientId) {
        const useExistingClient = await showDialog(
          "Existing Client",
          `Client with same name and email is already present with client id: ${fbClientId}. Go ahead to create the invoice under it?`,
          "confirm"
        );
        if (!useExistingClient) return;
      } else {
        fbClientId = await runScriptFunction("createFBClient", formData);
        if (!fbClientId) throw new Error("Failed to create FreshBooks client");
      }

      // Create FB invoice
      const fbInvoiceId = await runScriptFunction("createFBInvoice", {
        ...formData,
        projectNumber,
        fbClientId,
      });
      if (!fbInvoiceId) throw new Error("Failed to create FreshBooks invoice");

      // Create FB project
      const fbProjectId = await runScriptFunction("createFBProject", {
        ...formData,
        projectNumber,
        fbClientId,
        fbInvoiceId,
      });
      if (!fbProjectId) throw new Error("Failed to create FreshBooks project");

      // Update form data
      setFormData((prevData) => ({
        ...prevData,
        projectNumber,
        fbClientId,
        fbInvoiceId,
        fbProjectId,
      }));

      // Show success dialog
      await showDialog(
        "Success",
        `Invoice is created with invoice number - ${fbInvoiceId}\nProject number - ${fbProjectId}`,
        "success"
      );
    } catch (error) {
      console.error(error);
      await showDialog("Error", error.message, "error");
    } finally {
      setIsCreatingFreshbooks(false);
    }
  }, [formData, showDialog, setFormData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsCreatingContract(true);

      let error;
      if (!formData.fbInvoiceId || !formData.fbProjectId) {
        error = "Freshbooks invoice has not been generated yet!";
      }

      if (error) {
        const confirmed = await showDialog(
          "No Invoice",
          `${error}\nGo ahead despite the issues?`,
          "confirm"
        );
        if (!confirmed) {
          setIsCreatingContract(false);
          return;
        }
      }

      try {
        let newProject = await runScriptFunction("createContract", formData);
        const {
          draftingTaskedTo,
          engineeringTaskedTo,
          mepTaskedTo,
          civilTaskedTo,
        } = formData;
        newProject.draftingTaskedTo = draftingTaskedTo;
        newProject.engineeringTaskedTo = engineeringTaskedTo;
        newProject.mepTaskedTo = mepTaskedTo;
        newProject.civilTaskedTo = civilTaskedTo;
        newProject.assignedTo = [
          ...draftingTaskedTo,
          ...engineeringTaskedTo,
          ...mepTaskedTo,
          ...civilTaskedTo,
        ];
        newProject.projectType = formData.projectType;
        newProject.clientPhone = formData.clientPhone;
        newProject.clientEmail = formData.clientEmail;
        newProject.description = formData.projectDesc;

        setFormData((prevData) => ({
          ...prevData,
          showDocumentLink: true,
          documentUrl: newProject?.contractDocumentUrl,
        }));

        const folderOptions = {
          sendClientEmail: formData.sendClientEmail,
          drafter: formData.drafterFolderNeeded,
          engg: formData.enggFolderNeeded,
          mep: formData.mepFolderNeeded,
          civil: formData.civilFolderNeeded,
        };

        createProject({ ...BLANK_PROJECT, ...newProject, folderOptions });

        await showDialog(
          "Success",
          "Document created successfully. You can now view the document.",
          "success"
        );
      } catch (error) {
        console.error(error);
        await showDialog("Error", error.message, "error");
      } finally {
        setIsCreatingContract(false);
      }
    },
    [formData, showDialog, setFormData]
  );

  const resetForm = useCallback(async () => {
    // Check for unsaved work
    const warnings = [];
    if (formData.projectNumber)
      warnings.push("Project number is already generated");
    if (formData.fbInvoiceId) warnings.push("Invoice has been generated");
    if (formData.documentUrl) warnings.push("Document has been created");

    let confirmMessage = "Are you sure you want to reset the form?";
    if (warnings.length > 0) {
      confirmMessage += "\n\nWarning:\n" + warnings.join("\n");
    }

    const confirmed = await showDialog(
      "Confirm Reset",
      confirmMessage,
      "confirm"
    );

    if (confirmed) {
      const today = new Date().toISOString().split("T")[0];

      setFormData((prev) => ({ ...INITIAL_FORM, date: today }));
      setProjectScopes([]);
      setAllScopes(allScopes.map((scope) => ({ ...scope, selected: false })));
    }
  }, [
    formData.projectNumber,
    formData.fbInvoiceId,
    formData.documentUrl,
    showDialog,
  ]);

  const modalIcon = useMemo(() => {
    const icons = {
      success: <SuccessIcon fontSize="large" color="success" />,
      error: <ErrorIcon fontSize="large" color="error" />,
      info: <InfoIcon fontSize="large" color="info" />,
      confirm: <InfoIcon fontSize="large" color="info" />,
    };
    return icons[modalState.content.type] || icons.info;
  }, [modalState.content.type]);

  const handleOpenScopeModal = () => {
    setIsScopeModalOpen(true);
  };

  const sectionFields = [
    {
      label: "Arch",
      checkboxId: "drafterFolderNeeded",
      options: appData.drafters,
      taskedTo: "draftingTaskedTo",
      needed: "draftingNeeded",
    },
    {
      label: "Structural",
      checkboxId: "enggFolderNeeded",
      options: appData.engineers || [],
      taskedTo: "engineeringTaskedTo",
      needed: "engineerNeeded",
    },
    {
      label: "MEP",
      checkboxId: "mepFolderNeeded",
      options: appData.mep || [],
      taskedTo: "mepTaskedTo",
      needed: "mepNeeded",
    },
    {
      label: "Civil",
      checkboxId: "civilFolderNeeded",
      options: appData.civil || [],
      taskedTo: "civilTaskedTo",
      needed: "civilNeeded",
    },
  ];

  return isDataLoading || isContractDataLoading ? (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh">
        <CircularProgress />
      </Box>
    </>
  ) : (
    <div className="container right-content w-75 d-flex justify-content-center align-items-center mt-2">
      <div className="card shadow-lg mt-0">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">CEED Civil</h2>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="favClient" className="form-label">
                Favorite Clients:
              </label>
              <select
                className="form-select"
                id="favClient"
                name="favClient"
                value={formData.favClient || ""}
                onChange={handleInputChange}>
                <option value="" key="index" disabled>
                  Select a client
                </option>
                {contractMetadata.favClients.map((client, index) => (
                  <option value={client.name} key={client.name}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="projectType" className="form-label">
                Project Type: <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="projectType"
                name="projectType"
                value={formData.projectType || ""}
                onChange={handleInputChange}
                required>
                <option value="" key="index" disabled>
                  Select a project type
                </option>
                {appData.projectType?.map((type, index) => (
                  <option value={type} key={index}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <hr className="my-4" />
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="clientName" className="form-label">
                  Client's Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="clientCompany" className="form-label">
                  Client's Company
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="clientCompany"
                  name="clientCompany"
                  value={formData.clientCompany}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="clientStreet" className="form-label">
                  Client Street
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="clientStreet"
                  name="clientStreet"
                  value={formData.clientStreet}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="clientCity" className="form-label">
                  Client City
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="clientCity"
                  name="clientCity"
                  value={formData.clientCity}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="clientState" className="form-label">
                  Client State
                </label>
                <select
                  className="form-select"
                  id="clientState"
                  name="clientState"
                  value={formData.clientState}
                  onChange={handleInputChange}>
                  <option value="" key="index" disabled>
                    Select a state
                  </option>
                  {appData.states.map((state) => (
                    <option value={state} key={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="clientZip" className="form-label">
                  Client Zip code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="clientZip"
                  name="clientZip"
                  value={formData.clientZip}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="clientEmail" className="form-label">
                  Client Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="clientEmail"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="clientPhone" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="clientPhone"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="date" className="form-label">
                  Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="salesMan" className="form-label">
                  Sales Man
                </label>
                <select
                  className="form-select"
                  id="salesMan"
                  name="salesMan"
                  value={formData.salesMan}
                  onChange={handleInputChange}>
                  <option value="">Select the sales person</option>
                  {appData.salesmen.map((salesMan) => (
                    <option value={salesMan} key={salesMan}>
                      {salesMan}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="my-4" />

            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="sameAsClient"
                name="sameAsClient"
                checked={formData.sameAsClient}
                onChange={handleInputChange}
                style={{
                  transform: "scale(1.5)",
                }}
              />
              <label className="form-check-label" htmlFor="sameAsClient">
                Same as client
              </label>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="siteStreet" className="form-label">
                  Site Street
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="siteStreet"
                  name="siteStreet"
                  value={formData.siteStreet}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="siteCity" className="form-label">
                  Site City
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="siteCity"
                  name="siteCity"
                  value={formData.siteCity}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="siteState" className="form-label">
                  Site State
                </label>
                <select
                  className="form-select"
                  id="siteState"
                  name="siteState"
                  value={formData.siteState}
                  onChange={handleInputChange}>
                  <option value="" disabled>
                    Select a state
                  </option>
                  {appData.states.map((state) => (
                    <option value={state} key={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="siteZip" className="form-label">
                  Site Zip code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="siteZip"
                  name="siteZip"
                  value={formData.siteZip}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <hr className="my-4" />

            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="isUpworkJob"
                name="isUpworkJob"
                style={{
                  transform: "scale(1.5)",
                }}
                checked={formData.isUpworkJob}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor="isUpworkJob">
                Upwork Job
              </label>
            </div>

            <div className="mb-3">
              <label htmlFor="project" className="form-label">
                Project Title
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="project"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                />
                {/* <button className="btn btn-dark" type="button">
                  <i className="bi bi-plus-circle-fill me-2"></i>Create New
                  Project
                </button> */}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="projectDesc" className="form-label">
                Scope Of Work
              </label>
              <div className="input-group">
                <CustomTextArea2
                  id="projectDesc"
                  name="projectDesc"
                  value={formData.projectDesc}
                  onChange={handleInputChange}
                  rows={3} // Minimum rows
                />
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-4">
                <label htmlFor="ratePerHour" className="form-label">
                  Rate per Hour
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="ratePerHour"
                  name="ratePerHour"
                  value={formData.ratePerHour}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="retainerDeposit" className="form-label">
                  Retainer/Deposit
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="retainerDeposit"
                  name="retainerDeposit"
                  value={formData.retainerDeposit}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="remainingBalance" className="form-label">
                  Remaining$
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="remainingBalance"
                  name="remainingBalance"
                  value={formData.remainingBalance}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="deliverableFromClient" className="form-label">
                  Deliverable from client
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="deliverableFromClient"
                  name="deliverableFromClient"
                  value={formData.deliverableFromClient}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="deliveryDuration" className="form-label">
                  Delivery Duration
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="deliveryDuration"
                  name="deliveryDuration"
                  value={formData.deliveryDuration}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <hr className="my-4" />

            <div className="mb-4">
              <label className="form-label fw-bold mb-3">
                Folder Creation Options
              </label>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  style={{
                    transform: "scale(1.5)",
                    marginRight: "12px",
                    marginLeft: "4px",
                  }}
                  id="sendClientEmail"
                  name="sendClientEmail"
                  checked={formData.sendClientEmail}
                  onChange={handleInputChange}
                />
                <label
                  className="form-check-label"
                  style={{ fontSize: "1.1rem" }}
                  htmlFor="sendClientEmail">
                  Send Document Upload Email To Client?
                </label>
              </div>

              <div className="row mb-2">
                <div className="col-md-2">
                  <div className="text-center fw-bold">Folder/Section</div>
                </div>
                <div className="col-md-3">
                  <div className="text-center fw-bold">Create Folder</div>
                </div>
                <div className="col-md-4">
                  <div className="text-center fw-bold">Assign To</div>
                </div>
              </div>

              {sectionFields.map((item) => (
                <div
                  className="row mb-2 d-flex align-items-center"
                  key={item.checkboxId}>
                  <div className="col-md-2">
                    <div className="text-center">{item.label}</div>
                  </div>
                  <div className="col-md-3 text-center">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      style={{ transform: "scale(1.5)" }}
                      id={item.checkboxId}
                      name={item.checkboxId}
                      checked={formData[item.checkboxId]}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <MultiSelectDropdown
                      options={item.options}
                      selectedOptions={formData[item.taskedTo] || []}
                      setSelectedOptions={(newSelectedOptions) => {
                        let updates = {
                          [item.needed]: !!newSelectedOptions.length,
                          [item.taskedTo]: newSelectedOptions,
                        };

                        handleSectionAssigneeChange(updates);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-4" />
            <button
              type="button"
              className="btn btn-primary w-100 mb-3  py-2"
              disabled={isCreatingContract}
              onClick={createClientInvoiceProject}>
              {isCreatingFreshbooks ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <>
                  <i className="bi bi-plus-circle-fill me-2"></i>
                  Create FreshBooks Client, Invoice, and Project
                </>
              )}
            </button>

            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <button
                  type="button"
                  className="btn btn-info w-100  py-2"
                  onClick={handleOpenScopeModal}>
                  <i className="bi bi-search me-2"></i>Scope{" "}
                  {projectScopes.length > 0 &&
                    `(${projectScopes.length} Selected)`}
                </button>
              </div>
              <div className="col-md-4">
                <button
                  type="button"
                  className="btn btn-danger w-100  py-2"
                  onClick={resetForm}>
                  <i className="bi bi-trash-fill me-2"></i>Reset
                </button>
              </div>
              <div className="col-md-4">
                <button
                  type="submit"
                  className="btn btn-success w-100 py-2"
                  disabled={isCreatingFreshbooks}>
                  {isCreatingContract ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <>
                      <i className="bi bi-check-circle-fill me-2"></i>Submit
                    </>
                  )}
                </button>
              </div>
            </div>

            <hr className="my-2" />

            <div className="d-flex justify-content-between align-middle">
              <p className="my-1">
                Project Number: <span>{formData.projectNumber}</span>
              </p>
              <p className="my-1">
                FB Invoice: <span>{formData.fbInvoiceId}</span>
              </p>
              <p className="my-1">
                FB Project: <span>{formData.fbProjectId}</span>
              </p>
            </div>
            <hr className="my-2" />

            {formData.documentUrl && (
              <div className="text-center mb-3">
                <a
                  href={formData.documentUrl}
                  target="_blank"
                  className="btn btn-info">
                  <i className="bi bi-file-earmark-text me-2"></i>Click To See
                  Contract
                </a>
              </div>
            )}

            <Dialog
              open={modalState.isOpen}
              onClose={() => handleCloseModal(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description">
              <DialogTitle id="alert-dialog-title">
                <Box display="flex" alignItems="center">
                  {modalIcon}
                  <Typography variant="h6" style={{ marginLeft: "10px" }}>
                    {modalState.content.title}
                  </Typography>
                </Box>
              </DialogTitle>
              <DialogContent>
                <DialogContentText
                  id="alert-dialog-description"
                  sx={{
                    whiteSpace: "pre-line", // This preserves line breaks
                    "& p": {
                      marginBottom: "8px", // Add spacing between paragraphs
                    },
                  }}>
                  {modalState.content.body}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                {modalState.content.type === "confirm" && (
                  <Button onClick={() => handleCloseModal(false)}>
                    Cancel
                  </Button>
                )}
                <Button onClick={() => handleCloseModal(true)} autoFocus>
                  {modalState.content.type === "confirm" ? "Confirm" : "OK"}
                </Button>
              </DialogActions>
            </Dialog>

            <ScopeSelectorModal
              isOpen={isScopeModalOpen}
              onClose={() => setIsScopeModalOpen(false)}
              formData={formData}
              setFormData={setFormData}
              allScopes={allScopes}
              setAllScopes={setAllScopes}
              projectScopes={projectScopes}
              setProjectScopes={setProjectScopes}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CEEDCivilForm;
