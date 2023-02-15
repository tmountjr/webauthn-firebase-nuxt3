import { defineStore, acceptHMRUpdate } from 'pinia'

const THEME_LIGHT_ICON = 'mdi-weather-sunny'
const THEME_DARK_ICON = 'mdi-weather-night'

export const useThemeStore = defineStore('themeStore', () => {
  /** The current theme in use */
  const theme = ref('light')

  /**
   * Switch to the dark theme.
   */
  const useDarkTheme = (): void => {
    theme.value = 'dark';
  }

  /**
   * Switch to the light theme.
   */
  const useLightTheme = (): void => {
    theme.value = 'light'
  }

  /**
   * Toggle the theme between light and dark.
   */
  const toggleTheme = (): void => {
    if (theme.value == 'light') {
      useDarkTheme()
    } else {
      useLightTheme()
    }
  }

  /**
   * Choose which icon to display based on the theme.
   */
  const themeIcon = computed(() => {
    return theme.value === 'light'
      ? THEME_LIGHT_ICON
      : THEME_DARK_ICON
  })

  return {
    theme,
    toggleTheme,
    themeIcon
  }
}, { persist: true })

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThemeStore, import.meta.hot))
}