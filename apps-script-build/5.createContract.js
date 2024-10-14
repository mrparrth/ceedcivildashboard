function _createContract_(data) {
  let lock = LockService.getScriptLock()
  try {
    if (!lock.tryLock(60000)) {
      throw new Error("Could not acquire lock");
    }

    let shDatabase = SpreadsheetApp.getActive().getSheetByName('Contracts')
    let lastRow = shDatabase.getLastRow()

    shDatabase.getRange(lastRow + 1, 1, 1, 4).setValues([[data.id || _generateUuid_(), JSON.stringify(data), '', new Date()]])

    let doc = _createContractDoc_(data)

    shDatabase.getRange(lastRow + 1, 3).setValue(doc.getUrl())

    var newProject = _createNewProjectFromContract_(data)

    newProject.contractDocumentUrl = doc.getUrl()
  } finally {
    lock.releaseLock();
  }

  return newProject
}

function _createNewProjectFromContract_(data) {
  let ss = SpreadsheetApp.getActive()

  let { state, salesman, projectName, projectNumber, fbInvoiceId, clientName, siteAddress, clientEmail, clientPhone, siteState } = data

  try {
    var dropboxUrl = createDropBoxFolderAndGetLink(`Project ${projectNumber} - ${projectName}`)
  }
  catch (e) { }

  let newProject = {
    id: _generateUuid_(),
    projectName,
    invoiceNumber: fbInvoiceId,
    projectNumber,
    salesman,
    state: siteState || state,
    clientProjectNameAddress: [clientName, siteAddress, clientEmail, clientPhone].join('\n'),
    projectFilesFolder: dropboxUrl
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