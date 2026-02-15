import projects from '../db/projects.json'
import payments from '../db/payments.json'
import appData from '../db/appData.json'
import contractMetadata from '../db/contractMetadata.json'

const FAKE_USER = {
  id: 'fake_user',
  createdAt: '2024-10-03T13:55:51.772Z',
  modifiedAt: '2024-10-03T13:55:51.772Z',
  name: 'Parth',
  email: 'fake_user@ceedcivil.com',
  password: 'fake_user',
  role: 'Admin',
  status: 'Active',
  defaultDashboard: 'Kanban', //Kanban or Table
  _rowIndex: 3,
}

const DEFAULT_MOCK_API_DELAY = 1000
const DEFAULT_MOCK_API_BATCH_DELAY = 2000

export class MockAPI {
  static async executeMockFunction(functionName, { data, token }) {
    await this.simulateNetworkDelay()

    const handlers = {
      // Auth related functions
      login: () => this.handleMockLogin({ ...data, token }),
      autoLogin: () => this.handleMockAutoLogin(),
      logout: () => this.handleMockLogout(),

      // Data related functions
      getInitialData: () => this.handleMockGetInitialData(),
      updateSheet: () => this.handleMockUpdateSheet(data),
      deleteRow: () => this.handleMockDeleteRow(data),
      getContractMetadata: () => this.handleMockGetContractMetadata(data),
      getNewProjectNumber: () => this.handleMockGetNewProjectNumber(data),
      createProject: () => this.handleMockCreateProject(data),
      createContract: () => this.handleMockCreateContract(data),
      createFBClient: () => this.handleMockCreateFBClient(data),
      createFBProject: () => this.handleMockCreateFBProject(data),
      createFBInvoice: () => this.handleMockCreateFBInvoice(data),
      getLatestAppData: () => this.handleMockGetLatestAppData(),
      getAllUsers: () => this.handleMockGetAllUsers(),
      createUser: () => this.handleMockCreateUser(data),
      updateUser: () => this.handleMockUpdateUser(data),
      deleteUser: () => this.handleMockDeleteUser(data),
      generatePDF: () => this.handleMockGeneratePDF(data),
      resendInvitationWebsite: () => this.handleMockResendInvitationWebsite(data),
      executeMiscAPIRequest: () => this.handleMockExecuteMiscAPIRequest(data),
    }

    const handler = handlers[functionName]
    if (!handler) {
      throw new Error(
        `Unhandled function: ${functionName}${
          Object.keys(data).length ? ` with data: ${JSON.stringify(data)}` : ''
        }`,
      )
    }

    return handler()
  }

  static handleMockGetInitialData() {
    return {
      projects: projects,
      payments: payments,
      appData: appData,
    }
  }

  // Mock Handlers
  static handleMockLogin() {
    if (FAKE_USER.token !== localStorage.getItem('token')) {
      throw new Error('Invalid credentials')
    }
    return {
      user: FAKE_USER,
      token: 'FAKE_TOKEN',
    }
  }

  static handleMockAutoLogin() {
    return {
      user: FAKE_USER,
      token: 'FAKE_TOKEN',
    }
  }

  static handleMockLogout() {
    return { success: true }
  }

  static async handleMockGetLatestAppData() {
    await this.simulateNetworkDelay(DEFAULT_MOCK_API_BATCH_DELAY)
    return appData
  }

  static async handleMockGetAllUsers() {
    await this.simulateNetworkDelay(DEFAULT_MOCK_API_BATCH_DELAY)
    return ALL_USERS
  }

  static async handleMockCreateUser({ name, email, role, sendInvitation = false }) {
    await this.simulateNetworkDelay(DEFAULT_MOCK_API_BATCH_DELAY)
    return {
      id: '090a95ce-3933-4b57-a191-96dc067f9851' + Date.now(),
      createdAt: '2024-10-03T13:55:51.772Z',
      modifiedAt: '2024-10-03T13:55:51.772Z',
      name,
      email,
      role,
      status: 'Active',
    }
  }

  static async handleMockUpdateUser(updatedUserInfo) {
    const { id, createdAt, modifiedAt, name, email, role, status } = updatedUserInfo

    if (!email) {
      throw new Error('Email is required')
    }

    if (!name) {
      throw new Error('Name is required')
    }

    await this.simulateNetworkDelay(DEFAULT_MOCK_API_BATCH_DELAY)
    return updatedUserInfo
  }

  static handleMockGetContractMetadata() {
    return contractMetadata
  }

  static handleMockGetNewProjectNumber() {
    return newProjectNumber
  }

  static handleMockCreateProject(projectData) {
    return {
      id: '090a95ce-3933-4b57-a191-96dc067f9851' + Date.now(),
      createdAt: '2024-10-03T13:55:51.772Z',
      modifiedAt: '2024-10-03T13:55:51.772Z',
      name: projectData.name,
      email: projectData.email,
      role: projectData.role,
      status: 'Active',
    }
  }

  static handleMockCreateContract(contractData) {
    return {
      id: '090a95ce-3933-4b57-a191-96dc067f9851' + Date.now(),
      createdAt: '2024-10-03T13:55:51.772Z',
      modifiedAt: '2024-10-03T13:55:51.772Z',
      name: contractData.name,
      email: contractData.email,
      role: contractData.role,
      status: 'Active',
    }
  }

  static handleMockCreateFBClient(data) {
    return {
      id: '090a95ce-3933-4b57-a191-96dc067f9851' + Date.now(),
      createdAt: '2024-10-03T13:55:51.772Z',
      modifiedAt: '2024-10-03T13:55:51.772Z',
      name: data.name,
      email: data.email,
      role: data.role,
      status: 'Active',
    }
  }

  static handleMockCreateFBProject(data) {
    return {
      id: '090a95ce-3933-4b57-a191-96dc067f9851' + Date.now(),
      createdAt: '2024-10-03T13:55:51.772Z',
      modifiedAt: '2024-10-03T13:55:51.772Z',
      name: data.name,
      email: data.email,
      role: data.role,
      status: 'Active',
    }
  }

  static handleMockCreateFBInvoice(data) {
    return {
      id: '090a95ce-3933-4b57-a191-96dc067f9851' + Date.now(),
      createdAt: '2024-10-03T13:55:51.772Z',
      modifiedAt: '2024-10-03T13:55:51.772Z',
      name: data.name,
      email: data.email,
      role: data.role,
      status: 'Active',
    }
  }

  static simulateNetworkDelay(ms = DEFAULT_MOCK_API_DELAY) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  static getMetaData() {
    return CONFIG
  }
}
