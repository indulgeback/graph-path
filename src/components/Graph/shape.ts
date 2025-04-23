const PORT_ATTRS = {
  attrs: {
    circle: {
      r: 5,
      magnet: true,
      stroke: '#5F95FF',
      strokeWidth: 1,
      fill: '#fff',
      style: {
        visibility: 'hidden',
      },
    },
  },
}

export const DEFAULT_PORT_CONFIG = {
  groups: {
    top: {
      position: 'top',
      ...PORT_ATTRS,
    },
    right: {
      position: 'right',
      ...PORT_ATTRS,
    },
    bottom: {
      position: 'bottom',
      ...PORT_ATTRS,
    },
    left: {
      position: 'left',
      ...PORT_ATTRS,
    },
  },
  items: [
    {
      group: 'top',
    },
    {
      group: 'right',
    },
    {
      group: 'bottom',
    },
    {
      group: 'left',
    },
  ],
}

export const PORT_CONFIG = [{ id: 'top' }, { id: 'right' }, { id: 'bottom' }, { id: 'left' }]

export const DEFAULT_EDGE_CONFIG = {
  // 基类
  inherit: 'edge',
  markup: [
    {
      tagName: 'path',
      selector: 'wrap',
      attrs: {
        fill: 'none',
        cursor: 'pointer',
        stroke: 'transparent',
      },
    },
    {
      tagName: 'path',
      selector: 'line',
      attrs: {
        stroke: '#b1b8c0',
        strokeWidth: 1,
        fill: 'none',
        'pointer-events': 'none',
      },
    },
  ],
  attrs: {
    // 透明元素，用于响应交互
    wrap: {
      connection: true,
      strokeWidth: 20,
      strokeLinejoin: 'round',
    },
    line: {
      stroke: '#b1b8c0',
      strokeWidth: 1,
      connection: true,
      strokeLinejoin: 'round',
      targetMarker: 'classic',
    },
  },
  zIndex: -1, // 保证链接桩可重复点击
}
export const DEFAULT_GRAPH_CONFIG = {
  background: {
    color: 'rgb(250, 250, 251)',
  },
  grid: {
    size: 2,
    visible: false,
    type: 'dot',
  },
  // 画布滚动
  scroller: {
    enabled: true, // 画布滚动
    pannable: true, // 画布拖拽平移
    pageVisible: false, // 显示自动拓展画布边界
    autoResize: true,
    minVisibleWidth: 400,
    minVisibleHeight: 400, // 设置画布滚动时画布的最小可见高度
  },
  mousewheel: {
    enabled: true,
    zoomAtMousePosition: true,
    modifiers: 'ctrl',
    minScale: 0.5,
    maxScale: 2.5,
  },
  connecting: {
    router: {
      name: 'manhattan',
      args: {
        padding: 8,
      },
    },
    connector: {
      name: 'jumpover',
      args: {
        radius: 10,
      },
    },
    // anchor: 'center', // 当连接到节点时，通过 anchor 来指定被连接的节点的锚点，默认值为 center
    connectionPoint: 'anchor', // 指定连接点，默认值为 boundary
    allowBlank: false, // 连接到画布空白位置的点
    snap: {
      // 触发自动吸附
      radius: 10,
    },
  },
  // 限制节点移动
  translating: {
    restrict: true,
  },
  // 拖动边时，是否高亮显示所有可用的连接桩或节点
  highlighting: {
    // 连线过程中，自动吸附到链接桩时被使用
    magnetAdsorbed: {
      name: 'stroke',
      args: {
        attrs: {
          fill: '#5F95FF',
          stroke: '#5F95FF',
        },
      },
    },
  },

  rotating: false,
  // 通过点击或者套索框选节点
  selecting: {
    enabled: false,
    className: 'my-selecting',
    rubberband: false, // 是否启用框选
    showNodeSelectionBox: false,
    showEdgeSelectionBox: false,
  },
  snapline: true, // 对齐线
  keyboard: true,
  clipboard: true,
}
