function authorizeFB() {
  resetFreshbooks()
  getAccountId()
}

function getAccountId() {

  let response = fbGetRequest_("https://api.freshbooks.com/auth/api/v1/users/me")

  console.log("Your client id is " + response["response"]["roles"][0]["accountid"]);
  console.log("Your business id is " + response["response"]["business_memberships"][0]["business"]["id"]);
}

function _getFBClient_(data) {
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

function _createFBClient_(data) {
  let { clientName, clientEmail, clientPhone, clientCompany, clientStreet, clientCity, clientState, clientZip } = data
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

function _createFBInvoice_(data) {
  let jsonInvoice = _createInvoiceJson_(data);
  let response = fbPostRequest_(`https://api.freshbooks.com/accounting/account/${ACCOUNT_ID}/invoices/invoices`, jsonInvoice);

  Logger.log(`Invoice Created ${response.response.result.invoice.id}`)
  return response.response.result.invoice.invoice_number;
}

function _createInvoiceJson_(project) {
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
    individualItems["unit_cost"] = { amount: _parseCost_(scope.rate), code: 'USD' }

    allItems.push(individualItems);
  })

  rootDict["lines"] = allItems;
  finalDict["invoice"] = rootDict;
  Logger.log(`Invoice data ${JSON.stringify(finalDict)}`)
  return finalDict;
}

function _getAllServices_() {
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

function _createFBProject_(project) {
  console.log(project)
  const jsonProject = _createProjectJson_(project);
  const response = fbPostRequest_(`https://api.freshbooks.com/projects/business/${BUSINESS_ID}/project`, jsonProject)

  if (response.error) {
    throw response.error
  } else {
    return response.project.id;
  }
}

function _parseCost_(cost) {
  if (cost instanceof String) {
    return parseFloat(cost.replace(/[$,]/g, '')) || 0
  } else {
    return cost
  }
}

function _createProjectJson_(project) {
  Logger.log(JSON.stringify(project))
  const finalDict = {};
  const rootDict = {};
  const allServices = [];
  let { scopes, projectNumber, projectName, fbClientId, totalCost } = project

  const serviceData = _getAllServices_()

  rootDict["title"] = `${projectNumber} - ${projectName}`
  rootDict["client_id"] = fbClientId;
  rootDict["project_type"] = "fixed_price";

  scopes.forEach(scope => {
    let indivService = {};
    indivService["name"] = scope.description
    let serviceId = _getServiceIdByName_(serviceData, scope.description)
    if (serviceId) indivService["id"] = serviceId
    allServices.push(indivService)
  })

  rootDict["fixed_price"] = _parseCost_(totalCost);
  rootDict["services"] = allServices;
  finalDict["project"] = rootDict;

  console.log(JSON.stringify(finalDict));

  return finalDict;
}

function _getServiceIdByName_(serviceData, scopeDesc) {
  let service = serviceData.find(service => service.name == scopeDesc)
  if (service) return service.id
}


function testFB() {
  createFBExpenseForFinanceRow(250)
}

function _getClientIdFromInvoiceDesc_(invoiceDesc) {
  const url = `https://api.freshbooks.com/accounting/account/${ACCOUNT_ID}/invoices/invoices?search[item_description]=${invoiceDesc}`
  const result = fbGetRequest_(url)

  let invoices = result.response.result.invoices
  if (invoices.length == 0) throw `Invoice must be created for this project before you can create expenses`

  let invoice
  if (result.response.result.invoices.length > 1) {
    invoice = invoices.find(invoice => invoice.description.includes(invoiceDesc))
  } else {
    invoice = invoices[0]
  }

  return invoice.customerid
}

function _createFBExpense_(payment, user) {
  let { projectNumber, totalCost, actualCost, notes, datePaid } = payment
  let { merchantName, categoryName } = user

  try {
    var clientId = _getClientIdFromInvoiceDesc_(projectNumber)
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