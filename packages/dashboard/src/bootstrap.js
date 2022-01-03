import { createApp } from 'vue'
// import App from './components/Hello.vue'
import App from './App.vue'
import { setupRouter } from './route'

const mount = (el, { isMemoryHistory, basePath, currentPath }) => {
  console.log(basePath)
  console.log('isMemoryHistory', isMemoryHistory)
  const app = createApp(App, { basePath, currentPath, isMemoryHistory })
  setupRouter(app, { isMemoryHistory, basePath })
  app.mount(el)
  return {
    onParentNavigate({ pathname: nextPathname }) {
      // const { pathname } = history.location
      // if (pathname !== nextPathname) {
      //   // history.push(nextPathname)
      // }
      console.log('dashboard vue')
      console.log(nextPathname)
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
