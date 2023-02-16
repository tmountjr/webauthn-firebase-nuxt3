export default defineNuxtRouteMiddleware((_to, _from) => {
  const authUserStore = useAuthUserStore()

  if (!authUserStore.isAuthenticated) {
    return navigateTo('/login')
  }
})