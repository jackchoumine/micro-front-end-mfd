import { createApp } from 'vue'
// import App from './components/Hello.vue'
import App from './App.vue'
// Mount function to start up the app
import { setupRouter } from './route'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
// console.log(useRouter)
console.log('router')
console.log(router)
const mount = (el, { isMemoryHistory = false, basePath = '/' }) => {
  console.log(basePath)
  const app = createApp(App)
  setupRouter(app, { isMemoryHistory, basePath })
  console.log(router)
  // router.push('/upload')
  app.mount(el)
  return {
    onParentNavigate({ pathname: nextPathname }) {
      // const { pathname } = history.location
      // if (pathname !== nextPathname) {
      //   // history.push(nextPathname)
      // }
      console.log(nextPathname)
    },
  }
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
