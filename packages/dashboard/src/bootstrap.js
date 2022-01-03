import { createApp } from 'vue'
// import App from './components/Hello.vue'
import App from './App.vue'
// Mount function to start up the app
import { setupRouter } from './route'
const mount = (el, { isMemoryHistory = false }) => {
  const app = createApp(App)
  setupRouter(app, { isMemoryHistory })
  app.mount(el)
}

// If we are in development and in isolation,
// call mount immediately
if (process.env.NODE_ENV === 'development') {
  const devRoot = document.querySelector('#dashboard-dev-root')

  if (devRoot) {
    mount(devRoot, {})
  }
}

// We are running through container
// and we should export the mount function
export { mount }
