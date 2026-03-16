/**
 * Spline Interpolation for Smooth Path Drawing
 * Uses Catmull-Rom splines to create smooth curves through detected points
 */

export interface Point {
  x: number
  y: number
}

/**
 * Catmull-Rom spline interpolation
 * Creates a smooth curve that passes through all control points
 * @param p0, p1, p2, p3 - Four control points
 * @param t - Parameter from 0 to 1 (position along the segment p1-p2)
 */
function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const v0 = (p2 - p0) * 0.5
  const v1 = (p3 - p1) * 0.5
  const t2 = t * t
  const t3 = t * t2

  return (2 * p1 - 2 * p2 + v0 + v1) * t3 +
    (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 +
    v0 * t +
    p1
}

/**
 * Interpolate between points using Catmull-Rom spline
 * @param points - Key points to interpolate through
 * @param resolution - Number of points to generate per segment (higher = smoother)
 * @returns Dense array of interpolated points
 */
export function interpolateSpline(points: Point[], resolution: number = 10): Point[] {
  if (points.length < 2) return points
  if (points.length === 2) {
    // Linear interpolation for just 2 points
    return linearInterpolate(points[0], points[1], resolution)
  }

  const result: Point[] = [points[0]]

  for (let i = 0; i < points.length - 1; i++) {
    // Get the four control points
    const p0 = i === 0 ? points[0] : points[i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = i + 2 < points.length ? points[i + 2] : points[i + 1]

    // Generate points along this segment
    for (let t = 0; t < 1; t += 1 / resolution) {
      const x = catmullRom(p0.x, p1.x, p2.x, p3.x, t)
      const y = catmullRom(p0.y, p1.y, p2.y, p3.y, t)
      result.push({ x, y })
    }
  }

  // Always include the final point
  result.push(points[points.length - 1])

  return result
}

/**
 * Simple linear interpolation between two points
 */
function linearInterpolate(p1: Point, p2: Point, resolution: number): Point[] {
  const result: Point[] = [p1]
  for (let i = 1; i < resolution; i++) {
    const t = i / resolution
    result.push({
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t
    })
  }
  result.push(p2)
  return result
}

/**
 * Bresenham-like algorithm to get all grid cells that a point path crosses
 * Used to determine which cells to fill when drawing a line
 */
export function getCellsAlongPath(
  p1: Point,
  p2: Point,
  cellWidth: number,
  cellHeight: number,
  offset: { x: number; y: number }
): Array<{ row: number; col: number }> {
  const cells = new Set<string>()

  const x0 = Math.floor((p1.x - offset.x) / cellWidth)
  const y0 = Math.floor((p1.y - offset.y) / cellHeight)
  const x1 = Math.floor((p2.x - offset.x) / cellWidth)
  const y1 = Math.floor((p2.y - offset.y) / cellHeight)

  const dx = Math.abs(x1 - x0)
  const dy = Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1
  const sy = y0 < y1 ? 1 : -1

  let err = dx - dy
  let x = x0
  let y = y0

  while (true) {
    const key = `${y},${x}`
    cells.add(key)

    if (x === x1 && y === y1) break

    const e2 = 2 * err
    if (e2 > -dy) {
      err -= dy
      x += sx
    }
    if (e2 < dx) {
      err += dx
      y += sy
    }
  }

  return Array.from(cells).map(key => {
    const [row, col] = key.split(',').map(Number)
    return { row, col }
  })
}

/**
 * Get all cells that should be filled for a complete spline path
 */
export function getCellsForSplinePath(
  points: Point[],
  cellWidth: number,
  cellHeight: number,
  offset: { x: number; y: number }
): Array<{ row: number; col: number }> {
  const cells = new Map<string, { row: number; col: number }>()

  for (let i = 0; i < points.length - 1; i++) {
    const segmentCells = getCellsAlongPath(points[i], points[i + 1], cellWidth, cellHeight, offset)
    for (const cell of segmentCells) {
      const key = `${cell.row},${cell.col}`
      cells.set(key, cell)
    }
  }

  return Array.from(cells.values())
}
