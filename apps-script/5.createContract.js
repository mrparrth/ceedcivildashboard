function _createContract_(data) {
  let lock = LockService.getScriptLock();
  try {
    if (!lock.tryLock(60000)) {
      throw new Error("Could not acquire lock");
    }

    const formattedData = { ...data };
    
    // Format currency fields
    const currencyFields = ['remainingBalance', 'retainerDeposit', 'totalCost', 'ratePerHour'];
    currencyFields.forEach(field => {
      if (formattedData[field]) {
        formattedData[field] = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(formattedData[field]);
      }
    });

    // Format scope rates
    if (formattedData.scopes) {
      formattedData.scopes = formattedData.scopes.map(scope => ({
        ...scope,
        rate: `$${Math.round(scope.rate).toLocaleString()}`
      }));
    }

    // Format dates
    const dateFields = ['date'];
    dateFields.forEach(field => {
      if (formattedData[field]) {
        const date = new Date(formattedData[field]);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
        formattedData[field] = adjustedDate.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
    });

    // Format addresses
    formattedData['siteAddress'] = `${formattedData.siteStreet},${formattedData.siteCity},${formattedData.siteState} ${formattedData.siteZip}`;
    formattedData['clientAddress'] = `${formattedData.clientStreet},${formattedData.clientCity},${formattedData.clientState} ${formattedData.clientZip}`;

    let shDatabase = SpreadsheetApp.getActive().getSheetByName('Contracts');
    // let lastRow = shDatabase.getLastRow();

    shDatabase.insertRowBefore(2)
    shDatabase.getRange(2, 1, 1, 4).setValues([[
      formattedData.id || _generateUuid_(),
      JSON.stringify(formattedData),
      '',
      new Date()
    ]]);  

    let doc = _createContractDoc_(formattedData);
    shDatabase.getRange(2, 3).setValue(doc.getUrl());

    var newProject = _createNewProjectFromContract_(formattedData);
    newProject.contractDocumentUrl = doc.getUrl();

    return newProject;
  } finally {
    lock.releaseLock();
  }
}

function _createNewProjectFromContract_(data) {
  let ss = SpreadsheetApp.getActive()

  let { state, salesMan, projectName, projectNumber, fbInvoiceId, clientName, siteAddress, clientEmail, clientPhone, siteState } = data

  // try {
  //   var dropboxUrl = createDropBoxFolderAndGetLink(`Project ${projectNumber} - ${projectName}`)
  // }
  // catch (e) { }

  let newProject = {
    id: _generateUuid_(),
    projectName,
    invoiceNumber: fbInvoiceId,
    projectNumber,
    salesMan,
    state: siteState || state,
    clientEmail,
    clientPhone,
    clientProjectNameAddress: [clientName, siteAddress, clientEmail, clientPhone].join('\n'),
    // projectFilesFolder: dropboxUrl
  }

  return newProject
  // shProjects.insertRowBefore(2)
  // shProjects.getRange(2, 1, 1, 2).setValues([[projectName, JSON.stringify(newProject)]])
}

function _createContractDoc_(data) {
  let { projectNumber, siteAddress, clientName, date } = data
  let fileName = `${projectNumber} - ${siteAddress} - ${clientName} - ${date.replace(/\//g, '_')}`
  let newDoc = createNewDocFromTemplate(fileName)
  let body = newDoc.getBody()

  //add title image
  Logger.log(`Document is created. Filling it up`)

  for (let key of Object.keys(data)) {
    if (key !== 'scopes') {
      body.replaceText(`{{${key}}}`, data[key])
    }
    else {
      if (data['scopes'].length > 0) appendScopesDataToTable(body, data[key])
    }
  }

  newDoc.saveAndClose()

  return newDoc
}

function createNewDocFromTemplate(name) {
  let settings = _getSettings_()
  let document = DriveApp.getFileById(_getIdFromUrl_(settings.contractTemplate)).makeCopy();
  document.moveTo(DriveApp.getFolderById(_getIdFromUrl_(settings.contractExportFolder)))
  Logger.log(`New document created ${document.getUrl()}`)

  let outputDoc = DocumentApp.openById(document.getId())
  outputDoc.setName(name)
  return outputDoc
}


function appendScopesDataToTable(docBody, tableDataArray) {
  let allTables = docBody.getTables()
  let table = allTables[0]
  if (!table) return
  let tableFirstRow = table.getRow(0)
  let mergeFields = tableFirstRow.editAsText().getText().split('\n')
  let lastRowAttributes = tableFirstRow.getAttributes()
  let cellsInRow = tableFirstRow.getNumChildren()
  let newRow
  for (let i = 0; i < tableDataArray.length; i++) {
    newRow = table.appendTableRow()

    for (let j = 0; j < cellsInRow; j++) {
      let mergeField = mergeFields[j].replace('{{', '').replace('}}', '')

      if (mergeField == 'sl') {
        cell = newRow.appendTableCell(String(i + 1)) //.setAttributes(lastRowAttributes)
      }
      else {
        let value = tableDataArray[i][mergeField.replace('scopes.', '')].toString()

        if (value !== null) {
          cell = newRow.appendTableCell(value) //.setAttributes(lastRowAttributes)
        }
        else {
          cell = newRow.appendTableCell('') //.setAttributes(lastRowAttributes)
        }
      }

      if (i % 2 === 0) {
        cell.setBackgroundColor(CONFIG.CONTRACT_ALTERNATE_COLORS.color1); // Set background color for even rows
      } else {
        cell.setBackgroundColor(CONFIG.CONTRACT_ALTERNATE_COLORS.color2) // Set background color for odd rows
      }
    }

    // Apply alternating background colors
    if (newRow) newRow.setAttributes(lastRowAttributes)
  }

  table.removeRow(0)
}