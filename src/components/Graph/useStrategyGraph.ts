import { ref } from 'vue'
import { GraphManager } from '@/components/Graph/GraphManager'
import { Graph } from '@antv/x6'

const useStrategyGraph = () => {
  const graphInstance = ref<Graph>()
  const graphManager = new GraphManager()

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
        })
        node.prop('data/isSelected', true)
      }
    })
  }

  const resetNodeSelectable = (mode: 'start' | 'path' = 'start') => {
    const canSelectNodeTypes = ['validator', 'receiver', 'extend']
    const nodes = graphInstance.value?.getNodes()

    const isModeNode = (type: string) => {
      if (mode === 'start') {
        return canSelectNodeTypes.includes(type)
      } else {
        return type === 'receiver'
      }
    }

    nodes?.forEach((node) => {
      const type = node.prop('data/type')

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
