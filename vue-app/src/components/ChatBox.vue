<script setup>
import { ref, nextTick, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps({
    chats: {
        type: Array,
        default: () => []
    },
    currentUser: {
        type: Object,
        default: () => ({ name: 'Admin User' }) // Mock user
    }
})

const emit = defineEmits(['sendMessage', 'updateMessage'])

const message = ref('')
const chatContainer = ref(null)

const getInitials = (name) => {
    return (name || 'Unknown')
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    })
}

const sendMessage = () => {
    if (!message.value.trim()) return

    const newChat = {
        id: uuidv4(),
        message: message.value.trim(),
        date: new Date().toISOString(),
        sender: props.currentUser.name,
        completed: false
    }

    emit('sendMessage', newChat)
    message.value = ''
    scrollToBottom()
}

const toggleComplete = (chat) => {
    emit('updateMessage', { ...chat, completed: !chat.completed })
}

const scrollToBottom = async () => {
    await nextTick()
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
}

watch(() => props.chats.length, scrollToBottom)
</script>

<template>
    <div class="chat-box d-flex flex-column glass-card rounded-lg overflow-hidden"
        style="height: 400px; border: 1px solid rgba(255,255,255,0.1)">
        <!-- Header -->
        <div class="pa-3 bg-surface border-b d-flex justify-space-between align-center">
            <span class="text-subtitle-2 font-weight-bold">Project Chat</span>
            <v-chip size="x-small" color="primary" variant="flat">
                {{chats.filter(c => !c.completed).length}} Pending
            </v-chip>
        </div>

        <!-- Messages Area -->
        <div ref="chatContainer" class="flex-grow-1 overflow-y-auto pa-4 d-flex flex-column gap-3 bg-transparent">
            <div v-if="chats.length === 0" class="text-center text-medium-emphasis my-auto">
                <v-icon size="large" class="mb-2">mdi-message-text-outline</v-icon>
                <p class="text-caption">No messages yet. Start the conversation!</p>
            </div>

            <div v-for="chat in chats" :key="chat.id || chat.date" class="d-flex w-100 gap-2"
                :class="chat.sender === currentUser.name ? 'flex-row-reverse' : ''">
                <!-- Avatar -->
                <v-avatar size="32" :color="chat.sender === currentUser.name ? 'primary' : 'secondary'">
                    <span class="text-caption font-weight-bold text-white">{{ getInitials(chat.sender) }}</span>
                </v-avatar>

                <!-- Message Bubble -->
                <div class="d-flex flex-column" style="max-width: 80%">
                    <div class="pa-3 rounded-lg text-body-2" :class="[
                        chat.sender === currentUser.name ? 'bg-primary text-white rounded-tr-0' : 'bg-surface text-high-emphasis rounded-tl-0',
                        chat.completed ? 'text-decoration-line-through opacity-50' : ''
                    ]" style="border: 1px solid rgba(255,255,255,0.1)">
                        {{ chat.message }}
                    </div>
                    <div class="d-flex align-center gap-2 mt-1 px-1">
                        <span class="text-caption text-disabled" style="font-size: 10px">{{ formatDate(chat.date)
                            }}</span>
                        <v-checkbox-btn :model-value="chat.completed" @update:model-value="toggleComplete(chat)"
                            density="compact" color="success" hide-details
                            style="height: 20px; width: 20px"></v-checkbox-btn>
                    </div>
                </div>
            </div>
        </div>

        <!-- Input Area -->
        <div class="pa-2 bg-surface border-t d-flex align-center gap-2">
            <v-text-field v-model="message" placeholder="Type a message..." variant="solo" density="compact"
                hide-details bg-color="transparent" class="glow-input" @keyup.enter="sendMessage"></v-text-field>
            <v-btn icon="mdi-send" size="small" color="primary" class="glow-btn" @click="sendMessage"></v-btn>
        </div>
    </div>
</template>

<style scoped>
.gap-2 {
    gap: 8px;
}

.gap-3 {
    gap: 12px;
}

/* Custom scrollbar for chat */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}
</style>
