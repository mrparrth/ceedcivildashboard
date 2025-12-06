const addPhoneAndEmail = () => {
  let ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName('Projects');
  let projects = _getParsedDataFromSheet_(sheet);

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
  const phoneRegex = /(?:Phone:?\s*)?(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{10})/i;

  for (let project of projects) {
    let notes = project.clientProjectNameAddress;
    let splitNotes = notes.split('\n');

    if (splitNotes.length == 4) {
      let phone = splitNotes[3];
      let email = splitNotes[2];

      if (!project.clientEmail) {
        project.clientEmail = email.toLowerCase();
      }
      project.clientPhone = phone;
    } else {
      // Try finding matches in different locations
      let foundEmail, foundPhone;
      let searchLocations = [
        notes,
        project.projectNotes
      ];

      for (let location of searchLocations) {
        if (!location) continue;

        const emailMatch = location.match(emailRegex);
        const phoneMatch = location.match(phoneRegex);

        if (emailMatch && !foundEmail) {
          foundEmail = emailMatch[0];
        }
        if (phoneMatch && !foundPhone) {
          foundPhone = phoneMatch[1].replace(/[-.\s]/g, '');
        }

        if (foundEmail && foundPhone) break;
      }

      // Update project only if matches were found
      if (foundEmail && !project.clientEmail) {
        project.clientEmail = foundEmail.toLowerCase();
      }
      if (foundPhone) {
        project.clientPhone = foundPhone;
      }
    }
  }

  let output = projects.map(project => [JSON.stringify(project)]);
  sheet.getRange(2, 2, output.length, 1).setValues(output);
}

const testCreateDriveUrl = () => {
  let adminToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhjNjI4OWJlLWQxODQtNDg3Zi05NTllLTVhOTllYmFiNzg3MiIsImNyZWF0ZWRBdCI6IjIwMjQtMTEtMTdUMTk6MDE6NDUuNTE4WiIsIm1vZGlmaWVkQXQiOiIyMDI0LTExLTE3VDE5OjAxOjQ1LjUxOFoiLCJuYW1lIjoiVGVzdEVtcGxveWVlIiwiZW1haWwiOiJlbXBsb3llZUBjZWVkY2l2aWwuY29tIiwicm9sZSI6IkFkbWluIiwic3RhdHVzIjoiQWN0aXZlIiwibWVyY2hhbnROYW1lIjoiQWRtaW4iLCJjYXRlZ29yeU5hbWUiOiJEcmFmdGVyIC0gQ29udHJhY3RvciIsInRlc3RVc2VyPyI6dHJ1ZSwiX3Jvd0luZGV4IjoxMH0=.k3AK51d9WuV03O0qWmyNFrSiHxNejbw8V+lHp8YAtIE=";
  let empToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVjY2I1N2EwLWM0OTItNDlkOS04NmMwLTRmYzBjNTYyMGI3YSIsImNyZWF0ZWRBdCI6IjIwMjQtMTAtMDFUMTQ6MzA6MDAuNjU4WiIsIm1vZGlmaWVkQXQiOiIyMDI0LTEwLTAxVDE0OjMwOjAwLjY1OFoiLCJuYW1lIjoiQXJuZWwiLCJlbWFpbCI6ImlhbXBhcnJ0aEBnbWFpbC5jb20iLCJyb2xlIjoiRW1wbG95ZWUiLCJzdGF0dXMiOiJBY3RpdmUiLCJfcm93SW5kZXgiOjJ9.fUo9EAvFMb+BBYJPKEgmSVZWlGnXej3Mr2FRRjbvxiU=";

  let formProject = {
    "estimatedBudget": "",
    "draftingEstimatedDeliveryTime": "",
    "draftingTaskedTo": [],
    "jobType": "",
    "chats": [],
    "draftingEstimate": "",
    "engineeringStatus": "",
    "dateModified": "2025-04-09T04:43:28.130Z",
    "priority": "",
    "projectFilesFolder": "https://drive.google.com/drive/folders/1fAUOJGMx_1TvMc8_NUU4qmTwG46f4fUt",
    "salesMan": "Ryan",
    "civilNeeded": true,
    "assignedTo": [
      "VSC - ENG"
    ],
    "projectName": "1200 SF Foundation Only",
    "modifiedBy": "TestEmployee",
    "createdBy": "Admin",
    "engineeringTaskedTo": [
      "VSC - ENG"
    ],
    "depositPaid": false,
    "draftingStatus": "",
    "civilStatus": "",
    "contractDocumentUrl": "https://docs.google.com/open?id=1a5sxp0QWFqJhsEp3hpQH5z0vHJ0eINKdrEyUtpEZH9I",
    "engineeringEstimate": "",
    "description": "",
    "civilEstimatedDeliveryTime": "",
    "engineeringNeeded": true,
    "mepStatus": "",
    "projectNotes": "",
    "mepEstimatedDeliveryTime": "",
    "id": "c58bfa7e-e07f-4afd-8548-9c8b3a056c4c",
    "folderOptions": {
      "engg": true,
      "sendClientEmail": true,
      "mep": false,
      "civil": false,
      "drafter": false
    },
    "mepTaskedTo": [],
    "invoiceNumber": "0001938",
    "civilEstimate": "",
    "mepNeeded": true,
    "overallProjectStatus": "Pending Start",
    "clientProjectNameAddress": "Timothy DeScala \n#17CR2112,Nutrioso ,Arizona 85932\nmrmotoguy333@aol.com\n7202321885",
    "initialProjectStatus": "",
    "engineeringDropboxLink": "https://drive.google.com/drive/folders/18fU-LC7heAr3UTehZR_0LKDy_8zoWAgO",
    "mepEstimate": "",
    "draftingNeeded": true,
    "dateCreated": "2025-04-08T22:26:46.433Z",
    "civilTaskedTo": [],
    "projectNumber": 9999,
    "actualCost": "",
    "payments": [
      {
        "paymentId": "887c6b2e-b19d-4ed2-b1fa-9bfb7da2924d",
        "assignedTo": "VSC - ENG"
      }
    ],
    "isArchived": false,
    "expenses": [],
    "state": "Arizona",
    "contractLink": "",
    "clientEmail": "mrmotoguy333@aol.com",
    "engineeringEstimatedDeliveryTime": "",
    "clientProjectFolder": "https://drive.google.com/drive/folders/1ocqspllQ5URYFwkuA5tPpK-r6O11FQlN",
    "_rowIndex": 2
  }


  createProject({ token: adminToken, data: formProject })

  // let projectData = { "clientProjectNameAddress": "Test Parth\nBackwoods Pole Barns - FL\n\n", "projectNotes": "", "mepTaskedTo": [], "civilStatus": "", "draftingEstimate": "", "createdBy": "Admin", "mepNeeded": false, "contractDocumentUrl": "https://docs.google.com/open?id=1V4jx1zWG9JgkUDWGaU9MgHv4crvz_csM8GSva9P8k3s", "jobType": "", "engineeringNeeded": false, "engineeringEstimatedDeliveryTime": "", "isArchived": false, "draftingStatus": "", "clientEmail": "", "contractLink": "", "civilNeeded": false, "mepStatus": "", "expenses": [], "description": "Utilize the documents provided and run calcs for all sizing and welds and holes and bolts needed for 450 pole barns to utilize this system. PLEASE note the system is ONLY the backet and rebar and shown on the last page. The idea is to put the rebar and bracket into the wet concrete. ", "engineeringDropboxLink": "https://drive.google.com/drive/folders/1ta-K5PFNu5Hx61DdHrvlXiicOFO6q7zX", "draftingNeeded": false, "id": "adc2b093-3594-45ba-9604-64bb1e71bc48", "salesMan": "", "overallProjectStatus": "For Ryan Review", "payments": [{ "paymentId": "a8af0e3a-f57a-474c-a444-0c744284cbc0", "assignedTo": "VSC - ENG" }], "invoiceNumber": "0001904", "chats": [], "actualCost": "", "assignedTo": ["Test2"], "depositPaid": false, "mepEstimate": "", "projectNumber": 999, "civilEstimate": "", "engineeringStatus": "", "draftingEstimatedDeliveryTime": "", "folderOptions": { "sendClientEmail": false, "drafter": false, "engg": true, "mep": false, "civil": false }, "engineeringEstimate": "", "projectName": "Test Adding Madison and Ryan", "civilTaskedTo": [], "draftingTaskedTo": [], "mepEstimatedDeliveryTime": "", "dateCreated": "2025-03-20T17:37:40.995Z", "estimatedBudget": "", "dateModified": "2025-03-24T14:45:59.626Z", "initialProjectStatus": "", "projectFilesFolder": "https://drive.google.com/drive/folders/1lk-qAm87nNNBEQ_Dlee2pM3Chgy6OyTT", "state": "Florida", "priority": "Urgent", "engineeringTaskedTo": ["VSC - ENG"], "modifiedBy": "VSC - ENG", "civilEstimatedDeliveryTime": "", "clientProjectFolder": "https://drive.google.com/drive/folders/1A42s8Bk6VXmqic2_zo1qzlsJ2e1Dfw4V", "_rowIndex": 3, "draftingDropboxLink": null, "mepDropboxLink": null, "civilDropboxLink": null }

  // _createSlackChannel(projectData)
  // console.log(new SecureApp(adminToken).createProject(projectData))

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


function testSlackMessage() {
  const project = { "clientProjectNameAddress": "Test Parth\nBackwoods Pole Barns - FL\n\n", "projectNotes": "", "mepTaskedTo": [], "civilStatus": "", "draftingEstimate": "", "createdBy": "Admin", "mepNeeded": false, "contractDocumentUrl": "https://docs.google.com/open?id=1V4jx1zWG9JgkUDWGaU9MgHv4crvz_csM8GSva9P8k3s", "jobType": "", "engineeringNeeded": false, "engineeringEstimatedDeliveryTime": "", "isArchived": false, "draftingStatus": "", "clientEmail": "", "contractLink": "", "civilNeeded": false, "mepStatus": "", "expenses": [], "description": "Utilize the documents provided and run calcs for all sizing and welds and holes and bolts needed for 450 pole barns to utilize this system. PLEASE note the system is ONLY the backet and rebar and shown on the last page. The idea is to put the rebar and bracket into the wet concrete. ", "engineeringDropboxLink": "https://drive.google.com/drive/folders/1ta-K5PFNu5Hx61DdHrvlXiicOFO6q7zX", "draftingNeeded": false, "id": "adc2b093-3594-45ba-9604-64bb1e71bc48", "salesMan": "", "overallProjectStatus": "For Ryan Review", "payments": [{ "paymentId": "a8af0e3a-f57a-474c-a444-0c744284cbc0", "assignedTo": "VSC - ENG" }], "invoiceNumber": "0001904", "chats": [], "actualCost": "", "assignedTo": ["Test2", "Ryan"], "depositPaid": false, "mepEstimate": "", "projectNumber": 999, "civilEstimate": "", "engineeringStatus": "", "draftingEstimatedDeliveryTime": "", "folderOptions": { "sendClientEmail": false, "drafter": false, "engg": true, "mep": false, "civil": false }, "engineeringEstimate": "", "projectName": "Test Project 2 By Parth", "civilTaskedTo": [], "draftingTaskedTo": [], "mepEstimatedDeliveryTime": "", "dateCreated": "2025-03-20T17:37:40.995Z", "estimatedBudget": "", "dateModified": "2025-03-24T14:45:59.626Z", "initialProjectStatus": "", "projectFilesFolder": "https://drive.google.com/drive/folders/1lk-qAm87nNNBEQ_Dlee2pM3Chgy6OyTT", "state": "Florida", "priority": "Urgent", "engineeringTaskedTo": ["VSC - ENG"], "modifiedBy": "VSC - ENG", "civilEstimatedDeliveryTime": "", "clientProjectFolder": "https://drive.google.com/drive/folders/1A42s8Bk6VXmqic2_zo1qzlsJ2e1Dfw4V", "_rowIndex": 3, "draftingDropboxLink": null, "mepDropboxLink": null, "civilDropboxLink": null }

  sendWelcomeMessage('C08LZHNN61X', {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `🎉 *Welcome to Project #${project.projectNumber} - ${project.projectName}!* 🎉`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<${project.projectFilesFolder}|📁 Go to project folder>`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "📢 This channel is your central hub for:\n• Project updates and milestones\n• Important announcements\n• Team collaboration\n• Resource sharing"
        }
      }
    ],
    parse: 'full'
  })
}

function testFbProject() {
  let project = {
    retainerRemaining: '',
    drafterFolderNeeded: false,
    fbProjectId: '',
    projectDesc: 'site plan for location in MD',
    clientCity: 'Clinton ',
    siteAddress: '',
    scopes:
      [{
        description: 'FFX - Site Grading & Development Plan',
        rate: 3000,
        selected: true,
        _rowIndex: 37,
        detail: 'Existing and Proposed Contours, Established Building Setbacks, Driveway & Utilities, Demolition of the existing (if any), Existing parking spaces (if any), Proposed Construction Entrance and Driveway, Limits of Clearing and Grading, Determination of watershed and proposed impervious areas, Required Erosion and Sediment Control Devices, Site Development and Sequences of Construction Notes, Impervious Area Analysis, Watershed for the site and disturbed areas in the watershed, Frontage cover,Standard Construction Details and Certifications.'
      },
      {
        rate: 2000,
        detail: 'As required per County, CCE will perform outfall analysis for the site in order to ensure that it has adequate outfall in accordance with the PFM and Northern Virginia handbook. The outfall analysis will include pre-development, construction phase, and post-construction phase. CCE will perform field review of existing drainage pattern, set drainage divide, perform required analysis and calculations, and assess the adequacy of the outfall for the site. The Outfall Narrative will include:1.Stormwater runoff computation by runoff reduction method. Stormwater management ordinance Chapter 124.Virginia state regulations. 2.Site-specific Narrative with description of the elements of storm drainage system and adjoining properties. 3. Outfall Locations Map with contributing drainage areas and detailed hydrological and hydraulic calculations. 4. Extent of the outfall analysis per PFM chapter 6. 5. Up to five (5) cross-sections based on field run contour intervals and spot evaluations to verify the outfall adequacy. 6. Permissible velocity, based on roughness coefficient, soil classification, pipe materials, cover material and channel lining (if any). 7. Design velocities compared with the permissible channel velocities (as applicable). 8. Observed erosion conditions along the downstream channel and the presence of erosive conditions. 9. Adequacy of outfall to the bed and banks of the receiving stream. 10. Engineer’s Certification Statement regarding the adequacy of the outfall for the study sites',
        _rowIndex: 40,
        selected: true,
        description: 'Drainage Map, Adequacy comp. & Outfall Analysis'
      },
      {
        description: 'SWM facility design and BMP location map',
        selected: true,
        _rowIndex: 42,
        rate: 1000,
        detail: 'In accordance with County, the increased runoff volume due to the proposed development is required to be controlled on-site. A stormwater facility will be designed, or a waiver will be requested based on infiltration test reports. Infiltration testing and report fees are not included. The testing shall be done by certified soil consultants or Geotechnical engineers. If owner wants, they can hire directly Geotech engineer or soil consultants for infiltration testing and reports.'
      },
      {
        description: 'Topo Survey',
        detail: 'Ceed Civil Engineering\'s partner will perform the field run topography for the entire property, calculate MSL elevations, and prepare a plan showing existing site topography with 2-ft contour intervals @ 20-ft scale. The Survey will include a 50-foot overlap around the peripheral boundary of the property. All existing vegetation shall be depicted on the plan. Spot elevations and physical features, including edge of pavements, storm drainage pipes, and other relevant features within the limits of the survey will be identified for inclusion on the topography survey. Proposed profile holes and test holes will be located on the plan.',
        selected: true,
        _rowIndex: 36,
        rate: 2000
      },
      {
        rate: 2000,
        description: 'EVM Tree Conservation Plan (3rd Party Arborist)',
        detail: 'Ceed Civil Engineering\'s partner will provide the existing vegetation map and Tree Preservation Plan shall be prepared per County PFM chapter 12. Tree preservation target, Tree canopy covered computation shall be provided. A 10 yr tree canopy requirement will be computed,  and plantings will propose if required to meet canopy covered requirements. The Tree conservation plan (TCP) shall be signed and sealed by the certified arborist.',
        selected: true,
        _rowIndex: 39
      }],
    siteStreet: ': 6811 Old Alexandria Ferry Rd ',
    clientName: 'Jhonny  Marconi ',
    engineeringTaskedTo: [],
    remainingBalance: 3000,
    retainerDeposit: 5000,
    civilNeeded: true,
    fbClientId: 286335,
    sendClientEmail: true,
    projectType: '',
    enggFolderNeeded: false,
    clientAddress: '',
    mepTaskedTo: [],
    clientPhone: '(703) 499-2229, ',
    siteCity: 'Clinton ',
    deliveryDuration: '4-6 weeks',
    deliverableFromClient: 'access to lot, CAD files',
    civilFolderNeeded: true,
    isUpworkJob: false,
    siteState: 'Maryland',
    salesMan: '',
    civilTaskedTo: ['Tika Koirala'],
    gap: -2000,
    clientCompany: '',
    favClient: '',
    clientStreet: ': 6811 Old Alexandria Ferry Rd ',
    projectNumber: 782,
    fbInvoiceId: '0002170',
    totalCost: 10000,
    projectName: 'All files and CAD files, access to lot',
    draftingTaskedTo: [],
    mepFolderNeeded: false,
    clientZip: '',
    siteZip: '',
    date: '2025-10-01',
    clientEmail: 'marconimotors@hotmail.com',
    sameAsClient: true,
    clientState: 'Maryland',
    ratePerHour: 225,
    documentUrl: ''
  }

  _createFBProject_(project)
}
function testCreateProject(){
  let jsonProject = { remainingBalance: 2450,
  ratePerHour: 225,
  date: '2025-11-12',
  showDocumentLink: true,
  deliverableFromClient: 'Photos, sketch, layout, all material and sizing.',
  clientPhone: '561-436-8062',
  civilFolderNeeded: false,
  projectDesc: 'Standard 40\' container with standard detailing. This site requires a site plan with data from septic and house location with all setbacks and measurements from setbacks.',
  siteState: 'Florida',
  clientCity: 'Fernandina Beach',
  retainerRemaining: '',
  sameAsClient: false,
  clientName: 'Lisa Huffman',
  mepTaskedTo: [],
  retainerDeposit: 2500,
  sendClientEmail: true,
  clientEmail: 'Bsbhuffman@gmail.com',
  fbProjectId: '',
  clientAddress: '',
  draftingTaskedTo: [ 'Prateeksha' ],
  clientState: 'Florida',
  siteAddress: '',
  documentUrl: 'https://docs.google.com/open?id=1lkS8LquP_VL26AjbjxuNVxI4S6LW0x-jPMS2YsN3jWo',
  drafterFolderNeeded: true,
  siteStreet: '86187 Williams Ave ',
  draftingNeeded: true,
  projectType: 'Container home',
  gap: -350,
  clientCompany: '',
  clientZip: '32034',
  siteCity: 'Yulee ',
  enggFolderNeeded: true,
  fbInvoiceId: '0002218',
  civilTaskedTo: [],
  totalCost: 5300,
  scopes: 
   [ { selected: true,
       detail: 'Typical container layout/floor plan detail, interior section views, exterior wall detail (elevations view), window/door callouts.',
       rate: 1000,
       _rowIndex: 17,
       description: 'Container Architectural Drafting' },
     { description: 'Container Structural Drafting',
       selected: true,
       rate: 1550,
       detail: 'Structural details for container building plans. S-pages drafted as needed. Foundation, section view and details. Design criteria and connection details.',
       _rowIndex: 16 },
     { _rowIndex: 15,
       rate: 1100,
       description: 'Calculations Report',
       detail: 'Calculations report for project scope.',
       selected: true },
     { selected: true,
       _rowIndex: 18,
       detail: 'Basic MEP layout with Mini Split detail, outlet, lights, smoke detector, interior plumbing layout only',
       description: 'Container Basic MEP layout Only',
       rate: 500 },
     { description: 'Site/ Grading/ Conservation Plan',
       _rowIndex: 21,
       detail: 'Design plan showing proposed site improvements, provided well and septic overlay.',
       rate: 250,
       selected: true },
     { selected: true,
       _rowIndex: 9,
       detail: 'Scope of work, reviewed, stamped, and sealed by state licensed P.E. FL',
       description: 'Engineering Review, Stamp and Seal P.E.',
       rate: 0 },
     { _rowIndex: 28,
       rate: 550,
       description: 'Plan digital Submission',
       selected: true,
       detail: 'Plan submission digitally to the city.' },
     { _rowIndex: 29,
       description: 'NOTE',
       selected: true,
       rate: 350,
       detail: 'Resubmission of site plan for additional comments after first round.' },
     { selected: true,
       detail: 'Additional city comments may incur a fee, depending on the city\'s requests for plans. Price is based on their request.',
       description: 'NOTE',
       rate: 0,
       _rowIndex: 29 } ],
  siteZip: '32097',
  engineerNeeded: true,
  favClient: '',
  mepFolderNeeded: false,
  clientStreet: '95056 Kestrel Ct',
  isUpworkJob: false,
  deliveryDuration: '3-4 weeks',
  projectName: 'FL - Container W/ Site plan',
  engineeringTaskedTo: [ 'VSC - ENG' ],
  salesMan: 'Ryan - Partial',
  fbClientId: 288923,
  projectNumber: 804 }
  _createFBProject_(jsonProject)
}
function testCreateUser() {
  let user = {
    categoryName: '',
    slackEmail: 'engineering@ceedcivil.com',
    isNewCategory: false,
    email: 'engineering@ceedcivil.com',
    isNewMerchant: false,
    merchantName: '',
    userType: 'Engineer',
    role: 'ProjectOnly',
    name: 'Poojan',
    manager: 'VSC - ENG'
  }

  processForm(user)
}