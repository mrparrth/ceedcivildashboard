function authorizeFB() {
  resetFreshbooks()
  getAccountId()
}

function getAccountId() {

  let response = fbGetRequest_("https://api.freshbooks.com/auth/api/v1/users/me")

  console.log("Your client id is " + response["response"]["roles"][0]["accountid"]);
  console.log("Your business id is " + response["response"]["business_memberships"][0]["business"]["id"]);
}

function getFBClient(data) {
  Logger.log(JSON.stringify(data))
  let { clientName, clientEmail } = data
  let namesplit = clientName.split(" ");
  let lastName, firstName
  if (namesplit.length > 1) {
    lastName = namesplit[namesplit.length - 1];
    firstName = clientName.replace(" " + lastName, "");
  } else {
    firstName = clientName
  }

  let queryString = `https://api.freshbooks.com/accounting/account/${ACCOUNT_ID}/users/clients?search[email]=${clientEmail}&search[fname_like]=${firstName}&search[lname_like]=${lastName}`
  Logger.log(queryString)
  let response = fbGetRequest_(queryString)

  if (response.response.result.total == 0) {
    return
  } else {
    return response.response.result.clients[0].id;
  }
}

function createFBClient(data) {
  let { clientName, clientEmail, clientPhone, clientCompany, clientStreet, clientCity,clientState,clientZip } = data
  let namesplit = clientName.split(" ");
  let lastName, firstName
  if (namesplit.length > 1) {
    lastName = namesplit[namesplit.length - 1];
    firstName = clientName.replace(" " + lastName, "");
  } else {
    firstName = clientName
  }

  let jsonClient = {
    "client": {
      "fname": firstName,
      "lname": lastName,
      "home_phone": clientPhone,
      "email": clientEmail,
      "organization": clientCompany,
      "p_street": clientStreet,
      "p_city": clientCity,
      "p_province": clientState,
      "p_code": clientZip,
      "p_country": "United States",
      "currency_code": "USD",
      "language": "en"
    }
  };

  let response = fbPostRequest_(`https://api.freshbooks.com/accounting/account/${ACCOUNT_ID}/users/clients`, jsonClient)

  return response.response.result.client.id
}

function createFBInvoice(data) {
  let jsonInvoice = createInvoiceJson(data);
  let response = fbPostRequest_(`https://api.freshbooks.com/accounting/account/${ACCOUNT_ID}/invoices/invoices`, jsonInvoice);

  Logger.log(`Invoice Created ${response.response.result.invoice.id}`)
  return response.response.result.invoice.invoice_number;
}

function createInvoiceJson(project) {
  let finalDict = {};
  let rootDict = {};
  let allItems = [];
  let scopes = project['scopes']
  let { projectNumber, projectName, fbClientId, isUpworkJob } = project
  
  rootDict["customerid"] = fbClientId;
  rootDict["create_date"] = Utilities.formatDate(new Date(), "UTC", "yyyy-MM-dd");
  rootDict["terms"] = _getSettings_().terms

  let individualItems = {}
  individualItems["type"] = 0;
  individualItems["name"] = "Info";
  individualItems["description"] = `Project ${projectNumber} - ${projectName}${isUpworkJob ? " - Upwork Job" : ""}`
  individualItems["qty"] = 1;
  individualItems["unit_cost"] = { amount: 0, code: 'USD' };
  allItems.push(individualItems);

  scopes.forEach((scope) => {
    let individualItems = {};
    individualItems["type"] = 0;
    individualItems["name"] = scope.description
    individualItems["description"] = scope.detail;
    individualItems["qty"] = 1;
    individualItems["unit_cost"] = { amount: parseCost(scope.rate), code: 'USD' }

    allItems.push(individualItems);
  })

  rootDict["lines"] = allItems;
  finalDict["invoice"] = rootDict;
  Logger.log(`Invoice data ${JSON.stringify(finalDict)}`)
  return finalDict;
}

function getAllServices() {
  const response = fbGetAll_(`https://api.freshbooks.com/comments/business/${BUSINESS_ID}/services`)
  const services = response.services;
  const arrServices = [];

  for (let i = 0; i < services.length; i++) {
    let name = services[i].name;
    let id = services[i].id;
    arrServices.push({ name, id });
  }

  return arrServices
}

function createFBProject(project) {
  const jsonProject = createProjectJson(project);
  const response = fbPostRequest_(`https://api.freshbooks.com/projects/business/${BUSINESS_ID}/project`, jsonProject)

  return response;
}

function parseCost(cost){
  if(cost instanceof String){
    return parseFloat(cost.replace(/[$,]/g, '')) || 0
  }else{
    return cost
  }
}

function createProjectJson(project) {
  Logger.log(JSON.stringify(project))
  const finalDict = {};
  const rootDict = {};
  const allServices = [];
  let { scopes, projectNumber, projectName, fbClientId, totalCost } = project

  const serviceData = getAllServices()

  rootDict["title"] = `${projectNumber} - ${projectName}`
  rootDict["client_id"] = fbClientId;
  rootDict["project_type"] = "fixed_price";

  scopes.forEach(scope => {
    let indivService = {};
    indivService["name"] = scope.description
    let serviceId = getServiceIdByName(serviceData, scope.description)
    if (serviceId) indivService["id"] = serviceId
    allServices.push(indivService)
  })

  rootDict["fixed_price"] = parseCost(totalCost);
  rootDict["services"] = allServices;
  finalDict["project"] = rootDict;

  console.log(JSON.stringify(finalDict));

  return finalDict;
}

function getServiceIdByName(serviceData, scopeDesc) {
  let service = serviceData.find(service => service.name == scopeDesc)
  if (service) return service.id
}


function testFB() {
  createFBExpenseForFinanceRow(250)
}
//
function createFBExpenseForFinanceRow(rowNo) {
  Logger.log(`Creating expense for row number ${rowNo}`)
  let sheet = SpreadsheetApp.getActive().getSheetByName('Finance')

  let projectNo = sheet.getRange(`B${rowNo}`).getValue()
  let user = sheet.getRange(`A${rowNo}`).getValue()
  let totalCost = parseFloat(sheet.getRange(`O${rowNo}`).getValue())
  let actualCost = parseFloat(sheet.getRange(`G${rowNo}`).getValue())
  let cost = totalCost || actualCost

  let note = sheet.getRange(`B${rowNo}`).getValue() + ' - ' + sheet.getRange(`C${rowNo}`).getValue()
  let date = Utilities.formatDate(sheet.getRange(`I${rowNo}`).getValue(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'yyyy-MM-dd')
  let clientId
  try {
    clientId = getClientIdFromInvoiceDesc(projectNo)
  }
  catch (e) {
    // showError(e)
    throw e
  }

  let usrObject = getUserObjectFromData(user)
  let vendor = usrObject.merchantName
  let categoryName = usrObject.categoryName


  let expenseId
  try {
    expenseId = createFBExpense({ clientId, categoryName, vendor, note, cost, date })
  }
  catch (e) {
    showError(e)
    throw e
  }

  SpreadsheetApp.getActive().toast(`Expense created - ${expenseId}`)

  return expenseId
}

function getUserObjectFromData(userName) {
  let userData = SpreadsheetApp.getActive().getSheetByName('DATA').getRange('N2:P120').getValues()

  for (let usrrow of userData) {
    if (usrrow[0] == userName) {
      return {
        merchantName: usrrow[1],
        categoryName: usrrow[2]
      }
    }
  }
}

function getClientIdFromInvoiceDesc(invoiceDesc) {
  const url = `https://api.freshbooks.com/accounting/account/${ACCOUNT_ID}/invoices/invoices?search[item_description]=${invoiceDesc}`
  const result = fbGetRequest_(url)

  if (result.response.result.invoices.length > 0) {
    return result.response.result.invoices[0].customerid
  }
  else {
    throw `Invoice ${invoiceDesc} is not found `
  }
}

function createFBExpense({ projectNumber, totalCost, actualCost, notes, datePaid }, { merchantName, categoryName }) {
  try {
    var clientId = getClientIdFromInvoiceDesc(projectNumber)
  }
  catch (e) {
    throw e
  }

  let body = {
    "expense": {
      "amount": {
        "amount": totalCost || actualCost,
        "code": "USD"
      },
      notes,
      "vendor": merchantName,
      "date": datePaid,
      "clientid": clientId,
      "staffid": 1,
      "category_name": categoryName,
      "billable": false
    }
  }

  let url = `https://api.freshbooks.com/accounting/account/${ACCOUNT_ID}/expenses/expenses`

  let result = fbPostRequest_(url, body)

  if (result.response.errors) {
    throw result.response.errors[0].message
  }
  else {
    return result.response.result.expense.expenseid
  }
}

function testError() {
  let json = { "client-name": "Maryam Asefi", "FBProjectId": "", "site-state": "Virginia", "project": "VA - FFX - Infill Lot Grading Plan", "FavClients": "", "site-address": "10708 Ox Croft Court,Fairfax Station,Virginia 22039", "deliverable-from-client": "CAD of proposed pool layout and PDF", "client-city": "Fairfax Station", "site-city": "Fairfax Station", "retainer_remaining": "$3,000", "client-zip": "22039", "client-street": "10708 Ox Croft Court", "client-email": "asefi.mary@gmail.com", "retainer-deposit": "$3,000", "total_cost": "$14,000", "upwork-job": false, "client-address": "10708 Ox Croft Court,Fairfax Station,Virginia 22039", "scopes": [{ "detail": "Existing and Proposed Contours, Established Building Setbacks, Driveway & Utilities, Demolition of the existing (if any), Existing parking spaces (if any), Proposed Construction Entrance and Driveway, Limits of Clearing and Grading, Determination of watershed and proposed impervious areas, Required Erosion and Sediment Control Devices, Site Development and Sequences of Construction Notes, Impervious Area Analysis, Watershed for the site and disturbed areas in the watershed, Frontage cover,Standard Construction Details and Certifications, Current INF checklist per ESI (found here: https://www.fairfaxcounty.gov/ landdevelopment/sites/landdevelopment/ files/assets/documents/forms/infill-lot-grading-plan-checklist.pdf)", "description": "FFX - Site Grading & Development Plan", "rate": "$2,500" }, { "detail": "As required by the county submittal, Ceed Civil Engineering will prepare the Sediment and Erosion Control Checklist. The checklist will be prepared based on the grading plan and sealed by the registered professional engineer of record (EOR).", "rate": "$500", "description": "Sediment and Erosion Control Checklist" }, { "detail": "As required per Fairfax County, Ceed Civil Engineering will perform outfall analysis for the site in order to ensure that it has adequate outfall in accordance with the PFM and Northern Virginia handbook. The outfall analysis will include pre-development, construction phase, and post-construction phase. Inova will perform field review of existing drainage pattern, set drainage divide, perform required analysis and calculations, and assess the adequacy of the outfall for the site. The Outfall Narrative will include:1.Stormwater runoff computation by runoff reduction method. Stormwater management ordinance Chapter 124.Virginia state regulations. 2.Site-specific Narrative with description of the elements of storm drainage system and adjoining properties. 3. Outfall Locations Map with contributing drainage areas and detailed hydrological and hydraulic calculations. 4. Extent of the outfall analysis per PFM chapter 6. 5. Up to five (5) cross-sections based on field run contour intervals and spot evaluations to verify the outfall adequacy. 6. Permissible velocity, based on roughness coefficient, soil classification, pipe materials, cover material and channel lining (if any). 7. Design velocities compared with the permissible channel velocities (as applicable). 8. Observed erosion conditions along the downstream channel and the presence of erosive conditions. 9. Adequacy of outfall to the bed and banks of the receiving stream. 10. Engineer’s Certification Statement regarding the adequacy of the outfall for the study site. 11. Stormwater Management completion checklists", "description": "Drainage area Map, Adequacy computations and Outfall Analysis", "rate": "$1,000" }, { "description": "Building Ht. Computation", "detail": "In accordance with the Fairfax County Letter to Industries, the average height of the existing dwelling must be computed. The certified average elevation will be shown on the Site Grading Plan. Inova will coordinate with the project Architect to obtain the house plans, coordinate elevations between the final grading and elevation plans, and include the proposed height certification per county requirements.", "rate": "$500" }, { "description": "Stormwater management facility design and BMP location map (Chapter 124)", "detail": "In accordance with the Fairfax County, the increased runoff volume due to proposed development is required to control on site. Stormwater facility will be designed, or waiver will be requested based on infiltration test reports. Infiltration testing and reports fee is not included. The testing shall be done by certified soil consultants or Geotechnical engineers. If owner wants, he can hire directly Geotech engineer or soil consultants for infiltration testing and reports.", "rate": "$1,500" }, { "description": "EVM Tree and Forest Conservation Plan (3rd Party Arborist)", "detail": "Ceed Civil Engineering's partner will provide the existing vegetation map and Tree Preservation Plan shall be prepared per Fairfax County PFM chapter 12. Tree preservation target, Tree canopy covered computation shall be provided. A 10 yr tree canopy requirement will be computed,  and plantings will propose if required to meet canopy covered requirements. The Tree conservation plan (TCP) shall be signed and sealed by the certified arborist.", "rate": "$2,000" }, { "rate": "$3,000", "description": "Survey (3rd Party Licensed Surveyor)", "detail": "Ceed Civil Engineering's partner will perform the field run topography for the entire property, calculate MSL elevations, and prepare a plan showing existing site topography with 2-ft contour intervals @ 20-ft scale. The Survey will include a 50-foot overlap around the peripheral boundary of the property. All existing vegetation shall be depicted on the plan. Spot elevations and physical features, including edge of pavements, storm drainage pipes, and other relevant features within the limits of the survey will be identified for inclusion on the topography survey. Proposed profile holes and test holes will be located on the plan." }, { "rate": "$3,000", "description": "Soil Classification (3rd Party)", "detail": "Ceed Civil Engineer will facilitate to find Geotech engineer upon request by owner. Fee for soil report is not included. OPTIONAL - IF REQUIRED" }, { "description": "Engineering Review, Stamp and Seal P.E.", "rate": "$0.00", "detail": "Scope of work, reviewed, stamped, and sealed by state licensed P.E. VA" }], "salesman": "Ryan", "date": "05/13/2024", "client-company": "", "gap": -8000, "project-number": "573", "checkBox": "on", "remaining-balance": "$3,000", "site-zip": "22039", "client-phone": "703-870-8689", "site-street": "10708 Ox Croft Court", "client-state": "Virginia", "rate-per-hour": "$200", "FBInvoiceId": "0001456", "invoiceId": "0001457", "clientId": 252343, "delivery-duration": "2 - 5 Weeks" }

  createFBProject(json)
}