import { Edge, Node } from '@antv/x6'

export enum SearchMode {
  BFS = 'BFS',
  DFS = 'DFS',
}

/**
 * 查找所有路径
 * @param start 起始节点
 * @param targets 目标节点列表
 * @param allEdges 所有边
 * @param mode 搜索模式
 * @returns 路径列表
 */
export const findAllPaths = (
  start: Node,
  targets: Node[],
  allEdges: Edge[],
  mode: SearchMode = SearchMode.DFS,
): Edge[][] => {
  // 1. 构建邻接表（单向）
  const graph = new Map<string, string[]>()
  const edgeMap = new Map<string, Edge[]>()

  allEdges.forEach((edge) => {
    const source = edge.getSourceCell()!.id
    const target = edge.getTargetCell()!.id

    if (!graph.has(source)) graph.set(source, [])
    graph.get(source)?.push(target)

    const key = `${source}-${target}`
    if (!edgeMap.has(key)) edgeMap.set(key, [])
    edgeMap.get(key)?.push(edge)
  })

  // 2. 准备必要参数
  const requiredNodes = targets.map((t) => t.id)

  // 3. 定义内部搜索函数
  const bfsSearch = (startId: string): Edge[][] => {
    const queue: {
      current: string
      path: Edge[]
      visited: Set<string>
      waypointIndex: number
    }[] = [
      {
        current: startId,
        path: [],
        visited: new Set(),
        waypointIndex: 0,
      },
    ]

    while (queue.length > 0) {
      const { current, path, visited, waypointIndex } = queue.shift()!

      if (waypointIndex === requiredNodes.length) {
        return [path] // 返回第一条完整路径
      }

      const neighbors = graph.get(current) || []
      for (const neighbor of neighbors) {
        if (visited.has(neighbor)) continue

        const edgeKey = `${current}-${neighbor}`
        const edges = edgeMap.get(edgeKey) || []

        for (const edge of edges) {
          const newVisited = new Set(visited)
          newVisited.add(current)

          let newIndex = waypointIndex
          if (neighbor === requiredNodes[waypointIndex]) {
            newIndex += 1
          }

          queue.push({
            current: neighbor,
            path: [...path, edge],
            visited: newVisited,
            waypointIndex: newIndex,
          })
        }
      }
    }

    return []
  }

  const dfsSearch = (startId: string): Edge[][] => {
    const allValidPaths: Edge[][] = []
    const pathSet = new Set<string>()

    const getNodePath = (edges: Edge[]): string[] => {
      const path: string[] = [startId]
      edges.forEach((edge) => {
        const target = edge.getTargetCell()?.id
        if (!target) return
        path.push(target)
      })
      return path
    }

    const validatePath = (nodePath: string[]): boolean => {
      let currentIndex = 0
      for (const node of nodePath) {
        if (node === requiredNodes[currentIndex]) {
          currentIndex++
          if (currentIndex === requiredNodes.length) break
        }
      }
      return currentIndex === requiredNodes.length
    }

    const dfs = (current: string, path: Edge[], visited: Set<string>, waypointIndex: number) => {
      if (waypointIndex === requiredNodes.length) {
        const nodePath = getNodePath([...path])
        if (!validatePath(nodePath)) return

        const pathKey = nodePath.join('->')
        if (!pathSet.has(pathKey)) {
          pathSet.add(pathKey)
          allValidPaths.push([...path])
        }
        return
      }

      const neighbors = graph.get(current) || []
      for (const neighbor of neighbors) {
        if (visited.has(neighbor)) continue

        const edgeKey = `${current}-${neighbor}`
        const edges = edgeMap.get(edgeKey) || []

        for (const edge of edges) {
          const newVisited = new Set(visited)
          newVisited.add(current)

          let newIndex = waypointIndex
          if (neighbor === requiredNodes[waypointIndex]) {
            newIndex += 1
          }

          dfs(neighbor, [...path, edge], newVisited, newIndex)
        }
      }
    }

    dfs(startId, [], new Set(), 0)
    return allValidPaths
  }

  // 4. 根据模式选择算法
  if (mode === SearchMode.BFS) {
    return bfsSearch(start.id)
  } else {
    return dfsSearch(start.id)
  }
}
