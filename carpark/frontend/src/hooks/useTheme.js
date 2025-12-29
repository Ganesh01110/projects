import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { toggleTheme as toggleThemeAction, setTheme } from '@features/ui/uiSlice'
import { THEMES } from '@utils/constants'

/**
 * Custom hook for theme management
 */
export const useTheme = () => {
    const dispatch = useDispatch()
    const theme = useSelector(state => state.ui.theme)

    const isDark = theme === THEMES.DARK
    const isLight = theme === THEMES.LIGHT

    const toggleTheme = useCallback(() => {
        dispatch(toggleThemeAction())
    }, [dispatch])

    const setDarkTheme = useCallback(() => {
        dispatch(setTheme(THEMES.DARK))
    }, [dispatch])

    const setLightTheme = useCallback(() => {
        dispatch(setTheme(THEMES.LIGHT))
    }, [dispatch])

    // Apply theme class on mount
    useEffect(() => {
        if (theme === THEMES.LIGHT) {
            document.body.classList.add('light')
        } else {
            document.body.classList.remove('light')
        }
    }, [theme])

    return {
        theme,
        isDark,
        isLight,
        toggleTheme,
        setDarkTheme,
        setLightTheme,
    }
}

export default useTheme
