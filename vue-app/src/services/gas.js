import { MockAPI } from './mock.js'
const isGoogleEnvironment = typeof google !== 'undefined' // Check if google.script.run is available

export class API {
  // Core execution method
  static async execute(functionName, data = {}) {
    try {
      const token = localStorage.getItem('app_token')
      const enrichedData = token ? { data, token } : { data }

      console.info(`API: executing ${functionName}`, enrichedData)

      const result = await (isGoogleEnvironment
        ? this.executeGoogleFunction(functionName, enrichedData)
        : MockAPI.executeMockFunction(functionName, enrichedData))

      console.info('result', result)
      return result
    } catch (error) {
      console.info('error', error)
      throw error
    }
  }

  static executeGoogleFunction(functionName, data) {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((result) => {
          resolve(result)
        })
        .withFailureHandler((error) => {
          reject(error)
        })
        [functionName](data)
    })
  }

  static async login(email, password) {
    const result = await this.execute('login', { email, password })
    if (result.token) {
      localStorage.setItem('app_token', result.token)
    }
    return result
  }

  static async getInitialData() {
    return await this.execute('getInitialData')
  }

  static async getContractMetadata() {
    return await this.execute('getContractMetadata')
  }

  static async getNewProjectNumber() {
    return await this.execute('getNewProjectNumber')
  }

  static async createProject(projectData) {
    return await this.execute('createProject', projectData)
  }

  static async createContract(contractData) {
    return await this.execute('createContract', contractData)
  }

  static async getFBClient(data) {
    return await this.execute('getFBClient', data)
  }

  static async createFBClient(data) {
    return await this.execute('createFBClient', data)
  }

  static async createFBProject(data) {
    return await this.execute('createFBProject', data)
  }

  static async createFBInvoice(data) {
    return await this.execute('createFBInvoice', data)
  }
}

async function validateLogin(inputData) {
  // await sleep(30000);
  try {
    let { user, token } = await runScriptFunction('login', inputData)

    return { user, token }
  } catch (error) {
    console.error(error) //will be changed to throw error later
    const FAKE_USER = {
      id: '090a95ce-3933-4b57-a191-96dc067f9851',
      createdAt: '2024-10-03T13:55:51.772Z',
      modifiedAt: '2024-10-03T13:55:51.772Z',
      name: 'Admin',
      email: 'admin@ceedcivil.com',
      password: 'password',
      role: 'Admin',
      status: 'Active',
      _rowIndex: 3,
    }

    if (inputData.token)
      return {
        user: FAKE_USER,
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA5MGE5NWNlLTM5MzMtNGI1Ny1hMTkxLTk2ZGMwNjdmOTg1MSIsImNyZWF0ZWRBdCI6IjIwMjQtMTAtMDNUMTM6NTU6NTEuNzcyWiIsIm1vZGlmaWVkQXQiOiIyMDI0LTEwLTAzVDEzOjU1OjUxLjc3MloiLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGNlZWRjaXZpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJzdGF0dXMiOiJBY3RpdmUiLCJfcm93SW5kZXgiOjN9.yyF0FGeVa4bOVauiHdJmwvN4gHi1YYwhi1y/ZQP3khg=',
      }

    if (inputData.email === FAKE_USER.email && inputData.password === FAKE_USER.password) {
      return {
        user: FAKE_USER,
        msg: null,
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA5MGE5NWNlLTM5MzMtNGI1Ny1hMTkxLTk2ZGMwNjdmOTg1MSIsImNyZWF0ZWRBdCI6IjIwMjQtMTAtMDNUMTM6NTU6NTEuNzcyWiIsIm1vZGlmaWVkQXQiOiIyMDI0LTEwLTAzVDEzOjU1OjUxLjc3MloiLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGNlZWRjaXZpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJzdGF0dXMiOiJBY3RpdmUiLCJfcm93SW5kZXgiOjN9.yyF0FGeVa4bOVauiHdJmwvN4gHi1YYwhi1y/ZQP3khg=',
      }
    } else {
      throw new Error('Wrong username or password')
    }
  }
}

function getappData() {
  console.log('Getting app data')
  if (ge) {
    const appDataElement = document.getElementById('app-data')
    if (appDataElement) {
      try {
        return JSON.parse(appDataElement.getAttribute('app-data'))
      } catch (error) {
        console.error('Error parsing app data:', error)
        return appDataInit
      }
    }
  } else {
    console.log(`appDataInit:` + JSON.stringify(appDataInit))
    return appDataInit
  }
}

function saveTokenInLocalStorage(token) {
  localStorage.setItem('ceedCivil_jwtToken', token)
}

function getTokenFromLocalStorage() {
  return localStorage.getItem('ceedCivil_jwtToken')
}

function trashToken() {
  localStorage.removeItem('ceedCivil_jwtToken')
}

export { saveTokenInLocalStorage, getTokenFromLocalStorage, validateLogin, trashToken, getappData }
