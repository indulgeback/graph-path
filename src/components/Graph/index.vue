<template>
  <div class="graph-container">
    <div class="graph-container-item" id="graph-container1"></div>
    <PathPanel
      :strategyList="strategyList"
      @changeStrategy="showStrategy"
      @clearStrategy="clearStrategy"
    />
  </div>
  <div class="graph-container">
    <div class="graph-container-item" id="graph-container2"></div>
    <StrategyPanel @selectNode="resetNodeSelectable" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import usePathGraph from '@/components/Graph/usePathGraph'
import useStrategyGraph from '@/components/Graph/useStrategyGraph'
import '@antv/x6-vue-shape'
import PathPanel from '@/components/Panel/PathPanel.vue'
import StrategyPanel from '@/components/Panel/StrategyPanel.vue'

const { initPathGraph, showStrategy, strategyList, clearStrategy } = usePathGraph()
const { initStrategyGraph, resetNodeSelectable } = useStrategyGraph()

onMounted(() => {
  initPathGraph('graph-container1')
  initStrategyGraph('graph-container2')
})
</script>

<style scoped>
.graph-container {
  height: 50vh;
  position: relative;
  border: 1px solid #000;
}

.graph-container-item {
  width: 100%;
  height: 100%;
}
</style>
