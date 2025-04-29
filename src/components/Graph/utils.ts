import { Edge, Node } from '@antv/x6'

/**
 * 查找包含目标节点的最小子图及其所有路径
 * @param start 起始节点
 * @param targets 目标节点列表
 * @param allEdges 所有边
 * @returns 路径列表
 */
export const findMinimalSubGraph = (start: Node, targets: Node[], allEdges: Edge[]): Edge[][] => {
  // 1. 构建邻接表
  // graph: 存储节点间的连接关系，key为源节点id，value为可达的目标节点集合
  const graph = new Map<string, Set<string>>()
  // edgeMap: 存储节点间的具体边信息，key为"源节点id-目标节点id"，value为边数组
  const edgeMap = new Map<string, Edge[]>()

  // 遍历所有边，构建邻接表和边映射
  allEdges.forEach((edge) => {
    const source = edge.getSourceCell()!.id
    const target = edge.getTargetCell()!.id

    // 在邻接表中添加连接关系
    if (!graph.has(source)) {
      graph.set(source, new Set())
    }
    graph.get(source)!.add(target)

    // 在边映射中存储具体的边信息
    const key = `${source}-${target}`
    if (!edgeMap.has(key)) {
      edgeMap.set(key, [])
    }
    edgeMap.get(key)!.push(edge)
  })

  // 存储目标节点id集合，用于快速查找
  const requiredNodes = new Set(targets.map((t) => t.id))

  // 用于去重的路径集合
  const visitedPaths = new Set<string>()
  // 存储子图中的所有节点
  const subGraphNodes = new Set<string>()

  // 2. 搜索函数
  const search = (startId: string): Edge[][] => {
    const result: Edge[][] = []
    const visited = new Set<string>()

    // 深度优先搜索函数
    const traverse = (
      current: string, // 当前节点
      path: Edge[], // 当前路径
      visited: Set<string>, // 已访问节点集合
      waypointIndex: number, // 当前目标节点的索引
    ) => {
      // 如果已经访问完所有目标节点，说明找到了一条有效路径
      if (waypointIndex === targets.length) {
        const pathKey = path.map((e) => e.id).join(',')
        // 检查路径是否重复
        if (!visitedPaths.has(pathKey)) {
          visitedPaths.add(pathKey)
          result.push([...path])
          // 记录路径上的所有节点，用于后续构建子图
          path.forEach((edge) => {
            subGraphNodes.add(edge.getSourceCell()!.id)
            subGraphNodes.add(edge.getTargetCell()!.id)
          })
        }
        return
      }

      // 获取当前节点的所有邻居节点
      const neighbors = graph.get(current)
      if (!neighbors) return

      // 遍历所有邻居节点
      for (const neighbor of neighbors) {
        // 跳过已访问的节点
        if (visited.has(neighbor)) continue

        // 获取当前节点到邻居节点的所有边
        const edgeKey = `${current}-${neighbor}`
        const edges = edgeMap.get(edgeKey)
        if (!edges) continue

        // 遍历所有可能的边
        for (const edge of edges) {
          // 创建新的访问集合，避免影响其他分支
          const newVisited = new Set(visited)
          newVisited.add(current)

          let newIndex = waypointIndex
          // 如果当前邻居是下一个目标节点，增加目标节点索引
          if (requiredNodes.has(neighbor) && neighbor === targets[waypointIndex].id) {
            newIndex += 1
          }

          // 继续搜索
          traverse(neighbor, [...path, edge], newVisited, newIndex)
        }
      }
    }

    traverse(startId, [], visited, 0)
    return result
  }

  // 3. 执行搜索获取所有路径
  const paths = search(start.id)

  // 4. 获取子图中所有互相连接的边
  // 子图定义：边的source和target都是目标节点集合的元素的边的集合
  const subGraphEdges: Edge[] = []

  // 遍历所有边，找出符合子图定义的边
  allEdges.forEach((edge) => {
    const source = edge.getSourceCell()!.id
    const target = edge.getTargetCell()!.id

    // 只有当边的两个端点都在目标节点集合中（包括起始节点）时，才将这条边加入子图
    if (requiredNodes.has(source) && requiredNodes.has(target)) {
      subGraphEdges.push(edge)
    }
  })

  // 5. 将子图中的所有边作为一条路径添加到结果中
  if (subGraphEdges.length > 0) {
    paths.push(subGraphEdges)
  }

  return paths
}
