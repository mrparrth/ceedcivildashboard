<script setup>
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'
import { useDataStore } from '@/stores/data'

const props = defineProps({
    projects: {
        type: Array,
        required: true
    }
})

const store = useDataStore()
const showBlankGroups = ref(false)

// Status columns based on legacy colors/logic
const statuses = [
    { name: 'Pending Start', color: '#44AA80' },
    { name: 'In Work', color: '#44AA80' },
    { name: 'For Ryan Review', color: '#42A5F5' },
    { name: 'Sent to Client', color: '#66BB6A' },
    { name: 'Pending S&S', color: '#FFA726' },
    { name: 'Rework/Updates', color: '#FFA726' },
    { name: 'Submitted for Premit', color: '#42A5F5' },
    { name: 'Completed', color: '#66BB6A' },
    { name: 'On Hold', color: '#BDBDBD' },
    { name: 'Cancelled', color: '#BDBDBD' }
]

// Group projects by status
const columns = computed(() => {
    const cols = statuses.map(s => ({ ...s, items: [] }))

    // Also handle "No Status" or unmapped statuses
    const unmapped = { name: 'No Status', color: '#BDBDBD', items: [] }

    props.projects.forEach(p => {
        const statusName = p.overallProjectStatus || 'No Status'
        const col = cols.find(c => c.name === statusName)
        if (col) {
            col.items.push(p)
        } else {
            unmapped.items.push(p)
        }
    })

    // Only add unmapped if it has items from the start?? React logic adds it if items exist.
    if (unmapped.items.length > 0) cols.push(unmapped)

    // Filter based on showBlankGroups
    if (!showBlankGroups.value) {
        return cols.filter(c => c.items.length > 0)
    }

    return cols
})

const handleDragChange = (event, status) => {
    if (event.added) {
        const projectId = event.added.element.id
        console.log(`Moving project ${projectId} to ${status}`)
        store.updateProject({ id: projectId, overallProjectStatus: status })
    }
}

const getInitials = (name) => {
    if (!name) return ""
    return name
        .replace(/-/g, " ")
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
}

const formatDate = (date) => {
    if (!date) return "n/a"
    return new Date(date).toLocaleDateString()
}

const hasEstimatedDates = (p) => !!p.engineeringEstimatedDeliveryTime || !!p.draftingEstimatedDeliveryTime || !!p.mepEstimatedDeliveryTime || !!p.civilEstimatedDeliveryTime
const hasEstimatedStartDates = (p) => !!p.engineeringEstimatedStartTime || !!p.draftingEstimatedStartTime || !!p.mepEstimatedStartTime || !!p.civilEstimatedStartTime

</script>

<template>
    <div class="d-flex flex-column h-100">
        <!-- Show/Hide Blank Toggle -->
        <div class="d-flex justify-end mb-2 pr-4">
            <v-btn variant="text" size="small" class="text-caption text-medium-emphasis"
                :prepend-icon="showBlankGroups ? 'mdi-eye-off' : 'mdi-eye'" @click="showBlankGroups = !showBlankGroups">
                {{ showBlankGroups ? 'Hide' : 'Show' }} blank groups
            </v-btn>
        </div>

        <div class="kanban-container d-flex gap-4 overflow-x-auto pb-4 px-4">
            <div v-for="col in columns" :key="col.name" class="kanban-column d-flex flex-column">
                <!-- Header -->
                <div class="kanban-header pa-3 mb-3 rounded-lg border-t-lg glass-card"
                    :style="{ borderTopColor: col.color + '!important', borderTopWidth: '4px!important' }">
                    <h3 class="text-subtitle-1 font-weight-bold">{{ col.name }}</h3>
                    <span class="text-caption text-medium-emphasis">{{ col.items.length }} Projects</span>
                </div>

                <!-- Draggable Area -->
                <draggable v-model="col.items" group="projects" item-key="id"
                    class="kanban-list flex-grow-1 d-flex flex-column gap-2"
                    @change="(e) => handleDragChange(e, col.name)" ghost-class="ghost-card">
                    <template #item="{ element }">
                        <v-card class="glass-card mb-2 cursor-grab" hover link @click="$emit('card-click', element)"
                            elevation="2">
                            <v-card-text class="pa-3">
                                <!-- Title Row -->
                                <div class="d-flex justify-space-between align-center mb-1">
                                    <div class="d-flex align-center gap-1 overflow-hidden">
                                        <v-icon v-if="element.isArchived" size="small" color="grey"
                                            class="mr-1">mdi-archive</v-icon>
                                        <h4 class="text-body-2 font-weight-bold text-truncate"
                                            :title="element.projectName">
                                            {{ element.projectName }}
                                        </h4>
                                    </div>

                                    <!-- Files Link -->
                                    <v-btn v-if="element.projectFilesFolder" icon="mdi-folder-open-outline"
                                        size="x-small" variant="text" color="primary" :href="element.projectFilesFolder"
                                        target="_blank" @click.stop></v-btn>
                                </div>

                                <!-- Chips Row -->
                                <div class="d-flex flex-wrap gap-1 mb-2">
                                    <v-chip size="x-small" variant="outlined" class="px-1">{{ '#' +
                                        element.projectNumber }}</v-chip>
                                    <v-chip v-if="element.state" size="x-small" variant="outlined" class="px-1">{{
                                        element.state }}</v-chip>
                                    <v-chip v-if="element.projectType" size="x-small" variant="outlined" class="px-1">{{
                                        element.projectType }}</v-chip>
                                </div>

                                <!-- Assigned To -->
                                <div v-if="element.assignedTo?.length" class="text-caption text-medium-emphasis mb-2">
                                    Assigned to: {{ element.assignedTo.join(', ') }}
                                </div>

                                <!-- Estimated Dates (Simplified) -->
                                <div v-if="hasEstimatedDates(element) || hasEstimatedStartDates(element)" class="mb-2">
                                    <div class="text-caption font-weight-bold text-medium-emphasis mb-1">Estimated
                                        Dates:</div>
                                    <div class="d-flex flex-column gap-0">
                                        <div v-if="element.engineeringNeeded"
                                            class="d-flex align-center justify-space-between text-caption">
                                            <span class="text-grey">Eng:</span>
                                            <span>
                                                <span class="text-primary font-weight-bold">{{
                                                    formatDate(element.engineeringEstimatedStartTime) }}</span>
                                                <v-icon size="x-small" class="mx-1">mdi-arrow-right</v-icon>
                                                <span class="text-primary font-weight-bold">{{
                                                    formatDate(element.engineeringEstimatedDeliveryTime) }}</span>
                                            </span>
                                        </div>
                                        <div v-if="element.draftingNeeded"
                                            class="d-flex align-center justify-space-between text-caption">
                                            <span class="text-grey">Draft:</span>
                                            <span>
                                                <span class="text-primary font-weight-bold">{{
                                                    formatDate(element.draftingEstimatedStartTime) }}</span>
                                                <v-icon size="x-small" class="mx-1">mdi-arrow-right</v-icon>
                                                <span class="text-primary font-weight-bold">{{
                                                    formatDate(element.draftingEstimatedDeliveryTime) }}</span>
                                            </span>
                                        </div>
                                        <div v-if="element.mepNeeded"
                                            class="d-flex align-center justify-space-between text-caption">
                                            <span class="text-grey">MEP:</span>
                                            <span>
                                                <span class="text-primary font-weight-bold">{{
                                                    formatDate(element.mepEstimatedStartTime) }}</span>
                                                <v-icon size="x-small" class="mx-1">mdi-arrow-right</v-icon>
                                                <span class="text-primary font-weight-bold">{{
                                                    formatDate(element.mepEstimatedDeliveryTime) }}</span>
                                            </span>
                                        </div>
                                        <div v-if="element.civilNeeded"
                                            class="d-flex align-center justify-space-between text-caption">
                                            <span class="text-grey">Civil:</span>
                                            <span>
                                                <span class="text-primary font-weight-bold">{{
                                                    formatDate(element.civilEstimatedStartTime) }}</span>
                                                <v-icon size="x-small" class="mx-1">mdi-arrow-right</v-icon>
                                                <span class="text-primary font-weight-bold">{{
                                                    formatDate(element.civilEstimatedDeliveryTime) }}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </template>
                </draggable>
            </div>
        </div>
    </div>
</template>

<style scoped>
.kanban-container {
    height: calc(100vh - 240px);
    /* Adjusted for headers/toggles */
    width: 100%;
}

.kanban-column {
    min-width: 300px;
    width: 300px;
}

.gap-4 {
    gap: 16px;
}

.gap-2 {
    gap: 8px;
}

.gap-1 {
    gap: 4px;
}

.gap-0 {
    gap: 2px;
}

.cursor-grab {
    cursor: grab;
}

.cursor-grab:active {
    cursor: grabbing;
}

.ghost-card {
    opacity: 0.5;
    background: rgba(0, 229, 255, 0.1);
    border: 1px dashed #00E5FF;
}

/* Scrollbar specific for Kanban */
.kanban-container::-webkit-scrollbar {
    height: 8px;
}

.kanban-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
}
</style>
