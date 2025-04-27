export type NodeConfig = {
  id: string
  x: number
  y: number
  label: string
  type: 'validator' | 'safe' | 'receiver' | 'extend'
  endType?: string
  isEnd?: boolean
}

export type EdgeConfig = {
  source: NodePortConfig
  target: NodePortConfig
}

type NodePortConfig = {
  cell: string
  port: 'left' | 'right' | 'top' | 'bottom'
}

export const NODE_CONFIGS: NodeConfig[] = [
  {
    id: 'validator',
    x: 200,
    y: 400,
    label: '验证端',
    type: 'validator',
    isEnd: true,
  },
  {
    id: 'extend',
    x: 100,
    y: 200,
    label: '扩展组件',
    type: 'extend',
    isEnd: true,
  },
  {
    id: 'safe1',
    x: 400,
    y: 300,
    label: '安全设备1',
    type: 'safe',
  },
  {
    id: 'safe2',
    x: 600,
    y: 600,
    label: '安全设备2',
    type: 'safe',
  },
  {
    id: 'safe3',
    x: 800,
    y: 100,
    label: '安全设备3',
    type: 'safe',
  },
  {
    id: 'receiver1',
    x: 1000,
    y: 300,
    label: '接收端1',
    type: 'receiver',
    isEnd: true,
  },
  {
    id: 'receiver2',
    x: 1200,
    y: 300,
    label: '接收端2',
    type: 'receiver',
    isEnd: true,
  },
  {
    id: 'receiver3',
    x: 1600,
    y: 500,
    label: '接收端3',
    type: 'receiver',
    isEnd: true,
  },
  {
    id: 'receiver4',
    x: 1400,
    y: 100,
    label: '接收端4',
    type: 'receiver',
    isEnd: true,
  },
  {
    id: 'receiver5',
    x: 1400,
    y: 700,
    label: '接收端5',
    type: 'receiver',
    isEnd: true,
  },
]

export const EDGE_CONFIGS: EdgeConfig[] = [
  { source: { cell: 'validator', port: 'top' }, target: { cell: 'safe1', port: 'left' } },
  { source: { cell: 'validator', port: 'bottom' }, target: { cell: 'safe2', port: 'left' } },
  { source: { cell: 'safe2', port: 'right' }, target: { cell: 'receiver5', port: 'left' } },
  { source: { cell: 'safe1', port: 'right' }, target: { cell: 'safe3', port: 'left' } },
  { source: { cell: 'safe3', port: 'right' }, target: { cell: 'receiver1', port: 'top' } },
  { source: { cell: 'validator', port: 'right' }, target: { cell: 'receiver1', port: 'left' } },
  { source: { cell: 'receiver4', port: 'bottom' }, target: { cell: 'receiver5', port: 'top' } },
  { source: { cell: 'receiver1', port: 'right' }, target: { cell: 'receiver2', port: 'left' } },
  { source: { cell: 'receiver2', port: 'top' }, target: { cell: 'receiver4', port: 'left' } },
  { source: { cell: 'receiver2', port: 'right' }, target: { cell: 'receiver3', port: 'left' } },
  { source: { cell: 'receiver4', port: 'right' }, target: { cell: 'receiver3', port: 'top' } },
  { source: { cell: 'receiver3', port: 'bottom' }, target: { cell: 'receiver5', port: 'right' } },
]
