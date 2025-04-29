import { ref } from 'vue'
import { GraphManager } from '@/components/Graph/GraphManager'
import { Graph } from '@antv/x6'

// 用于跟踪不同模式下的已标记节点
// key: 'start' 或 数字 (表示路径节点索引)，value: 节点ID
const markedNodesMap = ref<Map<string | number, string>>(new Map())

const useStrategyGraph = () => {
  const graphInstance = ref<Graph>()
  const graphManager = new GraphManager()
  const currentSelectedNodeIndex = ref(0)
  // 当前选择模式: 'start' 表示选择起始节点, number 表示选择路径节点索引
  const currentMode = ref<'start' | number>('start')

  const initStrategyGraph = (containerId: string) => {
    graphManager.initGraph(containerId)
    graphInstance.value = graphManager.graph as Graph
    initEvents()
    resetNodeSelectable()
  }

  // 更新所有节点的显示状态
  const updateNodesDisplay = () => {
    const nodes = graphInstance.value?.getNodes()
    if (!nodes) return

    // 先重置所有节点的选中状态
    nodes.forEach((node) => {
      node.prop('data/isSelected', false)
      node.prop('data/showTag', false)
      node.prop('data/endType', '')
      node.prop('data/color', '')
    })

    // 根据标记映射恢复已标记节点的显示
    markedNodesMap.value.forEach((nodeId, mode) => {
      const node = nodes.find((n) => n.id === nodeId)
      if (node) {
        node.prop('data/showTag', true)
        node.prop('data/color', '#1890ff')
        // 所有已标记的节点都设置为选中状态
        node.prop('data/isSelected', true)

        // 设置适当的endType
        if (mode === 'start') {
          node.prop('data/endType', '始')
        } else {
          node.prop('data/endType', mode)
        }
      }
    })
  }

  const initEvents = () => {
    graphInstance.value?.on('node:click', (args) => {
      const node = args.node
      const nodeId = node.id

      if (node.prop('data/canSelect')) {
        // 更新当前模式下的标记节点
        markedNodesMap.value.set(currentMode.value, nodeId)

        // 更新节点显示
        updateNodesDisplay()
      }
    })
  }

  const resetNodeSelectable = (mode: 'start' | 'path' = 'start', index: number = 0) => {
    const canSelectNodeTypes = ['validator', 'receiver', 'extend']
    const nodes = graphInstance.value?.getNodes()

    // 设置当前选择模式和索引
    currentSelectedNodeIndex.value = index
    currentMode.value = mode === 'start' ? 'start' : index

    // 如果切换到新模式，确保该模式下没有已选节点时，清除该模式的标记
    if (!markedNodesMap.value.has(currentMode.value)) {
      markedNodesMap.value.delete(currentMode.value)
    }

    const isModeNode = (type: string) => {
      if (mode === 'start') {
        return canSelectNodeTypes.includes(type)
      } else {
        return type === 'receiver'
      }
    }

    // 重置节点可选状态
    nodes?.forEach((node) => {
      const type = node.prop('data/type')
      node.prop('data/canSelect', isModeNode(type))
    })

    // 更新所有节点的显示
    updateNodesDisplay()
  }

  const clearSelectedNodes = () => {
    markedNodesMap.value.clear()
    updateNodesDisplay()
  }

  return {
    graphInstance,
    initStrategyGraph,
    resetNodeSelectable,
    clearSelectedNodes,
  }
}

export default useStrategyGraph
