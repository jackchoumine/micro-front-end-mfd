<template>
  <div>
    <h1>home</h1>
    <p>是否登录：{{ sharedData.isSignedIn ? '是' : '否' }}</p>
    <p>用户名信息：{{ sharedData.user }}</p>
    <hr />
    <!-- <StencilRender :personArray="[{ name: 'stencil------' }]" /> -->
    <RouterLink to="/upload">upload page</RouterLink>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
// import TestStencil from './TestStencil.vue'
// import StencilRender from './StencilRender.jsx'

const maxValue = ref(5)
const value = ref(1)

defineProps({
  sharedData: {
    type: Object,
  },
})

onMounted(() => {
  console.log('Home mounted')
})
function changeRating() {
  maxValue.value = Math.max(Math.random() * 10, 5)
  value.value = Math.floor(Math.random() * maxValue.value)
}
function ratingChange(event) {
  console.log('rating changed', event.detail)
}
</script>
