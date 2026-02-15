import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API } from '@/services/gas'
import { debounce } from 'lodash'

export const useDataStore = defineStore('data', () => {
  // --- State ---
  const projects = ref([])
  const payments = ref([])
  const contractMetadata = ref({})
  const appData = ref({})

  const isLoading = ref(false)
  const error = ref(null)
  const queue = ref([])
  const isProcessingQueue = ref(false)

  // Debouncer cache
  const _debouncers = {}

  // --- Queue Management ---

  function addToQueue(functionName, data, options = {}) {
    const item = {
      functionName,
      data,
      id: Date.now() + Math.random(),
      retryCount: 0,
      ...options,
    }

    if (options.immediate) {
      queue.value.unshift(item)
      processQueue()
    } else {
      queue.value.push(item)
      processQueue()
    }
  }

  function debouncedAddToQueue(functionName, data, options = {}) {
    _getDebounced(functionName)(functionName, data, options)
  }

  function _getDebounced(key) {
    if (!_debouncers[key]) {
      _debouncers[key] = debounce((fn, d, opt) => {
        addToQueue(fn, d, opt)
      }, 2000)
    }
    return _debouncers[key]
  }

  async function processQueue() {
    if (isProcessingQueue.value || queue.value.length === 0) return

    isProcessingQueue.value = true

    try {
      while (queue.value.length > 0) {
        const item = queue.value[0]
        console.log(`[Queue] Processing ${item.functionName}`, item)

        try {
          const result = await API[item.functionName](item.data)
          if (item.onSuccess) item.onSuccess(result)
          queue.value.shift()
        } catch (err) {
          console.error(`[Queue] Error on ${item.functionName}`, err)
          if (err.type === 'credentials') {
            error.value = 'Session expired. Please login.'
            queue.value = []
            break
          }

          if (item.retryCount < 3) {
            item.retryCount++
            queue.value.shift()
            queue.value.push(item)
            if (item.onError) item.onError(err)
          } else {
            queue.value.shift()
            if (item.onError) item.onError(err)
          }
        }
      }
    } finally {
      isProcessingQueue.value = false
    }
  }

  // --- Core API Actions ---

  async function getInitialData() {
    isLoading.value = true
    try {
      const { projects: p, payments: pay, appData: ad } = await API.getInitialData()
      projects.value = p || []
      payments.value = pay || []
      appData.value = ad
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function getContractMetadata() {
    if (contractMetadata.value) return contractMetadata.value // Return cached if available
    try {
      const data = await API.getContractMetadata()
      contractMetadata.value = data
      return data
    } catch (err) {
      console.error('Failed to fetch contract metadata', err)
      throw err
    }
  }

  async function getNewProjectNumber() {
    return await API.getNewProjectNumber()
  }

  // --- Project Actions ---

  async function createProject(projectData) {
    isLoading.value = true
    try {
      // Optimistic or wait-for-server?
      // For creation, usually wait for ID from server is safer,
      // but if we want offline support we'd generate a temp ID.
      // Let's call the API directly for creation to get the real object back immediately.
      const newProject = await API.createProject(projectData)
      projects.value.unshift(newProject)
      return newProject
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function updateProject(updatedProject) {
    const index = projects.value.findIndex((p) => p.id === updatedProject.id)
    if (index !== -1) {
      projects.value[index] = { ...projects.value[index], ...updatedProject }
      debouncedAddToQueue('updateProject', updatedProject)
    }
  }

  async function createContract(contractData) {
    try {
      return await API.createContract(contractData)
    } catch (err) {
      console.error('Failed to create contract', err)
      throw err
    }
  }

  // --- FreshBooks Actions ---

  async function findFBClient(data) {
    return await API.getFBClient(data)
  }

  async function createFBClient(data) {
    return await API.createFBClient(data)
  }

  async function createFBProject(data) {
    return await API.createFBProject(data)
  }

  async function createFBInvoice(data) {
    return await API.createFBInvoice(data)
  }

  // --- Payment/Expense Actions ---

  function createPayment(paymentData) {
    const newPayment = { ...paymentData, id: Date.now().toString(), _temp: true }
    payments.value.unshift(newPayment)

    addToQueue('createPayment', paymentData, {
      onSuccess: (serverPayment) => {
        const index = payments.value.findIndex((p) => p.id === newPayment.id)
        if (index !== -1) payments.value[index] = serverPayment
      },
    })
  }

  function updatePayment(paymentData) {
    const index = payments.value.findIndex((p) => p.id === paymentData.id)
    if (index !== -1) {
      payments.value[index] = { ...payments.value[index], ...paymentData }
      addToQueue('updatePayment', paymentData)
    }
  }

  // --- Notifications ---

  const notification = ref({
    show: false,
    message: '',
    color: 'success',
    timeout: 3000,
  })

  function showNotification(message, color = 'success', timeout = 3000) {
    notification.value = {
      show: true,
      message,
      color,
      timeout,
    }
  }

  // --- Auth State ---
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  // --- Auth Actions ---
  async function login(email, password) {
    isLoading.value = true
    try {
      const result = await API.login(email, password)
      if (result.user) {
        user.value = result.user
        localStorage.setItem('app_user', JSON.stringify(result.user))
        localStorage.setItem('app_token', result.token)
        return true
      }
      return false
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function autoLogin() {
    const token = localStorage.getItem('app_token')
    if (!token) return false

    isLoading.value = true
    try {
      // Pass token to backend for verification if API supported it,
      // or just assume mock success for now as per handling.
      // However, mock implementation of autoLogin returns user.
      const result = await API.execute('autoLogin', { token })
      if (result.user) {
        user.value = result.user
        // Refresh token?
        return true
      }
      return false
    } catch (e) {
      console.error('Auto login failed', e)
      logout() // Clear stale token
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('app_user')
    if (localStorage.getItem('app_token')) localStorage.removeItem('app_token')
  }

  // --- Expose ---
  return {
    // State
    projects,
    payments,
    contractMetadata,
    appData,
    isLoading,
    error,
    notification,
    user, // Exposed
    isAuthenticated, // Exposed

    // Core Actions
    getInitialData,
    getContractMetadata,
    getNewProjectNumber,
    showNotification,
    login, // Exposed
    autoLogin, // Exposed
    logout, // Exposed

    // Project Actions
    createProject,
    updateProject,
    createContract,

    // FreshBooks Actions
    findFBClient,
    createFBClient,
    createFBProject,
    createFBInvoice,

    // Payment Actions
    createPayment,
    updatePayment,

    // Internal (exposed for debug if needed)
    queue,
  }
})
