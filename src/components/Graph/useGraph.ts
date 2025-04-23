import { Graph, Edge, Vector, Node } from '@antv/x6'
import { ref } from 'vue'
import CustomNode from '@/components/Node/index.vue'
import { createVNode } from 'vue'
import {
  DEFAULT_EDGE_CONFIG,
  DEFAULT_GRAPH_CONFIG,
  DEFAULT_PORT_CONFIG,
  PORT_CONFIG,
} from './shape'
import { NODE_CONFIGS, EDGE_CONFIGS } from '@/config/graph'
import { STRATEGY_CONFIGS } from '@/config/strategies'
import { SearchMode, findAllPaths } from './utils'

export type Strategy = {
  strategyId: number
  strategySource: Node
  strategyTarget: Node[]
  strategyPaths: Edge[][]
  strategyColor: string
}

// 新增类型定义
type AnimationToken = {
  element: Vector
  edge: Edge
}

// 新增节点配置类型
type NodeConfig = {
  x: number
  y: number
  label: string
  type: 'validator' | 'safe' | 'receiver'
  endType?: string
  showTag?: boolean
  isEnd?: boolean
}

const useGraph = () => {
  Graph.registerEdge('arrow', { ...DEFAULT_EDGE_CONFIG }, true)

  Graph.registerNode(
    'custom-node',
    {
      inherit: 'vue-shape',
      x: 100,
      y: 100,
      width: 150,
      height: 100,
      component: {
        render: () => createVNode(CustomNode),
      },
      ports: {
        ...DEFAULT_PORT_CONFIG,
      },
    },
    true,
  )

  const graphInstance = ref<Graph>()
  const edges = ref<Edge[]>([])
  const strategyList = ref<Strategy[]>([])
  const findPathMode = ref<SearchMode>(SearchMode.DFS)

  // 在 useGraph 函数内添加状态管理
  const animationStore = ref<Map<number, AnimationToken[]>>(new Map())
  const nodeMap = new Map<string, Node>()

  /**
   * 创建节点
   * @param config 节点配置
   * @returns 创建的节点实例
   */
  const createNode = (config: NodeConfig): Node => {
    return graphInstance.value!.addNode({
      x: config.x,
      y: config.y,
      width: 130,
      height: 50,
      shape: 'custom-node',
      data: {
        label: config.label,
        type: config.type,
        showTag: config.showTag ?? false,
        isEnd: config.isEnd ?? false,
        endType: config.endType ?? '',
      },
      ports: [...PORT_CONFIG],
    }) as Node
  }

  const initGraph = () => {
    // 创建一个图实例
    graphInstance.value = new Graph({
      container: document.getElementById('container') as HTMLElement,
      ...DEFAULT_GRAPH_CONFIG,
    })

    // 创建节点映射表
    NODE_CONFIGS.forEach((config) => {
      const node = createNode({
        x: config.x,
        y: config.y,
        label: config.label,
        type: config.type,
        endType: config.endType,
        isEnd: config.isEnd,
      })
      nodeMap.set(config.id, node)
    })

    // 批量创建边
    EDGE_CONFIGS.forEach((edgeConfig) => {
      const source = nodeMap.get(edgeConfig.source.cell)
      const target = nodeMap.get(edgeConfig.target.cell)
      if (source && target) {
        addEdge(source, target, edgeConfig.source.port, edgeConfig.target.port)
      }
    })

    initStrategy()
  }

  /**
   * 初始化策略路径
   *
   */
  // 初始化策略
  const initStrategy = () => {
    // 去掉重复的路径节点
    const strategySet = STRATEGY_CONFIGS.map((config) => {
      return {
        ...config,
        targets: [...new Set(config.targets)],
      }
    })

    strategySet.forEach((config) => {
      const source = nodeMap.get(config.source)
      const targets = config.targets.map((id) => nodeMap.get(id)).filter(Boolean) as Node[]

      if (source && targets.length) {
        const paths = findAllPaths(source, targets, edges.value as Edge[], findPathMode.value)

        strategyList.value.push({
          strategyId: config.strategyId,
          strategySource: source,
          strategyTarget: targets,
          strategyPaths: paths,
          strategyColor: getColorByIndex(config.strategyId),
        })
      }
    })
  }

  /**
   * 显示策略
   * @param strategyId 策略ID
   */
  const showStrategy = (strategyId: number) => {
    // 先移除所有已有动画
    removeAllAnimations()

    const strategy = strategyList.value.find((s) => s.strategyId === strategyId)
    if (strategy) {
      const tokens: AnimationToken[] = []
      addPathAnimation(strategy.strategyPaths as Edge[][], strategy.strategyId, tokens)
      animationStore.value.set(strategyId, tokens)
    }

    strategy?.strategySource.prop('data/showTag', true)
    strategy?.strategySource.prop('data/color', getColorByIndex(strategyId))
    strategy?.strategySource.prop('data/endType', '始')
    strategy?.strategyTarget.forEach((target, index) => {
      target.prop('data/showTag', true)
      target.prop('data/color', getColorByIndex(strategyId))
      target.prop('data/endType', index + 1)
    })
  }

  /**
   * 移除策略动画
   * @param strategyId 策略ID
   */
  const removeAnimation = (strategyId: number) => {
    const tokens = animationStore.value.get(strategyId)
    if (tokens) {
      tokens.forEach(({ element, edge }) => {
        element.remove()
        edge.attr({
          line: {
            stroke: '#b1b8c0', // 恢复默认颜色
            strokeWidth: 1,
          },
        })
      })
      animationStore.value.delete(strategyId)
    }
  }

  /**
   * 移除所有策略动画
   */
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

  /**
   * 添加边
   * @param source 源节点
   * @param target 目标节点
   */
  const addEdge = (source: Node, target: Node, sourcePort: string, targetPort: string) => {
    const edge = graphInstance.value?.addEdge({
      source: {
        cell: source,
        port: sourcePort,
      },
      target: {
        cell: target,
        port: targetPort,
      },
      shape: 'arrow',
      connector: { name: 'rounded' },
      attrs: {
        line: {
          stroke: '#b1b8c0',
          strokeWidth: 1,
        },
      },
    })
    edges.value.push(edge as Edge)
  }

  /**
   * 添加路径动画
   * @param allPaths 所有路径
   * @param strategyId 策略ID
   * @param tokens 动画token列表
   */
  const addPathAnimation = (
    allPaths: Edge[][],
    strategyId: number,
    tokens: AnimationToken[] = [],
  ) => {
    allPaths.forEach((pathEdges) => {
      const color = getColorByIndex(strategyId)
      pathEdges.forEach((edge) => {
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
      })
    })
  }

  /**
   * 创建动画token
   * @param edge 边
   * @param color 颜色
   * @returns 动画token
   */
  const createAnimationToken = (edge: Edge, color: string): AnimationToken | null => {
    const view = graphInstance.value?.findViewByCell(edge)
    const path = view?.findOne('line') as SVGPathElement
    if (!path) return null

    // 创建一个SVG的circle
    const token = Vector.create('circle', {
      r: 6,
      fill: color,
      filter: 'url(#glow)',
    })

    // 沿着路径动画
    token.animateAlongPath(
      {
        dur: '5s',
        repeatCount: 'indefinite',
      },
      path,
    )

    // 添加到路径的父元素
    token.appendTo(path.parentNode as SVGGElement)

    return { element: token, edge }
  }

  /**
   * 根据索引获取颜色
   * @param index 索引
   * @returns 颜色
   */
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

  /**
   * 清除策略
   */
  const clearStrategy = () => {
    removeAllAnimations()
  }

  /**
   * 设置搜索模式
   * @param mode 搜索模式
   */
  const setFindPathMode = (mode: SearchMode) => {
    strategyList.value = []
    findPathMode.value = mode
    clearStrategy()
    initStrategy()
  }

  return {
    graphInstance,
    initGraph,
    showStrategy,
    strategyList: strategyList.value as Strategy[],
    clearStrategy,
    initStrategy,
    setFindPathMode,
  }
}

export default useGraph
