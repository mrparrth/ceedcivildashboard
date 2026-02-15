<template>
  <v-container fluid class="pa-0 h-100">
    <!-- Header Toolbar -->
    <div class="d-flex align-center w-100  gap-4">
      <v-card class="mb-2 px-4 py-2 d-flex align-center flex-grow-1">
        <!-- Left Section: Filters and Actions -->
        <div class="d-flex flex-grow-1 align-center flex-wrap ga-2">
          <div class="d-flex flex-column">
            <h1 class="text-h6 font-weight-bold text-gradient">Projects</h1>
          </div>

          <v-btn v-if="viewMode === 'table'" color="secondary" prepend-icon="mdi-archive" variant="tonal"
            :disabled="selected.length === 0" @click="archiveSelectedProjects">
            Archive
          </v-btn>
          <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search Projects..." hide-details
            single-line variant="outlined" density="compact" class="w-60 glow-input"></v-text-field>

          <v-select v-model="selProjectType" :items="['All', ...(store.appData?.projectType || [])]"
            label="Project Type" density="compact" hide-details variant="outlined" style="w-10"></v-select>

          <v-checkbox v-model="includeArchived" label="Include Archived" color="primary" class="w-10" hide-details
            density="compact"></v-checkbox>


          <v-btn color="primary" prepend-icon="mdi-plus" class="elevation-4 glow-btn" @click="openNewProject">
            New Project
          </v-btn>
        </div>
      </v-card>

      <!-- Right Section: View Toggle Icons (100px) -->
      <v-card class="mb-2 px-4 py-3 d-flex align-center">
        <v-btn-toggle v-model="viewMode" mandatory density="compact" color="primary" class="glass-card">
          <v-btn value="table" icon="mdi-table">
            <v-icon>mdi-table</v-icon>
            <v-tooltip activator="parent" location="bottom">Table View</v-tooltip>
          </v-btn>
          <v-btn value="kanban" icon="mdi-view-column">
            <v-icon>mdi-view-column</v-icon>
            <v-tooltip activator="parent" location="bottom">Kanban View</v-tooltip>
          </v-btn>
        </v-btn-toggle>
      </v-card>
    </div>

    <!-- Project Calendar (Always on top, collapsible) -->
    <v-expansion-panels v-model="calendarPanel" class="mb-2 glass-card rounded-lg overflow-hidden">
      <v-expansion-panel value="calendar">
        <v-expansion-panel-title class="py-2">
          <div class="d-flex align-center gap-4 w-100">
            <span class="text-h6 font-weight-bold">Project Timeline</span>

            <v-spacer></v-spacer>

            <!-- Calendar Controls / Legend could go here or inside -->

          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="calendar-wrapper h-100 pa-0">
            <CalendarBoard :projects="filteredProjects" initialView="week" @edit-project="openEditProject" />
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Data Table View -->
    <v-card v-if="viewMode === 'table'" class="glass-card">
      <v-data-table v-model="selected" :headers="headers" :items="filteredProjects" :search="search" show-select hover
        return-object class="bg-transparent">
        <!-- Status Column -->
        <template v-slot:item.overallProjectStatus="{ item }">
          <v-chip :color="getStatusColor(item.overallProjectStatus)" variant="flat" size="small"
            class="font-weight-bold text-uppercase">
            {{ item.overallProjectStatus || 'Unknown' }}
          </v-chip>
        </template>
        <template v-slot:item.assignedTo="{ item }">
          <v-chip v-for="user in item.assignedTo" :key="user" variant="flat" size="small"
            class="font-weight-bold text-uppercase mr-1 mb-1"
            :class="DEPARTMENT_CLASS[getDepartmentOfUser(user, store.appData)]">
            {{ user }}
          </v-chip>
        </template>
        <!-- Actions Column -->
        <template v-slot:item.actions="{ item }">
          <v-btn icon variant="text" size="small" color="primary" @click="openEditProject(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon variant="text" size="small" color="error" @click="deleteProject(item)">
            <v-icon>mdi-delete</v-icon>
            <v-tooltip activator="parent" location="top">Delete Project</v-tooltip>
          </v-btn>
        </template>

        <!-- Empty State -->
        <template v-slot:no-data>
          <div class="pa-8 text-center text-medium-emphasis">
            <v-icon size="48" color="grey-lighten-2" class="mb-2">mdi-folder-open-outline</v-icon>
            <p>No projects found. Create one to get started!</p>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Kanban View -->
    <div v-if="viewMode === 'kanban'" class="kanban-wrapper">
      <KanbanBoard :projects="filteredProjects" @card-click="openEditProject" />
    </div>

    <!-- Project Modal -->
    <ProjectModal v-model="showModal" :project="editingProject" />
  </v-container>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '@/stores/data'
import { useRouter } from 'vue-router'
import KanbanBoard from '@/components/KanbanBoard.vue'
import ProjectModal from '@/components/ProjectModal.vue'
import CalendarBoard from '@/components/CalendarBoard.vue'
import { DEPARTMENT_COLORS, DEPARTMENT_CLASS } from '@/utils/constant'
import { getDepartmentOfUser } from '@/utils/utils'

const store = useDataStore()
const router = useRouter()
const search = ref('')
const selected = ref([])
const includeArchived = ref(false)
const viewMode = ref('kanban') // 'table' | 'kanban'

const calendarPanel = ref(['calendar']) // Default open
const selProjectType = ref('All')

// Modal State
const showModal = ref(false)
const editingProject = ref(null)

const openNewProject = () => {
  editingProject.value = null
  showModal.value = true
}

const openEditProject = (item) => {
  // Need to fetch full object if item is partial, but for now assuming item is full
  editingProject.value = item
  showModal.value = true
}

// Simple delete confirmation (could be a modal in future)
const deleteProject = async (item) => {
  if (confirm(`Are you sure you want to delete "${item.projectName}"?`)) {
    try {
      await store.updateProject({ ...item, isDeleted: true })
      store.showNotification('Project deleted', 'success')
    } catch (e) {
      store.showNotification('Failed to delete project', 'error')
    }
  }
}

const archiveSelectedProjects = async () => {
  if (selected.value.length === 0) return

  if (confirm(`Archive ${selected.value.length} selected project(s)?`)) {
    try {
      // In real app, we might want to do this in batch if API supports it,
      // or iterate. Store.updateProject queues acts properly.
      for (const p of selected.value) {
        store.updateProject({ id: p.id, isArchived: true })
      }
      store.showNotification('Projects archived', 'success')
      selected.value = []
    } catch (e) {
      store.showNotification('Failed to archive projects', 'error')
    }
  }
}

const headers = [
  { title: 'Project #', key: 'projectNumber', align: 'start' },
  { title: 'Name', key: 'projectName' },
  { title: 'Type', key: 'projectType' },
  { title: 'Status', key: 'overallProjectStatus' },
  { title: 'Assigned To', key: 'assignedTo' },
  { title: 'State', key: 'state' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

// Filter logic (porting from legacy)
const filteredProjects = computed(() => {
  return store.projects.filter(p => {
    if (!includeArchived.value && p.isArchived) return false
    if (p.isDeleted) return false

    // Project Type Filter
    if (selProjectType.value !== 'All' && p.projectType !== selProjectType.value) return false

    const s = search.value.toLowerCase()
    if (s && !Object.values(p).some(val => String(val).toLowerCase().includes(s))) return false
    return true
  })
})

const getStatusColor = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'completed': return 'success'
    case 'in progress': return 'info'
    case 'on hold': return 'warning'
    case 'cancelled': return 'error'
    default: return 'grey'
  }
}

const getAssignedToColor = (assignedTo) => {
  if (!assignedTo) return 'grey'
  const assignedToDept = assignedTo.toLowerCase()
  const color = DEPARTMENT_COLORS[assignedTo]
  return color || 'grey'
}
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}
</style>
