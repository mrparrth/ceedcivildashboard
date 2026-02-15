<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useDataStore } from '@/stores/data'
import ChatBox from './ChatBox.vue'
import { BLANK_PROJECT } from '@/utils/constant'
import { getAssignedToBreakdown } from '@/utils/utils'
import { DEPARTMENT_CLASS } from '@/utils/constant'

const props = defineProps({
    modelValue: Boolean,
    project: { type: Object, default: null } // If null, creating new
})

const emit = defineEmits(['update:modelValue', 'save'])

const store = useDataStore()
const dialog = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const isNew = computed(() => !props.project)
const loading = ref(false)
const valid = ref(false)
const form = ref(null)
const archiveDialog = ref(false)

// Initial state for a blank project

const formData = ref({ ...BLANK_PROJECT })
const departments = ['Drafting', 'Engineering', 'MEP', 'Civil']
const departmentExpanded = ref([])

// Mock Data for specific dropdowns (would come from appData in real app)
const projectTypes = computed(() => store.appData?.projectType || [])
const salesmen = computed(() => store.appData?.salesmen || [])
const states = computed(() => store.appData?.states || [])
const priorities = computed(() => store.appData?.priority || [])
const statuses = computed(() => store.appData?.status || [])

// Watch for project prop changes to populate form (Edit Mode)
watch(() => props.project, (newVal) => {
    if (newVal) {
        formData.value = JSON.parse(JSON.stringify(newVal)) // Deep copy
        // Auto expand relevant sections
        departmentExpanded.value = []
        if (newVal.draftingNeeded) departmentExpanded.value.push('Drafting')
        if (newVal.engineeringNeeded) departmentExpanded.value.push('Engineering')
        if (newVal.mepNeeded) departmentExpanded.value.push('MEP')
        if (newVal.civilNeeded) departmentExpanded.value.push('Civil')
    } else {
        formData.value = { ...BLANK_PROJECT }
        departmentExpanded.value = []
    }
}, { immediate: true })

const saveProject = async () => {
    const { valid: isValid } = await form.value.validate()
    if (!isValid) {
        store.showNotification('Please fill the required fields.', 'error')
        return
    }
    loading.value = true
    try {
        if (isNew.value) {
            await store.createProject(formData.value)
        } else {
            await store.updateProject(formData.value)
        }
        dialog.value = false
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

// Helpers for department fields

const getDepartmentPrefix = (dept) => dept.toLowerCase()

const handleAssignedToChange = (newAssignedTo) => {
    formData.value.assignedTo = newAssignedTo

    // Sync to departments
    const { draftingTaskedTo, engineeringTaskedTo, mepTaskedTo, civilTaskedTo } = getAssignedToBreakdown(newAssignedTo, store.appData)

    formData.value.draftingTaskedTo = draftingTaskedTo
    formData.value.draftingNeeded = draftingTaskedTo.length > 0

    formData.value.engineeringTaskedTo = engineeringTaskedTo
    formData.value.engineeringNeeded = engineeringTaskedTo.length > 0

    formData.value.mepTaskedTo = mepTaskedTo
    formData.value.mepNeeded = mepTaskedTo.length > 0

    formData.value.civilTaskedTo = civilTaskedTo
    formData.value.civilNeeded = civilTaskedTo.length > 0

    // Auto-expand sections if needed
    if (draftingTaskedTo.length > 0 && !departmentExpanded.value.includes('Drafting')) departmentExpanded.value.push('Drafting')
    if (engineeringTaskedTo.length > 0 && !departmentExpanded.value.includes('Engineering')) departmentExpanded.value.push('Engineering')
    if (mepTaskedTo.length > 0 && !departmentExpanded.value.includes('MEP')) departmentExpanded.value.push('MEP')
    if (civilTaskedTo.length > 0 && !departmentExpanded.value.includes('Civil')) departmentExpanded.value.push('Civil')
}

// Watch for individual department changes to sync back to main assignedTo
// logic: if dept taskedTo changes, we need to update main assignedTo
// merging: (currentAssignedTo - oldDeptUsers) + newDeptUsers
// This is complex with Vue's reactivity. Instead of a deep watch, let's use a helper for the specific inputs.

const updateDeptTaskedTo = (dept, newUsers) => {
    const prefix = getDepartmentPrefix(dept)
    const field = prefix + 'TaskedTo'
    const oldUsers = formData.value[field] || []

    // Update the specific field
    formData.value[field] = newUsers
    formData.value[prefix + 'Needed'] = newUsers.length > 0

    // Sync back to main assignedTo
    const otherUsers = (formData.value.assignedTo || []).filter(u => !oldUsers.includes(u)) // Remove old dept users from main
    // Add new dept users, dedupe
    formData.value.assignedTo = [...new Set([...otherUsers, ...newUsers])]
}


const getDeptEmployees = (dept) => {
    switch (dept) {
        case 'Drafting': return store.appData?.drafters || []
        case 'Engineering': return store.appData?.engineers || []
        case 'MEP': return store.appData?.mep || []
        case 'Civil': return store.appData?.civil || []
        default: return []
    }
}

const getDeptColor = (dept) => {
    switch (dept) {
        case 'Drafting': return 'success'
        case 'Engineering': return 'warning'
        case 'MEP': return 'grey-darken-3' // Dark
        case 'Civil': return '#5378e4' // Custom Blue
        default: return 'surface'
    }
}

const handleChatSend = (chat) => {
    formData.value.chats = [...(formData.value.chats || []), chat]
}

const toggleArchive = async () => {
    archiveDialog.value = true
}

const confirmArchive = async () => {
    const action = formData.value.isArchived ? 'Unarchive' : 'Archive'
    archiveDialog.value = false
    loading.value = true
    try {
        await store.updateProject({
            id: formData.value.id,
            isArchived: !formData.value.isArchived
        })
        store.showNotification(`Project ${action}d successfully`, 'success')
        dialog.value = false
    } catch (e) {
        console.error(e)
        store.showNotification(`Failed to ${action.toLowerCase()} project`, 'error')
    } finally {
        loading.value = false
    }
}

const openUrl = (url) => {
    if (!url) return
    const fullUrl = url.match(/^https?:\/\//) ? url : `https://${url}`
    window.open(fullUrl, '_blank')
}
</script>

<template>
    <v-dialog v-model="dialog" max-width="1200px" scrollable>
        <v-card class="glass-card">
            <v-toolbar color="transparent" class="border-b pl-4 pr-2">
                <v-toolbar-title class="text-h6 font-weight-bold">
                    {{ isNew ? 'Create New Project' : 'Edit Project' }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false" color="error" variant="text">
                    <v-icon>mdi-close</v-icon>
                    <v-tooltip activator="parent" location="bottom">Close without saving</v-tooltip>
                </v-btn>
            </v-toolbar>

            <v-card-text class="pa-0" style="max-height: 85vh;">
                <v-container fluid class="pa-4">
                    <v-row>
                        <!-- Left Column: Main Project Info -->
                        <v-col cols="12" md="4" class="border-e">
                            <v-form ref="form" v-model="valid">
                                <h3 class="text-subtitle-2 text-medium-emphasis mb-3 text-uppercase">Project Details
                                </h3>

                                <v-text-field v-model="formData.projectName" label="Project Name" variant="outlined"
                                    class="glow-input mb-4" :rules="[v => !!v || 'Required']"
                                    hide-details></v-text-field>

                                <v-row dense class="mb-4">
                                    <v-col cols="6">
                                        <v-text-field v-model="formData.projectNumber" label="Project Number"
                                            variant="outlined" class="glow-input" placeholder="Auto-gen"
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field v-model="formData.invoiceNumber" label="Invoice #"
                                            variant="outlined" class="glow-input" hide-details="auto"></v-text-field>
                                    </v-col>
                                </v-row>

                                <v-row dense class="mb-4">
                                    <v-col cols="6">
                                        <v-select v-model="formData.projectType" :items="projectTypes"
                                            label="Project Type" variant="outlined" class="glow-input"
                                            hide-details="auto"></v-select>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-select v-model="formData.salesMan" :items="salesmen" label="Salesman"
                                            variant="outlined" class="glow-input" hide-details="auto"></v-select>
                                    </v-col>
                                </v-row>

                                <v-row dense class="mb-4">
                                    <v-col cols="6">
                                        <v-select v-model="formData.overallProjectStatus" :items="statuses"
                                            label="Overall Status" variant="outlined" class="glow-input"
                                            hide-details="auto"></v-select>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-select v-model="formData.priority" :items="priorities" label="Priority"
                                            variant="outlined" class="glow-input" hide-details="auto"></v-select>
                                    </v-col>
                                </v-row>

                                <v-select v-model="formData.state" :items="states" label="State" variant="outlined"
                                    class="glow-input mb-4" hide-details="auto"></v-select>

                                <v-textarea v-model="formData.description" label="Scope of Work" rows="3"
                                    variant="outlined" class="glow-input mb-4" hide-details
                                    :rules="[v => !!v || 'Required']"></v-textarea>

                                <v-text-field v-model="formData.projectFilesFolder" label="Project Files Folder (URL)"
                                    prepend-inner-icon="mdi-google-drive" variant="outlined" class="glow-input mb-4"
                                    hide-details="auto"
                                    :append-inner-icon="formData.projectFilesFolder ? 'mdi-open-in-new' : undefined"
                                    @click:append-inner="openUrl(formData.projectFilesFolder)"></v-text-field>
                                <v-text-field v-model="formData.contractLink" label="Contract Link (URL)"
                                    prepend-inner-icon="mdi-file-document-outline" variant="outlined"
                                    class="glow-input mb-4" hide-details="auto"
                                    :append-inner-icon="formData.contractLink ? 'mdi-open-in-new' : undefined"
                                    @click:append-inner="openUrl(formData.contractLink)"></v-text-field>

                                <v-textarea v-model="formData.projectNotes" label="Project Notes" rows="2"
                                    variant="outlined" class="glow-input mb-4" hide-details="auto"></v-textarea>
                                <v-textarea v-model="formData.clientProjectNameAddress"
                                    label="Client Project Name/Address" rows="2" variant="outlined"
                                    class="glow-input mb-4" hide-details="auto"></v-textarea>

                                <v-checkbox v-model="formData.depositPaid" label="Deposit Paid" color="primary"
                                    hide-details class="mb-4"></v-checkbox>
                            </v-form>
                        </v-col>

                        <!-- Middle Column: Departments -->
                        <v-col cols="12" md="4" class="border-e">
                            <h3 class="text-subtitle-2 text-medium-emphasis mb-2 text-uppercase">Ownership
                            </h3>
                            <v-card flat class="bg-transparent pa-4">
                                <v-select v-model="formData.assignedTo" :items="store.appData?.assignTo || []"
                                    label="Assigned To" multiple chips closable-chips variant="outlined"
                                    density="compact" class="glow-input mb-4"
                                    @update:model-value="handleAssignedToChange" hide-details="auto"></v-select>

                                <v-select v-model="formData.personWorking" :items="formData.assignedTo || []"
                                    label="Who Is Working On It" variant="outlined" density="compact"
                                    class="glow-input mb-4" hide-details="auto"></v-select>

                            </v-card>
                            <v-divider class="mx-2 my-2"></v-divider>
                            <h3 class="text-subtitle-2 text-medium-emphasis mb-3 text-uppercase">Departments & Tasks
                            </h3>
                            <v-expansion-panels v-model="departmentExpanded" multiple variant="popout"
                                class="glass-panels">
                                <v-expansion-panel v-for="dept in departments" :key="dept" :value="dept"
                                    class="mb-2 bg-transparent border-thin">
                                    <v-expansion-panel-title expand-icon="mdi-menu-down" :color="DEPARTMENT_CLASS[dept]"
                                        :class="{ 'text-white': dept !== 'Engineering' }">
                                        <div class="d-flex align-center gap-2">
                                            <v-checkbox-btn
                                                :model-value="formData[getDepartmentPrefix(dept) + 'Needed']"
                                                @update:model-value="v => formData[getDepartmentPrefix(dept) + 'Needed'] = v"
                                                :color="dept === 'Engineering' ? 'black' : 'white'"
                                                class="mr-2"></v-checkbox-btn>
                                            <span class="font-weight-bold">{{ dept }}</span>
                                        </div>
                                    </v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                        <v-row dense class="mt-2">
                                            <v-col cols="12" class="mb-2">
                                                <v-select
                                                    :model-value="formData[getDepartmentPrefix(dept) + 'TaskedTo']"
                                                    @update:model-value="val => updateDeptTaskedTo(dept, val)"
                                                    :items="getDeptEmployees(dept)" label="Tasked To" multiple chips
                                                    closable-chips variant="outlined" density="compact"
                                                    class="glow-input" hide-details="auto"></v-select>
                                            </v-col>
                                            <v-col cols="12" md="6" class="mb-2">
                                                <v-text-field v-model="formData[getDepartmentPrefix(dept) + 'Estimate']"
                                                    label="Est. Cost" prefix="$" type="number" variant="outlined"
                                                    density="compact" class="glow-input"
                                                    hide-details="auto"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6" class="mb-2">
                                                <v-select v-model="formData[getDepartmentPrefix(dept) + 'Status']"
                                                    :items="['Not Started', 'In Progress', 'Done']" label="Status"
                                                    variant="outlined" density="compact" class="glow-input"
                                                    hide-details="auto"></v-select>
                                            </v-col>
                                            <v-col cols="12" class="mb-2">
                                                <v-text-field
                                                    v-model="formData[getDepartmentPrefix(dept) + 'DropboxLink']"
                                                    label="Drive Link" prepend-inner-icon="mdi-google-drive"
                                                    variant="outlined" density="compact" class="glow-input"
                                                    hide-details="auto"
                                                    :append-inner-icon="formData[getDepartmentPrefix(dept) + 'DropboxLink'] ? 'mdi-open-in-new' : undefined"
                                                    @click:append-inner="openUrl(formData[getDepartmentPrefix(dept) + 'DropboxLink'])"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6" class="mb-2">
                                                <v-text-field
                                                    v-model="formData[getDepartmentPrefix(dept) + 'EstimatedStartTime']"
                                                    label="Est. Start Date" type="date" variant="outlined"
                                                    density="compact" class="glow-input" shrink-label
                                                    hide-details="auto"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-text-field
                                                    v-model="formData[getDepartmentPrefix(dept) + 'EstimatedDeliveryTime']"
                                                    label="Est. Delivery Date" type="date" variant="outlined"
                                                    density="compact" class="glow-input" shrink-label
                                                    hide-details="auto"></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-col>

                        <!-- Right Column: Client & Chat -->
                        <v-col cols="12" md="4" class="">
                            <h3 class="text-subtitle-2 text-medium-emphasis mb-2 text-uppercase">Client Info</h3>
                            <v-card flat class="bg-transparent pa-4">
                                <v-text-field v-model="formData.clientEmail" density="compact" label="Client Email"
                                    prepend-inner-icon="mdi-email" variant="outlined" rounded="sm"
                                    class="glow-input mb-2" hide-details="auto"></v-text-field>
                                <v-text-field v-model="formData.clientPhone" density="compact" label="Client Phone"
                                    prepend-inner-icon="mdi-phone" variant="outlined" rounded="sm" class="glow-input"
                                    hide-details="auto"></v-text-field>
                            </v-card>

                            <v-divider class="mx-2 my-2"></v-divider>

                            <h3 class="text-subtitle-2 text-medium-emphasis mb-3 text-uppercase">Active Chat</h3>
                            <ChatBox :chats="formData.chats || []" :current-user="{ name: 'Current User' }"
                                @sendMessage="handleChatSend" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>

            <v-card-actions class="pa-4 border-t bg-transparent">
                <v-btn v-if="!isNew" color="grey" variant="text"
                    :prepend-icon="formData.isArchived ? 'mdi-archive-arrow-up' : 'mdi-archive'" @click="toggleArchive">
                    {{ formData.isArchived ? 'Unarchive' : 'Archive' }}
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" class="glow-btn px-6" min-width="150" :loading="loading" @click="saveProject">
                    {{ isNew ? 'Create Project' : 'Save Changes' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="archiveDialog" max-width="400">
        <v-card class="glass-card">
            <v-card-title class="text-h6">
                {{ formData.isArchived ? 'Unarchive Project?' : 'Archive Project?' }}
            </v-card-title>
            <v-card-text>
                Are you sure you want to {{ formData.isArchived ? 'unarchive' : 'archive' }} this project?
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey" variant="text" @click="archiveDialog = false">Cancel</v-btn>
                <v-btn color="primary" class="glow-btn" @click="confirmArchive">Confirm</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.glass-panels .v-expansion-panel {
    background: rgba(255, 255, 255, 0.02) !important;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.border-thin {
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.border-e {
    border-right: 1px solid rgba(0, 0, 0, 0.08);
}

.gap-2 {
    gap: 8px;
}

.text-uppercase {
    letter-spacing: 1px;
}

/* Specific override for cancel button */
.glow-btn.text-error {
    color: #FF1744 !important;
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
}

.glow-btn.text-error:hover {
    background: rgba(255, 23, 68, 0.1) !important;
}
</style>
