<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    modelValue: Boolean,
    allScopes: { type: Array, default: () => [] },
    initialProjectScopes: { type: Array, default: () => [] },
    retainer: { type: [Number, String], default: 0 },
    remainingBalance: { type: [Number, String], default: 0 }
})

const emit = defineEmits(['update:modelValue', 'save', 'update:scopes'])

const dialog = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const showAllScopes = ref(true)
const localAllScopes = ref([])
const projectScopes = ref([])
const editingIndex = ref(null)

// Initialize
watch(() => props.modelValue, (val) => {
    if (val) {
        // Deep copy to avoid mutating props directly until save
        localAllScopes.value = JSON.parse(JSON.stringify(props.allScopes))
        projectScopes.value = JSON.parse(JSON.stringify(props.initialProjectScopes))

        // Mark selected
        // In legacy, allScopes reset selection on 'Add'. 
        // Here we can just keep them separate.
    }
})

// Calculations
const totalCost = computed(() => {
    return projectScopes.value.reduce((acc, scope) => acc + (Number(scope.rate) || 0), 0)
})

const gap = computed(() => {
    const total = (Number(props.retainer) || 0) + (Number(props.remainingBalance) || 0)
    return total - totalCost.value
})

// Actions
const toggleView = () => {
    showAllScopes.value = !showAllScopes.value
    editingIndex.value = null
}

const addSelectedRows = () => {
    const selected = localAllScopes.value.filter(s => s.selected)
    // Add copies
    const newScopes = selected.map(s => ({ ...s, selected: false })) // reset selected on the copy
    projectScopes.value.push(...newScopes)

    // Reset selection in all scopes
    localAllScopes.value.forEach(s => s.selected = false)
}

const removeItem = (index) => {
    projectScopes.value.splice(index, 1)
}

const saveAndClose = () => {
    emit('update:scopes', projectScopes.value)
    dialog.value = false
}

// Editing
const startEdit = (index) => editingIndex.value = index
const saveEdit = () => editingIndex.value = null

</script>

<template>
    <v-dialog v-model="dialog" max-width="1200px" scrollable>
        <v-card class="glass-card rounded-xl">
            <v-toolbar color="transparent" class="border-b pl-4 pr-2">
                <v-toolbar-title class="text-h6 font-weight-bold">
                    Scope Selector
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false" class="glow-btn" variant="text">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <!-- Header Controls -->
            <div class="d-flex align-center pa-4 gap-4 bg-surface-light border-b">
                <v-btn size="small" :color="showAllScopes ? 'primary' : 'secondary'" @click="toggleView">
                    {{ showAllScopes ? 'Show Selected' : 'Show All' }}
                </v-btn>

                <v-btn v-if="showAllScopes" size="small" color="success" prepend-icon="mdi-plus"
                    @click="addSelectedRows">
                    Add Selected
                </v-btn>

                <v-spacer></v-spacer>

                <!-- Cost Summary -->
                <v-card variant="outlined" class="d-flex align-center py-1 px-3 bg-surface"
                    style="gap: 16px; min-width: 400px;">
                    <div class="d-flex flex-column text-caption text-right">
                        <div>Retainer: <strong>${{ retainer }}</strong></div>
                        <div>Balance: <strong>${{ remainingBalance }}</strong></div>
                    </div>
                    <v-divider vertical class="my-1"></v-divider>
                    <div class="d-flex flex-column text-body-2">
                        <div>Total Cost: <strong>${{ totalCost.toFixed(2) }}</strong></div>
                        <div :class="gap === 0 ? 'text-success' : 'text-error'">
                            Gap: <strong>${{ Math.abs(gap).toFixed(2) }}</strong>
                            {{ gap === 0 ? '😃' : '😐' }}
                        </div>
                    </div>
                </v-card>
            </div>

            <v-card-text class="pa-0">
                <v-table hover class="bg-transparent">
                    <thead>
                        <tr>
                            <th class="text-left" style="width: 30%">Description</th>
                            <th class="text-left" style="width: 15%">Rate</th>
                            <th class="text-left" style="width: 40%">Details</th>
                            <th class="text-center" style="width: 15%">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- All Scopes View -->
                        <template v-if="showAllScopes">
                            <tr v-for="(scope, index) in localAllScopes" :key="'all-' + index">
                                <td>{{ scope.description }}</td>
                                <td>${{ scope.rate }}</td>
                                <td class="text-caption text-medium-emphasis">{{ scope.detail }}</td>
                                <td class="text-center">
                                    <v-checkbox-btn v-model="scope.selected" color="primary"></v-checkbox-btn>
                                </td>
                            </tr>
                        </template>

                        <!-- Selected Project Scopes View -->
                        <template v-else>
                            <tr v-for="(scope, index) in projectScopes" :key="'proj-' + index">
                                <!-- Editable Description -->
                                <td>
                                    <v-text-field v-if="editingIndex === index" v-model="scope.description"
                                        density="compact" hide-details variant="outlined"></v-text-field>
                                    <span v-else>{{ scope.description }}</span>
                                </td>
                                <!-- Editable Rate -->
                                <td>
                                    <v-text-field v-if="editingIndex === index" v-model="scope.rate" type="number"
                                        density="compact" hide-details variant="outlined" prefix="$"></v-text-field>
                                    <span v-else>${{ scope.rate }}</span>
                                </td>
                                <!-- Editable Detail -->
                                <td>
                                    <v-textarea v-if="editingIndex === index" v-model="scope.detail" rows="1" auto-grow
                                        density="compact" hide-details variant="outlined"></v-textarea>
                                    <span v-else class="text-caption">{{ scope.detail }}</span>
                                </td>
                                <!-- Actions -->
                                <td class="text-center">
                                    <div v-if="editingIndex === index" class="d-flex justify-center gap-2">
                                        <v-btn size="x-small" color="success" icon="mdi-check"
                                            @click="saveEdit"></v-btn>
                                    </div>
                                    <div v-else class="d-flex justify-center gap-2">
                                        <v-btn size="x-small" color="warning" icon="mdi-pencil" variant="text"
                                            @click="startEdit(index)"></v-btn>
                                        <v-btn size="x-small" color="error" icon="mdi-delete" variant="text"
                                            @click="removeItem(index)"></v-btn>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="projectScopes.length === 0">
                                <td colspan="4" class="text-center text-medium-emphasis py-8">
                                    No scopes added yet. Switch to "Show All" to add scopes.
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </v-table>
            </v-card-text>

            <v-card-actions class="pa-4 border-t bg-transparent">
                <v-spacer></v-spacer>
                <v-btn color="primary" class="glow-btn px-6" @click="saveAndClose">
                    Save Changes
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.gap-4 {
    gap: 16px;
}

.gap-2 {
    gap: 8px;
}
</style>
