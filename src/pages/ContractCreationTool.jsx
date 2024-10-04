import React, { useState, useEffect } from "react";
import { useData } from "../contexts/DataContext";
import ScopeSelectorModal from "../components/ScopeSelectorModal";
const blankForm = {
  fbInvoiceId: "",
  date: "",
  clientName: "",
  retainerRemaining: "",
  siteState: "",
  clientStreet: "",
  checkBox: "",
  clientState: "",
  salesman: "",
  deliveryDuration: "",
  siteStreet: "",
  clientZip: "",
  gap: 0,
  clientCompany: "",
  remainingBalance: "",
  siteAddress: "",
  siteCity: "",
  scopes: [],
  clientAddress: "",
  favClients: "",
  upworkJob: false,
  retainerDeposit: "",
  projectNumber: "",
  fbProjectId: "",
  deliverableFromClient: "",
  clientEmail: "",
  project: "",
  clientPhone: "",
  totalCost: "",
  siteZip: "",
  ratePerHour: "",
};
const CEEDCivilForm = () => {
  let { metadata } = useData();
  const [formData, setFormData] = useState({
    fbInvoiceId: "0001634",
    date: "2024-09-14",
    clientName: "Kristeen Snyder",
    retainerRemaining: 5600,
    siteState: "California",
    clientStreet: "1850 So. 10th Street Suite 30",
    checkBox: "on",
    clientState: "California",
    salesman: "Ryan",
    deliveryDuration: "1 - 2 Weeks",
    siteStreet: "6373 San Igancio",
    clientZip: "95112",
    gap: 0,
    clientCompany: "IDEAL Environmental Products",
    remainingBalance: 0,
    siteAddress: "6373 San Igancio,San Jose,California 95119",
    siteCity: "San Jose",
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
    clientAddress: "1850 So. 10th Street Suite 30,San Jose,California 95112",
    favClients: "",
    upworkJob: false,
    retainerDeposit: 5600,
    projectNumber: "601",
    fbProjectId: "12471503",
    deliverableFromClient: "CAD and PDF files",
    clientEmail: "kristeen.snyder@chem-stor.com",
    project: "IDEAL - New Calcs",
    clientPhone: "(209)752-3177",
    totalCost: 5600,
    siteZip: "95119",
    ratePerHour: 200,
  });

  const [favoriteClient, setFavClient] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUpworkJob, setIsUpworkJob] = useState(false);
  const [sameAsClient, setSameAsClient] = useState(false);
  const [projectNumber, setProjectNumber] = useState(null);
  const [showDocumentLink, setShowDocumentLink] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMetadataReady, setIsMetadataReady] = useState(false);
  const [isScopeModalOpen, setIsScopeModalOpen] = useState(false);
  const [selectedScopes, setSelectedScopes] = useState([]);

  useEffect(() => {
    // Check if metadata is initialized and not empty
    if (metadata && Object.keys(metadata).length > 0) {
      setIsMetadataReady(true);
    }
  }, [metadata]);

  useEffect(() => {
    if (sameAsClient) {
      setFormData((prevData) => ({
        ...prevData,
        siteStreet: prevData.clientStreet,
        siteCity: prevData.clientCity,
        siteState: prevData.clientState,
        siteZip: prevData.clientZip,
      }));
    }
  }, [sameAsClient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const autoFillClientData = (clientName) => {
    setFavClient(clientName);
    const clientData = metadata.favClients.find(
      (client) => client.name === clientName
    );

    if (clientData) {
      setFormData((prevData) => ({
        ...prevData,
        clientName: clientData.name,
        clientCompany: clientData.company,
        clientStreet: clientData.street,
        clientCity: clientData.city,
        clientZip: clientData.zip,
        clientEmail: clientData.email,
        clientPhone: clientData.phone,
        clientState: clientData.state,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowModal(true);
      setShowDocumentLink(true);
    }, 2000);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === "sameAsClient") {
      setSameAsClient(checked);
    } else if (name === "upworkJob") {
      setIsUpworkJob(checked);
    }
  };
  const getNewProject = () => {
    setProjectNumber(Math.floor(1000 + Math.random() * 9000));
  };

  const handleOpenScopeModal = () => {
    setIsScopeModalOpen(true);
  };

  if (!isMetadataReady) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="right-content w-100 d-flex justify-content-center align-items-center mt-2">
      <div className="card shadow-lg mt-0" style={{ maxWidth: "900px" }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">CEED Civil</h2>
          <div className="mb-3">
            <label htmlFor="favoriteClients" className="form-label">
              Favorite Clients:
            </label>
            <select
              className="form-select"
              id="favoriteClients"
              name="favoriteClients"
              value={favoriteClient}
              onChange={(e) => autoFillClientData(e.target.value)}
            >
              <option value="" key="index">
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
                  <option value="" key="index">
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
                <label htmlFor="salesMan" className="form-label">
                  Sales Man
                </label>
                <select
                  className="form-select"
                  id="salesMan"
                  name="salesMan"
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
                checked={sameAsClient}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="sameAsClient">
                Same as client.
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
                  <option value="">Select a state</option>
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
                id="upworkJob"
                name="upworkJob"
                checked={isUpworkJob}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="upworkJob">
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
                Project
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="project"
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                />
                <button className="btn btn-dark" type="button">
                  <i className="bi bi-plus-circle-fill me-2"></i>Create New
                  Project
                </button>
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

            <button type="button" className="btn btn-primary w-100 mb-3  py-2">
              <i className="bi bi-plus-circle-fill me-2"></i>Create FreshBooks
              Client, Invoice, and Project
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
                <button type="button" className="btn btn-danger w-100  py-2">
                  <i className="bi bi-trash-fill me-2"></i>Reset
                </button>
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-success w-100 py-2">
                  <i className="bi bi-check-circle-fill me-2"></i>Submit
                </button>
              </div>
            </div>

            <hr className="my-4" />

            <div className="row">
              <div className="col-md-6">
                <p>
                  FB Invoice: <span id="FBInvoiceNo">{formData.fbInvoice}</span>
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  FB Project: <span id="FBProjectNo">{formData.fbProject}</span>
                </p>
              </div>
            </div>
            <hr className="my-4" />

            {showDocumentLink && (
              <div className="text-center mb-3">
                <a href="#" target="_blank" className="btn btn-info">
                  <i className="bi bi-file-earmark-text me-2"></i>Click To See
                  Contract
                </a>
              </div>
            )}

            {errorMessage && (
              <div className="text-danger mb-3">{errorMessage}</div>
            )}

            <ScopeSelectorModal
              isOpen={isScopeModalOpen}
              onClose={() => setIsScopeModalOpen(false)}
              formData={formData}
              setFormData={setFormData}
              handleChange={handleInputChange}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CEEDCivilForm;
