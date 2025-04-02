
const testCreateDriveUrl = () => {
  let adminToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhjNjI4OWJlLWQxODQtNDg3Zi05NTllLTVhOTllYmFiNzg3MiIsImNyZWF0ZWRBdCI6IjIwMjQtMTEtMTdUMTk6MDE6NDUuNTE4WiIsIm1vZGlmaWVkQXQiOiIyMDI0LTExLTE3VDE5OjAxOjQ1LjUxOFoiLCJuYW1lIjoiVGVzdEVtcGxveWVlIiwiZW1haWwiOiJlbXBsb3llZUBjZWVkY2l2aWwuY29tIiwicm9sZSI6IkFkbWluIiwic3RhdHVzIjoiQWN0aXZlIiwibWVyY2hhbnROYW1lIjoiQWRtaW4iLCJjYXRlZ29yeU5hbWUiOiJEcmFmdGVyIC0gQ29udHJhY3RvciIsInRlc3RVc2VyPyI6dHJ1ZSwiX3Jvd0luZGV4IjoxMH0=.k3AK51d9WuV03O0qWmyNFrSiHxNejbw8V+lHp8YAtIE=";
  let empToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVjY2I1N2EwLWM0OTItNDlkOS04NmMwLTRmYzBjNTYyMGI3YSIsImNyZWF0ZWRBdCI6IjIwMjQtMTAtMDFUMTQ6MzA6MDAuNjU4WiIsIm1vZGlmaWVkQXQiOiIyMDI0LTEwLTAxVDE0OjMwOjAwLjY1OFoiLCJuYW1lIjoiQXJuZWwiLCJlbWFpbCI6ImlhbXBhcnJ0aEBnbWFpbC5jb20iLCJyb2xlIjoiRW1wbG95ZWUiLCJzdGF0dXMiOiJBY3RpdmUiLCJfcm93SW5kZXgiOjJ9.fUo9EAvFMb+BBYJPKEgmSVZWlGnXej3Mr2FRRjbvxiU=";

  let project = { "clientProjectNameAddress": "James Craft\nBackwoods Pole Barns - FL\n\n", "projectNotes": "", "mepTaskedTo": [], "civilStatus": "", "draftingEstimate": "", "createdBy": "Admin", "mepNeeded": false, "contractDocumentUrl": "https://docs.google.com/open?id=1V4jx1zWG9JgkUDWGaU9MgHv4crvz_csM8GSva9P8k3s", "jobType": "", "engineeringNeeded": false, "engineeringEstimatedDeliveryTime": "", "isArchived": false, "draftingStatus": "", "clientEmail": "", "contractLink": "", "civilNeeded": false, "mepStatus": "", "expenses": [], "description": "Utilize the documents provided and run calcs for all sizing and welds and holes and bolts needed for 450 pole barns to utilize this system. PLEASE note the system is ONLY the backet and rebar and shown on the last page. The idea is to put the rebar and bracket into the wet concrete. ", "engineeringDropboxLink": "https://drive.google.com/drive/folders/1ta-K5PFNu5Hx61DdHrvlXiicOFO6q7zX", "draftingNeeded": false, "id": "adc2b093-3594-45ba-9604-64bb1e71bc48", "salesMan": "", "overallProjectStatus": "For Ryan Review", "payments": [{ "paymentId": "a8af0e3a-f57a-474c-a444-0c744284cbc0", "assignedTo": "VSC - ENG" }], "invoiceNumber": "0001904", "chats": [], "actualCost": "", "assignedTo": ["Erparthas", "Partha.s", "TestTestTest"], "depositPaid": false, "mepEstimate": "", "projectNumber": 704, "civilEstimate": "", "engineeringStatus": "", "draftingEstimatedDeliveryTime": "", "folderOptions": { "sendClientEmail": false, "drafter": false, "engg": true, "mep": false, "civil": false }, "engineeringEstimate": "", "projectName": "450 - Pole Barn Attachment - Open and Enclosed", "civilTaskedTo": [], "draftingTaskedTo": [], "mepEstimatedDeliveryTime": "", "dateCreated": "2025-03-20T17:37:40.995Z", "estimatedBudget": "", "dateModified": "2025-03-24T14:45:59.626Z", "initialProjectStatus": "", "projectFilesFolder": "https://drive.google.com/drive/folders/1lk-qAm87nNNBEQ_Dlee2pM3Chgy6OyTT", "state": "Florida", "priority": "Urgent", "engineeringTaskedTo": ["VSC - ENG"], "modifiedBy": "VSC - ENG", "civilEstimatedDeliveryTime": "", "clientProjectFolder": "https://drive.google.com/drive/folders/1A42s8Bk6VXmqic2_zo1qzlsJ2e1Dfw4V", "_rowIndex": 3, "draftingDropboxLink": null, "mepDropboxLink": null, "civilDropboxLink": null, "slackChannelId": "C08LJMRF5A8" }


  // createSlackChannel(project)
  // console.log('here')
  // console.log(new SecureApp(adminToken).createDriveFolderStructure(project));


  console.log(new SecureApp(adminToken).updateProject(project));
  // this.settings = _getSettings_(CONFIG.SETTINGS)
  // console.log(this.settings.projectsRootFolder)
  // let folderName = `Project ${project.projectNumber} - ${project.projectName}`
  // let driveRoot = DriveApp.getFolderById(_getIdFromUrl_(this.settings.projectsRootFolder))

  // let now = new Date();
  // let timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), "ddMMyyyy_HHmmss");

  // let projectFolder = driveRoot.createFolder(folderName + '_' + timestamp)

  // let subFolders = [
  //   'Arch Folder',
  //   'MEP folder',
  //   'Old Archive Folder',
  //   'Structural Folder',
  //   'Client Provided Files'
  // ];

  // for (let folderName of subFolders) {
  //   let folder = projectFolder.createFolder(folderName)
  //   if (folderName == 'Client Provided Files') {
  //     folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT)
  //   } else {
  //     let allUsers = this.settings.emailsWithEditAccess
  //     folder.addEditors(allUsers.split('/'))
  //   }
  // }

  // console.log(new Date(payload['data'].date))
  // console.log(_createContract_(payload.data));

  // console.log(new SecureApp(payload.token).createExpense(payload.data));

  payload = { "data": { "engineeringEstimatedDeliveryTime": "", "projectNotes": "", "priority": "", "description": "Test Description", "civilEngineeringStatus": "", "createdBy": "TestEmployee", "clientProjectNameAddress": "", "dateCreated": "2024-12-03T15:54:20.110Z", "mepTaskedTo": "", "initialProjectStatus": "", "engineeringStatus": "", "estimatedBudget": "0", "projectFilesFolder": "https://www.dropbox.com/scl/fo/qfkp9a8ghy73eurnekxis/AGE9Td31GLJhw3YjYbwUiVk?rlkey=6owed268b39yl8xaji9gdsy37&dl=0", "depositPaid": false, "civilEstimatedDeliveryTime": "", "mepNeeded": false, "actualCost": "", "assignedTo": ["TestEmployee"], "mepEstimatedDeliveryTime": "", "civilNeeded": false, "projectName": "Test By Partha", "contractLink": "", "jobType": "", "projectNumber": 630, "dateModified": "2025-01-04T20:11:33.884Z", "modifiedBy": "TestEmployee", "engineeringNeeded": false, "engineeringDropboxLink": "", "id": "29ae080f-d043-43df-aac2-a9f97b77a136", "overallProjectStatus": "Pending S&S", "civilDropboxLink": "", "draftingEstimatedDeliveryTime": "", "draftingDropboxLink": "", "isArchived": true, "state": "TestState", "engineerTaskedTo": "", "mepDropboxLink": "", "drafterNeeded": false, "mepStatus": "", "invoiceNumber": "", "drafterTaskedTo": "", "salesMan": "", "civilEngineeringTaskedTo": "", "draftingStatus": "", "_rowIndex": 7, "clientEmail": "iamparrth@gmail.com" }, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhjNjI4OWJlLWQxODQtNDg3Zi05NTllLTVhOTllYmFiNzg3MiIsImNyZWF0ZWRBdCI6IjIwMjQtMTEtMTdUMTk6MDE6NDUuNTE4WiIsIm1vZGlmaWVkQXQiOiIyMDI0LTExLTE3VDE5OjAxOjQ1LjUxOFoiLCJuYW1lIjoiVGVzdEVtcGxveWVlIiwiZW1haWwiOiJlbXBsb3llZUBjZWVkY2l2aWwuY29tIiwicm9sZSI6IkVtcGxveWVlIiwic3RhdHVzIjoiQWN0aXZlIiwibWVyY2hhbnROYW1lIjoiQWRtaW4iLCJjYXRlZ29yeU5hbWUiOiJEcmFmdGVyIC0gQ29udHJhY3RvciIsIl9yb3dJbmRleCI6MTB9.AU5TjKTgxWjqrXgBSFEe0+0u7KiFc5mf7r5Ha4QtPs8=" }
  console.log(new SecureApp(payload.token).createProject(payload.data))

  // payload = { "data": { "engineeringEstimatedDeliveryTime": "", "projectNotes": "", "priority": "", "description": "Test Description", "civilEngineeringStatus": "", "createdBy": "TestEmployee", "clientProjectNameAddress": "", "dateCreated": "2024-12-03T15:54:20.110Z", "mepTaskedTo": "", "initialProjectStatus": "", "engineeringStatus": "", "estimatedBudget": "0", "projectFilesFolder": "https://www.dropbox.com/scl/fo/qfkp9a8ghy73eurnekxis/AGE9Td31GLJhw3YjYbwUiVk?rlkey=6owed268b39yl8xaji9gdsy37&dl=0", "depositPaid": false, "civilEstimatedDeliveryTime": "", "mepNeeded": false, "actualCost": "", "assignedTo": ["TestEmployee"], "mepEstimatedDeliveryTime": "", "civilNeeded": false, "projectName": "Test By Partha", "contractLink": "", "jobType": "", "projectNumber": 630, "dateModified": "2024-12-24T05:45:49.704Z", "modifiedBy": "TestEmployee", "engineeringNeeded": false, "engineeringDropboxLink": "", "id": "29ae080f-d043-43df-aac2-a9f97b77a136", "overallProjectStatus": "Pending S&S", "civilDropboxLink": "", "draftingEstimatedDeliveryTime": "", "draftingDropboxLink": "", "isArchived": true, "state": "TestState", "engineerTaskedTo": "", "mepDropboxLink": "", "drafterNeeded": false, "mepStatus": "", "invoiceNumber": "", "drafterTaskedTo": "", "salesMan": "", "civilEngineeringTaskedTo": "", "draftingStatus": "", "_rowIndex": 7 }, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhjNjI4OWJlLWQxODQtNDg3Zi05NTllLTVhOTllYmFiNzg3MiIsImNyZWF0ZWRBdCI6IjIwMjQtMTEtMTdUMTk6MDE6NDUuNTE4WiIsIm1vZGlmaWVkQXQiOiIyMDI0LTExLTE3VDE5OjAxOjQ1LjUxOFoiLCJuYW1lIjoiVGVzdEVtcGxveWVlIiwiZW1haWwiOiJlbXBsb3llZUBjZWVkY2l2aWwuY29tIiwicm9sZSI6IkVtcGxveWVlIiwic3RhdHVzIjoiQWN0aXZlIiwibWVyY2hhbnROYW1lIjoiQWRtaW4iLCJjYXRlZ29yeU5hbWUiOiJEcmFmdGVyIC0gQ29udHJhY3RvciIsIl9yb3dJbmRleCI6MTB9.AU5TjKTgxWjqrXgBSFEe0+0u7KiFc5mf7r5Ha4QtPs8=" }

  // console.log(new SecureApp(payload.token).updateProject(payload.data))
  // new Auth().login({ token: data.token });
};

const testLogin = () => {
  console.log(
    new Auth().login({ email: "employee@ceedcivil.com", password: "test" })
  );
};

const getClient = () => {
  console.log(_getClientIdFromInvoiceDesc_('405'))
}

const testModifyProjects = () => {
  let ss = SpreadsheetApp.getActive()
  let projects = _getParsedDataFromSheet_(ss.getSheetByName('Projects'))
  let output = []

  for (let i = 0; i < projects.length; i++) {
    let strProject = JSON.stringify(projects[i])
    strProject = strProject.replace(/civilEngineering/g, 'civil');

    let project = JSON.parse(strProject)
    project.payments = []
    project.draftingTaskedTo = []
    project.draftingNeeded = false
    project.engineeringTaskedTo = []
    project.engineeringNeeded = false
    project.mepTaskedTo = []
    project.mepNeeded = false
    project.civilTaskedTo = []
    project.civilNeeded = false

    output.push([JSON.stringify(project)])
  }

  ss.getSheetByName('Projects').getRange(2, 2, output.length, 1).setValues(output)
}

const testUpdateStatus = () => {
  const auth = {
    email: undefined,
    password: undefined,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhjNjI4OWJlLWQxODQtNDg3Zi05NTllLTVhOTllYmFiNzg3MiIsImNyZWF0ZWRBdCI6IjIwMjQtMTEtMTdUMTk6MDE6NDUuNTE4WiIsIm1vZGlmaWVkQXQiOiIyMDI0LTExLTE3VDE5OjAxOjQ1LjUxOFoiLCJuYW1lIjoiVGVzdEVtcGxveWVlIiwiZW1haWwiOiJlbXBsb3llZUBjZWVkY2l2aWwuY29tIiwicm9sZSI6IkFkbWluIiwic3RhdHVzIjoiQWN0aXZlIiwibWVyY2hhbnROYW1lIjoiQWRtaW4iLCJjYXRlZ29yeU5hbWUiOiJEcmFmdGVyIC0gQ29udHJhY3RvciIsInVzZXJUeXBlIjoiIiwidGVzdFVzZXI/Ijp0cnVlLCJfcm93SW5kZXgiOjEwfQ==.kIeCLPy5EPJsz3Eiv4I2QNWMg8lDfrK49kElvtnFTGU='
  }

  let update = {
    id: 'b78cafb9-737a-417d-a172-77fc8964dd6b',
    overallProjectStatus: 'Pending Start1'
  }

  updateProject({ token: auth.token, data: update })
}

const testNewUser = () => {
  let user = {
    isNewMerchant: false,
    email: 'erparthas@gmail.com',
    categoryName: 'Calcualtions - Contractor',
    isNewCategory: false,
    name: 'Partha Sarathi Sahoo',
    userType: 'Drafter',
    merchantName: 'Bren Navarro - MEP',
    role: 'Employee'
  }

  processForm(user)
}

const testCreateExpense = () => {
  let expense = { "dateModified": "2025-02-02T18:38:53.814Z", "revisionPaid": false, "notes": "", "id": "4ffc2279-637d-4c3a-bd1e-af2ab0150aa2", "createdBy": "Tika Koirala", "actualCost": 0, "projectId": "127a5455-5a41-4ef2-8fb3-70456108e0ce", "paid": false, "modifiedBy": "Tika Koirala", "revisionCost": 0, "projectNumber": 632, "datePaid": "2025-03-04", "dateCreated": "2025-02-02T18:38:53.812Z", "revisionNeeded": false, "projectName": "VA - Gym Addition Site Plan", "totalCost": 0, "salesMan": "", "datePaid2": null, "assignee": "Arnel", "projectStatus": "Pending Start" }

  let userSh = _getSheetById_(350989579)
  let user = _getItemsFromSheet_(userSh, row => row.email == 'erparthas@gmail.com')[0]

  _createFBExpense_(expense, user)
}