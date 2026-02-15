<template>
    <v-container fluid class="fill-height bg-grey-lighten-4">
        <v-row justify="center" align="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12 rounded-lg pa-4">
                    <div class="d-flex flex-column align-center mb-4">
                        <v-icon size="64" color="primary" class="mb-2">mdi-alpha-c-box</v-icon>
                        <h1 class="text-h5 font-weight-bold text-primary">CeedCivil Dashboard</h1>
                        <div class="text-subtitle-1 text-medium-emphasis">Please sign in to continue</div>
                    </div>

                    <v-card-text>
                        <v-form @submit.prevent="handleLogin" v-model="valid">
                            <v-text-field v-model="email" label="Email" prepend-inner-icon="mdi-email"
                                variant="outlined" :rules="[v => !!v || 'Email is required']" required
                                class="mb-2"></v-text-field>

                            <v-text-field v-model="password" label="Password" prepend-inner-icon="mdi-lock"
                                variant="outlined" :type="showPassword ? 'text' : 'password'"
                                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append-inner="showPassword = !showPassword"
                                :rules="[v => !!v || 'Password is required']" required></v-text-field>

                            <v-alert v-if="error" type="error" variant="tonal" class="mt-3" closable
                                @click:close="error = ''">
                                {{ error }}
                            </v-alert>

                            <v-btn type="submit" color="primary" block size="large" class="mt-6 font-weight-bold"
                                :loading="loading" :disabled="loading">
                                {{ isAutoLoggingIn ? 'Trying to auto login...' : 'Login' }}
                            </v-btn>
                        </v-form>
                        <v-fade-transition>
                            <div v-if="isAutoLoggingIn" class="text-center mt-4 text-primary font-weight-bold">
                                Trying to auto login, please wait...
                            </div>
                        </v-fade-transition>
                    </v-card-text>

                    <!-- Optional fake link for implementation completeness if 'sign up needed' was implied -->
                    <!-- <v-card-text class="text-center">
            <a href="#" class="text-decoration-none text-body-2">Forgot Password?</a>
          </v-card-text> -->
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/data'

const router = useRouter()
const store = useDataStore()

const email = ref('')
const password = ref('')
const valid = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const isAutoLoggingIn = ref(false)

import { onMounted } from 'vue'

onMounted(async () => {
    const token = localStorage.getItem('app_token')
    if (token) {
        isAutoLoggingIn.value = true
        loading.value = true
        try {
            const success = await store.autoLogin()
            if (success) {
                router.push('/projects')
                await store.getInitialData()
            } else {
                // Auto login failed (token expired/invalid), user stays on login page
                // Optional: show message "Session expired"
                error.value = 'Session expired. Please login again.'
            }
        } catch (e) {
            // Fallback
        } finally {
            isAutoLoggingIn.value = false
            loading.value = false
        }
    }
})

const handleLogin = async () => {
    if (!email.value || !password.value) return

    loading.value = true
    error.value = ''

    try {
        const success = await store.login(email.value, password.value)
        if (success) {
            router.push('/projects')
            await store.getInitialData()
        } else {
            error.value = 'Invalid Credentials'
        }
    } catch (e) {
        error.value = e.message || 'Login Failed'
    } finally {
        loading.value = false
    }
}
</script>
