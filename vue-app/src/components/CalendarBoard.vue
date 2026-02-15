<script setup>
import { ref, computed } from 'vue'
import { DEPARTMENT_COLORS, DEPARTMENT_CLASS } from '../utils/constant'

const props = defineProps({
    projects: {
        type: Array,
        default: () => []
    },
    initialView: {
        type: String, // 'week' | 'day'
        default: 'week'
    }
})

const emit = defineEmits(['edit-project'])

const viewMode = ref(props.initialView)
const currentDate = ref(new Date())

// ---------------------------------------------------------
// DATA PROCESSING
// ---------------------------------------------------------

const projectsWithTimeline = computed(() => {
    return props.projects.filter(p => {
        return ['Drafting', 'Engineering', 'MEP', 'Civil'].some(dept => {
            const prefix = dept.toLowerCase()
            return p[`${prefix}EstimatedStartTime`] || p[`${prefix}EstimatedDeliveryTime`]
        })
    })
})

const timelineData = computed(() => {
    return projectsWithTimeline.value.map(project => {
        const timelines = ['Drafting', 'Engineering', 'MEP', 'Civil'].map(dept => {
            const prefix = dept.toLowerCase()
            const startStr = project[`${prefix}EstimatedStartTime`]
            const endStr = project[`${prefix}EstimatedDeliveryTime`]

            if (!startStr && !endStr) return null

            const start = startStr ? new Date(startStr + 'T00:00:00') : new Date(endStr + 'T23:59:59')
            const end = endStr ? new Date(endStr + 'T23:59:59') : new Date(startStr + 'T00:00:00')

            const assignedKey = `${prefix}TaskedTo`
            const assigned = project[assignedKey] || project.assignedTo

            return {
                type: prefix,
                dept: dept,
                start: start,
                end: end,
                color: DEPARTMENT_COLORS[dept],
                className: DEPARTMENT_CLASS[dept],
                label: dept,
                assigned: Array.isArray(assigned) ? assigned.join(', ') : (assigned || 'Unassigned')
            }
        }).filter(Boolean)

        return { project, timelines }
    })
})

const visibleTimelineData = computed(() => {
    const monthStart = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
    const monthEnd = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0, 23, 59, 59)

    return timelineData.value.map(({ project, timelines }) => {
        const visible = timelines.filter(tl => {
            return tl.end >= monthStart && tl.start <= monthEnd
        })
        if (visible.length === 0) return null
        return { project, timelines: visible }
    }).filter(Boolean).sort((a, b) => {
        const aStart = Math.min(...a.timelines.map(t => t.start))
        const bStart = Math.min(...b.timelines.map(t => t.start))
        if (aStart !== bStart) return aStart - bStart

        const aEnd = Math.min(...a.timelines.map(t => t.end))
        const bEnd = Math.min(...b.timelines.map(t => t.end))
        return aEnd - bEnd
    })
})


// ---------------------------------------------------------
// NAVIGATION & HELPERS
// ---------------------------------------------------------

const monthName = computed(() => {
    return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const prevMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const formatDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const formatWeekday = (d) => d.toLocaleDateString('en-US', { weekday: 'short' })


// ---------------------------------------------------------
// "WEEK VIEW" (MONTH GRID) LOGIC
// ---------------------------------------------------------

const weeks = computed(() => {
    const days = []
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()

    // Start from first day of month
    const firstDay = new Date(year, month, 1)
    // Backtrack to Sunday
    const startDay = new Date(firstDay)
    startDay.setDate(firstDay.getDate() - firstDay.getDay())

    // Go until last day of month + fill week
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const endDay = new Date(lastDayOfMonth)
    endDay.setDate(endDay.getDate() + (6 - endDay.getDay()))

    const d = new Date(startDay)
    while (d <= endDay) {
        days.push(new Date(d))
        d.setDate(d.getDate() + 1)
    }

    // Chunk into weeks
    const chunks = []
    for (let i = 0; i < days.length; i += 7) {
        chunks.push(days.slice(i, i + 7))
    }
    return chunks
})

const isCurrentMonth = (d) => {
    return d.getMonth() === currentDate.value.getMonth() && d.getFullYear() === currentDate.value.getFullYear()
}

const calculateBarSegments = (timelines, weekStart, weekEnd) => {
    return timelines.map(tl => {
        const s = tl.start < weekStart ? weekStart : tl.start
        const e = tl.end > weekEnd ? weekEnd : tl.end

        let startIdx = Math.floor((s - weekStart) / (24 * 60 * 60 * 1000))
        let endIdx = Math.floor((e - weekStart) / (24 * 60 * 60 * 1000))

        startIdx = Math.max(0, startIdx)
        endIdx = Math.min(6, endIdx)

        const isLeftFlat = tl.start < weekStart
        const isRightFlat = tl.end > weekEnd
        let radius = '12px'
        if (isLeftFlat && isRightFlat) radius = '0'
        else if (isLeftFlat) radius = '0 12px 12px 0'
        else if (isRightFlat) radius = '12px 0 0 12px'

        return {
            timeline: tl,
            startIdx,
            endIdx,
            radius,
            colSpan: endIdx - startIdx + 1,
            startPct: (startIdx / 7) * 100,
            widthPct: ((endIdx - startIdx + 1) / 7) * 100
        }
    })
}

// Computed property for PRE-CALCULATED Week Grid Layout
const processedWeeks = computed(() => {
    const weekData = []

    weeks.value.forEach(weekDates => {
        const weekStart = new Date(weekDates[0]); weekStart.setHours(0, 0, 0, 0)
        const weekEnd = new Date(weekDates[6]); weekEnd.setHours(23, 59, 59, 999)

        // 1. Identify projects in this week
        const projectsInWeek = []
        visibleTimelineData.value.forEach(({ project, timelines }) => {
            const weekTimelines = timelines.filter(tl => tl.end >= weekStart && tl.start <= weekEnd)
            if (weekTimelines.length > 0) {
                projectsInWeek.push({ project, timelines: weekTimelines })
            }
        })

        // 2. Assign Rows (Stacking) using React Logic
        const positions = new Map() // projId -> rowIndex
        const maxProjectsPerDay = 4

        // Sort by start date first
        projectsInWeek.sort((a, b) => {
            const aStart = Math.min(...a.timelines.map(t => t.start))
            const bStart = Math.min(...b.timelines.map(t => t.start))
            return aStart - bStart
        })

        for (let d = 0; d < 7; d++) {
            const dStart = new Date(weekDates[d]); dStart.setHours(0, 0, 0, 0)
            const dEnd = new Date(weekDates[d]); dEnd.setHours(23, 59, 59, 999)

            // Find projects active on this day
            const onDay = projectsInWeek.filter(({ timelines }) =>
                timelines.some(t => t.start <= dEnd && t.end >= dStart)
            )

            // Take top 4
            const visible = onDay.length > maxProjectsPerDay ? onDay.slice(0, maxProjectsPerDay) : onDay

            visible.forEach((p, idx) => {
                if (!positions.has(p.project.id)) {
                    positions.set(p.project.id, idx)
                }
            })
        }

        // 3. Pre-calculate bars and styles for each project
        const renderedProjects = []
        projectsInWeek.forEach(pData => {
            if (positions.has(pData.project.id)) {
                const rowIndex = positions.get(pData.project.id)
                const bars = calculateBarSegments(pData.timelines, weekStart, weekEnd)

                // INTRA-PROJECT FANNING
                // If a project has multiple bars in the same week, they will overlap.
                // We want to fan them out vertically slightly (innerOffset).

                // Sort bars to ensure order? Timelines already sorted by logic in timelineData usually?
                // Let's ensure deterministic order: by start date, then by type.
                bars.sort((a, b) => {
                    const diff = a.timeline.start - b.timeline.start
                    if (diff !== 0) return diff
                    return a.timeline.type.localeCompare(b.timeline.type)
                })

                const rowPitch = 40 // More space per project row
                const internalStep = 8 // Step for fanning

                bars.forEach((bar, bIdx) => {
                    const internalOffset = bIdx * internalStep
                    const top = 24 + (rowIndex * rowPitch) + internalOffset

                    renderedProjects.push({
                        project: pData.project,
                        bar,
                        top: top,
                        zIndex: 2 + bIdx
                    })
                })
            }
        })

        // 4. Calculate Row Height based on new Pitch
        let maxRow = 0
        if (renderedProjects.length > 0) {
            positions.forEach(r => { if (r > maxRow) maxRow = r })
        }

        const rowCount = maxRow + 1
        // Base row height on 40px pitch
        // + some buffer
        const height = (renderedProjects.length === 0) ? 100 :
            (rowCount >= 4 ? 200 : Math.max(rowCount, 2) * 55)

        weekData.push({
            weekDates,
            height,
            renderedProjects
        })
    })

    return weekData
})

const getMoreCount = (dayDate) => {
    const dStart = new Date(dayDate); dStart.setHours(0, 0, 0, 0)
    const dEnd = new Date(dayDate); dEnd.setHours(23, 59, 59, 999)

    // Check against visibleTimelineData global to be accurate
    const count = visibleTimelineData.value.filter(({ timelines }) =>
        timelines.some(t => t.start <= dEnd && t.end >= dStart)
    ).length

    if (count > 4) return count - 3
    return 0
}


// ---------------------------------------------------------
// "DAY VIEW" (MONTH GANTT) LOGIC
// ---------------------------------------------------------

const monthDays = computed(() => {
    const days = []
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const lastDay = new Date(year, month + 1, 0).getDate()

    for (let i = 1; i <= lastDay; i++) {
        days.push(new Date(year, month, i))
    }
    return days
})

// REFINED GANTT LOGIC: Increased offset and dynamic height calculation logic
const getDayGanttBars = (project, timelines) => {
    const mStart = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
    const mEnd = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0, 23, 59, 59)
    const totalMs = mEnd - mStart

    const sorted = [...timelines].sort((a, b) => a.start - b.start)
    const processed = []

    return sorted.map(tl => {
        const s = tl.start < mStart ? mStart : tl.start
        const e = tl.end > mEnd ? mEnd : tl.end

        if (e <= s) return null

        let slot = 0
        while (true) {
            const collision = processed.some(p => {
                const pS = p.start < mStart ? mStart : p.start
                const pE = p.end > mEnd ? mEnd : p.end
                if (s < pE && e > pS) { return p.slot === slot }
                return false
            })
            if (!collision) break
            slot++
        }

        processed.push({ ...tl, slot })

        const left = ((s - mStart) / totalMs) * 100
        const width = ((e - s) / totalMs) * 100

        const isLeftFlat = tl.start < mStart
        const isRightFlat = tl.end > mEnd
        let radius = '12px'
        if (isLeftFlat && isRightFlat) radius = '0'
        else if (isLeftFlat) radius = '0 12px 12px 0'
        else if (isRightFlat) radius = '12px 0 0 12px'

        return {
            ...tl,
            leftPct: left,
            widthPct: width,
            radius,
            // Increased offset to 14px to be more visible "downwards"
            topOffset: slot * 14,
            zIndex: 5 + slot
        }
    }).filter(Boolean)
}

// Calculate dynamic height for Gantt row
const getGanttRowHeight = (timelines) => {
    if (!timelines.length) return 50
    const bars = getDayGanttBars(null, timelines)
    if (!bars.length) return 50
    const maxSlot = Math.max(...bars.map(b => b.zIndex - 5))
    // Base 50, add 14px per extra slot
    const requiredHeight = 6 + (maxSlot * 14) + 24 + 10
    return Math.max(50, requiredHeight)
}

</script>

<template>
    <div class="calendar-board h-100 d-flex flex-column bg-surface rounded-l elevation-2 overflow-hidden">

        <!-- Header -->
        <div class="pa-4 border-b d-flex justify-space-between align-center bg-white">
            <!-- Legend -->
            <div class="d-flex gap-4">
                <div v-for="(color, dept) in DEPARTMENT_COLORS" :key="dept" class="d-flex align-center mr-3">
                    <div class="rounded-pill mr-1" :style="{ backgroundColor: color, width: '18px', height: '8px' }">
                    </div>
                    <span class="text-caption font-weight-bold">{{ dept }}</span>
                </div>
            </div>

            <!-- Controls -->
            <div class="d-flex align-center gap-2">
                <v-btn-toggle v-model="viewMode" mandatory density="compact" color="primary" class="rounded-lg border">
                    <v-btn value="week" class="text-capitialize">Week View</v-btn>
                    <v-btn value="day" class="text-capitialize">Day View</v-btn>
                </v-btn-toggle>

                <div class="d-flex align-center ml-4">
                    <v-btn icon="mdi-chevron-left" variant="text" size="small" @click="prevMonth"></v-btn>
                    <span class="text-subtitle-1 font-weight-bold mx-2 min-w-150 text-center" style="min-width: 140px">
                        {{ monthName }}
                    </span>
                    <v-btn icon="mdi-chevron-right" variant="text" size="small" @click="nextMonth"></v-btn>
                </div>
            </div>
        </div>

        <!-- WEEK VIEW (MONTH GRID) -->
        <div v-if="viewMode === 'week'" class="flex-grow-1 overflow-y-auto">
            <!-- Header Row -->
            <div class="d-grid-7 border-b bg-grey-lighten-4">
                <div v-for="d in processedWeeks[0]?.weekDates" :key="'h-' + d"
                    class="text-center py-2 text-caption font-weight-bold text-medium-emphasis border-e">
                    {{ formatWeekday(d) }}
                </div>
            </div>

            <!-- Weeks -->
            <div v-for="(weekData, wIdx) in processedWeeks" :key="wIdx" class="position-relative border-b"
                :style="{ minHeight: weekData.height + 'px' }">

                <!-- Grid Background -->
                <div class="d-grid-7 h-100 position-absolute w-100" style="z-index: 0">
                    <div v-for="(day, dIdx) in weekData.weekDates" :key="dIdx" class="border-e h-100 px-2 py-1"
                        :class="isCurrentMonth(day) ? 'bg-white' : 'bg-grey-lighten-5'">
                        <div class="d-flex justify-space-between align-center">
                            <span class="text-body-2 font-weight-bold"
                                :class="isCurrentMonth(day) ? 'text-high-emphasis' : 'text-disabled'">
                                {{ isCurrentMonth(day) ? day.getDate() : formatDate(day) }}
                            </span>
                        </div>

                        <div v-if="getMoreCount(day) > 0"
                            class="position-absolute bottom-0 right-0 ma-1 px-2 py-0 bg-grey-lighten-3 rounded-pill text-caption font-weight-bold text-medium-emphasis">
                            +{{ getMoreCount(day) }} more
                        </div>
                    </div>
                </div>

                <!-- Timeline Bars (Pre-Calculated) -->
                <div class="position-absolute w-100" style="z-index: 1; top: 0;">
                    <template v-for="pData in weekData.renderedProjects" :key="pData.project.id">
                        <div class="position-relative w-100" style="height: 0;">
                            <div class="position-absolute d-flex align-center px-2 text-white text-caption font-weight-bold text-truncate shadow-sm pointer"
                                :style="{
                                    left: pData.bar.startPct + '%',
                                    width: pData.bar.widthPct + '%',
                                    top: pData.top + 'px',
                                    height: '24px',
                                    backgroundColor: pData.bar.timeline.color,
                                    borderRadius: pData.bar.radius,
                                    zIndex: pData.zIndex,
                                    cursor: 'pointer'
                                }" @click="emit('edit-project', pData.project)">

                                <v-tooltip activator="parent" location="top" open-delay="200"
                                    content-class="bg-grey-lighten-3 text-high-emphasis elevation-4">
                                    <div class="pa-1">
                                        <div class="font-weight-bold text-subtitle-2 mb-1">#{{
                                            pData.project.projectNumber }} - {{ pData.bar.timeline.label }}</div>
                                        <div class="text-caption mb-1">Assigned to: {{ pData.bar.timeline.assigned }}
                                        </div>
                                        <div class="text-caption">Duration: {{ formatDate(pData.bar.timeline.start) }} -
                                            {{ formatDate(pData.bar.timeline.end) }}</div>
                                    </div>
                                </v-tooltip>

                                #{{ pData.project.projectNumber }} - {{ pData.project.projectName }}
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <!-- DAY VIEW (MONTH GANTT) -->
        <div v-if="viewMode === 'day'" class="flex-grow-1 overflow-auto d-flex flex-column">
            <div class="d-flex border-b bg-grey-lighten-5 sticky-top" style="min-width: fit-content;">
                <div style="width: 200px"
                    class="flex-shrink-0 border-e pa-2 font-weight-bold text-caption d-flex align-center bg-white sticky-left">
                    Projects
                </div>
                <div class="d-flex flex-grow-1">
                    <div v-for="d in monthDays" :key="d" class="text-center border-e px-1 py-2 flex-grow-1"
                        style="min-width: 40px"
                        :class="{ 'bg-blue-lighten-5': d.toDateString() === new Date().toDateString() }">
                        <div class="text-caption text-medium-emphasis">{{ formatWeekday(d) }}</div>
                        <div class="font-weight-bold">{{ d.getDate() }}</div>
                    </div>
                </div>
            </div>

            <div class="flex-grow-1" style="min-width: fit-content;">
                <div v-for="data in visibleTimelineData" :key="data.project.id" class="d-flex border-b hover-bg">
                    <!-- Sticky Project Info -->
                    <div style="width: 200px"
                        class="flex-shrink-0 border-e pa-3 bg-white sticky-left z-10 cursor-pointer"
                        @click="emit('edit-project', data.project)">
                        <div class="font-weight-bold text-body-2 text-truncate">#{{ data.project.projectNumber }}</div>
                        <div class="text-caption text-medium-emphasis text-truncate">{{ data.project.projectName }}
                        </div>
                    </div>

                    <!-- Dynamic Height Container -->
                    <div class="flex-grow-1 position-relative"
                        :style="{ height: getGanttRowHeight(data.timelines) + 'px' }">
                        <div class="d-flex h-100 w-100 position-absolute">
                            <div v-for="d in monthDays" :key="d" class="flex-grow-1 border-e h-100"
                                style="min-width: 40px">
                            </div>
                        </div>

                        <div class="position-absolute w-100 h-100 d-flex align-center">
                            <div v-for="(currBar, i) in getDayGanttBars(data.project, data.timelines)" :key="i"
                                class="position-absolute h-75 rounded px-2 d-flex align-center justify-center text-white text-caption font-weight-bold shadow-sm pointer"
                                :style="{
                                    left: currBar.leftPct + '%',
                                    width: currBar.widthPct + '%',
                                    backgroundColor: currBar.color,
                                    borderRadius: currBar.radius,
                                    zIndex: currBar.zIndex,
                                    top: (6 + currBar.topOffset) + 'px',
                                    height: '24px'
                                }" @click="emit('edit-project', data.project)">

                                <v-tooltip activator="parent" location="top" open-delay="200"
                                    content-class="bg-grey-lighten-3 text-high-emphasis elevation-4">
                                    <div class="pa-1">
                                        <div class="font-weight-bold text-subtitle-2 mb-1">#{{
                                            data.project.projectNumber }} -
                                            {{ currBar.label }}</div>
                                        <div class="text-caption mb-1">Assigned to: {{ currBar.assigned }}</div>
                                        <div class="text-caption">Duration: {{ formatDate(currBar.start) }} - {{
                                            formatDate(currBar.end) }}</div>
                                    </div>
                                </v-tooltip>

                                <span class="text-truncate">{{ currBar.type }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.d-grid-7 {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.border-e {
    border-right: 1px solid rgba(0, 0, 0, 0.06);
}

.border-b {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.border {
    border: 1px solid rgba(0, 0, 0, 0.06);
}

.sticky-top {
    position: sticky;
    top: 0;
    z-index: 20;
}

.sticky-left {
    position: sticky;
    left: 0;
    z-index: 10;
}

.hover-bg:hover {
    background-color: rgba(0, 0, 0, 0.01);
}

.cursor-pointer {
    cursor: pointer;
}

/* Custom Scrollbar */
.overflow-auto::-webkit-scrollbar {
    height: 8px;
    width: 8px;
}

.overflow-auto::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
}
</style>
