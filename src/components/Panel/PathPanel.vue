<template>
  <div class="hidden-button" @click="togglePanelHidden">
    <ArrowDownCircle
      class="hidden-button-icon"
      :class="{ 'hidden-button-icon-hidden': panelHidden }"
    />
  </div>
  <div class="path-panel-container">
    <div
      class="panel-item"
      v-for="strategy in strategyList"
      :key="strategy.strategyId"
      @click="changeStrategy(strategy.strategyId)"
    >
      <div class="panel-item-legend" :style="{ backgroundColor: strategy.strategyColor }"></div>
      <div class="panel-item-title">
        <span
          >策略 {{ strategy.strategyId }} : {{ strategy.strategySource.data.label }} -
          {{ strategy.strategyTarget.map((target) => target.data.label).join(' - ') }}</span
        >
      </div>
    </div>
    <div class="panel-item" @click="clearStrategy">
      <div class="panel-item-title">清除策略</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { toRefs, ref } from 'vue'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css' // for React, Vue and Svelte
import ArrowDownCircle from '~icons/mdi/arrow-down-circle'
import type { Strategy } from '@/components/Graph/usePathGraph'

const props = defineProps<{
  strategyList: Strategy[]
}>()

const emit = defineEmits<{
  (e: 'changeStrategy', strategyId: number): void
  (e: 'clearStrategy'): void
}>()

const notyf = new Notyf({
  duration: 2000,
  position: {
    x: 'right',
    y: 'top',
  },
  types: [
    {
      type: 'custom',
      background: 'linear-gradient(30deg, #f9d423, #ff4e50)',
    },
  ],
})
const { strategyList } = toRefs(props)
const panelHidden = ref(false)

const changeStrategy = (strategyId: number) => {
  notyf.open({
    message: `已切换至策略 ${strategyId}`,
    type: 'custom',
  })
  emit('changeStrategy', strategyId)
}

const clearStrategy = () => {
  notyf.open({
    message: '已清除所有策略',
    type: 'custom',
  })
  emit('clearStrategy')
}

const togglePanelHidden = () => {
  const panel = document.querySelector('.path-panel-container')
  if (panel) {
    panel.classList.toggle('hidden')
    panelHidden.value = !panelHidden.value
  }
}
</script>
<style scoped>
.path-panel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  transition: all 0.5s ease-in-out;
  max-height: 50%;
  overflow-y: auto;
}

.path-panel-container.hidden {
  opacity: 0;
  max-height: 0;
  padding: 0;
}

.panel-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  gap: 10px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.panel-item:hover {
  background-color: #f0f0f0;
  transform: scale(1.05);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
}

.panel-item-legend {
  width: 10px;
  aspect-ratio: 1/1;
  background-color: transparent;
  border-radius: 50%;
}

.panel-item-title {
  flex: 1;
  font-size: 12px;
  font-weight: 500;
  color: #333;
  user-select: none;
}

.hidden-button {
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: #333;
  user-select: none;
  padding: 10px;
  border-radius: 50%;
  background-color: #f0f0f0;
  transition: all 0.3s ease;
  position: absolute;
  bottom: 50px;
  left: 50px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-50%);
}

.hidden-button:hover {
  background-color: #ffffff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);

  .hidden-button-icon {
    width: 20px;
    height: 20px;
    color: #1890ff;
  }
}

.hidden-button-icon {
  width: 20px;
  height: 20px;
  transition: all 0.3s ease;
}

.hidden-button-icon-hidden {
  transform: rotate(540deg);
}
</style>
