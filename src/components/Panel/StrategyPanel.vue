<template>
  <div class="hidden-button" @click="togglePanelHidden">
    <ArrowDownCircle
      class="hidden-button-icon"
      :class="{ 'hidden-button-icon-hidden': panelHidden }"
    />
  </div>
  <div class="strategy-panel-container">
    <div class="panel-item">
      <div class="panel-item-title" @click="selectNode('start')">选择起始节点</div>
    </div>
    <div class="panel-item" v-for="node in 5" :key="node">
      <div class="panel-item-title" @click="selectNode('path', node)">选择路径节点 {{ node }}</div>
    </div>
    <div class="panel-item">
      <div class="panel-item-title" @click="clearSelectedNodes">清除已选节点</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import ArrowDownCircle from '~icons/mdi/arrow-down-circle'

const emit = defineEmits<{
  (e: 'selectNode', type: 'start' | 'path', node: number): void
  (e: 'clearSelectedNodes'): void
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

const panelHidden = ref(false)

const togglePanelHidden = () => {
  const panel = document.querySelector('.strategy-panel-container')
  if (panel) {
    panel.classList.toggle('hidden')
    panelHidden.value = !panelHidden.value
  }
}

const selectNode = (type: 'start' | 'path', node: number = 0) => {
  notyf.open({
    message: `开始选择 ${type === 'start' ? '起始' : '路径'} 节点 ${node === 0 ? '' : node}`,
    type: 'custom',
  })
  emit('selectNode', type, node)
}

const clearSelectedNodes = () => {
  emit('clearSelectedNodes')
}
</script>
<style scoped>
.strategy-panel-container {
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

.strategy-panel-container.hidden {
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
