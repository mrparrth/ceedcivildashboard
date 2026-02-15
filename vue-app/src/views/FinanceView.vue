<script setup>
import { ref, computed } from 'vue'
import { useDataStore } from '@/stores/data'
import NewPaymentModal from '@/components/NewPaymentModal.vue'

const store = useDataStore()

// State
const filters = ref({
  startDate: null,
  endDate: null,
  assignee: null,
  salesMan: null,
  projectNumber: '',
  paid: null
})

const showPaymentModal = ref(false)
const editingPayment = ref(null)
const selected = ref([])

// Mock Data for filters (should come from store/appData)
const assignees = ['Ryan', 'Admin', 'User']
const salesmen = ['Ryan', 'Sales 2']

// Actions
const openNewPayment = () => {
  editingPayment.value = null
  showPaymentModal.value = true
}

const resetFilters = () => {
  filters.value = {
    startDate: null,
    endDate: null,
    assignee: null,
    salesMan: null,
    projectNumber: '',
    paid: null
  }
}

// Computed
const filteredPayments = computed(() => {
  return store.payments.filter(p => {
    // Date Filter
    if (filters.value.startDate && filters.value.endDate) {
      const pDate = new Date(p.datePaid)
      const start = new Date(filters.value.startDate)
      const end = new Date(filters.value.endDate)
      if (pDate < start || pDate > end) return false
    }
    // Assignee
    if (filters.value.assignee && p.assignee !== filters.value.assignee) return false
    // Salesman
    if (filters.value.salesMan && p.salesMan !== filters.value.salesMan) return false
    // Project Number
    if (filters.value.projectNumber && !String(p.projectNumber).includes(filters.value.projectNumber)) return false
    // Paid
    if (filters.value.paid !== null) {
      const isPaid = filters.value.paid === 'Yes'
      if (p.paid !== isPaid) return false
    }
    return true
  })
})

const totalExpenses = computed(() => {
  return filteredPayments.value.reduce((sum, p) => sum + (Number(p.actualCost) || 0) + (Number(p.revisionCost) || 0), 0)
})

const totalSelectedPayments = computed(() => {
  return selected.value.reduce((sum, p) => sum + (Number(p.actualCost) || 0) + (Number(p.revisionCost) || 0), 0)
})

// Table Headers
const headers = [
  { title: 'Actions', key: 'actions', sortable: false, width: '50px', fixed: true, cellProps: { class: 'fixed-header' } },
  { title: 'Assignee', key: 'assignee', fixed: true, cellProps: { class: 'fixed-header' } },
  { title: 'Project #', key: 'projectNumber', fixed: true, cellProps: { class: 'fixed-header' } },
  { title: 'Project', key: 'projectName', fixed: true, cellProps: { class: 'fixed-header' } },
  { title: 'Est. Budget', key: 'estimatedBudget', fixed: true, cellProps: { class: 'fixed-header' } },
  { title: 'Created At', key: 'createdAt', fixed: true, cellProps: { class: 'fixed-header' } }, // Assuming createdAt exists

  // Editable / Blue Headers
  { title: 'Actual Cost', key: 'actualCost', cellProps: { class: 'editable-header' } },
  { title: 'Ready?', key: 'readyToBePaid', cellProps: { class: 'editable-header' } },
  { title: 'Paid', key: 'paid', cellProps: { class: 'editable-header' } },
  { title: 'Date Paid', key: 'datePaid', cellProps: { class: 'editable-header' } },
  { title: 'Rev. Needed?', key: 'revisionNeeded', cellProps: { class: 'editable-header' } },
  { title: 'Date Paid', key: 'revisionDatePaid', cellProps: { class: 'editable-header' } },
  { title: 'Rev. Cost', key: 'revisionCost', cellProps: { class: 'editable-header' } },
  { title: 'Notes', key: 'notes', cellProps: { class: 'editable-header' } },
]

const formatCurrency = (val) => {
  return Number(val || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
</script>

<template>
  <div class="finance-view pa-4">
    <!-- Filters Bar -->
    <v-card class="mb-4 glass-card" elevation="0">
      <div class="d-flex flex-wrap gap-2 w-100 align-center pa-4">
        <v-text-field v-model="filters.startDate" type="date" label="Start" hide-details density="compact"
          variant="outlined" class="glow-input" style="max-width: 140px"></v-text-field>
        <v-text-field v-model="filters.endDate" type="date" label="End" hide-details density="compact"
          variant="outlined" class="glow-input" style="max-width: 140px"></v-text-field>

        <v-select v-model="filters.assignee" :items="assignees" label="Assignee (All)" hide-details density="compact"
          variant="outlined" class="glow-input" style="min-width: 150px"></v-select>
        <v-select v-model="filters.salesMan" :items="salesmen" label="Salesman (All)" hide-details density="compact"
          variant="outlined" class="glow-input" style="min-width: 150px"></v-select>

        <v-text-field v-model="filters.projectNumber" placeholder="Project Number" hide-details density="compact"
          variant="outlined" class="glow-input"></v-text-field>

        <v-select v-model="filters.paid" :items="['Yes', 'No']" label="Paid (All)" hide-details density="compact"
          variant="outlined" class="glow-input" style="max-width: 120px"></v-select>

        <v-spacer></v-spacer>
        <v-btn color="secondary" variant="outlined" class="glow-btn" @click="resetFilters">Reset Filters</v-btn>
      </div>
    </v-card>

    <!-- Action Bar -->
    <v-card class="mb-4 glass-card" elevation="0">
      <div class="d-flex align-center pa-4">
        <v-btn color="primary" prepend-icon="mdi-plus" class="glow-btn font-weight-bold" @click="openNewPayment">New
          Payment</v-btn>

        <v-spacer></v-spacer>

        <div v-if="selected.length" class="d-flex flex-column align-end mr-6">
          <span class="text-caption text-medium-emphasis text-uppercase font-weight-bold">Selected Total</span>
          <span class="text-h6 font-weight-bold text-primary text-glow">{{ formatCurrency(totalSelectedPayments)
            }}</span>
        </div>

        <div class="d-flex flex-column align-end">
          <span class="text-caption text-medium-emphasis text-uppercase font-weight-bold">Total Expenses</span>
          <span class="text-h6 font-weight-bold text-gradient">{{ formatCurrency(totalExpenses) }}</span>
        </div>
      </div>
    </v-card>

    <!-- Finance Table -->
    <v-card class="glass-card" elevation="0">
      <v-data-table v-model="selected" :headers="headers" :items="filteredPayments" show-select class="bg-transparent"
        density="compact">
        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
          <tr class="glass-header-row">
            <template v-for="column in columns" :key="column.key">
              <th v-if="column.key === 'data-table-select'" class="glass-header px-4">
                <!-- Select All Checkbox -->
              </th>
              <th v-else :class="[
                'text-start font-weight-bold text-uppercase text-caption glass-header',
                ['actualCost', 'readyToBePaid', 'paid', 'datePaid', 'revisionNeeded', 'revisionDatePaid', 'revisionCost', 'notes'].includes(column.key) ? 'text-primary' : 'text-medium-emphasis'
              ]" @click="() => toggleSort(column)">
                {{ column.title }}
              </th>
            </template>
          </tr>
        </template>

        <!-- Validations / Formatting -->
        <template v-slot:item.estimatedBudget="{ item }">{{ formatCurrency(item.estimatedBudget) }}</template>
        <template v-slot:item.actualCost="{ item }">
          <span class="text-primary font-weight-bold text-glow">{{ formatCurrency(item.actualCost) }}</span>
        </template>
        <template v-slot:item.readyToBePaid="{ item }">
          <v-icon :color="item.readyToBePaid ? 'success' : 'grey-darken-2'">{{ item.readyToBePaid ?
            'mdi-check-box-outline' : 'mdi-checkbox-blank-outline' }}</v-icon>
        </template>
        <template v-slot:item.paid="{ item }">
          <v-icon :color="item.paid ? 'success' : 'grey-darken-2'">{{ item.paid ? 'mdi-check-box-outline' :
            'mdi-checkbox-blank-outline' }}</v-icon>
        </template>
        <template v-slot:item.revisionNeeded="{ item }">
          <v-icon :color="item.revisionNeeded ? 'warning' : 'grey-darken-2'">{{ item.revisionNeeded ?
            'mdi-check-box-outline' : 'mdi-checkbox-blank-outline' }}</v-icon>
        </template>
        <template v-slot:item.revisionCost="{ item }">{{ formatCurrency(item.revisionCost) }}</template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon size="small" variant="text" color="primary" @click="openEditPayment(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>

      </v-data-table>
    </v-card>

    <NewPaymentModal v-model="showPaymentModal" :payment="editingPayment" />
  </div>
</template>

<style scoped>
.gap-2 {
  gap: 12px;
}

.glass-header-row th {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  white-space: nowrap;
}

.text-glow {
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
}

.finance-view {
  min-height: 100vh;
}
</style>
