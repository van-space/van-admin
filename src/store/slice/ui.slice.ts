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
    toggleDark(state, action) {
      state.isDark = action.payload
    },
    updateViewport(state) {
      const innerHeight = window.innerHeight
      const width = document.documentElement.getBoundingClientRect().width
      const { hpad, pad, mobile } = state.viewport

      // 忽略移动端浏览器 上下滚动 导致的视图大小变化
      if (
        state.viewport.h &&
        // chrome mobile delta == 56
        Math.abs(innerHeight - state.viewport.h) < 80 &&
        width === state.viewport.w &&
        (hpad || pad || mobile)
      ) {
        return
      }
      state.viewport = {
        w: width,
        h: innerHeight,
        mobile: window.screen.width <= 568 || window.innerWidth <= 568,
        pad: window.innerWidth <= 768 && window.innerWidth > 568,
        hpad: window.innerWidth <= 1024 && window.innerWidth > 768,
        wider: window.innerWidth > 1024 && window.innerWidth < 1920,
        widest: window.innerWidth >= 1920,
        phone: window.innerWidth <= 768,
      }
    },
    toggleSidebar(state, action) {
      state.sidebarCollapse = action.payload
    },
  },
})
