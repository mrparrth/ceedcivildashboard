
const test = () => {
  let adminToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhjNjI4OWJlLWQxODQtNDg3Zi05NTllLTVhOTllYmFiNzg3MiIsImNyZWF0ZWRBdCI6IjIwMjQtMTEtMTdUMTk6MDE6NDUuNTE4WiIsIm1vZGlmaWVkQXQiOiIyMDI0LTExLTE3VDE5OjAxOjQ1LjUxOFoiLCJuYW1lIjoiVGVzdEVtcGxveWVlIiwiZW1haWwiOiJlbXBsb3llZUBjZWVkY2l2aWwuY29tIiwicm9sZSI6IkFkbWluIiwic3RhdHVzIjoiQWN0aXZlIiwibWVyY2hhbnROYW1lIjoiQWRtaW4iLCJjYXRlZ29yeU5hbWUiOiJEcmFmdGVyIC0gQ29udHJhY3RvciIsInRlc3RVc2VyPyI6dHJ1ZSwiX3Jvd0luZGV4IjoxMH0=.k3AK51d9WuV03O0qWmyNFrSiHxNejbw8V+lHp8YAtIE=";
  let empToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVjY2I1N2EwLWM0OTItNDlkOS04NmMwLTRmYzBjNTYyMGI3YSIsImNyZWF0ZWRBdCI6IjIwMjQtMTAtMDFUMTQ6MzA6MDAuNjU4WiIsIm1vZGlmaWVkQXQiOiIyMDI0LTEwLTAxVDE0OjMwOjAwLjY1OFoiLCJuYW1lIjoiQXJuZWwiLCJlbWFpbCI6ImlhbXBhcnJ0aEBnbWFpbC5jb20iLCJyb2xlIjoiRW1wbG95ZWUiLCJzdGF0dXMiOiJBY3RpdmUiLCJfcm93SW5kZXgiOjJ9.fUo9EAvFMb+BBYJPKEgmSVZWlGnXej3Mr2FRRjbvxiU=";

  let project = { draftingEstimatedDeliveryTime: '',
  estimatedBudget: '',
  projectName: 'Test',
  mepNeeded: false,
  civilTaskedTo: [ 'Civil Engineer' ],
  engineeringStatus: '',
  projectFilesFolder: '',
  draftingDropboxLink: '',
  payments: 
   [ { paymentId: '6eacd899-4416-4156-a715-4684a01c5481',
       assignedTo: 'Arnel' },
     { paymentId: '675c9781-da4d-4d82-a05b-f390810b633c',
       assignedTo: 'VSC -ENG' },
     { assignedTo: 'Nicko',
       paymentId: '6a5ba276-acaa-4661-aa0c-652297a75de6' },
     { paymentId: 'd73d9137-5342-4701-a7f9-06ced5926627',
       assignedTo: 'Civil Engineer' } ],
  dateModified: '2025-01-30T06:29:21.104Z',
  mepStatus: '',
  createdBy: 'TestEmployee',
  invoiceNumber: '0001672',
  mepEstimatedDeliveryTime: '',
  isArchived: false,
  salesMan: '',
  engineeringEstimate: '',
  civilStatus: '',
  initialProjectStatus: '',
  engineeringTaskedTo: [ 'VSC -ENG' ],
  mepTaskedTo: [ 'Nicko' ],
  clientProjectNameAddress: 'test test\nTest Test,test,California 95112\ntest@test.com\n(000)000-0000',
  engineeringDropboxLink: '',
  draftingNeeded: false,
  assignedTo: [ 'Arnel', 'VSC -ENG', 'Nicko', 'Civil Engineer' ],
  contractDocumentUrl: 'https://docs.google.com/open?id=13q91hOIwjurdxonJk_y7wYnJvfOAk_pwj2AgjbhyKpU',
  engineeringEstimatedDeliveryTime: '',
  clientEmail: 'test@test.com',
  depositPaid: false,
  civilEstimatedDeliveryTime: '',
  civilNeeded: false,
  draftingStatus: '',
  id: '071276f7-8d5a-4d73-bbee-5d7b7acaddc3',
  civilEstimate: '',
  state: 'California',
  civilDropboxLink: '',
  actualCost: '',
  description: '',
  jobType: '',
  projectNumber: '999',
  modifiedBy: 'TestEmployee',
  mepDropboxLink: '',
  contractLink: '',
  draftingEstimate: '',
  mepEstimate: '',
  folderOptions: 
   { drafter: true,
     civil: true,
     sendClientEmail: true,
     mep: true,
     engg: true },
  salesman: 'Ryan',
  dateCreated: '2025-01-30T06:29:21.104Z',
  overallProjectStatus: '',
  engineeringNeeded: false,
  draftingTaskedTo: [ 'Arnel' ],
  priority: '',
  projectNotes: '' }

  console.log(new SecureApp(adminToken).createProject(project));
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