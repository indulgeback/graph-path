export type Edge = {
  source: string // 边的起始节点
  target: string // 边的目标节点
}

export type StrategyConfig = {
  strategyId: number
  sourceNode: string // 起始节点ID
  targetNodes: string[] // 目标节点ID数组
  edges: Edge[] // 单向边数组
}

export const STRATEGY_CONFIGS: StrategyConfig[] = [
  {
    strategyId: 1,
    sourceNode: 'validator',
    targetNodes: ['receiver1'],
    edges: [{ source: 'validator', target: 'receiver1' }],
  },
  {
    strategyId: 2,
    sourceNode: 'validator',
    targetNodes: ['receiver2'],
    edges: [{ source: 'validator', target: 'receiver2' }],
  },
  {
    strategyId: 3,
    sourceNode: 'validator',
    targetNodes: ['receiver2', 'receiver3'],
    edges: [
      { source: 'validator', target: 'receiver2' },
      { source: 'receiver2', target: 'receiver3' },
    ],
  },
  {
    strategyId: 4,
    sourceNode: 'validator',
    targetNodes: ['receiver5'],
    edges: [{ source: 'validator', target: 'receiver5' }],
  },
  {
    strategyId: 5,
    sourceNode: 'validator',
    targetNodes: ['receiver2', 'receiver4', 'receiver3', 'receiver5'],
    edges: [
      { source: 'validator', target: 'receiver2' },
      { source: 'receiver2', target: 'receiver4' },
      { source: 'receiver4', target: 'receiver3' },
      { source: 'receiver3', target: 'receiver5' },
    ],
  },
  {
    strategyId: 6,
    sourceNode: 'validator',
    targetNodes: ['receiver2', 'receiver4', 'receiver3'],
    edges: [
      { source: 'validator', target: 'receiver2' },
      { source: 'receiver2', target: 'receiver4' },
      { source: 'receiver3', target: 'receiver4' },
    ],
  },
  {
    strategyId: 7,
    sourceNode: 'receiver1',
    targetNodes: ['receiver2'],
    edges: [{ source: 'receiver1', target: 'receiver2' }],
  },
  {
    strategyId: 8,
    sourceNode: 'validator',
    targetNodes: ['receiver2', 'receiver3', 'receiver4', 'receiver5'],
    edges: [
      { source: 'validator', target: 'receiver2' },
      { source: 'receiver2', target: 'receiver3' },
      { source: 'receiver3', target: 'receiver4' },
      { source: 'receiver4', target: 'receiver5' },
    ],
  },
]
