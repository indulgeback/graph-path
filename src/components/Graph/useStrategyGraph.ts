import { ref } from 'vue'
import { GraphManager } from '@/components/Graph/GraphManager'
import { Graph } from '@antv/x6'

const useStrategyGraph = () => {
  const graphInstance = ref<Graph>()
  const graphManager = new GraphManager()
  const currentSelectedNodeIndex = ref(0)

  const initStrategyGraph = (containerId: string) => {
    graphManager.initGraph(containerId)
    graphInstance.value = graphManager.graph as Graph
    initEvents()
    resetNodeSelectable()
  }

  const initEvents = () => {
    graphInstance.value?.on('node:click', (args) => {
      const nodes = graphInstance.value?.getNodes()
      const node = args.node
      if (node.prop('data/canSelect')) {
        nodes?.forEach((n) => {
          if (n.prop('data/canSelect')) {
            n.prop('data/isSelected', false)
          }
          n.prop('data/showTag', false)
          n.prop('data/endType', '')
          n.prop('data/color', '')
        })
        node.prop('data/isSelected', true)
        node.prop('data/showTag', true)
        node.prop('data/color', '#1890ff')
        node.prop(
          'data/endType',
          !currentSelectedNodeIndex.value ? '始' : currentSelectedNodeIndex.value,
        )
      }
    })
  }

  const resetNodeSelectable = (mode: 'start' | 'path' = 'start', index: number = 0) => {
    const canSelectNodeTypes = ['validator', 'receiver', 'extend']
    const nodes = graphInstance.value?.getNodes()
    currentSelectedNodeIndex.value = index

    const isModeNode = (type: string) => {
      if (mode === 'start') {
        return canSelectNodeTypes.includes(type)
      } else {
        return type === 'receiver'
      }
    }

    nodes?.forEach((node) => {
      const type = node.prop('data/type')
      node.prop('data/showTag', false)
      node.prop('data/endType', '')
      node.prop('data/color', '')
      node.prop('data/isSelected', false)

      if (isModeNode(type)) {
        node.prop('data/canSelect', true)
      } else {
        node.prop('data/canSelect', false)
      }
    })
  }

  return {
    graphInstance,
    initStrategyGraph,
    resetNodeSelectable,
  }
}

export default useStrategyGraph
