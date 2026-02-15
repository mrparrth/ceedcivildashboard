<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useDataStore } from '@/stores/data'

const props = defineProps({
    modelValue: Boolean,
    payment: { type: Object, default: null } // If null, creating new
})

const emit = defineEmits(['update:modelValue', 'save'])

const store = useDataStore()
const dialog = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const isEditing = computed(() => !!props.payment)
const loading = ref(false)
const valid = ref(false)

// Blank payment state
const blankPayment = {
    assignee: '',
    projectNumber: '',
    projectName: '',
    estimatedBudget: 0,
    actualCost: '',
    readyToBePaid: false,
    paid: false,
    datePaid: '',
    revisionNeeded: false,
    datePaid2: '',
    revisionCost: '',
    revisionsPaid: false,
    notes: '',
    billingItems: []
}

const formData = ref({ ...blankPayment })
const suggestion = ref('')

// Mock Data
const assignees = ['Ryan', 'Staff 1', 'Staff 2']

// Watch props
watch(() => props.payment, (newVal) => {
    formData.value = newVal ? JSON.parse(JSON.stringify(newVal)) : { ...blankPayment }
}, { immediate: true })

// Auto-populate logic (simplified for Vue)
watch(() => formData.value.projectNumber, (val) => {
    if (val && val.length >= 3) {
        const match = store.projects.find(p => p.projectNumber == val)
        if (match) {
            formData.value.projectName = match.projectName
            formData.value.estimatedBudget = match.estimatedBudget // Simplified estimate logic
        }
    }
})

const savePayment = async () => {
    if (!valid.value) return
    loading.value = true
    try {
        if (isEditing.value) {
            await store.updatePayment(formData.value)
        } else {
            await store.createPayment(formData.value)
        }
        dialog.value = false
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <v-dialog v-model="dialog" max-width="800px">
        <v-card class="glass-card rounded-xl">
            <v-toolbar color="transparent" class="border-b pl-4 pr-2">
                <v-toolbar-title class="text-h6 font-weight-bold">
                    {{ isEditing ? 'Update Payment' : 'Create New Payment' }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false" class="glow-btn" variant="text">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text class="pa-4">
                <v-form v-model="valid">
                    <v-row>
                        <v-col cols="12">
                            <v-select v-model="formData.assignee" :items="assignees" label="Assignee *"
                                variant="outlined" class="glow-input" :rules="[v => !!v || 'Required']"
                                density="comfortable" hide-details="auto"></v-select>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field v-model="formData.projectNumber" label="Project # *" variant="outlined"
                                class="glow-input" :rules="[v => !!v || 'Required']" density="comfortable"
                                hide-details="auto"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field v-model="formData.projectName" label="Project Name *" variant="outlined"
                                class="glow-input" :rules="[v => !!v || 'Required']" density="comfortable"
                                hide-details="auto"></v-text-field>
                        </v-col>

                        <!-- Budget & Ready Status -->
                        <v-col cols="12" md="6" class="mt-4">
                            <v-text-field v-model="formData.estimatedBudget" label="Estimated Budget" prefix="$"
                                variant="outlined" class="glow-input" readonly density="comfortable"
                                hide-details="auto"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="mt-4 d-flex align-center">
                            <v-checkbox v-model="formData.readyToBePaid" label="Ready to be Paid?" color="primary"
                                hide-details density="compact" class="font-weight-bold"></v-checkbox>
                        </v-col>

                        <!-- Base Payment Group -->
                        <v-col cols="12">
                            <v-divider class="my-4"></v-divider>
                            <div class="text-subtitle-2 text-medium-emphasis mb-3">Initial Payment</div>
                            <v-row>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="formData.actualCost" label="Actual Cost" prefix="$"
                                        variant="outlined" class="glow-input" :disabled="formData.revisionNeeded"
                                        density="comfortable" hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3" class="d-flex align-center">
                                    <v-checkbox v-model="formData.paid" label="Paid?" color="success" hide-details
                                        :disabled="formData.revisionNeeded" density="compact"></v-checkbox>
                                </v-col>
                                <v-col cols="12" md="5">
                                    <v-text-field type="date" v-model="formData.datePaid" label="Date Paid"
                                        variant="outlined" class="glow-input" :disabled="formData.revisionNeeded"
                                        density="comfortable" hide-details="auto"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-col>

                        <!-- Revision Group -->
                        <v-col cols="12">
                            <v-divider class="my-4"></v-divider>
                            <v-checkbox v-model="formData.revisionNeeded" label="Revision Needed?" color="warning"
                                hide-details class="font-weight-bold mb-3" density="compact"></v-checkbox>

                            <v-expand-transition>
                                <v-row v-if="formData.revisionNeeded">
                                    <v-col cols="12" md="4">
                                        <v-text-field v-model="formData.revisionCost" label="Revision Cost" prefix="$"
                                            variant="outlined" class="glow-input" :placeholder="'Enter cost'"
                                            density="comfortable" hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="3" class="d-flex align-center">
                                        <v-checkbox v-model="formData.revisionsPaid" label="Revisions Paid?"
                                            color="success" hide-details density="compact"></v-checkbox>
                                    </v-col>
                                    <v-col cols="12" md="5">
                                        <v-text-field type="date" v-model="formData.datePaid2"
                                            label="Revision Date Paid" variant="outlined" class="glow-input"
                                            density="comfortable" hide-details="auto"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-expand-transition>
                        </v-col>

                        <v-col cols="12" class="mt-6">
                            <v-textarea v-model="formData.notes" label="Notes/Remarks" rows="2" variant="outlined"
                                class="glow-input" density="comfortable" hide-details="auto"></v-textarea>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions class="pa-4 border-t bg-transparent">
                <v-btn color="error" class="glow-btn" variant="text" @click="dialog = false">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" class="glow-btn px-6" :loading="loading" @click="savePayment">
                    {{ isEditing ? 'Update Payment' : 'Create Payment' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.gap-4 {
    gap: 16px;
}
</style>
