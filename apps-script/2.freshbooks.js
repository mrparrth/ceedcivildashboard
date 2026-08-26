const FRESHBOOKS_CONFIG = {
  bearerToken: 'mbk_live_d7c8b4321cc330191d5d8bd2c4e2f265d56f23167e16258e6b2fb0912e4dde6f',
  baseUrl: 'https://main.d2ong3g37sbjmz.amplifyapp.com/api/'
}

function getAccountId() {

  let response = fbGetRequest_("https://api.freshbooks.com/auth/api/v1/users/me")

  console.log("Your client id is " + response["response"]["roles"][0]["accountid"]);
  console.log("Your business id is " + response["response"]["business_memberships"][0]["business"]["id"]);
}

function _getFBClient_(data) {
  let client = fbGetRequest_('clients', { email: data.clientEmail })

  if (client.totalItems == 0) {
    return
  } else {
    return client.items[0].id;
  }
}

function _createFBClient_(data) {
  let { clientName, clientEmail, clientPhone, clientCompany, clientStreet, clientCity, clientState, clientZip } = data


  let jsonClient = {
    "displayName": clientName,
    "phone": clientPhone,
    "email": clientEmail,
    "company": clientCompany,
    "address_line1": clientStreet,
    "city": clientCity,
    "state": clientState,
    "postal": clientZip,
    "country": "United States",
  };

  let client = fbPostRequest_(`clients`, jsonClient)

  return client.id
}

function _createFBInvoice_(data) {
  let jsonInvoice = _createInvoiceJson_(data);
  let invoice = fbPostRequest_(`invoices`, jsonInvoice);


  Logger.log(`Invoice Created ${invoice.invoiceNumber}`)
  return invoice.invoiceNumber;
}

function _createInvoiceJson_(project) {
  let rootDict = {};
  let allItems = [];
  let { projectNumber, projectName, fbClientId, isUpworkJob, scopes, totalCost } = project

  rootDict["clientId"] = fbClientId;
  rootDict["issueDate"] = Utilities.formatDate(new Date(), "UTC", "yyyy-MM-dd");
  rootDict["dueDate"] = Utilities.formatDate(new Date(), "UTC", "yyyy-MM-dd");
  rootDict["terms"] = 'test'
  rootDict["subtotal"] = _parseCost_(totalCost)
  rootDict["tax"] = 0
  rootDict["discount"] = 0
  rootDict["total"] = _parseCost_(totalCost)

  let individualItems = {}
  individualItems["name"] = "Info";
  individualItems["details"] = `Project ${projectNumber} - ${projectName}${isUpworkJob ? " - Upwork Job" : ""}`
  individualItems["quantity"] = 1;
  individualItems["unitPrice"] = 0;
  allItems.push(individualItems);

  scopes.forEach((scope) => {
    let individualItems = {};
    individualItems["name"] = scope.description
    individualItems["details"] = scope.detail;
    individualItems["quantity"] = 1;
    individualItems["unitPrice"] = _parseCost_(scope.rate)

    allItems.push(individualItems);
  })

  rootDict["lineItems"] = allItems;
  Logger.log(`Invoice data ${JSON.stringify(rootDict)}`)
  return rootDict;
}

function _createFBProject_(project) {
  const jsonProject = _createProjectJson_(project);
  const response = fbPostRequest_(`projects`, jsonProject)

  if (response.error) {
    throw response.error
  } else {
    return response.project.id;
  }
}

function _createProjectJson_(project) {
  const rootDict = {};
  const allServices = [];
  let { scopes, projectNumber, projectName, fbClientId, totalCost } = project

  const serviceMap = _getAllServices_()

  rootDict["title"] = `${projectNumber} - ${projectName}`
  rootDict["clientId"] = fbClientId;
  rootDict["projectType"] = "fixed_price";

  scopes.forEach(scope => {
    let indivService = {};
    indivService["name"] = scope.description
    let serviceId = serviceMap[scope.description.trim()]
    if (serviceId) {
      indivService["id"] = serviceId
    } else {
      indivService["id"] = _createFbService_(scope.description)
    }
    allServices.push(indivService)
  })

  rootDict["fixedPrice"] = _parseCost_(totalCost);
  rootDict["serviceIds"] = allServices.map(s => s.id);

  console.log(JSON.stringify(rootDict));

  return rootDict;
}

function _getAllServices_() {
  const services = fbGetAll_(`services`)

  return Object.fromEntries(
    services.map(({ name, id }) => [name.trim(), id])
  );
}

function _createFbService_(name) {
  let response = fbPostRequest_(`services`, { name })

  return response.service.id
}

function _createFBExpense_(payment, user) {
  let { projectNumber, projectName, actualCost, revisionCost, revisionNeeded, notes, datePaid, datePaid2 } = payment
  let { merchantName, categoryName } = user

  try {
    var clientId = _getClientIdFromInvoiceDesc_(projectNumber)
  }
  catch (e) {
    throw e
  }

  let body = {
    "amount": revisionNeeded ? revisionCost : actualCost,
    "currency": "USD",
    "notes": `${projectNumber} - ${projectName}`,
    "vendor": merchantName,
    "category": categoryName,
    "date": revisionNeeded ? datePaid2 : datePaid,
    "clientId": clientId,
    "billable": false
  }

  let result = fbPostRequest_(`expenses`, body)

  if (result?.errors) {
    throw result.response.errors[0].message
  } else {
    return result.id
  }
}

function _getClientIdFromInvoiceDesc_(invoiceDesc) {
  const params = { keyword: invoiceDesc, include: 'lineItems', keywordField: 'description' }
  const result = fbGetRequest_('invoices', params)

  let invoices = result.items
  if (invoices.length == 0) throw `Invoice must be created for this project before you can create expenses`

  let foundInvoice = invoices.find(invoice => invoice.description.includes(invoiceDesc))

  if (!foundInvoice) {
    foundInvoice = invoices.find(inv => inv.lineItems.some(r => r.description.includes(invoiceDesc)))
  }

  if (!foundInvoice) throw 'Invoice must be created for this project before you can create expenses'

  return foundInvoice.clientId
}


function _parseCost_(cost) {
  if (typeof cost === 'string') {
    return parseFloat(cost.replace(/[$,]/g, '')) || 0
  } else {
    return cost
  }
}

function getExpenses() {

  const shPayments = _getSheetById_(1407472227)
  const isRecent = dateStr => dateStr.includes('2024') || dateStr.includes('2025')
  let payments = _getParsedDataFromSheet_(shPayments, payment => !!payment.expenseId && (isRecent(payment.datePaid) || isRecent(payment.datePaid2)))
  // payments = payments.filter(payment=>payment.actualCost==363)
  //get expenses
  const url = `https://api.freshbooks.com/accounting/account/${ACCOUNT_ID}/expenses/expenses?search[date_min]=2024-06-01&search[date_max]=2025-03-07`
  const expenses = fbGetAll_(url).expenses

  for (let payment of payments) {
    let foundExpenseInFb = expenses.find(expense => expense.id == payment.expenseId)
    if (foundExpenseInFb) {
      if (parseFloat(foundExpenseInFb.amount.amount) !== parseFloat(payment.totalCost) && parseFloat(foundExpenseInFb.amount.amount) !== parseFloat(payment.actualCost)) {
        console.error(`Check ${foundExpenseInFb.id}. Mismatch in amount`)
      }
      let expenseUrl = `https://api.freshbooks.com/accounting/account/${ACCOUNT_ID}/expenses/expenses/${foundExpenseInFb.id}`

      let existingNote = foundExpenseInFb.notes.replace(payment.notes.trim(), '')
      let textMustHave = `${payment.projectNumber} - ${payment.projectName}`
      if (existingNote.includes(textMustHave)) {
        console.log(`Skipping ${textMustHave}`)
        continue
      }

      let newNote
      if (existingNote) {
        newNote = `${textMustHave}\n${existingNote}`
      } else {
        newNote = `${textMustHave}`
      }
      let data = {
        "expense": {
          notes: newNote
        }
      }
      console.info(`${payment._rowIndex} - Updating expense ${foundExpenseInFb.id} with note ${newNote}`)
      let response = fbPutRequest_(expenseUrl, data)

    } else {
      console.log(`Skipping ${payment._rowIndex} ${payment.projectNumber} - ${payment.projectName}`)
    }
  }

  // console.log(analyzedExpenses)
}

function getFbVendors() {
  let url = `expenses/merchants`
  let vendors = fbGetAll_(url)
  return vendors
}

function getFbCategories() {
  let url = `/expense-categories`
  let categories = fbGetAll_(url)
  console.log(categories.map(c => [c.id, c.parentId, c.category]))
  let file = DriveApp.createFile('test.txt', JSON.stringify(categories.map(c => [c.id, c.parentId, c.category])))
  console.log(file.getUrl())
  let parentCIds = categories.filter(c => c.category == 'Contractors').map(c => c.id)
  let contractorCategories = categories.filter(c => parentCIds.includes(c.parentid)).map(c => c.category)

  return Array.from(new Set(contractorCategories))
}

function createFbCategory(fbCategory) {
  let url = `/expense-categories`
  let categories = fbGetAll_(url)
  console.log(categories.map(c => [c.id, c.parentId, c.category]))
  let file = DriveApp.createFile('test.txt', JSON.stringify(categories.map(c => [c.id, c.parentId, c.category])))
  console.log(file.getUrl())
  let parentCIds = categories.filter(c => c.category == 'Contractors').map(c => c.id)

  let params = {
    "category": fbCategory,
    "is_cogs": false,
    "parentid": parentCIds,
  }
  let response = fbPostRequest_(url, params)
  if (!response.result) console.log(response)
}

function fbGetRequest_(endpoint, params = {}) {
  const strParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
    .join('&');

  const url = FRESHBOOKS_CONFIG.baseUrl + (strParams ? `${endpoint}?${strParams}` : endpoint);

  const options = {
    method: 'get',
    headers: {
      Authorization: `Bearer ${FRESHBOOKS_CONFIG.bearerToken}`
    }
  }

  const response = UrlFetchApp.fetch(url, options);

  const json = JSON.parse(response.getContentText());

  return json
}

function fbPostRequest_(endpoint, data = {}) {
  const url = FRESHBOOKS_CONFIG.baseUrl + endpoint;

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${FRESHBOOKS_CONFIG.bearerToken}`
    },
    payload: JSON.stringify(data),
    muteHttpExceptions: true
  };

  console.log(JSON.stringify(data))
  const response = UrlFetchApp.fetch(url, options);

  return JSON.parse(response.getContentText());
}

function fbGetAll_(endpoint, options = {}) {
  if (!options.pageSize) options.pageSize = 100

  let allData = [];
  let hasMoreData = true;
  let pageCnt = 0;
  let mainDataKey;

  while (hasMoreData) {
    pageCnt++;
    options.page = pageCnt

    let response = fbGetRequest_(endpoint, options);
    mainDataKey = Object.keys(response).find(key => Array.isArray(response[key]));

    if (!mainDataKey) {
      return {};
    }

    allData.push(...response[mainDataKey]);

    hasMoreData = response.totalPages > response.page
  }

  return allData
}