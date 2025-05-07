import { Graph, Edge, Vector, Node } from '@antv/x6'
import { ref } from 'vue'
import { GraphManager } from '@/components/Graph/GraphManager'
import { STRATEGY_CONFIGS } from '@/config/strategies'
import { findMinimalSubGraph } from '@/components/Graph/utils'
import Swal from 'sweetalert2'

export type Strategy = {
  strategyId: number
  strategySource: Node
  strategyTarget: Node[]
  strategyPaths: Edge[][]
  strategyColor: string
}

type AnimationToken = {
  element: Vector
  edge: Edge
}

const usePathGraph = () => {
  const graphInstance = ref<Graph>()
  const graphManager = new GraphManager()
  const strategyList = ref<Strategy[]>([])
  const animationStore = ref<Map<number, AnimationToken[]>>(new Map())

  const initPathGraph = (containerId: string) => {
    graphManager.initGraph(containerId)
    graphInstance.value = graphManager.graph as Graph
    initStrategy()
    initEvents()
  }

  const initStrategy = () => {
    STRATEGY_CONFIGS.forEach((config) => {
      const strategyPaths: Edge[][] = []
      const sourceNode = graphManager.nodes.get(config.sourceNode)
      const allTargets: Node[] = config.targetNodes
        .map((targetId) => graphManager.nodes.get(targetId))
        .filter(Boolean) as Node[]

      // 处理策略中的每条边
      for (const edge of config.edges) {
        const sourceId = edge.source
        const targetId = edge.target

        // 获取起点和终点节点
        const source = graphManager.nodes.get(sourceId)
        const target = graphManager.nodes.get(targetId)

        // 如果找不到节点，跳过路径查找
        if (!source || !target) {
          continue
        }

        // 检查拓扑图中是否有从source到target的直接边
        const directEdges = graphManager.edges.filter(
          (e) => e.getSourceCell()?.id === sourceId && e.getTargetCell()?.id === targetId,
        )

        if (directEdges.length > 0) {
          // 如果有直接边，使用它们
          strategyPaths.push(directEdges)
        } else {
          // 如果没有直接边，找出从source到target的所有可能路径
          const paths = findMinimalSubGraph(source, [target], graphManager.edges)
          if (paths.length > 0) {
            strategyPaths.push(...paths)
          }
        }
      }

      // 只要有源节点和目标节点，就创建策略（即使没有路径）
      if (sourceNode && allTargets.length > 0) {
        strategyList.value.push({
          strategyId: config.strategyId,
          strategySource: sourceNode,
          strategyTarget: allTargets,
          strategyPaths: strategyPaths,
          strategyColor: getColorByIndex(config.strategyId),
        })
      }
    })
  }

  const initEvents = () => {
    graphInstance.value?.on('node:click', (e) => {
      Swal.fire({
        title: 'DEVICE INFO',
        text: `Device id: ${e.cell.prop('data/label')}\nDevice Type: ${e.cell.prop('data/type')}`,
        icon: 'success',
        confirmButtonText: 'Cool',
      })
    })
  }

  const showStrategy = (strategyId: number) => {
    if (animationStore.value.has(strategyId)) {
      animationStore.value.forEach((_, key) => {
        if (key !== strategyId) {
          removeAnimation(key)
        }
      })

      strategyList.value.forEach((strategy) => {
        if (strategy.strategyId !== strategyId) {
          strategy.strategySource.prop('data/showTag', false)
          strategy.strategySource.prop('data/color', '')
          strategy.strategyTarget.forEach((target) => {
            target.prop('data/showTag', false)
            target.prop('data/color', '')
            target.prop('data/endType', '')
          })
        }
      })

      const currentStrategy = strategyList.value.find((s) => s.strategyId === strategyId)
      if (currentStrategy) {
        updateNodeStyles(currentStrategy as Strategy)
      }
      return
    }

    removeAllAnimations()

    const strategy = strategyList.value.find((s) => s.strategyId === strategyId)
    if (strategy) {
      const tokens: AnimationToken[] = []
      addPathAnimation(strategy.strategyPaths as Edge[][], strategy.strategyId, tokens)
      animationStore.value.set(strategyId, tokens)
    }

    updateNodeStyles(strategy as Strategy)
  }

  const updateNodeStyles = (strategy?: Strategy) => {
    strategy?.strategySource.prop('data/showTag', true)
    strategy?.strategySource.prop('data/color', getColorByIndex(strategy.strategyId))
    strategy?.strategySource.prop('data/endType', '始')
    strategy?.strategyTarget.forEach((target, index) => {
      target.prop('data/showTag', true)
      target.prop('data/color', getColorByIndex(strategy.strategyId))
      target.prop('data/endType', index + 1)
    })
  }

  const addPathAnimation = (
    allPaths: Edge[][],
    strategyId: number,
    tokens: AnimationToken[] = [],
  ) => {
    // 创建一个集合来跟踪已经添加了动画的边的ID
    const animatedEdgeIds = new Set<string>()

    allPaths.forEach((pathEdges) => {
      const color = getColorByIndex(strategyId)
      pathEdges.forEach((edge) => {
        // 检查这条边是否已经添加了动画
        const edgeId = edge.id
        if (!animatedEdgeIds.has(edgeId)) {
          // 记录这条边已经添加了动画
          animatedEdgeIds.add(edgeId)

          const token = createAnimationToken(edge, color)
          if (token) {
            tokens.push(token)
            edge.attr({
              line: {
                stroke: color,
                strokeWidth: 2,
              },
            })
          }
        }
      })
    })
  }

  const createAnimationToken = (edge: Edge, color: string): AnimationToken | null => {
    const view = graphInstance.value?.findViewByCell(edge)
    const path = view?.findOne('line') as SVGPathElement
    if (!path) return null

    const token = Vector.create('circle', {
      r: 6,
      fill: color,
      filter: 'url(#glow)',
    })

    token.animateAlongPath(
      {
        dur: '5s',
        repeatCount: 'indefinite',
      },
      path,
    )

    token.appendTo(path.parentNode as SVGGElement)

    return { element: token, edge }
  }

  const removeAnimation = (strategyId: number) => {
    const tokens = animationStore.value.get(strategyId)
    if (tokens) {
      tokens.forEach(({ element, edge }) => {
        element.remove()
        edge.attr({
          line: {
            stroke: '#b1b8c0',
            strokeWidth: 1,
          },
        })
      })
      animationStore.value.delete(strategyId)
    }
  }

  const removeAllAnimations = () => {
    animationStore.value.forEach((_, key) => removeAnimation(key))
    strategyList.value.forEach((strategy) => {
      strategy.strategySource.prop('data/showTag', false)
      strategy.strategySource.prop('data/color', '')
      strategy.strategyTarget.forEach((target) => {
        target.prop('data/showTag', false)
        target.prop('data/color', '')
        target.prop('data/endType', '')
      })
    })
  }

  const getColorByIndex = (index: number) => {
    const colors = [
      '#ff4d4f',
      '#1890ff',
      '#52c41a',
      '#f56565',
      '#faad14',
      '#722ed1',
      '#f5222d',
      '#f59e0b',
      '#f53756',
    ]
    return colors[index % colors.length]
  }

  const clearStrategy = () => {
    removeAllAnimations()
  }

  return {
    graphInstance,
    initPathGraph,
    showStrategy,
    strategyList: strategyList.value as Strategy[],
    clearStrategy,
    graphManager,
  }
}

export default usePathGraph
