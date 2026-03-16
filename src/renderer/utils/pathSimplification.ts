/**
 * Path Simplification using Ramer-Douglas-Peucker algorithm
 * Aggressively simplifies paths while preserving key turning points
 */

export interface Point {
  x: number
  y: number
}

/**
 * Calculate the perpendicular distance from a point to a line
 */
function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const num = Math.abs(
    (lineEnd.y - lineStart.y) * point.x -
    (lineEnd.x - lineStart.x) * point.y +
    lineEnd.x * lineStart.y -
    lineEnd.y * lineStart.x
  )
  const den = Math.sqrt(
    Math.pow(lineEnd.y - lineStart.y, 2) +
    Math.pow(lineEnd.x - lineStart.x, 2)
  )
  return num / den
}

/**
 * Ramer-Douglas-Peucker algorithm for path simplification
 * @param points - Array of points in the path
 * @param epsilon - Maximum distance threshold (lower = more aggressive simplification)
 * @returns Simplified array of points
 */
export function simplifyPath(points: Point[], epsilon: number = 1.0): Point[] {
  if (points.length < 3) return points

  let maxDistance = 0
  let maxIndex = 0

  // Find the point with maximum distance from line between start and end
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], points[0], points[points.length - 1])
    if (distance > maxDistance) {
      maxDistance = distance
      maxIndex = i
    }
  }

  // If max distance is greater than epsilon, recursively simplify
  if (maxDistance > epsilon) {
    const left = simplifyPath(points.slice(0, maxIndex + 1), epsilon)
    const right = simplifyPath(points.slice(maxIndex), epsilon)
    return left.slice(0, -1).concat(right)
  } else {
    return [points[0], points[points.length - 1]]
  }
}

/**
 * Snap points to grid to make drawing more aligned with the ASCII grid
 * @param point - Point in pixel coordinates
 * @param cellWidth - Width of grid cell in pixels
 * @param cellHeight - Height of grid cell in pixels
 * @returns Point snapped to grid
 */
export function snapToGrid(point: Point, cellWidth: number, cellHeight: number): Point {
  return {
    x: Math.round(point.x / cellWidth) * cellWidth,
    y: Math.round(point.y / cellHeight) * cellHeight
  }
}

/**
 * Detect key grid points from a path
 * Aggressively filters to only significant grid-aligned turning points
 * @param points - Simplified path points
 * @param cellWidth - Width of grid cell
 * @param cellHeight - Height of grid cell
 * @returns Key grid points that should be drawn to
 */
export function detectGridPoints(points: Point[], cellWidth: number, cellHeight: number): Point[] {
  if (points.length < 2) return points

  const gridPoints: Point[] = [snapToGrid(points[0], cellWidth, cellHeight)]
  let lastPoint = gridPoints[0]

  for (let i = 1; i < points.length; i++) {
    const snapped = snapToGrid(points[i], cellWidth, cellHeight)
    
    // Only add if it's different from the last grid point
    if (snapped.x !== lastPoint.x || snapped.y !== lastPoint.y) {
      gridPoints.push(snapped)
      lastPoint = snapped
    }
  }

  return gridPoints
}

/**
 * Convert grid points to cell coordinates
 */
export function gridPointsToCells(
  gridPoints: Point[],
  cellWidth: number,
  cellHeight: number,
  offset: { x: number; y: number }
): Array<{ row: number; col: number }> {
  return gridPoints.map(point => ({
    col: Math.round((point.x - offset.x) / cellWidth),
    row: Math.round((point.y - offset.y) / cellHeight)
  }))
}
