# webpack 5 模块联邦实现微前端

微前端：将**巨大**的**单体**前端系统拆分成**多个独立**的小型系统，用户感知上还是一个系统的架构思路，**分而治之**，让系统更加容易维护、更易扩展，实施微前端是一个**先拆分**，**后合并**的过程。

> 这里的前端应用指的是前后端分离的单应用页面，在这基础才谈论微前端才有意义。


微前端的好处

1. 应用自治：各个应用相互独立，规模更小，更容易扩展、测试、构建、维护、排错、升级依赖等；
2. 团队自治：应用独立后，团队也会独立，减少很多人在一个巨石应用中同时开发，相互影响；
3. 技术无关：各个应用可选择不同的框架开发，**尽量保持统一**，否则应用之间交互会可能遇到麻烦，也不利于组件复用，比如无法功能组件级别的代码；

缺点：

1. 代码规范统一比较困难（人员多、项目多），容易克服
2. 开发时可能需要同时运行多个项目，容易克服
3. 集成测试比较困难
4. UI、交互等容易不统一，容易克服

相比微前端的优点，缺点基本可忽略不计。

实施建议：

1. 一致的工作方法：团队成员要达成一致的工作方法，尤其是宿主应用和远程应用之间的**交互协议**，需要提前约定好。
2. 结合业务：在使用为微前端架构之前，思考业务划分和微前端给团队给来的价值
3. 遵从一致的代码标准，方便后期维护
4. 不要过度使用：微前端适合生命周期长、团队人员多（3 人以上）、人员流动频繁、**多种业务（功能）聚合**的应用。

[微前端](https://swearer23.github.io/micro-frontends/)

[微前端](https://martinfowler.com/articles/micro-frontends.html)

## 常见的微前端实施方案

[MicroApp](https://micro-zoe.github.io/micro-app/)
## 模块联邦 -- Module Federation

模块联邦是 webpack5 引入的特性，能**轻易实现**在两个使用 webpack 构建的项目之间**共享代码**，甚
至**组合不同的应用为一个应用**。

[Module Federation 官网](https://module-federation.github.io/)

### 应用之间如何共享数据

`函数调用`,函数调用的特点:

1. 在定义处获取到参数，在调用出获取到返回值，**参数**和**返回值**将定义处和调用处联系起来。
2. 函数没有其他依赖，非常容易扩展。

vue3 bootstrap

```js
import { createApp } from 'vue'
// import App from './components/Hello.vue'
import App from './App.vue'
import { setupRouter } from './route'
import { createRouter, createWebHistory, createMemoryHistory, RouteRecordRaw } from 'vue-router'

const mount = (el, { isMemoryHistory, basePath, currentPath, onNavigate, sharedData = {} }) => {
  // console.log(basePath)
  // console.log(onNavigate)
  // console.log('isMemoryHistory', isMemoryHistory, currentPath)
  const app = createApp(App, { basePath, currentPath, isMemoryHistory, onNavigate, sharedData })
  const history = isMemoryHistory ? createMemoryHistory(basePath) : createWebHistory()
  // console.log(history)
  // const url = new URL(window.location.href)
  // console.log('history.location', history.location, url.pathname)
  setupRouter(app, { history })
  // history.push('/upload')
  // FIXME　监听不起效
  // history.listen(onNavigate)
  app.mount(el)
  return {
    onParentNavigate({ pathname: nextPathname }) {
      console.log('dashboard vue onParentNavigate', nextPathname)
      history.listen(currentPath => {
        if (currentPath !== nextPathname) {
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

  if (devRoot) {
    mount(devRoot, { isMemoryHistory: false })
  }
}

// We are running through container
// and we should export the mount function
export { mount }
```

App.vue

```html
<template>
  <div id="app">
    <!-- <NotificationProvider> -->
    <div id="nav">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/upload">Upload Dropzone</RouterLink>
    </div>
    <RouterView :sharedData="sharedData" />
    <!-- </NotificationProvider> -->
  </div>
</template>

<script>
import { nextTick, onMounted, watch } from '@vue/runtime-core'
import { useRouter, useRoute } from 'vue-router'
// import { NotificationProvider } from './store'
export default {
  name: 'App',
  components: {
    // NotificationProvider,
  },
  props: {
    onNavigate: {
      type: Function,
    },
    basePath: {
      type: String,
      default: '/',
    },
    currentPath: {
      type: String,
      default: '/',
    },
    isMemoryHistory: {
      type: Boolean,
      default: false,
    },
    sharedData: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { basePath, currentPath, isMemoryHistory, onNavigate, sharedData } = props
    const router = useRouter()
    const route = useRoute()
    watch(
      () => route.path,
      (newPath) => {
        onNavigate && onNavigate(basePath + newPath)
      }
    )
    onMounted(() => {
      console.log('App vue mounted', basePath, currentPath, sharedData)
      let nextPath = currentPath
      if (currentPath.startsWith(basePath)) {
        //NOTE 默认去到首页
        nextPath = currentPath.replace(basePath, '') ?? '/'
      }
      // NOTE 如果是 memoryHistory，才跳转
      isMemoryHistory && router.push(nextPath)
    })
    return {}
  },
}
</script>

<style scoped lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-bottom: 10px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  &.router-link-exact-active {
    color: #42b983;
  }
}
</style>
```
route

```js
import { App } from 'vue'
import { createRouter, createWebHistory, createMemoryHistory, RouteRecordRaw } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('../views/Upload.vue'),
  },
]

export function setupRouter(app, { history = createWebHistory() } = {}) {
  const router = createRouter({
    // 4. Provide the history implementation to use.
    // We are using the hash history for simplicity here.
    // baseUrl: '/dashboard',
    // 最为子应用，使用内存history
    // https://next.router.vuejs.org/api/#creatememoryhistory
    history,
    routes, // short for `routes: routes`
  })
  app.use(router)
}

// export default router
```

container dashboard

```js
import { mount } from 'dashboard/DashboardApp'
import React, { useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

export default ({ isSignedIn, user }) => {
  const ref = useRef(null)
  const history = useHistory()
  useEffect(() => {
    const { onParentNavigate } = mount(ref.current, {
      isMemoryHistory: true,
      basePath: '/dashboard',
      currentPath: history.location.pathname,
      onNavigate: nextPathname => {
        const { pathname } = history.location
        if (pathname !== nextPathname) {
          console.log('vue 子应用跳转', nextPathname)
          history.push(nextPathname)
        }
      },
      sharedData: { isSignedIn, user },
    })
    console.log('container dashboard navigate')
    history.listen(onParentNavigate)
  }, [])

  return <div ref={ref} />
}
```
## 参考

[Webpack 5 and Module Federation - A Microfrontend Revolution](https://dev.to/marais/webpack-5-and-module-federation-4j1i)

[Webpack 5 Module Federation: A game-changer in JavaScript architecture](https://indepth.dev/posts/1173/webpack-5-module-federation-a-game-changer-in-javascript-architecture)

[webpack 5 模块联邦实现微前端疑难问题解决](https://blog.csdn.net/mjzhang1993/article/details/115871597)
