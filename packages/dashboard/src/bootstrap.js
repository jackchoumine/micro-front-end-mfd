import { createApp } from 'vue'
// import App from './components/Hello.vue'
import App from './App.vue'
import { setupRouter } from './route'
import { createRouter, createWebHistory, createMemoryHistory, RouteRecordRaw } from 'vue-router'

const mount = (el, { isMemoryHistory, basePath, currentPath, onNavigate }) => {
  console.log(basePath)
  console.log(onNavigate)
  console.log('isMemoryHistory', isMemoryHistory, currentPath)
  const app = createApp(App, { basePath, currentPath, isMemoryHistory })
  const history = isMemoryHistory ? createMemoryHistory(basePath) : createWebHistory()
  console.log(history)
  const url = new URL(window.location.href)
  console.log('history.location', history.location, url.pathname)
  setupRouter(app, { history })
  // history.push('/upload')
  history.listen(onNavigate)
  app.mount(el)
  return {
    onParentNavigate({ pathname: nextPathname }) {
      console.log('dashboard vue onParentNavigate', nextPathname)
      history.listen((currentPath) => {
        if (currentPath !== nextPathname) {
          console.log(currentPath)
          history.push(nextPathname)
        }
      })
    },
  }
}

// If we are in development and in isolation,
// call mount immediately
if (process.env.NODE_ENV === 'development') {
  const devRoot = document.querySelector('#dashboard-dev-root')
  // const url = new URL(window.location.href)
  if (devRoot) {
    mount(devRoot, {})
  }
}

// We are running through container
// and we should export the mount function
export { mount }
