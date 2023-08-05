export const LocalStorage = {
  getItemStorage: (name: string) => {
    let result = localStorage.getItem(name)
    return result ? result : null
  },
  setItemStorage: (name: string, value: string) => {
    localStorage.setItem(name, value)
    return
  },
  removeItemStorage: (name: string) => {
    localStorage.removeItem(name)
    return
  },
  clear: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('profile')
    return
  }
}
