import { defineStore } from 'pinia'

export const useThemeStore = defineStore('ThemeStore', () => {
  const theme = ref('light')

  function useDarkTheme() {
    theme.value = 'dark'
  }

  function useLightTheme() {
    theme.value = 'light'
  }

  function toggleTheme() {
    if (theme.value == 'light') {
      useDarkTheme()
    } else {
      useLightTheme()
    }
  }

  return { theme, useDarkTheme, useLightTheme, toggleTheme }
})
