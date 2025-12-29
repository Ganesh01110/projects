import { createSlice } from '@reduxjs/toolkit'
import { THEMES, STORAGE_KEYS } from '@utils/constants'

// Get initial theme from localStorage or default to dark
const getInitialTheme = () => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)
    return savedTheme || THEMES.DARK
}

// Get initial collapsed state from localStorage
const getInitialSidebarCollapsed = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED)
        return raw === 'true'
    } catch (e) {
        return false
    }
}

const initialState = {
    theme: getInitialTheme(),
    sidebarOpen: true,
    // desktop collapsed state (compact sidebar) - persisted
    sidebarCollapsed: getInitialSidebarCollapsed(),
    modalOpen: false,
    modalContent: null,
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme: state => {
            state.theme = state.theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
            localStorage.setItem(STORAGE_KEYS.THEME, state.theme)

            // Apply theme class to document
            if (state.theme === THEMES.LIGHT) {
                document.body.classList.add('light')
            } else {
                document.body.classList.remove('light')
            }
        },
        setTheme: (state, action) => {
            state.theme = action.payload
            localStorage.setItem(STORAGE_KEYS.THEME, state.theme)

            // Apply theme class to document
            if (state.theme === THEMES.LIGHT) {
                document.body.classList.add('light')
            } else {
                document.body.classList.remove('light')
            }
        },
        toggleSidebar: state => {
            state.sidebarOpen = !state.sidebarOpen
        },
        toggleSidebarCollapsed: state => {
            state.sidebarCollapsed = !state.sidebarCollapsed
            try { localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(state.sidebarCollapsed)) } catch (e) {}
        },
        setSidebarCollapsed: (state, action) => {
            state.sidebarCollapsed = !!action.payload
            try { localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(state.sidebarCollapsed)) } catch (e) {}
        },
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload
        },
        openModal: (state, action) => {
            state.modalOpen = true
            state.modalContent = action.payload
        },
        closeModal: state => {
            state.modalOpen = false
            state.modalContent = null
        },
    },
})

export const {
    toggleTheme,
    setTheme,
    toggleSidebar,
    toggleSidebarCollapsed,
    setSidebarCollapsed,
    setSidebarOpen,
    openModal,
    closeModal,
} = uiSlice.actions

export default uiSlice.reducer
