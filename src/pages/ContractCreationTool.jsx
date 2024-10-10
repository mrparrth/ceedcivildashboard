import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useData } from "../contexts/data/DataContext";
import ScopeSelectorModal from "../components/ScopeSelectorModal";
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
import { Result } from "postcss";

const initialFormState = {
  sameAsClient: false,
  fbInvoiceId: "",
  date: "",
  clientName: "",
  clientStreet: "",
  clientCity: "",
  clientState: "",
  clientZip: "",
  clientCompany: "",
  clientAddress: "",
  clientEmail: "",
  clientPhone: "",
  siteAddress: "",
  siteCity: "",
  siteZip: "",
  siteState: "",
  retainerRemaining: "",
  checkBox: "",
  salesman: "",
  deliveryDuration: "",
  gap: 0,
  siteStreet: "",
  remainingBalance: "",
  scopes: [],
  favClients: "",
  isUpworkJob: false,
  retainerDeposit: "",
  projectNumber: "",
  fbProjectId: "",
  deliverableFromClient: "",
  projectName: "",
  totalCost: "",
  ratePerHour: "",
};

const trialForm = {
  sameAsClient: false,
  fbInvoiceId: "0001634",
  date: "2024-09-14",
  clientName: "Kristeen Snyder",
  clientStreet: "1850 So. 10th Street Suite 30",
  clientState: "California",
  clientCompany: "IDEAL Environmental Products",
  clientZip: "95112",
  clientCity: "test",
  clientEmail: "kristeen.snyder@chem-stor.com",
  clientAddress: "1850 So. 10th Street Suite 30,San Jose,California 95112",
  clientPhone: "(209)752-3177",
  siteAddress: "6373 San Igancio,San Jose,California 95119",
  siteCity: "San Jose",
  siteState: "California",
  siteZip: "95119",
  retainerRemaining: 5600,
  checkBox: "on",
  salesman: "Ryan",
  deliveryDuration: "1 - 2 Weeks",
  siteStreet: "6373 San Igancio",
  favClients: "",
  gap: 0,
  remainingBalance: 0,
  isUpworkJob: false,
  retainerDeposit: 5600,
  projectNumber: "601",
  fbProjectId: "12471503",
  deliverableFromClient: "CAD and PDF files",
  projectName: "IDEAL - New Calcs",
  totalCost: 5600,
  ratePerHour: 200,
  scopes: [
    {
      detail:
        "Preparation of design computations and construction drawings for building plans. Soil assumed at 1500 PSF unless soil report provided. All loads as shown. Single use for address as shown",
      description: "Building Plan Calculations Package",
      rate: 1800,
    },
    {
      rate: 700,
      description: "Calculations Report",
      detail: "Calculations report for the openings in the ceiling.",
    },
    {
      description: "Engineering Review, Stamp and Seal P.E.",
      detail:
        "Scope of work, reviewed, stamped, and sealed by state licensed P.E. CA",
      rate: 2300,
    },
    {
      detail:
        "This is for a single use, single build, single location contract. Any State approvals or HCD approval is not authorized usage of the plans and calcs for usage other than that specified in on the plans and contract.",
      rate: 0,
      description: "Contract Notes",
    },
    {
      rate: 800,
      detail:
        "Electrical pages for Scope of work, reviewed, stamped, and sealed by state licensed P.E. CA",
      description: "Engineering Review, Stamp and Seal P.E.",
    },
  ],
};

const CEEDCivilForm = () => {
  let { metadata, isLoading: isDataLoading } = useData();
  const [formData, setFormData] = useState(trialForm);
  const [loading, setLoading] = useState(false);
  const [isScopeModalOpen, setIsScopeModalOpen] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, content: {} });

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
    }
  }, [
    formData.sameAsClient,
    formData.clientStreet,
    formData.clientCity,
    formData.clientState,
    formData.clientZip,
  ]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? checked
          : ["remainingBalance", "retainerDeposit"].includes(name)
          ? parseFloat(value) || 0
          : value,
    }));
  }, []);

  useEffect(() => {
    const clientData = metadata.favClients?.find(
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

  const handleOpenScopeModal = () => {
    setIsScopeModalOpen(true);
  };

  const createClientInvoiceProject = useCallback(() => {
    setLoading(true);
    if (!formData.projectName) {
      showDialog("Error", "Project description is not provided", "error").then(
        () => setLoading(false)
      );
      return;
    }
    if (formData.scopes.length === 0) {
      showDialog("Error", "No scopes selected", "error").then(() =>
        setLoading(false)
      );
      return;
    }

    let projectNumber, fbClientId, fbInvoiceId, fbProjectId;

    (parseFloat(formData.gap) !== 0
      ? showDialog(
          "Warning",
          "Total scope value is not in align with retainer/deposit + remaining. Go ahead despite the issues?",
          "confirm"
        )
      : Promise.resolve(true)
    )
      .then((confirmed) => {
        if (!confirmed) throw new Error("Operation cancelled");
        return runScriptFunction("getNewProjectNumber");
      })
      .then((number) => {
        projectNumber = number;
        return runScriptFunction("getFBClient", formData);
      })
      .then((id) => {
        if (id) {
          fbClientId = id;
          console.log(`fbClientId:` + fbClientId);
          return showDialog(
            "Existing Client",
            `Client with same name and email is already present with client id: ${fbClientId}. Go ahead to create the invoice under it?`,
            "confirm"
          );
        } else {
          return runScriptFunction("createFBClient", formData);
        }
      })
      .then((result) => {
        if (typeof result === "boolean" && !result)
          throw new Error("Operation cancelled");
        if (typeof result === "string") fbClientId = result;
        console.log(`result:` + result);
        return runScriptFunction("createFBInvoice", {
          ...formData,
          projectNumber,
          fbClientId,
        });
      })
      .then((id) => {
        fbInvoiceId = id;
        console.log(`fbInvoiceId:` + fbInvoiceId);
        return runScriptFunction("createFBProject", {
          ...formData,
          projectNumber,
          fbClientId,
          fbInvoiceId,
        });
      })
      .then(({ id, error }) => {
        if (error) throw new Error(error);
        fbProjectId = id;
        console.log(`fbProjectId:` + fbProjectId);
        setFormData((prevData) => ({
          ...prevData,
          projectNumber,
          fbClientId,
          fbInvoiceId,
          fbProjectId,
        }));
        return showDialog(
          "Success",
          `Invoice is created with invoice number - ${invoiceId}\nProject number - ${projectId}`,
          "success"
        );
      })
      .catch((e) => {
        console.log(e);
        return showDialog("Error", e.message, "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [formData, showDialog]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      if (!formData.fbInvoiceId || !formData.fbProjectId) {
        error = "Freshbooks invoice has not been generated yet!";
      }

      if (error) {
        const confirmed = await showDialog(
          "Existing Client",
          `${error}\nGo ahead despite the issues?`,
          "confirm"
        );
        if (!confirmed) return;
      }

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        let documentUrl = await runScriptFunction("createContract");
        setFormData((prevData) => ({
          ...prevData,
          showDocumentLink: true,
          documentUrl,
        }));
        await showDialog(
          "Success",
          "Document created successfully. You can now view the document.",
          "success"
        );
      } catch (error) {
        await showDialog("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    },
    [showDialog]
  );

  const resetForm = useCallback(() => {
    setFormData(initialFormState);
  }, []);

  const modalIcon = useMemo(() => {
    const icons = {
      success: <SuccessIcon fontSize="large" color="success" />,
      error: <ErrorIcon fontSize="large" color="error" />,
      info: <InfoIcon fontSize="large" color="info" />,
      confirm: <InfoIcon fontSize="large" color="info" />,
    };
    return icons[modalState.content.type] || icons.info;
  }, [modalState.content.type]);

  return isDataLoading ? (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    </>
  ) : (
    <div className="container right-content w-75 d-flex justify-content-center align-items-center mt-2">
      <div className="card shadow-lg mt-0">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">CEED Civil</h2>
          <div className="mb-3">
            <label htmlFor="favClient" className="form-label">
              Favorite Clients:
            </label>
            <select
              className="form-select"
              id="favClient"
              name="favClient"
              value={formData.favClient}
              onChange={handleInputChange}
            >
              <option value="" key="index" disabled>
                Select a client
              </option>
              {metadata.favClients.map((client, index) => (
                <option value={client.name} key={client.name}>
                  {client.name}
                </option>
              ))}
            </select>
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
                  onChange={handleInputChange}
                >
                  <option value="" key="index" disabled>
                    Select a state
                  </option>
                  {metadata.states.map((state) => (
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
                <label htmlFor="salesman" className="form-label">
                  Sales Man
                </label>
                <select
                  className="form-select"
                  id="salesman"
                  name="salesman"
                  value={formData.salesman}
                  onChange={handleInputChange}
                >
                  <option value="">Select the sales person</option>
                  {metadata.salesmen.map((salesman) => (
                    <option value={salesman} key={salesman}>
                      {salesman}
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
                  onChange={handleInputChange}
                >
                  <option value="" disabled>
                    Select a state
                  </option>
                  {metadata.states.map((state) => (
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
                checked={formData.isUpworkJob}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor="isUpworkJob">
                Upwork Job
              </label>
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
                  type="text"
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
                  type="text"
                  className="form-control"
                  id="remainingBalance"
                  name="remainingBalance"
                  value={formData.remainingBalance}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="project" className="form-label">
                Project Description
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="project"
                  name="project"
                  value={formData.projectName}
                  onChange={handleInputChange}
                />
                {/* <button className="btn btn-dark" type="button">
                  <i className="bi bi-plus-circle-fill me-2"></i>Create New
                  Project
                </button> */}
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

            <button
              type="button"
              className="btn btn-primary w-100 mb-3  py-2"
              onClick={createClientInvoiceProject}
            >
              {loading ? (
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
                  onClick={handleOpenScopeModal}
                >
                  <i className="bi bi-search me-2"></i>Scope
                </button>
              </div>
              <div className="col-md-4">
                <button
                  type="button"
                  className="btn btn-danger w-100  py-2"
                  onClick={resetForm}
                >
                  <i className="bi bi-trash-fill me-2"></i>Reset
                </button>
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-success w-100 py-2">
                  {loading ? (
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

            {formData.showDocumentLink && (
              <div className="text-center mb-3">
                <a href="#" target="_blank" className="btn btn-info">
                  <i className="bi bi-file-earmark-text me-2"></i>Click To See
                  Contract
                </a>
              </div>
            )}

            <Dialog
              open={modalState.isOpen}
              onClose={() => handleCloseModal(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                <Box display="flex" alignItems="center">
                  {modalIcon}
                  <Typography variant="h6" style={{ marginLeft: "10px" }}>
                    {modalState.content.title}
                  </Typography>
                </Box>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
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
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CEEDCivilForm;
