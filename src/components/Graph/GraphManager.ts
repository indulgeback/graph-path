import { Graph, Edge, Node } from '@antv/x6'
import CustomNode from '@/components/Node/index.vue'
import { createVNode } from 'vue'
import {
  DEFAULT_EDGE_CONFIG,
  DEFAULT_GRAPH_CONFIG,
  DEFAULT_PORT_CONFIG,
  PORT_CONFIG,
} from '@/components/Graph/shape'
import { NODE_CONFIGS, EDGE_CONFIGS } from '@/config/graph'

type NodeConfig = {
  x: number
  y: number
  label: string
  type: 'validator' | 'safe' | 'receiver' | 'extend'
  endType?: string
  showTag?: boolean
  isEnd?: boolean
  canSelect?: boolean
  isSelected?: boolean
}

export class GraphManager {
  public graph: Graph | null = null
  public edges: Edge[] = []
  public nodes: Map<string, Node> = new Map()

  constructor() {
    this.initGraphConfig()
  }

  private initGraphConfig() {
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
  }

  public initGraph(containerId: string) {
    this.graph = new Graph({
      container: document.getElementById(containerId) as HTMLElement,
      ...DEFAULT_GRAPH_CONFIG,
    })

    this.createNodes()
    this.createEdges()
  }

  private createNodes() {
    NODE_CONFIGS.forEach((config) => {
      const node = this.createNode({
        x: config.x,
        y: config.y,
        label: config.label,
        type: config.type,
        endType: config.endType,
        isEnd: config.isEnd,
      })
      this.nodes.set(config.id, node)
    })
  }

  private createNode(config: NodeConfig): Node {
    return this.graph!.addNode({
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
        canSelect: config.canSelect ?? false,
        isSelected: config.isSelected ?? false,
      },
      ports: [...PORT_CONFIG],
    }) as Node
  }

  private createEdges() {
    EDGE_CONFIGS.forEach((edgeConfig) => {
      const source = this.nodes.get(edgeConfig.source.cell)
      const target = this.nodes.get(edgeConfig.target.cell)
      if (source && target) {
        this.addEdge(source, target, edgeConfig.source.port, edgeConfig.target.port)
      }
    })
  }

  public addEdge(source: Node, target: Node, sourcePort: string, targetPort: string) {
    const edge = this.graph?.addEdge({
      source: {
        cell: source,
        port: sourcePort,
      },
      target: {
        cell: target,
        port: targetPort,
      },
      shape: 'arrow',
      attrs: {
        line: {
          stroke: '#b1b8c0',
          strokeWidth: 1,
        },
      },
    })
    this.edges.push(edge as Edge)
    return edge
  }
}
