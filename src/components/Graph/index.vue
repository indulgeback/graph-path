<template>
  <div class="graph-container">
    <div class="graph-container-item" id="container"></div>
  </div>
  <Panel
    :strategyList="strategyList"
    @changeStrategy="showStrategy"
    @clearStrategy="clearStrategy"
    @setFindPathMode="setFindPathMode"
  />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useGraph from './useGraph'
import '@antv/x6-vue-shape'
import Panel from '../Panel/index.vue'
const { initGraph, showStrategy, strategyList, clearStrategy, setFindPathMode } = useGraph()

onMounted(() => {
  initGraph()
})
</script>

<style scoped>
.graph-container {
  height: 100vh;
}

.graph-container-item {
  width: 100%;
  height: 100%;
}
</style>
