<template>
  <div class="graph-container">
    <h1 class="graph-container-title">PathGraph</h1>
    <div class="graph-container-item" id="graph-container1"></div>
    <PathPanel
      :strategyList="strategyList"
      @changeStrategy="showStrategy"
      @clearStrategy="clearStrategy"
    />
  </div>
  <div class="graph-container">
    <h1 class="graph-container-title">StrategyGraph</h1>
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
  height: 80vh;
  position: relative;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.graph-container + .graph-container {
  margin-top: 20px;
}

.graph-container-item {
  width: 100%;
  height: 100%;
}

.graph-container-title {
  text-align: center;
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
}
</style>
