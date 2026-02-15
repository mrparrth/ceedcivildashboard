<template>
  <v-app>
    <v-navigation-drawer v-if="store.isAuthenticated" v-model="drawer" color="#000000" theme="dark" width="290"
      class="sidebar-drawer border-none">
      <div class="pa-6 pt-8 mb-4 d-flex flex-column">
        <div class="d-flex align-center gap-3 justify-center">
          <v-icon size="28" color="white" class="mr-3">mdi-alpha-c-box</v-icon>
          <span class="text-h6 font-weight-bold text-white" style="letter-spacing: 0.5px;">CeedCivil</span>
        </div>
      </div>

      <v-list nav class="px-3">
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" class="mb-2 sidebar-item"
          active-class="sidebar-item-active" :ripple="false">
          <template v-slot:prepend>
            <v-icon :icon="item.icon" class="mr-4 sidebar-icon"></v-icon>
          </template>
          <v-list-item-title class="text-body-1 font-weight-medium sidebar-title">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar v-if="store.isAuthenticated" elevation="0" color="background" class="border-b">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="primary"></v-app-bar-nav-icon>
      <v-app-bar-title class="font-weight-medium text-primary">Overview</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon color="primary" class="mr-2">
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>
      <v-avatar color="primary-darken-1" size="40">
        <span class="text-subtitle-2">AD</span>
      </v-avatar>
    </v-app-bar>

    <v-main class="bg-background">
      <v-container fluid class="pa-6 fill-height align-start">
        <RouterView />
      </v-container>
    </v-main>

    <v-snackbar v-model="store.notification.show" :color="store.notification.color"
      :timeout="store.notification.timeout" location="top right">
      {{ store.notification.message }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="store.notification.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { useDataStore } from '@/stores/data'

const drawer = ref(true)
const store = useDataStore()

const items = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
  { title: 'Project Tracker', icon: 'mdi-briefcase', to: '/projects' },
  { title: 'Finance', icon: 'mdi-currency-usd', to: '/finance' },
  { title: 'Contract Tool', icon: 'mdi-file-document-edit', to: '/contract-tool' },
]
</script>

<style scoped>
/* Scoped to prevent leaking, though global 'body' styles typically go in a main.css */

/* Navigation Drawer Background */
body {
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.sidebar-drawer {
  background-color: #000000 !important;
  /* Pure black to match the design */
  border-right: none !important;
}

/* -------------------------------------------------------------------------
   BASE ITEM STATE (Inactive)
   ------------------------------------------------------------------------- */
.sidebar-item {
  width: 260px !important;
  height: 60px !important;
  margin: 0 auto 0px auto !important;
  padding: 0 16px !important;

  /* Important: Pre-set the border to transparent so the item doesn't 
     jump in size when the 6px black border appears on active */
  border: 6px solid transparent !important;
  border-radius: 20px !important;

  display: flex !important;
  align-items: center !important;

  background-color: transparent;
  color: #9CA3AF !important;
  /* Gray text */
  transition: all 0.3s ease;
}

/* Hover Effect for Inactive */
.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: #E5E7EB !important;
}

/* Remove Vuetify's default overlay/ripple opacity layers */
:deep(.v-list-item__overlay) {
  display: none !important;
}

/* Base Icon and Text Styling */
.sidebar-icon {
  font-size: 24px !important;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.sidebar-title {
  font-size: 20px !important;
  font-weight: 500 !important;
  letter-spacing: -0.3px !important;
}

/* -------------------------------------------------------------------------
   ACTIVE STATE (Convex Glow)
   ------------------------------------------------------------------------- */
.sidebar-item-active {
  /* 1. The Convex Gradient Background */
  background: linear-gradient(to bottom,
      #3a3a3e 0%,
      /* Highlight top */
      #222224 50%,
      /* Mid-tone center */
      #111113 100%
      /* Deep shadow bottom */
    ) !important;

  /* 2. Deep Inset Shadows for the "Water Filled" look */
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    /* Sharp top highlight */
    inset 0 4px 8px rgba(255, 255, 255, 0.05),
    /* Soft top glow */
    inset 0 -6px 12px rgba(0, 0, 0, 0.8) !important;
  /* Deep bottom shadow */

  /* 3. The Thick Black Frame */
  border: 6px solid #000 !important;

  /* 4. Text Color */
  color: #ffffff !important;

  /* 5. Essential Layout Props */
  position: relative !important;
  overflow: hidden !important;
  /* Clips the glow leaks */

  /* 6. Outer Drop Shadow (Lift) */
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.5)) !important;
}

/* --- LAYER 1: The Ambient Light Leak (Gradient Wash) --- */
.sidebar-item-active::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 160px;
  background: linear-gradient(to left,
      rgba(255, 45, 112, 0.45) 0%,
      rgba(255, 45, 112, 0.1) 60%,
      rgba(255, 45, 112, 0) 100%);
  pointer-events: none;
  mix-blend-mode: screen;
  z-index: 1;
}

/* --- LAYER 2: The Pink Glow Stick --- */
.sidebar-item-active::after,
html body .v-navigation-drawer .v-list-item--active.sidebar-item::after {
  content: '' !important;
  display: block !important;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  /* --- VUETIFY CONFLICT RESETS --- */
  border: none !important;
  /* Removes the default 2px solid border */
  transition: none !important;
  /* Stops the default opacity transition */
  opacity: 1 !important;

  /* Positions it flush against the inner edge of the black border */
  right: 0 !important;
  left: auto !important;
  /* Safety check to prevent Vuetify overrides */

  width: 5px;
  height: 28px;
  border-radius: 4px;

  background-color: #ff5c8d;

  /* The intense glow stack */
  box-shadow:
    0 0 4px 1px rgba(255, 200, 220, 0.8),
    0 0 12px 4px rgba(255, 45, 112, 0.8),
    -10px 0 35px 10px rgba(255, 45, 112, 0.5),
    -20px 0 60px 20px rgba(255, 45, 112, 0.2);

  /* Increased Z-Index to ensure it sits on top of Vuetify text/icons */
  z-index: 100 !important;
}

/* --- 3D Effects for Content inside Active Item --- */

/* Target the Icon */
.sidebar-item-active .sidebar-icon {
  opacity: 0.95 !important;
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.3));
  transform: perspective(500px) translateZ(2px);
  /* 3D pop */
  color: white !important;
}

/* Target the Text */
.sidebar-item-active .sidebar-title {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  transform: perspective(500px) translateZ(2px);
  /* 3D pop */
  font-weight: 600 !important;
}
</style>