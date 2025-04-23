<template>
  <div class="node-container">
    <div class="node-header-icon">
      <img :src="svgToDataURL(extendStr, '#ffffdd')" alt="extend" />
    </div>
    <div class="node-title">
      <div>{{ data.label }}</div>
      <div>{{ data.type }}</div>
    </div>
    <div class="x6-port-body" />
    <div
      class="node-tag"
      :style="{ backgroundColor: data.color }"
      v-if="data.showTag && data.isEnd"
    >
      {{ data.endType }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Node } from '@antv/x6'
import { inject, onMounted, ref } from 'vue'
import extendStr from '@/assets/icons/extend.svg?raw'

const getNode = inject<() => Node>('getNode')

type NodeData = {
  label: string
  type: string
  showTag: boolean
  isEnd: boolean
  endType: string
  color: string
}

const node = ref<Node | null>(null)
const data = ref<NodeData>({
  label: '',
  type: 'xxxx',
  showTag: false,
  isEnd: false,
  endType: '',
  color: '',
})

const svgToDataURL = (svgStr: string, fillColor?: string): string => {
  const encoded = encodeURIComponent(
    fillColor ? svgStr.replace(/fill="#([0-9a-fA-F]{6})"/g, `fill="${fillColor}"`) : svgStr,
  )
    .replace(/'/g, '%27')
    .replace(/"/g, '%22')

  const header = 'data:image/svg+xml,'
  return header + encoded
}

onMounted(() => {
  node.value = (getNode && getNode()) || null
  data.value = node.value?.getData() as NodeData
  node.value?.on('change:data', ({ current }) => {
    data.value = current
  })
})
</script>

<style scoped>
.node-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 2px 2px 5px 2px rgba(125, 133, 142, 0.15);
  transition: box-shadow 0.3s ease;
}

.node-container:hover {
  box-shadow: 2px 2px 5px 2px rgba(125, 133, 142, 0.3);
}

.node-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.x6-port circle:hover {
  opacity: 1 !important;
  stroke: #1890ff;
  stroke-width: 3px;
}

.node-tag {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  background-color: transparent;
  color: #fff;
  border-radius: 50%;
}
</style>
