# webpack 5 模块联邦实现微前端

微前端：将**巨大**的**单体**前端系统拆分成**多个独立**的小型系统，用户感知上还是一个系统的架构思路，**分而治之**，让系统
更加容易维护、更易扩展，实施微前端是一个**先拆分**，**后合并**的过程。

> 这里的前端应用指的是**前后端分离**的**单页应用**，在这基础上谈论微前端才有意义。

> 微前端和微服务都是为了解决大项目和大团队的难题：大项目实现**模块解耦**，大团队实现**人员解耦**，这两大难题是《软件工程
> 》这门课程研究的主要问题。

> 康威定律：软件结构体现人员结构，人员结构决定软件结结构。

[阮一峰软件工程介绍](https://www.ruanyifeng.com/blog/2021/05/scaling-problem.html)

[微服务架构的理论基础 - 康威定律](https://developer.aliyun.com/article/8611)

[康威定律](https://marsonshine.github.io/MS.Microservice/docs/ConwayLaw.html)

## 为何需要微前端

巨石单体系统随着业务的增加，变得越来越臃肿，多个团队一起开发，沟通成功高，编译、部署、测试、维护困难，微前端可解决这些问
题。

1. 应用自治：各个应用相互独立，规模更小，更容易扩展、测试、构建、维护、排错、升级依赖等；
2. 团队自治：应用独立后，团队也会独立，减少很多人在一个巨石应用中同时开发，相互影响；
3. 技术无关：各个应用可选择不同的框架开发，**尽量保持统一**，否则应用之间交互会可能遇到麻烦，也不利于组件复用，比如无法
   功能组件级别的代码；
4. 尝试新技术：应用拆分后，可在系统里尝试新技术。
5. 老系统增量重构。

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
4. 不要过度使用：希望能实现拆分人员或者技术的目标，或者有必要拆分人员或者技术时才使用。

[微前端介绍](https://swearer23.github.io/micro-frontends/)

[关于微前端最早的讨论文章](https://martinfowler.com/articles/micro-frontends.html)

## 如何集成 --- 聚合

主要三种集成方式：

![三种集成](https://tva1.sinaimg.cn/large/008i3skNgy1gy5h55k4g9j31ci0oyae2.jpg)

| 集成方式   | 具体描述                                        | 优点                                                     | 缺点                                                                             | 其他                                     |
| ---------- | ----------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------- |
| 构建时集成 | 把微应用打包进入主应用，微应用通常以 npm 的发布 | 实施容易且很好理解                                       | 有依赖关系的应用之间，其中一个更新，另一个也要更新，然后部署，实际上无法独立部署 | 实际上这种方式并没有实现微前端的目标     |
| 运行时构建 | 主应用在浏览器加载后，再去获取微应用代码        | 独立部署，主应用能决定使用哪个微应用的版本，灵活，性能好 | 设置复杂，不好理解                                                               | 实现微前端的目标，**目前比较通用的方式** |
| 服务端集成 | 主应用向服务器请求微应用，服务器决定是否给代码  | 严重依赖后台代码                                         | 实现复杂，一般不使用                                                             |                                          |
|            |                                                 |                                                          |                                                                                  |                                          |

集成时需要考虑哪些问题？

1. 避免样式冲突

2. 应用之间通信方便

3. 方便在不同应用之间导航

4. 能集成特定版本

5. 版本控制不相互干扰

6. 能方便实现依赖共享

## 常见的微前端实施方案

微前端的架构方式出现后，业界出现一些框架和解决方案，常见的：

框架：

[MicroApp ](https://micro-zoe.github.io/micro-app/)、[single-spa](https://zh-hans.single-spa.js.org/docs/getting-started-overview)、[qiankuan](https://qiankun.umijs.org/zh)

无裤架的解决方案：

`web components` 不推荐，无法提供模块化功能，项目越大，越容易失控。

`iframe`

`webpack5 module federation` 模块联邦，webpack5 的一个新特性，可实现跨应用共享代码。

## 模块联邦 -- Module Federation

模块联邦是 webpack5 引入的特性，能**轻易实现**在两个使用 webpack 构建的项目之间**共享代码**，甚至**组合不同的应用为一个
应用**。

[Module Federation 官网](https://module-federation.github.io/)

### 模块联邦的配置

模块联邦可实现跨应用共享代码，以两个应用为例子说明其配置。

一个`dashboard` vue3 应用，希望提供代码给其他应用：

```js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin') // 导出模块联邦
// webpack 插件配置
{
plugins: [
    new ModuleFederationPlugin({
      name: 'dashboard', // exposeRemoteName  共享的模块名字，在消费该模块的应用中会用到
      filename: 'remoteEntry.js', // 远程加载的文件名字，在浏览器请求面板可看到，默认名字就是 remoteEntry.js
      exposes: {
        './DashboardApp': './src/bootstrap', // 从本应用暴露的共享模块,可共享多个模块 key 以 ./ 开头，value 指向本地的一个文件
      },
      shared: packageJson.dependencies, // 希望共享的依赖
    }),
  ],
}
```

`container` react 应用消费 dashboard

```js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
{
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',// 希望共享的模块，虽然 container 没有被其他应用消费，声明名字是一个好的做法
      remotes: {
        // marketing: 'marketing@http://localhost:8081/remoteEntry.js',
        // auth: 'auth@http://localhost:8082/remoteEntry.js',
        dashboard: 'dashboard@http://localhost:8083/remoteEntry.js',// 指定远程模块
        //NOTE remoteName:exposeRemoteName@fileOnRemoteServer
      },
      shared: packageJson.dependencies,// 希望共享的模块
    }),
  ],
}
```

> 如何在 container 使用 dashboard 呢？

在 container 中新建一个 `DashboardApp.jsx` 组件来引入 dashboard:

> dashboard 是 container 里 remotes 的字段 DashboardApp 是 dashboard 在 exposes 里暴露而 key 是 dashboard 里导出的一个挂
> 载函数，可在 container 将该应用挂载到任何地方

```jsx
import { mount } from 'dashboard/DashboardApp' // NOTE 注意这里的写法和配置的对应关系
import React, { useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

export default ({ isSignedIn, user }) => {
  const ref = useRef(null)
  const history = useHistory()
  useEffect(() => {
    // NOTE 通过 mount 把 dashboard 挂载到 div 上，这些参数和返回值是实现数据共享的方式，稍后细说
    const { onParentNavigate } = mount(ref.current, {
      isMemoryHistory: true,
      basePath: '/dashboard',
      currentPath: history.location.pathname,
      onNavigate: (nextPathname) => {
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

然后将该组件导出，放在`/dashboard`路径下，就可导航到 dashboard 了：

```jsx
import React, { lazy, Suspense, useState, useEffect } from 'react'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'
import { createBrowserHistory } from 'history'

import { Progress, Header } from './components'

const MarketingLazy = lazy(() => import('./components/MarketingApp'))
const AuthLazy = lazy(() => import('./components/AuthApp'))
const DashboardLazy = lazy(() => import('./components/DashboardApp'))

const generateClassName = createGenerateClassName({
  productionPrefix: 'co',
})

const history = createBrowserHistory()

export default () => {
  const [isSignedIn, setIsSignedIn] = useState(window.localStorage.getItem('isSignedIn') === 'true')
  const [user, setUser] = useState(JSON.parse(window.localStorage.getItem('user')))

  useEffect(() => {
    if (isSignedIn) {
      history.push('/dashboard')
    }
  }, [isSignedIn])

  return (
    <Router history={history}>
      <StylesProvider generateClassName={generateClassName}>
        <div>
          <Header
            onSignOut={() => {
              window.localStorage.removeItem('isSignedIn')
              window.localStorage.removeItem('user')
              window.sessionStorage.removeItem('user')
              setIsSignedIn(false)
            }}
            isSignedIn={isSignedIn}
          />
          <Suspense fallback={<Progress />}>
            <Switch>
              <Route path='/auth'>
                <AuthLazy
                  onSignIn={(user) => {
                    setUser(user)
                    // 使用本地存储
                    window.sessionStorage.setItem('user', JSON.stringify(user))
                    window.localStorage.setItem('user', JSON.stringify(user))
                    window.localStorage.setItem('isSignedIn', JSON.stringify(true))
                    setIsSignedIn(true)
                  }}
                />
              </Route>
              <Route path='/dashboard'>
                {/* {!isSignedIn && <Redirect to='/' />} */}
                <DashboardLazy user={user} isSignedIn={isSignedIn} />
              </Route>
              <Route path='/' component={MarketingLazy} />
            </Switch>
          </Suspense>
        </div>
      </StylesProvider>
    </Router>
  )
}
```

> dashboard 暴露出来的模块是怎样的呢？

dashboard 里 `bootstrap.js`

```js
import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './route'
import { createWebHistory, createMemoryHistory } from 'vue-router'

function mount(el, { isMemoryHistory, basePath, currentPath, onNavigate, sharedData = {} }) {
  const app = createApp(App, { basePath, currentPath, isMemoryHistory, onNavigate, sharedData })
  const history = isMemoryHistory ? createMemoryHistory(basePath) : createWebHistory()

  setupRouter(app, { history })

  app.mount(el)

  return {
    onParentNavigate({ pathname: nextPathname }) {
      console.log('dashboard vue onParentNavigate', nextPathname)
      history.listen((currentPath) => {
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

关键点：

① 提供一个`mount`函数，导出该函数，让消费该模块的应用能任意挂载它，在独立部署和开发环境下，调用该函数实现应用挂载到页面
上。

② 合理设计 mount 的**参数**和**返回值**，以实现应用之间**共享数据**、**路由切换**等。

### 如何避免 container 和 dashboard 路由导航冲突问题？

为了实现独立部署能切换页面，各个微应要有自己的导航，container 也有自己的导航， container 加载 dashboard 之后，如何解决导
航冲突？

> 为何会有导航冲突？

**一个路径只能对应一个页面**：同一个时刻，浏览器只有一个路径，该路径对应一个页面或者组件，切换到该路径时，渲染该页面或者
组件。

vue-router 提供了 web 路由和内存路由，使用 web 路由时，切换应用的路径，浏览器地址栏会变化，浏览器地址变化，应用里渲染的
组件的也会变化；使用内存导航时，地址栏和应用内的组件渲染脱离关系。

> 为何会有内存路由？为了适用非浏览器环境。

> vue 和 react 有这两种路由。

> 微应用单独部署时，使用 web 路由，集成到 container 时，使用内存路由，web 路由由 container 接管，浏览器地址栏变化时，告
> 诉集成进来的微应用，然后微应用再跳转到相应的页面。

dashboard 的 路由配置:

```js
import { createRouter, createWebHistory } from 'vue-router'

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

// 导出路由配置函数，默认使用 web 路由
export function setupRouter(app, { history = createWebHistory() } = {}) {
  const router = createRouter({
    history,
    routes,
  })
  app.use(router)
}
```

如何在 mount 中使用 setupRouter 呢？

关键代码：

```js
// 传递一个 isMemoryHistory 标识，说明使用的路由
function mount(el, { isMemoryHistory }) {
  // el 是应用挂载的元素
  const history = isMemoryHistory ? createMemoryHistory(basePath) : createWebHistory()
  setupRouter(app, { history }) // app 是 createApp 的返回值
}
```

单独部署和开发时，使用 web 路由：

```js
// If we are in development and in isolation,
// call mount immediately
if (process.env.NODE_ENV === 'development') {
  const devRoot = document.querySelector('#dashboard-dev-root')

  if (devRoot) {
    // NOTE 使用 web 路由
    mount(devRoot, { isMemoryHistory: false })
  }
}
```

> 集成时使用内存路由，同时还需要检测浏览器路径是否变化，在变化时切换路由，否则 container 导航时，dashboard 不会变化。

在 `App.vue` 中实现跳转过程：

```html
<script>
  import { onMounted, watch } from '@vue/runtime-core'
  import { useRouter, useRoute } from 'vue-router'
  export default {
    name: 'App',
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
    },
    setup(props) {
      const { basePath, currentPath, isMemoryHistory, onNavigate } = props
      const router = useRouter()
      const route = useRoute()

      // NOTE 路由有变化且提供了跳转函数，才跳转
      function onRouteChange(newPath) {
        onNavigate && onNavigate(basePath + newPath)
      }

      watch(() => route.path, onRouteChange)

      onMounted(() => {
        console.log('App vue mounted', basePath, currentPath)
        let nextPath = currentPath
        if (currentPath.startsWith(basePath)) {
          //NOTE 默认去到首页
          nextPath = currentPath.replace(basePath, '') ?? '/'
        }
        // NOTE 如果是 memoryHistory，挂载时跳转到相应的组件，解决浏览器刷新，页面无法维持的问题
        isMemoryHistory && router.push(nextPath)
      })

      return {}
    },
  }
</script>
```

App 接收当前浏览器路径、基础路径（dashboard 在 container 中的路径）、是否时内存路由和跳转的具体方法，这些参数都是从
container 传递进来。

```js
function mount(el, { isMemoryHistory, basePath, currentPath, onNavigate, sharedData = {} }) {
  //NOTE basePath, currentPath, isMemoryHistory, onNavigate, 是 container 传递到 App.vue 的数据
  // onNavigate 是跳转函数，dashboard 路由变化是，通过该函数告知 container 跳转到哪儿
  const app = createApp(App, { basePath, currentPath, isMemoryHistory, onNavigate, sharedData })
  const history = isMemoryHistory ? createMemoryHistory(basePath) : createWebHistory()
  setupRouter(app, { history })
  app.mount(el)
}
```

> 这些参数时如何传递到 App 的呢？

在 container 应用中通过 mount 传递

```js
export default () => {
  const ref = useRef(null)
  const history = useHistory()
  useEffect(() => {
    mount(ref.current, {
      isMemoryHistory: true,
      basePath: '/dashboard',
      currentPath: history.location.pathname,
      onNavigate: (nextPathname) => {
        const { pathname } = history.location
        if (pathname !== nextPathname) {
          console.log('vue 子应用跳转', nextPathname)
          history.push(nextPathname)
        }
      },
    })
    console.log('container dashboard navigate')
  }, [])

  return <div ref={ref} />
}
```

以上办法实现了 dashboard 内路由跳转，通知 container 切换路径，当 container 切换路径时，需要通知 dashboard 跳转路径，如何
找到这一点？

可通过 mount 返回一个**函数**，该函数处理具体的跳转逻辑，由于 mount 在 container 内部调用，可以获取返回值，在 container
路由变化时，就调用该函数。

```js
function mount(el, { isMemoryHistory, basePath, currentPath, onNavigate, sharedData = {} }) {
  const history = isMemoryHistory ? createMemoryHistory(basePath) : createWebHistory()
  return {
    // pathname 时 container 传递过来的浏览器路径
    onParentNavigate({ pathname: nextPathname }) {
      console.log('dashboard vue onParentNavigate', nextPathname)
      // history.listen 时 vue-router 提供的函数，可监听路径变化，参数是一个回调函数，回调的时当前应用路径
      history.listen((currentPath) => {
        if (currentPath !== nextPathname) {
          history.push(nextPathname)
        }
      })
    },
  }
}
```

在 `DashboardApp.jsx` 中调用 onParentNavigate ：

```js
import { mount } from 'dashboard/DashboardApp'
import React, { useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

export default () => {
  const ref = useRef(null)
  const history = useHistory()
  useEffect(() => {
    const { onParentNavigate } = mount(ref.current, {})
    console.log('container dashboard navigate')
    history.listen(onParentNavigate) // container 的路径变化，然后调用 onParentNavigate
    // history.listen 是 react-router-dom 提供的函数，在地址栏变化时触发回调函数执行，回调函数的尝试时 history 对象
  }, [])

  return <div ref={ref} />
}
```

### 如何共享数据？

解决了路由冲突问题，应用如何共享数据呢？

> 还是通过 mount 传递。

mount 在 container 中调用，在 dashboard 中定义，那么就能在调用时传递 container 的数据到 dashboard 中。

mount 有一个 sharedData 字段，接受从 container 传递过来的参数，再通过 createApp 的第二个参数，传递到`App.vue`中。

```js
function mount(el, { sharedData = {} }) {
  const app = createApp(App, { sharedData })
}
```

`App.vue` 通过 props 接收 sharedData：

```html
<template>
  <div id="app">
    <div id="nav">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/upload">Upload Dropzone</RouterLink>
    </div>
    <!-- NOTE  给路由出口传递数据 -->
    <RouterView :sharedData="sharedData" />
  </div>
</template>
<script>
  import { onMounted } from '@vue/runtime-core'
  export default {
    name: 'App',
    props: {
      sharedData: {
        type: Object,
        default: () => ({}),
      },
    },
    setup(props) {
      const { sharedData } = props

      onMounted(() => {
        console.log('App vue mounted', sharedData)
      })

      return {}
    },
  }
</script>
```

> 特别提示，RouterView 可传递数据，然后在相应的路由组件中接收该数据。

在 container 的 `DashboardApp.jsx` 调用 mount

```jsx
// isSignedIn 和 user 时组件的 props
export default ({ isSignedIn, user }) => {
  const ref = useRef(null)
  useEffect(() => {
    const { onParentNavigate } = mount(ref.current, {
      sharedData: { isSignedIn, user },
    })
  }, [])

  return <div ref={ref} />
}
```

在 container 的路由配置中传递数据：

```jsx
<DashboardLazy user={user} isSignedIn={isSignedIn} />
```

### 如何实现样式隔离？

常见的样式作用域解决方案

1. 自定义 css

① css in js：会重新编译选择器。不同的项目使用相同的 css in js 库，生产环境下可能导致样式冲突。

原因：生产环境下，css in js 生成的类名短小，导致不同微前端应用之间类名相同，规则不同，导致冲突。

解决：使用不同的 css-in-js 库，或者查询其本地，配置自定义前缀。

比如 `@material-ui` 的 `createGenerateClassName` 可自定义类名前缀。

```jsx
import React from 'react'
import { Switch, Route, Router } from 'react-router-dom'
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'

import { Landing, Pricing } from './components'

const generateClassName = createGenerateClassName({
  productionPrefix: 'ma',
})

export default ({ history }) => {
  return (
    <div>
      <StylesProvider generateClassName={generateClassName}>
        <Router history={history}>
          <Switch>
            <Route exact path='/pricing' component={Pricing} />
            <Route path='/' component={Landing} />
          </Switch>
        </Router>
      </StylesProvider>
    </div>
  )
}
```

② vue 内置的 scoped 样式：给标签添加自定义属性

其他：给 css 添加 namespace: 设置特殊的选择器

2. css 库

css 样式库，自行构建，比较麻烦。

3. 相同的样式库不同的版本导致样式规则不同

① 类名相同规则不同导致样式不一致；

② 规则相同，类名不同导致样式失效。

解决办法：不同样式库不共享。

> 相比之下，vue scoped 和设置类名前缀是最方便的解决办法。

还有其他方案吗？

到此，解决了**路由导航**、**数据共享**和**样式冲突**问题，集成遇到的遇到的问题基本解决了，微前端架构实施是一个**先分后
合**的过程，下面聊聊如何分。

### 如何拆分微应用？

在拆分时，希望不同应用之间的**交互最小**为原则，最大程度解耦，以方便不同应用之间的通信，否则导致应用难以测试、问题难以定
位。

按照业务划分，相同的业务拆分到同一个微应用中。

按照权限划分，根据用户的权限，不同用户使用使用的功能划分到一起。

按照后台微服务划分，有的团队，后台使用微服务架构，可考虑按照微服务划分。

### 微应用用 react 开发，如何集成到 container?

以上和 vue3 集成到 container，react 应用如何集成到 container 呢？

思路和前面的类似，从 react 微应用导出 `mount`，同时也要处理路由到底、样式冲突等问题。

现在有一个 marketing 的 react 应用，希望集成到 container 到。

入口文件 `dashboard.js`

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { createMemoryHistory, createBrowserHistory } from 'history'
import App from './App'

// Mount function to start up the app
function mount(el, { onChildNavigate, defaultHistory, currentPathParent }) {
  const history =
    defaultHistory ||
    createMemoryHistory({
      initialEntries: [currentPathParent],
    })
  const { pathname: currentPathChild } = history.location
  // NOTE 浏览器刷新，应用会重新挂载，此时要保持路径和当前路径一致
  if (currentPathParent && currentPathChild && currentPathParent !== currentPathChild) {
    console.log('child history.push', currentPathParent)
    history.push(currentPathParent)
  }

  onChildNavigate && history.listen(onChildNavigate)

  ReactDOM.render(<App history={history} />, el)

  return {
    onParentNavigate({ pathname: nextPathname }) {
      const { pathname } = history.location

      nextPathname && pathname !== nextPathname && history.push(nextPathname)
    },
  }
}

// If we are in development and in isolation,
// call mount immediately
if (process.env.NODE_ENV === 'development') {
  const el = document.getElementById('_marketing-dev-root')
  const history = createBrowserHistory()
  el && mount(el, { defaultHistory: history })
}

// We are running through container
// and we should export the mount function
export { mount }
```

在 `index.js` 引入 `bootstrap.js`

```js
import('./bootstrap')
```

`webpack.dev.js` 配置

```js
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const commonConfig = require('./webpack.common')
const packageJson = require('../package.json')

const devConfig = {
  mode: 'development',
  output: {
    publicPath: 'http://localhost:8081/',
    clean: true, // build 之前清空 dist 目录
  },
  devServer: {
    port: 8081,
    historyApiFallback: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'marketing',
      filename: 'remoteEntry.js',
      exposes: {
        './MarketingApp': './src/bootstrap',
      },
      shared: packageJson.dependencies,
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
}

module.exports = merge(commonConfig, devConfig)
```

在 container 的`MarketingApp.jsx` 引入 marketing

```jsx
import { mount } from 'marketing/MarketingApp'
import React, { useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

export default () => {
  const ref = useRef(null)
  const history = useHistory()

  useEffect(() => {
    const { onParentNavigate } = mount(ref.current, {
      currentPathParent: history.location.pathname,
      onChildNavigate: ({ pathname: nextPathname }) => {
        console.log('marketing react: ', nextPathname)
        const { pathname } = history.location

        nextPathname && pathname !== nextPathname && history.push(nextPathname)
      },
    })

    history.listen(onParentNavigate)
  }, [])

  return <div ref={ref} />
}
```

在 container 路由中配置 `MarketingApp`

```jsx
import React, { lazy, Suspense, useState, useEffect } from 'react'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'
import { createBrowserHistory } from 'history'

import { Progress, Header } from './components'

const MarketingLazy = lazy(() => import('./components/MarketingApp'))

const generateClassName = createGenerateClassName({
  productionPrefix: 'co',
})

const history = createBrowserHistory()

export default () => {
  const [isSignedIn, setIsSignedIn] = useState(window.localStorage.getItem('isSignedIn') === 'true')
  const [user, setUser] = useState(JSON.parse(window.localStorage.getItem('user')))

  useEffect(() => {
    if (isSignedIn) {
      history.push('/dashboard')
    }
  }, [isSignedIn])

  return (
    <Router history={history}>
      <StylesProvider generateClassName={generateClassName}>
        <div>
          <Header
            onSignOut={() => {
              window.localStorage.removeItem('isSignedIn')
              window.localStorage.removeItem('user')
              window.sessionStorage.removeItem('user')
              setIsSignedIn(false)
            }}
            isSignedIn={isSignedIn}
          />
          <Suspense fallback={<Progress />}>
            <Switch>
              <Route path='/' component={MarketingLazy} />
            </Switch>
          </Suspense>
        </div>
      </StylesProvider>
    </Router>
  )
}
```

### 为何使用函数实现数据共享

`函数调用`，函数调用的特点:

1. 在**定义处**接收到**外部数据（通过参数）**，在*调用处*获取到*返回值*，**参数**和**返回值**将定义处和调用处联系起来。
2. 依赖少，函数设计适当，可有效降低依赖---最好的情况，只依赖参数，也非常容易扩展。
3. 函数是 js 代码，能在任意框架调用。

### 为何不导出组件，以实现在 container 中集成？

组件难以实现跨框架使用。

### 为何不适应状态管理库实现数据共享？

状态管理库要求同一个框架之间，难以实现技术无关。

即使使用同一种框架搭建微前端，也要避免使用状态管理库在不同应用之间共享数据，这增加了耦合。

### 集成方案和源码

```bash
container --- react
auth --- react
dashboard --- vue3
marketing --- react
```

[micro-front-end-mfd](https://github.com/jackchoumine/micro-front-end-mfd)

### 推荐教程

本文根据视频教
程[使用 React 的微前端，完整的开发指南 Microfrontends with React A Complete Developer's Guide](https://www.bilibili.com/video/BV1Yq4y1o7ab)整
理，强烈推荐，p43 --- p66 讲解 CICD 可跳过。

## 参考

[Webpack 5 and Module Federation - A Microfrontend Revolution](https://dev.to/marais/webpack-5-and-module-federation-4j1i)

[Webpack 5 Module Federation: A game-changer in JavaScript architecture](https://indepth.dev/posts/1173/webpack-5-module-federation-a-game-changer-in-javascript-architecture)

[webpack 5 模块联邦实现微前端疑难问题解决](https://blog.csdn.net/mjzhang1993/article/details/115871597)
