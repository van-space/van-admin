import { createSlice } from '@reduxjs/toolkit'

export interface ViewportRecord {
  w: number
  h: number
  mobile: boolean
  pad: boolean
  hpad: boolean
  wider: boolean
  widest: boolean
  phone: boolean
}

const initialState = {
  viewport: {
    w: 0,
    h: 0,
    mobile: false,
    pad: false,
    hpad: false,
    wider: false,
    widest: false,
    phone: false,
  },
  sidebarWidth: 250,
  sidebarCollapse: false,
  isDark: false,
  naiveUIDark: false,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDark(state) {
      state.isDark = !state.isDark
    },
    updateViewport(state, action) {
      state.viewport = action.payload
    },
    toggleSidebar(state, action) {
      state.sidebarCollapse = action.payload
    },
  },
})
