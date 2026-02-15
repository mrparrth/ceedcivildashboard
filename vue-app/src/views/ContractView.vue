<template>
    <v-container fluid class="fill-height align-start">
        <v-row justify="center">
            <v-col cols="12" md="10" lg="8">
                <v-card class="glass-card pa-4 mt-4">
                    <v-card-title class="text-h4 font-weight-bold text-center mb-4 text-gradient">
                        New Contract
                    </v-card-title>

                    <!-- Stepper Header -->
                    <div class="d-flex justify-space-between align-center mb-8 px-8 position-relative">
                        <!-- Progress Line -->
                        <div class="position-absolute bg-grey-lighten-2"
                            style="left: 50px; right: 50px; top: 24px; height: 2px; z-index: 0;"></div>
                        <div class="position-absolute bg-primary transition-all"
                            :style="{ left: '50px', top: '24px', height: '2px', 'z-index': 0, width: ((step - 1) / 2 * 100) + '%' }">
                        </div>

                        <div v-for="(s, index) in steps" :key="index"
                            class="d-flex flex-column align-center position-relative" style="z-index: 1;">
                            <v-avatar
                                :color="step > index + 1 ? 'success' : step === index + 1 ? 'primary' : 'grey-lighten-2'"
                                :variant="step === index + 1 ? 'flat' : 'flat'" size="48" class="mb-2 elevation-2"
                                :class="step === index + 1 ? 'glow-active' : ''">
                                <v-icon v-if="step > index + 1" color="white">mdi-check</v-icon>
                                <span v-else class="text-h6 font-weight-bold"
                                    :class="step === index + 1 ? 'text-white' : 'text-grey-darken-3'">
                                    {{ index + 1 }}
                                </span>
                            </v-avatar>
                            <span class="text-caption font-weight-bold"
                                :class="step === index + 1 ? 'text-primary' : 'text-medium-emphasis'">
                                {{ s }}
                            </span>
                        </div>
                    </div>

                    <!-- Step Content -->
                    <v-window v-model="step">
                        <!-- Step 1: Client Info -->
                        <v-window-item :value="1">
                            <v-container>
                                <!-- Favorite Client Selector -->
                                <v-row dense class="mb-4">
                                    <v-col cols="12">
                                        <v-select v-model="formData.favClient" :items="favClients.map(c => c.name)"
                                            label="Select Favorite Client (Auto-fill)" variant="outlined"
                                            density="comfortable" prepend-inner-icon="mdi-star" color="amber-darken-2"
                                            hide-details class="glow-input">
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12"><v-divider></v-divider></v-col>
                                </v-row>

                                <v-row dense>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="formData.clientName" label="Client Name"
                                            variant="outlined" class="glow-input" density="comfortable"
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="formData.clientCompany" label="Client Company"
                                            variant="outlined" class="glow-input" density="comfortable"
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="formData.clientEmail" label="Client Email"
                                            variant="outlined" class="glow-input" density="comfortable"
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="formData.clientPhone" label="Phone Number"
                                            variant="outlined" class="glow-input" density="comfortable"
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field type="date" v-model="formData.date" label="Date"
                                            variant="outlined" class="glow-input" density="comfortable"
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-select v-model="formData.salesMan" :items="salesmen" label="Sales Man"
                                            variant="outlined" class="glow-input" density="comfortable"
                                            hide-details="auto"></v-select>
                                    </v-col>

                                    <!-- Client Address -->
                                    <v-col cols="12">
                                        <div class="text-subtitle-2 text-medium-emphasis mt-4 mb-2">Client Address</div>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="formData.clientStreet" label="Street" variant="outlined"
                                            class="glow-input" density="comfortable" hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="formData.clientCity" label="City" variant="outlined"
                                            class="glow-input" density="comfortable" hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-select v-model="formData.clientState" :items="states" label="State"
                                            variant="outlined" class="glow-input" density="comfortable"
                                            hide-details="auto"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="formData.clientZip" label="Zip Code" variant="outlined"
                                            class="glow-input" density="comfortable" hide-details="auto"></v-text-field>
                                    </v-col>

                                    <!-- Site Address -->
                                    <v-col cols="12">
                                        <v-divider class="my-4"></v-divider>
                                        <v-checkbox v-model="formData.sameAsClient" label="Site Address Same as Client?"
                                            color="primary" class="font-weight-bold" hide-details></v-checkbox>
                                    </v-col>

                                    <v-col cols="12">
                                        <div class="text-subtitle-2 text-medium-emphasis mb-2">Site Address</div>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="formData.siteStreet" label="Site Street"
                                            variant="outlined" class="glow-input" density="comfortable"
                                            hide-details="auto" :disabled="formData.sameAsClient"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="formData.siteCity" label="Site City" variant="outlined"
                                            class="glow-input" density="comfortable" hide-details="auto"
                                            :disabled="formData.sameAsClient"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-select v-model="formData.siteState" :items="states" label="Site State"
                                            variant="outlined" class="glow-input" density="comfortable"
                                            hide-details="auto" :disabled="formData.sameAsClient"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="formData.siteZip" label="Site Zip Code"
                                            variant="outlined" class="glow-input" density="comfortable"
                                            hide-details="auto" :disabled="formData.sameAsClient"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-window-item>

                        <!-- Step 2: Project Details -->
                        <v-window-item :value="2">
                            <v-container>
                                <v-row dense>
                                    <v-col cols="12">
                                        <v-checkbox v-model="formData.isUpworkJob" label="Upwork Job?" color="primary"
                                            class="font-weight-bold" hide-details density="compact"></v-checkbox>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-select v-model="formData.projectType" :items="projectTypes"
                                            label="Project Type" variant="outlined" class="glow-input"
                                            density="comfortable" hide-details="auto"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="formData.projectName" label="Project Title"
                                            variant="outlined" class="glow-input" density="comfortable"
                                            hide-details="auto"></v-text-field>
                                    </v-col>

                                    <!-- Scope -->
                                    <v-col cols="12" class="d-flex align-center justify-space-between mt-2">
                                        <div class="text-subtitle-2 text-medium-emphasis">Scope of Work</div>
                                        <v-btn size="small" color="info" prepend-icon="mdi-format-list-checks"
                                            variant="tonal" @click="openScopeModal">
                                            Manage Scopes ({{ projectScopes.length }})
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea v-model="formData.scopeOfWork" label="Project Description" rows="4"
                                            variant="outlined" class="glow-input" density="comfortable"
                                            hide-details="auto"></v-textarea>
                                    </v-col>

                                    <!-- Selected Scopes Preview (Read-only) -->
                                    <v-col cols="12" v-if="projectScopes.length > 0">
                                        <v-card variant="outlined" class="pa-2 bg-surface-light">
                                            <div class="d-flex flex-wrap gap-2">
                                                <v-chip v-for="(scope, i) in projectScopes" :key="i" size="small"
                                                    class="mb-1 mr-1">
                                                    {{ scope.description }} (${{ scope.rate }})
                                                </v-chip>
                                            </div>
                                            <div class="text-caption text-right mt-1 font-weight-bold">
                                                Total Scope Cost: ${{ scopesTotalCost }}
                                            </div>
                                        </v-card>
                                    </v-col>

                                    <!-- Financials -->
                                    <v-col cols="12">
                                        <div class="text-subtitle-2 text-medium-emphasis mt-2 mb-2">Financials</div>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field v-model="formData.ratePerHour" label="Rate per Hour" prefix="$"
                                            type="number" variant="outlined" class="glow-input" density="comfortable"
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field v-model="formData.retainer" label="Retainer / Deposit" prefix="$"
                                            type="number" variant="outlined" class="glow-input" density="comfortable"
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field v-model="formData.remainingBalance" label="Remaining Balance"
                                            prefix="$" type="number" variant="outlined" class="glow-input"
                                            density="comfortable" hide-details="auto"></v-text-field>
                                    </v-col>

                                    <!-- Delivery -->
                                    <v-col cols="12">
                                        <div class="text-subtitle-2 text-medium-emphasis mt-2 mb-2">Delivery Details
                                        </div>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="formData.deliverableFromClient"
                                            label="Deliverable from Client" variant="outlined" class="glow-input"
                                            density="comfortable" hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="formData.deliveryDuration" label="Delivery Duration"
                                            variant="outlined" class="glow-input" density="comfortable"
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-window-item>

                        <!-- Step 3: Folder & Scopes -->
                        <v-window-item :value="3">
                            <v-container>
                                <v-row dense>
                                    <v-col cols="12">
                                        <div class="text-h6 mb-4">Folder Creation Options</div>
                                    </v-col>

                                    <!-- Architecture -->
                                    <v-col cols="12" md="6">
                                        <v-card variant="outlined" class="pa-4 glass-card">
                                            <v-checkbox v-model="formData.drafterFolderNeeded"
                                                label="Architecture (Drafter)" color="success" hide-details
                                                density="compact" class="font-weight-bold mb-2"></v-checkbox>
                                            <v-select v-model="formData.draftingTaskedTo" :items="drafters"
                                                label="Tasked To" multiple chips closable-chips variant="outlined"
                                                class="glow-input" :disabled="!formData.drafterFolderNeeded"
                                                density="comfortable" hide-details="auto"></v-select>
                                        </v-card>
                                    </v-col>

                                    <!-- Structural -->
                                    <v-col cols="12" md="6">
                                        <v-card variant="outlined" class="pa-4 glass-card">
                                            <v-checkbox v-model="formData.enggFolderNeeded"
                                                label="Structural (Engineer)" color="warning" hide-details
                                                density="compact" class="font-weight-bold mb-2"></v-checkbox>
                                            <v-select v-model="formData.engineeringTaskedTo" :items="engineers"
                                                label="Tasked To" multiple chips closable-chips variant="outlined"
                                                class="glow-input" :disabled="!formData.enggFolderNeeded"
                                                density="comfortable" hide-details="auto"></v-select>
                                        </v-card>
                                    </v-col>

                                    <!-- MEP -->
                                    <v-col cols="12" md="6" class="mt-4">
                                        <v-card variant="outlined" class="pa-4 glass-card">
                                            <v-checkbox v-model="formData.mepFolderNeeded" label="MEP"
                                                color="grey-darken-1" hide-details density="compact"
                                                class="font-weight-bold mb-2"></v-checkbox>
                                            <v-select v-model="formData.mepTaskedTo" :items="mepStaff" label="Tasked To"
                                                multiple chips closable-chips variant="outlined" class="glow-input"
                                                :disabled="!formData.mepFolderNeeded" density="comfortable"
                                                hide-details="auto"></v-select>
                                        </v-card>
                                    </v-col>

                                    <!-- Civil -->
                                    <v-col cols="12" md="6" class="mt-4">
                                        <v-card variant="outlined" class="pa-4 glass-card">
                                            <v-checkbox v-model="formData.civilFolderNeeded" label="Civil" color="info"
                                                hide-details density="compact"
                                                class="font-weight-bold mb-2"></v-checkbox>
                                            <v-select v-model="formData.civilTaskedTo" :items="civilStaff"
                                                label="Tasked To" multiple chips closable-chips variant="outlined"
                                                class="glow-input" :disabled="!formData.civilFolderNeeded"
                                                density="comfortable" hide-details="auto"></v-select>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-window-item>

                        <!-- Step 4: Review -->
                        <v-window-item :value="4">
                            <v-container>
                                <v-alert icon="mdi-information" type="info" variant="tonal" class="mb-4">
                                    Confirm details before creating the contract and invoice.
                                </v-alert>

                                <v-card variant="outlined" class="pa-4 bg-surface mb-4">
                                    <h3 class="text-h6 mb-2">
                                        {{ formData.clientName || 'Client Name' }}
                                        <span class="text-medium-emphasis">({{ formData.clientCompany || 'Company Name'
                                        }})</span>
                                    </h3>
                                    <p class="text-body-2 mb-4">{{ formData.projectName || 'Project Title' }}</p>

                                    <v-divider class="mb-2"></v-divider>

                                    <div class="d-flex justify-space-between align-center py-2 border-b-dashed">
                                        <span>Total Value</span>
                                        <span class="font-weight-bold">${{ totalAmount }}</span>
                                    </div>
                                    <div class="d-flex justify-space-between align-center py-2">
                                        <span>Deposit Required</span>
                                        <span class="font-weight-bold text-primary">${{ formData.retainer }}</span>
                                    </div>
                                </v-card>

                                <v-switch v-model="formData.includeFreshbooks" label="Create FreshBooks Invoice"
                                    color="primary" hide-details class="mb-2"></v-switch>

                                <!-- FreshBooks Workflow Section -->
                                <v-expand-transition>
                                    <div v-if="formData.includeFreshbooks">
                                        <v-card variant="outlined" class="pa-4 mb-4 border-dashed border-primary">
                                            <div class="text-subtitle-1 font-weight-bold text-primary mb-2">
                                                <v-icon start>mdi-cloud-sync</v-icon> FreshBooks Integration
                                            </div>

                                            <div v-if="!formData.fbInvoiceId"
                                                class="text-body-2 text-medium-emphasis mb-4">
                                                Generate FreshBooks Client, Project, and Invoice before finalizing the
                                                contract.
                                            </div>

                                            <v-btn v-if="!formData.fbInvoiceId" color="primary" variant="tonal" block
                                                class="glow-btn mb-2" :loading="isCreatingFreshbooks"
                                                @click="generateFreshbooksData">
                                                Create FreshBooks Entities
                                            </v-btn>

                                            <!-- Generated Details -->
                                            <div v-if="formData.fbInvoiceId">
                                                <v-alert type="success" variant="tonal" density="compact" class="mb-2">
                                                    FreshBooks Data Generated!
                                                </v-alert>
                                                <v-list density="compact" class="bg-transparent">
                                                    <v-list-item title="Project Number"
                                                        :subtitle="formData.projectNumber"
                                                        prepend-icon="mdi-pound"></v-list-item>
                                                    <v-list-item title="Invoice ID" :subtitle="formData.fbInvoiceId"
                                                        prepend-icon="mdi-file-document"></v-list-item>
                                                    <v-list-item title="FB Project ID" :subtitle="formData.fbProjectId"
                                                        prepend-icon="mdi-briefcase"></v-list-item>
                                                </v-list>
                                            </div>
                                        </v-card>
                                    </div>
                                </v-expand-transition>

                                <v-switch v-model="formData.sendEmail" label="Email Contract to Client"
                                    color="primary"></v-switch>
                            </v-container>
                        </v-window-item>
                    </v-window>

                    <!-- Footer Actions -->
                    <v-card-actions class="pa-4 pt-0">
                        <v-btn v-if="step > 1" variant="outlined" @click="prevStep">Back</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn v-if="step < 4" color="primary" class="glow-btn px-6" @click="nextStep">Next Step</v-btn>
                        <v-btn v-else color="success" class="glow-btn px-6" @click="createContract" :loading="loading"
                            prepend-icon="mdi-check-circle">Create Contract</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <ScopeSelectorModal v-model="showScopeModal" :allScopes="allScopes" :initialProjectScopes="projectScopes"
            :retainer="formData.retainer" :remainingBalance="formData.remainingBalance" @update:scopes="updateScopes" />
    </v-container>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useDataStore } from '@/stores/data'
import ScopeSelectorModal from '@/components/ScopeSelectorModal.vue'
import { API } from '@/services/gas'
import { DEV_PREFILL_FORM, INITIAL_FORM } from '@/utils/constant'
// Steps configuration
const step = ref(1)
const steps = ['Client Info', 'Project Details', 'Folder Options', 'Review & Create']

const showScopeModal = ref(false)
const projectScopes = ref([])

// Mock Scopes Data
// Previous static mock removed. allScopes is now populated from backend.

const openScopeModal = () => {
    showScopeModal.value = true
}

const updateScopes = (newScopes) => {
    projectScopes.value = newScopes
}

const isCreatingFreshbooks = ref(false)

const generateFreshbooksData = async () => {
    isCreatingFreshbooks.value = true
    try {
        // 1. Get Project Number
        const pNum = await store.getNewProjectNumber()
        formData.projectNumber = pNum

        // 2. Create/Get Client
        // Check if we need to create or find? Assume createFBClient handles both or deduplicates
        const fbClient = await store.createFBClient(formData)
        const fbClientId = fbClient?.id || 'FB-CLIENT-ID-MOCK'

        // 3. Create Project
        const fbProject = await store.createFBProject({ ...formData, fbClientId })
        formData.fbProjectId = fbProject?.id || 'FB-PROJ-ID-MOCK'

        // 4. Create Invoice
        const fbInvoice = await store.createFBInvoice({ ...formData, fbClientId, fbProjectId: formData.fbProjectId })
        formData.fbInvoiceId = fbInvoice?.id || 'FB-INV-ID-MOCK'

    } catch (e) {
        console.error('FreshBooks Error:', e)
        store.showNotification('Failed to generate FreshBooks entities: ' + e.message, 'error')
    } finally {
        isCreatingFreshbooks.value = false
    }
}

const scopesTotalCost = computed(() => {
    return projectScopes.value.reduce((acc, s) => acc + (Number(s.rate) || 0), 0)
})

// Backend Data Refs
const store = useDataStore()

const states = computed(() => store.appData?.states || [])
const salesmen = computed(() => store.appData?.salesmen || [])
const projectTypes = computed(() => store.appData?.projectType || [])
const drafters = computed(() => store.appData?.drafters || [])
const engineers = computed(() => store.appData?.engineers || [])
const mepStaff = computed(() => store.appData?.mep || [])
const civilStaff = computed(() => store.appData?.civil || [])

const favClients = computed(() => store.contractMetadata?.favClients || [])
const allScopes = computed(() => store.contractMetadata?.scopes || [])

// Logic for Favorite Client moved below formData definition to avoid ReferenceError

const formData = reactive(INITIAL_FORM)

// Compute Total Amount for Review
const totalAmount = computed(() => {
    return (Number(formData.retainer) || 0) + (Number(formData.remainingBalance) || 0)
})

// Logic for Favorite Client: Defined AFTER formData is initialized
watch(() => formData.favClient, (newVal) => {
    if (!newVal) return
    const client = favClients.find(c => c.name === newVal)
    if (client) {
        formData.clientName = client.name
        formData.clientCompany = client.company
        formData.clientEmail = client.email
        formData.clientPhone = client.phone
        formData.clientStreet = client.street
        formData.clientCity = client.city
        formData.clientState = client.state
        formData.clientZip = client.zip
    }
})

// Auto-populate site address
watch(() => formData.sameAsClient, (val) => {
    if (val) {
        formData.siteStreet = formData.clientStreet
        formData.siteCity = formData.clientCity
        formData.siteState = formData.clientState
        formData.siteZip = formData.clientZip
    } else {
        formData.siteStreet = ''
        formData.siteCity = ''
        formData.siteState = ''
        formData.siteZip = ''
    }
})

const loading = ref(false)

const nextStep = () => {
    if (step.value < 4) step.value++
}
const prevStep = () => {
    if (step.value > 1) step.value--
}

const createContract = async () => {
    loading.value = true
    try {
        if (formData.includeFreshbooks && !formData.fbInvoiceId) {
            // Replace confirm with a soft warning that doesn't block but notifies? 
            // Or better, failing with a message.
            store.showNotification('Please generate FreshBooks Invoice first!', 'warning')
            loading.value = false
            return
        }

        // This creates the final Google Doc Contract
        await store.createContract(formData)
        store.showNotification('Contract Created Successfully!', 'success')
        // Reset form or redirect?
    } catch (e) {
        console.error(e)
        store.showNotification('Error creating contract: ' + e.message, 'error')
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await store.getContractMetadata()
})
</script>

<style scoped>
.glow-active {
    box-shadow: 0 0 15px rgba(0, 229, 255, 0.4) !important;
}

.transition-all {
    transition: all 0.3s ease;
}
</style>
