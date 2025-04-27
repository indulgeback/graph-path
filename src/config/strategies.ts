export type StrategyConfig = {
  strategyId: number
  source: string // 起始节点ID
  targets: string[] // 路径点节点ID数组
}

export const STRATEGY_CONFIGS: StrategyConfig[] = [
  {
    strategyId: 1,
    source: 'validator',
    targets: ['receiver1'],
  },
  {
    strategyId: 2,
    source: 'validator',
    targets: ['receiver2'],
  },
  {
    strategyId: 3,
    source: 'validator',
    targets: ['receiver2', 'receiver3'],
  },
  {
    strategyId: 4,
    source: 'validator',
    targets: ['receiver5'],
  },
  {
    strategyId: 5,
    source: 'validator',
    targets: ['receiver2', 'receiver4', 'receiver3', 'receiver5'],
  },
  {
    strategyId: 6,
    source: 'validator',
    targets: ['receiver2', 'receiver2', 'receiver4', 'receiver4'],
  },
  {
    strategyId: 7,
    source: 'receiver1',
    targets: ['receiver2'],
  },
]
