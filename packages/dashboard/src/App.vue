<template>
  <div id="app">
    <div id="nav">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/upload">Upload Dropzone</RouterLink>
    </div>
    <RouterView :sharedData="sharedData" />
  </div>
</template>

<script>
import { onMounted, watch } from '@vue/runtime-core'
import { useRouter, useRoute } from 'vue-router'
export default {
  name: 'App',
  components: {},
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
      default: () => ({}),
    },
  },
  setup(props) {
    const { basePath, currentPath, isMemoryHistory, onNavigate, sharedData } = props
    const router = useRouter()
    const route = useRoute()

    function onRouteChange(newPath) {
      onNavigate && onNavigate(basePath + newPath)
    }

    watch(() => route.path, onRouteChange)

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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-bottom: 10px;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
